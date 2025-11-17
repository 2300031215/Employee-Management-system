#!/bin/bash

# Quick Start Script for Docker Deployment
# This script helps deploy the fullstack application with Docker

set -e  # Exit on error

echo "========================================="
echo "  Fullstack App - Docker Deployment"
echo "========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available"
    echo "Please install Docker Compose v2"
    exit 1
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is available"
echo ""

# Check if ports are available
echo "Checking if required ports are available..."
for port in 3000 5000 3306; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Warning: Port $port is already in use"
        echo "   Please stop the service using this port or change the port in docker-compose.yml"
    else
        echo "✅ Port $port is available"
    fi
done
echo ""

# Ask user for confirmation
read -p "Do you want to build and start all containers? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🚀 Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

# Build and start containers
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check container status
docker compose ps

echo ""
echo "========================================="
echo "  🎉 Deployment Complete!"
echo "========================================="
echo ""
echo "Access your application:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:5000/api/products"
echo "  MySQL:     localhost:3306"
echo ""
echo "Useful commands:"
echo "  View logs:        docker compose logs -f"
echo "  Stop services:    docker compose down"
echo "  Restart services: docker compose restart"
echo ""
echo "For more information, see DOCKER_GUIDE.md"
echo ""
