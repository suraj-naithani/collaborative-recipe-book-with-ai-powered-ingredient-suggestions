# Project Setup and Environment Configuration

## 1. Prerequisites

* Node.js and npm (or yarn)
* PostgreSQL
* A Cloudinary account
* An OpenAI API key


## 2. Project Setup

bash
npm init -y
npm install express pg pg-hstore body-parser cors dotenv react react-dom react-redux redux redux-thunk @reduxjs/toolkit tailwindcss postcss autoprefixer
npx tailwindcss init -p
Add Tailwind directives to your CSS file (e.g., `./src/index.css`).

## 3. Database Setup

Create a PostgreSQL database (e.g., `recipe_app`).  Then, create the following table:

sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    imageUrl VARCHAR(255),
    userId INTEGER REFERENCES users(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

## 4. Environment Variables

Create a `.env` file in the root directory:

PORT=3001
DATABASE_URL=postgres://your_user:your_password@your_host:5432/recipe_app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_api_key
## 5. Cloudinary and OpenAI Configuration

Ensure your Cloudinary and OpenAI API keys are correctly set in the `.env` file.


## 6. Backend (Node.js/Express.js)

Create a server file (e.g., `server.js`):

require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });


app.use(bodyParser.json());
app.use(cors());

// Add your API routes here (example)
app.get('/recipes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.listen(port, () => console.log(`Server listening on port ${port}`));

Remember to replace placeholder values with your actual credentials.  Implement error handling and security best practices in a production environment.  This is a minimal example; you'll need to add more routes and functionality.