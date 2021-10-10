import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addrecipeView.js';

import icons from 'url:.././img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1)Load
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //2)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    //get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);
    //Render Results
    resultsView.render(model.getSearchResultsPage());
    //4)Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //Rende NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //4)Render NEw pagination
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //Update the recipe servings
  model.updateServings(newServings);
  //Update the recipe view

  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //1)Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2)Update recipe view
  recipeView.update(model.state.recipe);
  //3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addrecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //render success message
    addrecipeView.renderMessage();
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Cahnge ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(':(', err);
    addrecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addrecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
