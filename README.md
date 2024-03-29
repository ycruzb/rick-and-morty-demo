# Rick and Morty demo app

This is a demo app that includes a backend and frontend solution with the use of a PostgreSQL database to store the data and a Redis database to implement a cache. Some e2e tests were implemented using Playwright.

## Project structure

There are three main folders in the project:

- backend (backend solution)
- frontend (frontend solution)
- tests (e2e tests project)

There is a docker-compose.yml in the root folder that provides the ability to run the entire project in a containerized approach.

## How to run the entire project (Redis, PostgreSQL, backend and frontend)

The easier way to run the entire project is using docker compose so you have to install Docker Desktop and run the project. 

```bash
docker-compose up
```

With the project running the first time you have to generate the db structure. Create a .env file in the root of the backend folder with the same variables passed to the backend in the docker-compose.yml but changing the host of the db connection string to localhost, then run the following command inside the backend folder to generate the db structure:

```bash
npx prisma db push
```

and finally open the following url in the browser when the scripts are ready:

[http://localhost:5173](http://localhost:5173)

## Some considerations

- regarding performance: it was implemented a cache using Redis in the backend and also in the frontend using Tanstack query, the result is a super fast website
- regarding the case of having issues wih the Rick and Morty api: the cache implemented in the backend using Redis covers this scenario because a one week time is used as the expiration time for the values so in theory as the app is being used then fewer requests will be made to the api (important: it's understood that make a whole copy of the data from the api wasn't a possible solution so because of that the cache was considered as a proper solution)

## Backend solution

The backend folder includes a project that can be executed by itself just providing a .env file with all the required variables (details on the environment data passed to the backend in the docker-compose.yml file).

The solution was developed in Node.js using Express and Typescript. It uses a PostgreSQL as a database to store the data related to the registered users and it's favorites characters. It's also used Prisma as an ORM in order to have the possibility of change the database easily in the future and also to gain in DX. A Redis database is also used as a cache not only for performance but also for cover issues with the origin of the data (in this case the Rick and Morty api) considering that a long expiration time could be assigned for the data. The authentication was implemented using a JWT implementation and the routes are protected using this approach.

### How to run the backend as an isolated solution

Create a .env file in the root with all the required variables (details on the environment data passed to the backend in the docker-compose.yml file) and run the following commands inside the backend folder:

Installing depedencies:

```bash
npm i
```

Generate the db structure:

The first time you have to generate the structure for the db

IMPORTANT: set properly the host in the .env file for the database in the connection string in order to generate the structure for the db properly

run the following command:

```bash
npx prisma db push
```

For running the project in development mode:

```bash
npm run dev
```

For running the project in production mode:

```bash
npm run build
```

```bash
npm run start
```

For a containerized solution:

The backend has been containerized, the Dockerfile it's located in the root.

## Frontend solution

The solution in the frontend was developed using React and Typescript, specially using a Vite project. It's used React Router Dom for the routing, Tanstack Query for making the requests to the backend in order to implement a good performance in these calls and also it was used Zustand as an state manager to synchronize some states/data in the app in a cleaner and optimal way.

### How to run the frontend as an isolated solution

Create a .env file in the root with all the required variables (details on the environment data passed to the frontend in the docker-compose.yml file) and run the following commands inside the frontend folder:

```bash
npm i
```

```bash
npm run dev
```

For a containerized solution:

The frontend has been containerized, the Dockerfile it's located in the root.

## e2e tests

It was used Playwright for e2e testing in the app. Some tests were implemented like these ones:

- test the protection of the routes in the app, if the user isn't logged in then the login page is shown
- when a user tries to log in with wrong credentials then a proper message is shown
- when the user tries to log in with a proper credentials then it's logged in and the home page is shown
- test the pagination validating that the user can navigate to the second page if it exists and then come back to the first one
- when the user is in the home page and filter by status alive then there are no dead or unknown characters listed in the page
- when the user is in the home page and make click in the Favorites link then the user is redirected to that page and just favorites characters are listed in the page
- when the user make click in the Logout link then the user is logged out and redirected to the login page

more tests could be implemented in the future.

### How to run the tests

Note: See the comment on line 15 in the file tests/tests/frontend.spec.ts. You have to specify there an already registered email with the valid password.

Run the following commands inside the tests folder:

- installing depedencies:

```bash
npm i
```

```bash
npx playwright install
```

- running the tests with a UI:

```bash
npx playwright test --ui
```

- running the tests just in the command line:

```bash
npx playwright test
```

## What was additionally added/included

- Pagination in the characters list including when there are filters applied
- Favorites page, a page for listing the characters marked as favorite
- e2e testing to check if the main features of the app are working properly from the end user perspective (the most confidence approach)
- Containerized solutions (for the entire project running it with just one command and also for each part, backend and frontend)

## Improvements to do

Some improvements that could be implemented:

- add sorting and searching in the list of characters
- add email verification in the registration process of the user
- add the feature that allows the user change it's password
- add a logging system for register all actions and errors (new relic, etc.)
- sync the backend and frontend data (probably using tRPC)