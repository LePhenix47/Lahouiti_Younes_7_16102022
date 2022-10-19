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
    console.log(
      "STATIC METHOD Text of tag:",
      tagText,
      "\nType of search =",
      tagSearchType
    );
    const tagTemplate = new TagTemplate(tagText, tagSearchType).createTag();
    console.log({ tagTemplate });
    container.innerHTML += tagTemplate;
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

//Launching the app
const launchApp = new IndexApp().main();

const selectedOptionsArray = []; //This array will contain all the name of the tags that the user chose

let arrayOfRecipes = []; //Array containing all the list of  the different recipes fetched from the JSON file

let arrayOfIngredients = []; //Array containing all the list of

let arrayOfDevices = []; //Array containing all the list of

let arrayOfUtensils = []; //Array containing all the list of

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
  console.groupCollapsed("Array of ingredients");
  console.table(arrayOfIngredients);
  console.groupEnd("Array of ingredients");
  arrayOfDevices = [
    ...new Set(
      [].concat(
        ...arrayOfRecipes.map((recipe) => recipe.appliance.toLowerCase())
      )
    ),
  ];
  console.groupCollapsed("Array of devices");
  console.table(arrayOfDevices);
  console.groupEnd("Array of devices");
  arrayOfUtensils = [
    ...new Set([].concat(...arrayOfRecipes.map((recipe) => recipe.ustensils))),
  ];
  arrayOfUtensils = [
    ...new Set(
      [].concat(...arrayOfUtensils.map((ustensil) => ustensil.toLowerCase()))
    ),
  ];
  console.groupCollapsed("Array of utensils");
  console.table(arrayOfUtensils);
  console.groupEnd("Array of utensils");
  IndexApp.addRecipeCards(recipeCardsContainer, arrayOfRecipes);

  addEventListerners();
});

const inputsArray = document.getElementsByClassName(
  "dropdown-menu__sort-input"
);

function addEventListerners() {
  for (input of inputsArray) {
    input.addEventListener("click", openMenuOptions); //To open the dropdown menu
    input.addEventListener("input", createTag); //To display all the list items
  }
}
