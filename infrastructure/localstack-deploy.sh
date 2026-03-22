#!/bin/bash
set -e # Stops the script if any command fails

aws --endpoint-url=http://localhost.localstack.cloud:4566 cloudformation delete-stack \
    --stack-name patient-management

aws --endpoint-url=http://localhost.localstack.cloud:4566 cloudformation deploy \
    --stack-name patient-management \
    --template-file "./cdk.out/Patient-Management.template.json"

aws --endpoint-url=http://localhost.localstack.cloud:4566 elbv2 describe-load-balancers \
    --query "LoadBalancers[0].DNSName" --output text
