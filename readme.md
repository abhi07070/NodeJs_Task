## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.

## Usage

1. Run the project using `nodemon index.js`.
2. Access the APIs at `http://localhost:3000` (or the specified port).

## Endpoints

- **POST /api/register**: Register a new user.
- **POST /api/login**: Log in with username and password.
- **POST /api/forgot-password**: Reset user password.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `PORT`: Port number for the server.
- `MONGO_DB`: MongoDB connection string.
- `JWT_SECRET`: JWT SECRET.

Example `.env` file:

```plaintext
PORT=4000
MONGO_DB=mongodb://localhost:27017/your_database
JWT_SECRET= this is jwt secret
```
