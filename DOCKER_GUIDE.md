# Docker Deployment Guide

This guide explains how to deploy the fullstack Inventory Management System using Docker containers.

## Architecture

The application consists of three Docker containers:

1. **Frontend**: React application served by Nginx (port 3000)
2. **Backend**: Node.js/Express API server (port 5000)
3. **Database**: MySQL 8.0 database (port 3306)

All containers are connected via a custom Docker bridge network for secure communication.

## Prerequisites

- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- At least 2GB of free RAM
- Ports 3000, 5000, and 3306 available

## Quick Start

### 1. Build and Start All Services

```bash
# Build and start all containers
docker-compose up --build -d
```

This command will:
- Build the frontend Docker image
- Build the backend Docker image
- Pull the MySQL 8.0 image
- Create a Docker network
- Start all containers with health checks

### 2. Verify Containers are Running

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

You should see three running containers:
- `inventory_frontend` (port 3000)
- `inventory_backend` (port 5000)
- `inventory_mysql` (port 3306)

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/products
- **Database**: localhost:3306 (username: root, password: rootpassword)

## Container Details

### Frontend Container

**Image**: Built from `client/Dockerfile`
- **Base**: node:18-alpine (build) + nginx:alpine (serve)
- **Port**: 80 (mapped to host 3000)
- **Features**:
  - Multi-stage build for optimized image size
  - Production React build served by Nginx
  - API requests proxied to backend service

### Backend Container

**Image**: Built from `Dockerfile`
- **Base**: node:18-alpine
- **Port**: 5000
- **Environment Variables**:
  - `DB_HOST=mysql`
  - `DB_USER=root`
  - `DB_PASSWORD=rootpassword`
  - `DB_NAME=inventory_db`
- **Features**:
  - Automatic database initialization
  - Sample data seeding
  - Health check endpoint

### Database Container

**Image**: mysql:8.0 (official)
- **Port**: 3306
- **Credentials**:
  - Root password: `rootpassword`
  - Database: `inventory_db`
  - User: `inventory_user`
  - Password: `inventory_pass`
- **Features**:
  - Data persistence via Docker volume
  - Health checks for startup coordination

## Docker Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Execute Commands in Containers
```bash
# Access backend container shell
docker-compose exec backend sh

# Access MySQL database
docker-compose exec mysql mysql -u root -prootpassword inventory_db

# View backend environment variables
docker-compose exec backend env
```

### Rebuild Specific Service
```bash
# Rebuild only backend
docker-compose up --build -d backend

# Rebuild only frontend
docker-compose up --build -d frontend
```

## Data Persistence

MySQL data is persisted using a Docker named volume `mysql_data`. This ensures:
- Data survives container restarts
- Data persists even if containers are removed
- Easy backup and restore

### Backup Database
```bash
# Create backup
docker-compose exec mysql mysqldump -u root -prootpassword inventory_db > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u root -prootpassword inventory_db < backup.sql
```

## Troubleshooting

### Container Won't Start

1. Check logs:
```bash
docker-compose logs [service-name]
```

2. Verify ports are not in use:
```bash
# Linux/Mac
lsof -i :3000
lsof -i :5000
lsof -i :3306

# Windows
netstat -ano | findstr :3000
```

3. Check container status:
```bash
docker-compose ps
```

### Database Connection Issues

1. Verify MySQL is healthy:
```bash
docker-compose exec mysql mysqladmin ping -h localhost -u root -prootpassword
```

2. Check database exists:
```bash
docker-compose exec mysql mysql -u root -prootpassword -e "SHOW DATABASES;"
```

3. Verify backend can connect:
```bash
docker-compose logs backend | grep -i "database\|mysql"
```

### Frontend Can't Reach Backend

1. Check nginx configuration:
```bash
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

2. Verify network connectivity:
```bash
docker-compose exec frontend wget -O- http://backend:5000/api/products
```

### Clean Restart

If issues persist, perform a clean restart:

```bash
# Stop all containers
docker-compose down

# Remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start fresh
docker-compose up --build -d
```

## Environment Variables

You can customize the deployment by creating a `.env` file:

```env
# Backend
PORT=5000

# Database
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=inventory_db
MYSQL_ROOT_PASSWORD=your_secure_password

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

Then update `docker-compose.yml` to use these variables.

## Production Considerations

For production deployment:

1. **Change default passwords** in `docker-compose.yml`
2. **Use environment variables** for sensitive data
3. **Enable SSL/TLS** with reverse proxy (nginx, traefik)
4. **Set up monitoring** (Prometheus, Grafana)
5. **Configure automatic backups** for MySQL
6. **Implement rate limiting** on API endpoints
7. **Use Docker secrets** for credentials
8. **Enable container resource limits**
9. **Set up log aggregation** (ELK stack, Loki)
10. **Configure auto-restart policies**

### Example Production docker-compose.yml Enhancement

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    environment:
      NODE_ENV: production
```

## Scaling

To scale the backend service:

```bash
# Run 3 instances of backend
docker-compose up -d --scale backend=3

# Note: You'll need a load balancer (nginx/traefik) to distribute traffic
```

## Network Architecture

```
┌─────────────────┐
│   Host Machine  │
│   Port 3000     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      inventory_network (bridge)
│    Frontend     │──────────────────────┐
│   (nginx:80)    │                      │
└────────┬────────┘                      │
         │ proxy /api                    │
         ▼                               │
┌─────────────────┐                      │
│    Backend      │──────────────────────┤
│  (express:5000) │                      │
└────────┬────────┘                      │
         │                               │
         ▼                               │
┌─────────────────┐                      │
│     MySQL       │──────────────────────┘
│   (mysql:3306)  │
└─────────────────┘
```

## Docker Images Size

Approximate image sizes:
- Frontend: ~50MB (alpine + nginx)
- Backend: ~150MB (node:18-alpine + dependencies)
- MySQL: ~500MB (official mysql:8.0)

Total: ~700MB

## Health Checks

All services include health checks:

- **MySQL**: `mysqladmin ping`
- **Backend**: HTTP GET to `/api/products`
- **Frontend**: Depends on backend health

Services start in order with health check dependencies:
1. MySQL (waits for ping success)
2. Backend (waits for MySQL healthy)
3. Frontend (waits for Backend healthy)

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
