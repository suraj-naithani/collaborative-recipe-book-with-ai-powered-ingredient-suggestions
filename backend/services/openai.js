const { Configuration, OpenAIApi } = require("openai");
const {OPENAI_API_KEY} = require('../config');

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getIngredientSuggestions(existingIngredients) {
  try {
    if (!existingIngredients || existingIngredients.length === 0) {
      throw new Error("Existing ingredients cannot be empty.");
    }

    const prompt = `Suggest 3 additional ingredients that would complement the following ingredients in a recipe: ${existingIngredients.join(', ')}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003", // or a suitable model
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    const suggestions = response.data.choices[0].text.trim().split('\n').map(s => s.trim()).filter(s => s.length > 0);
    return suggestions;
  } catch (error) {
    console.error("OpenAI API error:", error);
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    }
    throw new Error("Failed to get ingredient suggestions from OpenAI.");
  }
}


module.exports = { getIngredientSuggestions };