//In order to make the GitHub Pages page work we must use a relative path to the data directory
function getApiDataForGitHub() {
  const urlAPI = window.location.origin.includes("http://127.0.0.1:5500")
    ? "http://127.0.0.1:5500/P7/workstation/data/recipes.json"
    : "./data/recipes.json";

  return urlAPI;
}

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

  static createTagsForQuery(container, tagText, tagSearchType) {
    const tagTemplate = new TagTemplate(tagText, tagSearchType).createTag();
    container.appendChild(tagTemplate);
  }
}

//DOM Elements
const recipeCardsContainer = document.querySelector(
  ".main-index__recipes-container"
);

const tagsContainer = document.querySelector(".main-index__tags-container");

const dropdownMenuOptionsListContainer = document.querySelector(
  ".dropdown-menu__options-list"
);

const amountOfVisibleCardsParagraph = document.querySelector(
  ".main-index__cards-found-paragraph"
);

const recipeNotFoundParagraph = document.querySelector(
  ".recipe-card__not-found-message"
);
//Launching the app
const launchApp = new IndexApp().main();

const selectedOptionsArray = []; //This array will contain all the name of the tags that the user chose

let arrayOfRecipes = []; //Array containing all the list of  the different recipes fetched from the JSON file

let arrayOfIngredients = []; //Array containing all the list of

let arrayOfDevices = []; //Array containing all the list of

let arrayOfUtensils = []; //Array containing all the list of

let arrayOfIngredientsVisible = [];

let arrayOfDevicesVisible = [];

let arrayOfUtensilsVisible = [];

launchApp.then((recipes) => {
  arrayOfRecipes = recipes;

  /*
  Ok so here's how we get the array of appliances/devices

  The array of devices will be an array containing all the properties of the Set() object
  We'll create a new set in order to avoid duplicates, 
  we add inside this method an empty array that we'll concatenate
  to the array of recipes that will be mapped to contain ONLY the array of appliances/devices
  */
  arrayOfIngredients = [
    ...new Set(
      [].concat(...arrayOfRecipes.map((recipe) => recipe.ingredients))
    ),
  ];
  arrayOfIngredients = [
    ...new Set(
      [].concat(
        ...arrayOfIngredients.map((recipe) => recipe.ingredient.toLowerCase())
      )
    ),
  ];
  arrayOfDevices = [
    ...new Set(
      [].concat(
        ...arrayOfRecipes.map((recipe) => recipe.appliance.toLowerCase())
      )
    ),
  ];
  arrayOfUtensils = [
    ...new Set([].concat(...arrayOfRecipes.map((recipe) => recipe.ustensils))),
  ];
  arrayOfUtensils = [
    ...new Set(
      [].concat(...arrayOfUtensils.map((ustensil) => ustensil.toLowerCase()))
    ),
  ];
  IndexApp.addRecipeCards(recipeCardsContainer, arrayOfRecipes);

  addEventListerners();

  console.log(
    "%cAlgorithme de recherche V2",
    "background: purple; font-size: 16px; padding: 10px"
  );
});

const inputsArray = document.getElementsByClassName(
  "dropdown-menu__sort-input"
);

const mainSearchInput = document.querySelector(".main-index__input");

const form = document.querySelector(".main-index__form");

function addEventListerners() {
  for (input of inputsArray) {
    input.addEventListener("click", openMenuOptions); //To open the dropdown menu
    input.addEventListener("input", createTag); //To display all the list items
  }

  mainSearchInput.addEventListener("input", searchRecipe);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  const dropdownMenus = getAllDropdownMenus();

  dropdownMenus.forEach((dropdownMenu) => {
    const dropdownMenuList = dropdownMenu.querySelector(
      ".dropdown-menu__options"
    );
    addListItemsForDropdown(dropdownMenu, dropdownMenuList);
  });
}
