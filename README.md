# Backend Wizards - Stage 1

This is the backend implementation for Stage 1 of Backend Wizards challenge.

## Features

- Create user profiles by name using external APIs (Genderize, Agify, Nationalize)
- Store profiles in MongoDB database with duplicate handling
- RESTful API endpoints for profile management
- Filtering capabilities for profiles

## Installation

1. Clone the repository
2. Navigate to the server directory
3. Run `npm install`
4. Create a `.env` file with your MongoDB connection string
5. Run `npm start`

## Environment Variables

Create a `.env` file in the server directory with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints

### POST /api/profiles
Create a new profile or return existing one if name already exists.

**Request Body:**
```json
{
  "name": "ella"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 46,
    "age_group": "adult",
    "country_id": "DRC",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

**Duplicate Response (201):**
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ...existing profile... }
}
```

### GET /api/profiles/{id}
Get a single profile by ID.

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emmanuel",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 25,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

### GET /api/profiles
Get all profiles with optional filters.

**Query Parameters:** gender, country_id, age_group (case-insensitive)

**Example:** /api/profiles?gender=male&country_id=NG

**Success Response (200):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "sarah",
      "gender": "female",
      "age": 28,
      "age_group": "adult",
      "country_id": "US"
    }
  ]
}
```

### DELETE /api/profiles/{id}
Delete a profile by ID.

**Success Response (204):** No Content

## Error Responses

All errors follow this structure:
```json
{ "status": "error", "message": "<error message>" }
```

- 400 Bad Request: Missing or empty name
- 422 Unprocessable Entity: Invalid type
- 404 Not Found: Profile not found
- 502 Bad Request: Upstream API failure
- 500 Internal Server Error: Server error

## Deployment

This app can be deployed to platforms like Railway, Heroku, or Vercel. Set the environment variables in the deployment settings.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Axios for HTTP requests
- UUID for ID generation
    "age": 46,
    "age_group": "adult",
    "country_id": "DRC",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

### GET /api/profiles/{id}
Get a single profile by ID.

### GET /api/profiles
Get all profiles with optional filters: gender, country_id, age_group.

### DELETE /api/profiles/{id}
Delete a profile by ID.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Axios for HTTP requests
- UUID for unique identifiers

## Deployment

This application can be deployed to platforms like Railway, Heroku, or Vercel. Make sure to set the PORT environment variable if required by the platform.