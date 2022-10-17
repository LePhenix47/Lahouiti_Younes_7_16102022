class IndexApp {
  constructor() {
    this.recipeUrlApi = getApiDataForGitHub();
    this.recipeDataApi = new RecipesApi(this.recipeUrlApi);
  }

  async main() {
    const recipesDataPromise = await this.recipeDataApi.getRecipes();
    return recipesDataPromise;
  }

  static addRecipeCards(container, recipeArray) {
    container.innerHTML = new RecipeCardTemplate(
      recipeArray
    ).createRecipeCards();
  }
}

//DOM Elements
const recipeCardsContainer = document.querySelector(
  ".main-index__recipes-container"
);

const searchTagsContainer = document.querySelector(
  ".main-index__tags-container"
);

const dropdownMenuOptionsListContainer = document.querySelector(
  ".dropdown-menu__options-list"
);

//Launching the app
const launchApp = new IndexApp().main();

let arrayOfRecipes = [];

launchApp.then((recipes) => {
  arrayOfRecipes = recipes;

  IndexApp.addRecipeCards(recipeCardsContainer, arrayOfRecipes);
});

//In order to make the GitHub Pages page work we must use a relative path to the data directory
function getApiDataForGitHub() {
  const urlAPI = window.location.origin.includes("http://127.0.0.1:5500")
    ? "http://127.0.0.1:5500/P7/workstation/data/recipes.json"
    : "./data/recipes.json";

  return urlAPI;
}
