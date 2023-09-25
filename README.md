# exam-nifty
CRUD API Endpoints and Stripe Integration

1. clone and run npm install
2. create your local postgresql test db and replace env vars using the .env.example included in the repo. Create .local.env file and add your env vars such as DB_USERNAME, DB_PASSWORD, DB_NAME (as database name) and STRIPE_SECRET_KEY for your stripe test key. (NOTE: The database type used in the configs is POSTGRES)
3. npm run start:dev / or npm run start (this will run the database entities automatically, specifically the userstestnifty table because autosync entities typeorm feature is set to true)
4. you may use any api client (postman, insomnia, etc.) to test the api endpoints, or you can refer to the Swagger Open API documentation at http://localhost:3000/api
5. API Docs available at http://localhost:3000/api (for both users and products, and payments api endpoints, add the jwt token from the login to the bearer token to authorize the Swagger API docs)


