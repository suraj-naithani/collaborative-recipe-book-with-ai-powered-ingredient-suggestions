# Recipe App Frontend

This directory contains the frontend code for the Recipe App, built using React.js, Tailwind CSS, and Redux.

## Getting Started

1.  **Prerequisites:** Make sure you have Node.js and npm (or yarn) installed.
2.  **Installation:** Run `npm install` or `yarn install` to install the project dependencies.
3.  **Development:** Run `npm start` or `yarn start` to start the development server.  This will start the app in development mode.  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddRecipeForm.js
│   │   ├── RecipeCard.js
│   │   └── RecipeList.js
│   ├── reducers/
│   │   └── recipeReducer.js
│   ├── actions/
│   │   └── recipeActions.js
│   ├── store.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
## Technology Stack

*   **React.js:**  For building the user interface.
*   **Tailwind CSS:** For rapid UI development.
*   **Redux:** For state management.


## Features

*   **Add Recipe:** Users can add new recipes with title, ingredients, instructions, and an image.
*   **Ingredient Suggestions:**  Suggests ingredients using OpenAI API (backend integration required).
*   **Recipe List:** Displays a list of added recipes.
*   **Image Upload:** Uploads images to Cloudinary (backend integration required).


##  Further Development

*   Implement backend integration with Node.js, Express.js, and PostgreSQL.
*   Integrate Cloudinary for image uploads.
*   Integrate OpenAI API for ingredient suggestions.
*   Add recipe searching and filtering.
*   Implement user authentication.


## License

[MIT](https://choosealicense.com/licenses/mit/)