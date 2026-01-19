<p align="center">
  <img src="https://raw.githubusercontent.com/Kokoio01/Edura/e5599a8c294d61454895228ac6f86b833bf1674a/.github/pictures/logo.png" width="200" />
</p>

# Edura

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Docker Pulls](https://img.shields.io/docker/pulls/kokoio01/edura)


**Edura** is user-friendly tool that helps you organize your homework effectively and always keep track of everything.


## Usage

### docker-compose (recommended)

```yaml
services:
  app:
    image: kokoio01/edura:latest
    restart: unless-stopped
    container_name: Edura
    environment:
      DB_USER: edura
      DB_PASS: change-me!
      DB_NAME: EDURA
      DB_HOST: db
      DB_PORT: 5432
      DB_SSL: false

      BETTER_AUTH_SECRET: !change-me!

      ADMIN_EMAIL: admin@example.com
      ADMIN_PASS: change-me!
    ports:
      - "80:3000"
    depends_on:
      db:
        condition: service_healthy


  db:
    image: postgres:17-alpine
    restart: unless-stopped
    container_name: EduraDB
    volumes:
      - edura_data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}" ]
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      POSTGRES_USER: edura
      POSTGRES_PASSWORD: change-me!
      POSTGRES_DB: EDURA

volumes:
  edura_data:
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/Kokoio01/Edura.git
```

Go to the project directory

```bash
  cd Edura
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```
