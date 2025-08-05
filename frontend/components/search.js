import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, filterRecipes } from '../redux/actions/recipeActions';
import { openai } from '../api/openai';


const Search = () => {
  const dispatch = useDispatch();
  const recipes = useSelector(state => state.recipes.recipes);
  const loading = useSelector(state => state.recipes.loading);
  const error = useSelector(state => state.recipes.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    ingredients: [],
  });

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(filterRecipes({ ...filters, searchQuery }));
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleIngredientAdd = async (e) => {
    e.preventDefault();
    try{
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Suggest 3 ingredients that go well with ${searchQuery}`,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.5,
      });
      const suggestions = response.data.choices[0].text.trim().split('\n').map(s => s.trim());
      setFilters(prevFilters => ({ ...prevFilters, ingredients: [...prevFilters.ingredients, ...suggestions] }));
    } catch (err) {
      console.error("OpenAI API error:", err);
      //Handle error appropriately, maybe display a message to the user.
    }
  };


  const handleIngredientRemove = (ingredient) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ingredients: prevFilters.ingredients.filter(ing => ing !== ingredient),
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCuisine = !filters.cuisine || recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase());
    const matchesDiet = !filters.diet || recipe.diet.toLowerCase().includes(filters.diet.toLowerCase());
    const matchesIngredients = filters.ingredients.every(ing => recipe.ingredients.some(rIng => rIng.toLowerCase().includes(ing.toLowerCase())));
    return matchesSearch && matchesCuisine && matchesDiet && matchesIngredients;
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSearch}>
        <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Search recipes..." className="border border-gray-300 rounded px-3 py-2 mb-2" />
        <select name="cuisine" value={filters.cuisine} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 mb-2">
          <option value="">All Cuisines</option>
          {/* Add cuisine options here */}
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
        </select>
        <select name="diet" value={filters.diet} onChange={handleFilterChange} className="border border-gray-300 rounded px-3 py-2 mb-2">
          <option value="">All Diets</option>
          {/* Add diet options here */}
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <div>
          {filters.ingredients.map((ing, index) => (
            <div key={index} className="inline-block mr-2 mb-2">
              <span className="bg-gray-200 p-1 rounded">{ing}</span>
              <button onClick={() => handleIngredientRemove(ing)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">X</button>
            </div>
          ))}
          <button onClick={handleIngredientAdd} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Suggest Ingredients</button>
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Search</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {filteredRecipes.map(recipe => (
          //Recipe display component goes here
          <div key={recipe._id} className="bg-white shadow-md rounded px-4 py-2">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-lg font-bold">{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;