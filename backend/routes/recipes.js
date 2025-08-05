const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const cloudinary = require('../utils/cloudinary');
const openai = require('../utils/openai');


router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').not().isEmpty(),
    check('instructions', 'Instructions are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, instructions, imageUrl } = req.body;

    try {
      let image;
      if(imageUrl) {
        const result = await cloudinary.uploader.upload(imageUrl, {
          upload_preset: 'recipe-images'
        });
        image = result.secure_url;
      } else {
        image = null;
      }

      const recipe = new Recipe({
        user: req.user.id,
        title,
        ingredients,
        instructions,
        imageUrl: image,
      });

      await recipe.save();
      res.json(recipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('user', ['name', 'avatar']);
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', ['name', 'avatar']);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, ingredients, instructions, imageUrl } = req.body;
    const recipeFields = {};
    if (title) recipeFields.title = title;
    if (ingredients) recipeFields.ingredients = ingredients;
    if (instructions) recipeFields.instructions = instructions;
    if (imageUrl) {
      const result = await cloudinary.uploader.upload(imageUrl, {upload_preset: 'recipe-images'});
      recipeFields.imageUrl = result.secure_url;
    }

    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $set: recipeFields },
            { new: true }
        );
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Recipe.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Recipe removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/suggestIngredients', async (req, res) => {
  const { prompt } = req.body;
  try {
    const suggestedIngredients = await openai.getIngredientSuggestions(prompt);
    res.json(suggestedIngredients);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;