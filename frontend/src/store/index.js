import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import recipeReducer from './recipeSlice';
import searchReducer from './searchSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'recipe'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  recipe: recipeReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;