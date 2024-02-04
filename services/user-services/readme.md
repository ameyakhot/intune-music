# User Service

## Overview
The User Service is a key component of our microservices architecture, handling all user-related operations including registration, authentication, and user profile management. This service is designed to be independently deployable, scalable, and maintainable.

## Features
- User Registration
- User Login
- JWT-based Authentication
- Password Hashing and Security

## Technology Stack
- **Node.js**: Runtime environment for executing JavaScript on the server.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Bcryptjs**: Library for hashing and salting user passwords.
- **jsonwebtoken**: Implementation of JSON Web Tokens for secure authentication.
- **dotenv**: Module to load environment variables from a `.env` file.

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB instance (local or remote)

### Installation
1. **Clone the repository** (if applicable):

git clone [repository-url]

2. **Navigate to the `user-service` directory**:

cd path/to/user-service

3. **Install dependencies**:

npm install

4. **Set up environment variables**:
- Create a `.env` file in the root of the `user-service` directory.
- Add the following variables:
  ```
  MONGO_URI=[Your MongoDB URI]
  JWT_SECRET=[Your JWT Secret]
  PORT=[Preferred Port Number] (optional)
  ```

### Running the Service
1. **Start the server**:

npm start


## API Documentation
Here you can list your API endpoints with their respective descriptions, request types, and payload structures.

### Registration
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Payload**:
```json
{
 "username": "user1",
 "email": "user1@example.com",
 "password": "yourpassword"
}

Endpoint: /api/auth/login
Method: POST
Payload:

{
  "email": "user1@example.com",
  "password": "yourpassword"
}
