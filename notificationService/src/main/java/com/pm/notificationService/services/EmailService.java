package com.pm.notificationService.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false) // Won't fail if mail is not configured
    private JavaMailSender mailSender;

    /**
     * Sends an email, or logs it if mail sender is not configured.
     */
    public void sendEmail(String to, String subject, String body) {
        log.info("📧 Sending email to: {}", to);
        log.info("   Subject: {}", subject);
        log.info("   Body: {}", body);

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                log.info("✅ Email sent successfully to {}", to);
            } catch (Exception e) {
                log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
            }
        } else {
            log.warn("⚠️ Mail sender not configured. Email logged only.");
        }
    }
}
