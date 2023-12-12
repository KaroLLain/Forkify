import * as model from './model.js';
import recipeView from './vievs/recipeView.js';
import searchView from './vievs/searchView.js';
import resultsView from './vievs/resultsView.js';
import paginationView from './vievs/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const contolRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.loadSearchResults(query);

    //3. Render results
    resultsView.render(model.getSearchResultsPage(1));

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //3. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4. Render new pagination buttons
  // paginationView.render(model.state.search);
  paginationView.update(model.state.search);
};

const controlServings = function (newServings) {
  //Update recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(contolRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};
init();
