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

//Launching the app
const launchApp = new IndexApp().main();

console.log(launchApp);

const selectedOptionsArray = []; //This array will contain all the name of the tags that the user chose

let arrayOfRecipes = []; //Array containing all the list of  the different recipes fetched from the JSON file

let arrayOfIngredients = []; //Array containing all the list of

let arrayOfDevices = []; //Array containing all the list of

let arrayOfUtensils = []; //Array containing all the list of

let arrayOfItemsSearchedByUser = [];

let tagsTextArray = [];

let queryParameters = "";

let keywordsParameters = "";

launchApp.then((recipes) => {
  arrayOfRecipes = recipes;

  arrayOfIngredients = createUniqueArrays(arrayOfRecipes, "ingredients", true); //Contains the array of arrays
  arrayOfIngredients = createUniqueArrays(
    //Contains the unique values of the arrays inside this array
    arrayOfIngredients,
    "ingredient",
    false
  );

  console.groupCollapsed("Array of ingredients");
  console.table(arrayOfIngredients);
  console.groupEnd("Array of ingredients");

  arrayOfDevices = createUniqueArrays(arrayOfRecipes, "appliance", false);

  console.groupCollapsed("Array of devices");
  console.table(arrayOfDevices);
  console.groupEnd("Array of devices");

  arrayOfUtensils = createUniqueArrays(arrayOfRecipes, "ustensils", false);

  console.groupCollapsed("Array of utensils");
  console.table(arrayOfUtensils);
  console.groupEnd("Array of utensils");
  IndexApp.addRecipeCards(recipeCardsContainer, arrayOfRecipes);

  addEventListeners();

  initiateDropdownMenus();
});

const inputsArray = document.getElementsByClassName(
  "dropdown-menu__sort-input"
);

const searchRecipeInput = document.querySelector(".main-index__input");

const form = document.querySelector(".main-index__form");

//Adds all the event listeners inside the page
function addEventListeners() {
  for (input of inputsArray) {
    input.addEventListener("click", openMenuOptions); //To open the dropdown menu
    input.addEventListener("input", createTag); //To display all the list items
  }

  searchRecipeInput.addEventListener("input", searchRecipes);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

//This function will create arrays with unique values
function createUniqueArrays(array, objectProperty, arrayContainsObjects) {
  // we add inside the concat method an empty array that we'll concatenate
  // to the array of recipes that will be mapped to contain ONLY the array of appliances/devices
  array = [].concat(
    ...array.map((recipe) => {
      let valueOfProperty = recipe[objectProperty];
      return valueOfProperty;
    })
  );

  if (!arrayContainsObjects) {
    //If the array contains DOES NOT contain objects → Set its values to lowercase
    setArrayValuesToLowerCase(array);
  }

  // We'll create a set in order to avoid duplicates,
  return [...new Set(array)];
}

//This functions sets all values inside an array to lowercase
function setArrayValuesToLowerCase(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].toLowerCase();
  }
  return array;
}
