import React from 'react';
import { useDispatch } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    if (recipe.isFavorite) {
      dispatch(removeFromFavorites(recipe.id));
    } else {
      dispatch(addToFavorites(recipe.id));
    }
  };

  const handleRecipeClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer" onClick={handleRecipeClick}>
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{recipe.title}</h2>
        <p className="text-gray-600 text-sm mt-2">{recipe.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175.107l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
            <span className="ml-2 text-gray-600">{recipe.rating}</span>
          </div>
          <button onClick={handleFavoriteClick} className={`text-gray-600 hover:text-red-500 ${recipe.isFavorite ? 'text-red-500' : ''}`}>
            {recipe.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;