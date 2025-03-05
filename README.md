# URL Shortener

This application runs using Docker Compose. Please follow the instructions below to get started.

## Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

1. **Install Docker and Docker Compose:**  
   Ensure Docker and Docker Compose are installed on your machine. You can verify the installation with:
   ```bash
   docker --version
   docker-compose --version


2. Copy the env.example file to a new file named .env. This file contains the environment variables required by the application.

```
cp env.example .env
```

Edit the .env file to customize any configurations as needed.

## Running the Application
To build the images and start the application, run:

```
docker-compose up --build
```
This command will build (or rebuild) the images and start all services defined in your docker-compose.yml file.


## Stopping the Application
To stop the application, run:

```
docker-compose down
```


