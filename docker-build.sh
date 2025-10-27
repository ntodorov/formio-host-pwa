#!/bin/bash

# Build Docker image using BuildKit secrets for linux/amd64 platform
# This ensures compatibility with Azure App Service (which runs on x86_64/AMD64)
DOCKER_BUILDKIT=1 docker build \
  --platform linux/amd64 \
  --secret id=env,src=.env \
  -t formio-pwa \
  .

echo "Docker image 'formio-pwa' built successfully for linux/amd64!"
