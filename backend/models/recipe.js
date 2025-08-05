const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');

const Recipe = sequelize.define('Recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prepTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  cookTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.0,
  },
}, {
  underscored: true,
});


Recipe.hasMany(require('./ingredient'), { foreignKey: 'recipeId', onDelete: 'cascade' });
Recipe.belongsTo(User, { foreignKey: 'userId' });
Recipe.belongsToMany(Category, { through: 'RecipeCategories', foreignKey: 'recipeId' });
Recipe.hasMany(require('./review'), { foreignKey: 'recipeId', onDelete: 'cascade' });


module.exports = Recipe;