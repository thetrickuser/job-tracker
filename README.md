# Job Tracker

This repository contains a Spring Boot backend and a (separate) frontend. The Docker Compose setup provides a PostgreSQL database and a containerized backend.

Quick start (Docker Compose)

1. Build and start services:

```bash
docker compose up --build
```

2. Watch logs (recommended during first run):

```bash
docker compose logs -f backend
docker compose logs -f postgres
```

What the compose file provides
- `postgres`: PostgreSQL 15 (data persisted in a Docker volume `db-data`).
- `backend`: the Spring Boot application built from `backend/` using the provided `backend/Dockerfile`.

Flyway and database migrations
- This project uses Flyway for database migrations. Migration files live in `backend/src/main/resources/db/migration` and are applied on application startup.
- Spring Boot 4 changes: Flyway is auto-configured differently than previous Spring Boot versions. The application explicitly enables Flyway via `spring.flyway.enabled=true` and `spring.flyway.locations=classpath:db/migration` in the backend configuration.
- Do not change `spring.jpa.hibernate.ddl-auto` to `update` — we keep it as `validate` so Flyway manages schema changes. If migrations need a baseline for an existing DB, set `spring.flyway.baseline-on-migrate=true` (only when appropriate).

Environment variables (overriding)
- The Compose file sets these env vars for the backend service (change if needed):
	- `SPRING_DATASOURCE_URL` (default: `jdbc:postgresql://postgres:5432/jobtrackdb`)
	- `SPRING_DATASOURCE_USERNAME` (default: `postgres`)
	- `SPRING_DATASOURCE_PASSWORD` (default: `postgres`)
	- `SPRING_FLYWAY_ENABLED` (default: `true`)
	- `SPRING_FLYWAY_LOCATIONS` (default: `classpath:db/migration`)

Troubleshooting
- If Flyway migrations do not run, check the backend logs and verify the migration files are present at `backend/src/main/resources/db/migration` and follow Spring's Flyway logging output.
- Useful commands:

```bash
docker compose logs backend --no-color --tail=200
docker compose ps
docker compose exec postgres psql -U postgres -d jobtrackdb -c "\dt"
```

Development notes
- The backend `Dockerfile` builds with Maven and runs the packaged JAR. You can build locally with:

```bash
cd backend
./mvnw -DskipTests package
```

If you'd like, I can add a small `docker-compose.override.yml` or `.env` file to keep secrets and overrides out of version control.

