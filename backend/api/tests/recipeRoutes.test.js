const request = require('supertest');
const app = require('../../../app');
const { Pool } = require('pg');
const { clearDatabase, createRecipe } = require('./utils');
const cloudinary = require('cloudinary').v2;
const openai = require('openai');

const pool = new Pool({
  // Your PostgreSQL connection details here
});

openai.apiKey = process.env.OPENAI_API_KEY;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


beforeAll(async () => {
    await pool.query('BEGIN');
});

afterAll(async () => {
    await pool.query('ROLLBACK');
    await pool.end();
});

beforeEach(async () => {
    await clearDatabase(pool);
});

describe('Recipe Routes', () => {
  it('should create a new recipe', async () => {
    const recipeData = {
      name: 'Test Recipe',
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Instructions',
      imageUrl: 'test.jpg'
    };
    const res = await request(app)
      .post('/api/recipes')
      .send(recipeData);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(recipeData.name);
  });


  it('should get a recipe by ID', async () => {
    const recipe = await createRecipe(pool, { name: 'Test Recipe 2', ingredients: ['a','b'], instructions: 'test', imageUrl: 'test.jpg'});
    const res = await request(app).get(`/api/recipes/${recipe.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Recipe 2');
  });

  it('should handle recipe not found', async () => {
    const res = await request(app).get('/api/recipes/9999');
    expect(res.status).toBe(404);
  });

    it('should get all recipes', async () => {
        await createRecipe(pool, { name: 'Recipe 1', ingredients: ['a','b'], instructions: 'test', imageUrl: 'test.jpg'});
        await createRecipe(pool, { name: 'Recipe 2', ingredients: ['c','d'], instructions: 'test', imageUrl: 'test.jpg'});
        const res = await request(app).get('/api/recipes');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should update a recipe', async () => {
        const recipe = await createRecipe(pool, { name: 'RecipeToUpdate', ingredients: ['a','b'], instructions: 'test', imageUrl: 'test.jpg'});
        const updatedRecipe = { name: 'Updated Recipe', ingredients: ['x','y'], instructions: 'updated instructions', imageUrl: 'test.jpg'};
        const res = await request(app).put(`/api/recipes/${recipe.id}`).send(updatedRecipe);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Recipe');
    });

    it('should delete a recipe', async () => {
        const recipe = await createRecipe(pool, { name: 'RecipeToDelete', ingredients: ['a','b'], instructions: 'test', imageUrl: 'test.jpg'});
        const res = await request(app).delete(`/api/recipes/${recipe.id}`);
        expect(res.status).toBe(204);
        const checkRes = await request(app).get(`/api/recipes/${recipe.id}`);
        expect(checkRes.status).toBe(404);
    });


    it('should suggest ingredients using OpenAI', async () => {
        const res = await request(app).get('/api/recipes/suggestIngredients?base="pizza"');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });


    it('should handle errors from OpenAI', async () => {
        //Mock openAI error for testing
        const originalOpenaiCreate = openai.Completion.create;
        openai.Completion.create = jest.fn(() => {
            throw new Error('OpenAI API Error');
        })
        const res = await request(app).get('/api/recipes/suggestIngredients?base="pizza"');
        expect(res.status).toBe(500);
        openai.Completion.create = originalOpenaiCreate;

    });

    it('should handle cloudinary upload error', async () => {
        const originalCloudinaryUpload = cloudinary.uploader.upload;
        cloudinary.uploader.upload = jest.fn(() => {
            throw new Error('Cloudinary upload error');
        })
        const recipeData = {
            name: 'Test Recipe',
            ingredients: ['ingredient1', 'ingredient2'],
            instructions: 'Instructions',
            image: 'fake-image-data'
        };
        const res = await request(app)
            .post('/api/recipes')
            .send(recipeData);
        expect(res.status).toBe(500);
        cloudinary.uploader.upload = originalCloudinaryUpload;
    });
});