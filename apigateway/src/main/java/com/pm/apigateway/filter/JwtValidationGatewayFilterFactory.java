package com.pm.apigateway.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Base64;

@Component
public class JwtValidationGatewayFilterFactory extends AbstractGatewayFilterFactory<Object> {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtValidationGatewayFilterFactory(WebClient.Builder webClientBuilder,
            @Value("${auth.service.url}") String authServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(authServiceUrl).build();
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // Fallback to query parameter for EventSource (SSE) which doesn't support custom headers
            if (token == null || !token.startsWith("Bearer ")) {
                String queryToken = exchange.getRequest().getQueryParams().getFirst("token");
                if (queryToken != null && !queryToken.isEmpty()) {
                    token = "Bearer " + queryToken;
                }
            }

            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Must be effectively final for lambda
            final String finalToken = token;

            return webClient.get()
                    .uri("/validate")
                    .header(HttpHeaders.AUTHORIZATION, finalToken)
                    .retrieve()
                    .toBodilessEntity()
                    .onErrorMap(e -> new RuntimeException("Validation Failed", e))
                    .flatMap(response -> {
                        // JWT is validated — decode claims and forward as headers
                        ServerWebExchange mutatedExchange = addUserHeaders(exchange, finalToken);
                        return chain.filter(mutatedExchange);
                    })
                    .onErrorResume(e -> {
                        if (e.getMessage() != null && e.getMessage().contains("Validation Failed")) {
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        }
                        // Otherwise, it’s a downstream error, let it bubble up
                        return org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler.class.isAssignableFrom(e.getClass()) ? Mono.error(e) : Mono.error(e);
                    });
        };
    }

    /**
     * Extracts claims from a validated JWT and adds them as X-User-Email
     * and X-User-Role headers to the downstream request.
     */
    private ServerWebExchange addUserHeaders(ServerWebExchange exchange, String authHeader) {
        try {
            String jwt = authHeader.substring(7); // Remove "Bearer "
            String[] parts = jwt.split("\\.");
            if (parts.length != 3)
                return exchange;

            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode claims = objectMapper.readTree(payload);

            String email = claims.has("sub") ? claims.get("sub").asText() : "";
            String role = claims.has("role") ? claims.get("role").asText() : "";

            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            return exchange.mutate().request(mutatedRequest).build();
        } catch (Exception e) {
            return exchange;
        }
    }
}
