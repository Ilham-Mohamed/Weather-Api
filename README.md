# WeatherAPI Node.js Project
WeatherAPI is a Node.js application that provides weather information based on user accounts and locations.

## Features
- **Create User:** Create an account with email, password, and location.
- **Login:** Log in securely using email and password.
- **Update Location:** Users can update their location by providing their userId and Bearer token obtained from User Authentication.
- **Get Weather Details:** Retrieve weather details for a specific day by providing the userId and date and Bearer token obtained from User Authentication.

## Installation
1. Clone the repository:
   git clone https://github.com/Ilham-Mohamed/Weather-Api.git

2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a .env file in the root directory with the following:
   DATABASE_URL = mongodb+srv://ilham1998evr:ilham1998@weatherapinew.mmfiyje.mongodb.net/weather_api?retryWrites=true&w=majority
   SENDGRID_KEY=your_sendgrid_api_key
   WEATHERMAP_KEY=your_openweathermap_api_key



## Usage
If you Wish to run locally
   The main URL for the API is `http://localhost:3000/api

1. Create User
      Endpoint: /create-user
      Method: POST
      Request Body:
         {
            "email": "user@example.com",
            "password": "your_password",
            "location": "Your_Location"
         }
   
2. Login
      Endpoint: /login
      Method: POST
      Request Body:
         {
            "email": "user@example.com",
            "password": "your_password"
         }
   
3. Update Location
      Endpoint: /update-location/:userId
      Method: PUT
      Request Parameters:
      userId: User ID obtained during authentication(userId = _id, _id will be in the response of /login and /create-user
      Request Body:
         {
            "location": "Your_Location"
         }

4. Get Weather Details
      Endpoint: /weather/:userId/:date
      Method: GET
      Request Parameters:
      userId: User ID obtained during authentication
      date: Specific date in YYYY-MM-DD format

My Vercel Deployment URL
   1. https://weather-api-eight-flax.vercel.app/api/create-user
         Method: POST
      
   2. https://weather-api-eight-flax.vercel.app/api/login
         Method: POST
         you can use
            email: jaffnaevr@gmail.com
            password: 123456
      
   3. https://weather-api-eight-flax.vercel.app/api/update-location/65a166626bcc3167099aebad
         Method: PUT
         Request Body:
         {
            "location": "Your_Location"
         }

         65a166626bcc3167099aebad is the _id of jaffnaevr@gmail.com

   4. https://weather-api-eight-flax.vercel.app/api/weather/65a166626bcc3167099aebad/2024-01-12
         Method: GET

