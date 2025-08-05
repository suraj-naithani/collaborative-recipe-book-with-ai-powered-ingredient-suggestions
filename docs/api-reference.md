# API Reference

## Authentication

**Endpoint:** `/api/auth/login`

**Method:** POST

**Request Body:**

{
  "username": "username",
  "password": "password"
}
**Response (Success):**

{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "username"
  }
}
**Response (Error):**

{
  "error": "Invalid credentials"
}
## Recipes

**Endpoint:** `/api/recipes`

**Method:** GET

**Query Parameters:**

* `page` (optional): Page number for pagination.
* `limit` (optional): Number of recipes per page.
* `search` (optional): Search term for recipe title or ingredients.


**Response:**

{
  "recipes": [
    {
      "id": 1,
      "title": "Recipe Title",
      "image": "cloudinary_url",
      "ingredients": ["Ingredient 1", "Ingredient 2"],
      "instructions": "Instructions",
      "userId": 1
    },
    // ... more recipes
  ],
  "total": 10, // Total number of recipes
  "page": 1,   // Current page
  "limit": 10 // Number of recipes per page
}
**Endpoint:** `/api/recipes`

**Method:** POST

**Request Body (Requires Authentication):**

{
  "title": "New Recipe Title",
  "image": "base64_encoded_image",
  "ingredients": ["Ingredient A", "Ingredient B"],
  "instructions": "New Recipe Instructions"
}
**Response (Success):**

{
  "id": 2,
  "title": "New Recipe Title",
  "image": "cloudinary_url",
  "ingredients": ["Ingredient A", "Ingredient B"],
  "instructions": "New Recipe Instructions",
  "userId": 1
}
**Endpoint:** `/api/recipes/:id`

**Method:** GET

**Response:**  (Same as single recipe in GET /api/recipes response)


**Endpoint:** `/api/recipes/:id`

**Method:** PUT (Requires Authentication)

**Request Body:** (Similar to POST /api/recipes)


**Endpoint:** `/api/recipes/:id`

**Method:** DELETE (Requires Authentication)


## Ingredient Suggestions

**Endpoint:** `/api/ingredients/suggest`

**Method:** POST

**Request Body:**

{
  "ingredients": ["Ingredient 1", "Ingredient 2"]
}
**Response:**

{
  "suggestions": ["Suggested Ingredient 1", "Suggested Ingredient 2"]
}
## Error Handling

All endpoints return JSON responses. Error responses include an `error` field with a descriptive message.  HTTP status codes are used to indicate success or failure (e.g., 200 for success, 400 for bad request, 401 for unauthorized, 500 for server error).