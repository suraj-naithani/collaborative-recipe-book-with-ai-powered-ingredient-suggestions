# Backend API for Recipe App

## Dependencies

express
pg
bcrypt
jsonwebtoken
dotenv
cloudinary
axios
## .env

DATABASE_URL=YOUR_POSTGRES_URL
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
JWT_SECRET=YOUR_JWT_SECRET
## server.js

const express = require('express');
const pg = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

//User Authentication

app.post('/register', async (req, res) => {
  // ... registration logic ...
});

app.post('/login', async (req, res) => {
  // ... login logic ...
});


//Recipe Management

app.post('/recipes', async (req, res) => {
  // ... create recipe logic ...
});

app.get('/recipes', async (req, res) => {
  // ... get recipes logic ...
});

app.get('/recipes/:id', async (req, res) => {
  // ... get single recipe logic ...
});

app.put('/recipes/:id', async (req, res) => {
  // ... update recipe logic ...
});

app.delete('/recipes/:id', async (req, res) => {
  // ... delete recipe logic ...
});


//Recipe Search

app.get('/search', async (req, res) => {
  // ... search recipes logic ...
});


//AI Ingredient Suggestions

app.post('/ingredients', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      // ... OpenAI API call ...
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    res.json(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate ingredient suggestions' });
  }
});

// Cloudinary Integration

app.post('/upload', async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      // ... cloudinary upload options ...
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});


//User Profile Management

app.get('/profile/:id', async (req, res) => {
  // ... get user profile logic ...
});

app.put('/profile/:id', async (req, res) => {
  // ... update user profile logic ...
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});