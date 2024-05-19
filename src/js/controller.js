import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {

//   module.hot.accept;
// }



const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    //0 updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    //1)loading rece
    await model.loadRecipe(id);
    
    //2)rendering rece
    recipeView.render(model.state.recipe);
   
  
  } catch (err) {

    recipeView.renderError();
  }

};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);



    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);


    
  } catch (err) {
    console.log(err);
  }


}

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // update the recipe
model.updateServings(newServings);
// recipeView.render(model.state.recipe);
recipeView.update(model.state.recipe);


  //update view
}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked)   model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)   model.deleteBookmark(model.state.recipe.id);

  
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe =async function(newRecipe){
  
  try{
    addRecipeView.renderSpinner();

  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);


  recipeView.render(model.state.recipe);
  
addRecipeView.renderMessage();
bookmarksView.render(model.state.bookmarks);

window.history.pushState(null,'', `#${model.state.recipe.id}`)  // change url w/o reloading


  setTimeout(function () {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_SEC*1000);

  } catch(err) {
console.error(err);
addRecipeView.renderError(err.message);
  }

}

const newFeature = function(){
  console.log('NewFeature');
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
}
init();

