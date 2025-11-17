# Quick Docker Deployment

## One-Command Deployment

```bash
./deploy.sh
```

Or manually:

```bash
docker compose up --build -d
```

## Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/products
- **MySQL**: localhost:3306 (user: root, password: rootpassword)

## Common Commands

```bash
# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove data
docker compose down -v

# Restart services
docker compose restart

# View container status
docker compose ps
```

## First Time Setup

1. Make sure Docker and Docker Compose are installed
2. Clone the repository
3. Navigate to project directory
4. Run `./deploy.sh` or `docker compose up --build -d`
5. Wait for services to start (check with `docker compose ps`)
6. Access frontend at http://localhost:3000

## Troubleshooting

**Containers won't start?**
- Check logs: `docker compose logs -f`
- Check ports are free: `lsof -i :3000,5000,3306`

**Can't access frontend?**
- Wait for containers to be healthy: `docker compose ps`
- Check frontend logs: `docker compose logs frontend`

**Backend can't connect to database?**
- Check MySQL is healthy: `docker compose logs mysql`
- Verify network: `docker network ls`

For detailed information, see **DOCKER_GUIDE.md**
