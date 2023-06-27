# Backend Flight Booking Service
This is the backend of Flight-Booking-Service.
It is one of the microservice of the complete PROJECT which mimics the booking of flights.

## Other Microservices
- `flights-services`: https://github.com/ArnavSavant/Flight-Services
- `flights-booking-services`: https://github.com/ArnavSavant/Flight-Booking-Service
- `authentication-service`:  
 
## Project Structure

The project structure is as follows:

- `src`: This folder contains the actual source code of the project, excluding tests. You may consider creating a separate `tests` folder for your tests.

Let's take a closer look inside the `src` folder:

- `config`: This folder is used for configuring and setting up various libraries or modules. For example, you can set up `dotenv` to use environment variables in a cleaner way. The configuration for logging libraries or other modules can also be done here.

- `routes`: In this folder, you register routes along with their corresponding middleware and controllers.

- `middlewares`: Middlewares intercept incoming requests and can be used for tasks such as request validation, authentication, etc.

- `migrations`: The migrations folder is responsible for managing database schema changes over time. It contains files that define the changes to be applied to the database schema. Migrations help in keeping the database structure in sync with the application code.

- `models`: The models folder contains the database models or schemas. These models define the structure of the data stored in the database and provide an interface for interacting with the data. They typically represent tables or collections in the database.

- `seeders`: The seeders folder is used for seeding the database with initial or test data. Seeders provide a way to populate the database with predefined data, making it easier to set up a development or testing environment.

- `controllers`: Controllers act as the last layer of middleware. They receive incoming requests and data, pass them to the business layer for executing the logic, and structure the API response before sending it back.

- `repositories`: This folder contains the logic for interacting with the database using raw queries or ORM queries. It is responsible for handling database operations.

- `services`: Services contain the business logic of your application and interact with repositories to fetch or modify data from the database.

- `utils`: This folder contains helper methods, error classes, and other utility functions that can be used across the project.

## Setup

To set up the project, follow these steps:

1. Download this template from GitHub and open it in your favorite text editor.

2. Navigate to the project folder in your terminal and execute the following command to install the dependencies:
   ```
   npm install
   ```

3. In the root directory, create a `.env` file and add the following environment variables:
   ```
   PORT=<port number of your choice>
   ```
   Example:
   ```
   PORT=3000
   ```

4. Navigate to the `src` folder in your terminal and execute the following command to initialize Sequelize:
   ```
   npx sequelize init
   ```

   This command will create `migrations` and `seeders` folders along with a `config.json` file inside the `config` folder.

5. If you are setting up your development environment, modify the `config.json` file to provide the username and password of your database. Also, specify the dialect based on the database you are using (e.g., mysql, mariadb, etc.).

   If you are setting up the test or production environment, make sure to replace the host with the URL of the hosted database.

6. To run the server, execute the following command in the root directory:
   ```
   npm run dev
   ```

Congratulations! You have successfully set up the backend flight booking service. Feel free to modify and expand the code according to your project requirements.