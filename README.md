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

If you are using yarn or npm there is few handy command in package.json. Just type `yarn run`

###

Main application is located at `http://localhost:3000/'. API documentation is located at `http://localhost:3000/api`




## My Remarks


Requirements:
[x] - Build a web page with a form for entering a URL
[x] - When the form is submitted, return a shortened version of the URL
[x] - Save a record of the shortened URL to a database
[x] - Ensure the slug of the URL (abc123 in the screenshot above) is unique


Extra:
[x] - Add support for accounts so people can view the URLs they created
      // sort of. I am storing user id in local storage so you can see your URLs once you re-enter 
[x] - Validate the URL provided is an actual URL
      // mind that you need to add protocol to make url valid
[x] - Display an error message if invalid
[x] - Make it easy to copy the shortened URL to the clipboard 
- Allow users to modify the slug of their URL
- Track visits to the shortened URL
[x] - Add rate-limiting to prevent bad-actors from spamming the service 
[x] - Update API to follow a known spec (such as json:api)
