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

let arrayOfIngredients = [];

let arrayOfDevices = [];

let arrayOfUtensils = [];

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

  addFeatures();
});

const inputsArray = document.getElementsByClassName(
  "dropdown-menu__sort-input"
);

function addFeatures() {
  for (input of inputsArray) {
    input.addEventListener("focus", openMenuOptions);
    input.addEventListener("change", closeMenuOptions);
  }
}

function openMenuOptions(event) {
  console.log("Focused on ", event.currentTarget);
  let userHasNotInputted =
    event.currentTarget.value === event.currentTarget.getAttribute("name");
  if (userHasNotInputted) {
    event.currentTarget.value = "";
  }
  const container = event.currentTarget.closest(".dropdown-menu");
  container.classList.add("input-container-active");

  const label = container.querySelector(".dropdown-menu__sort-label");
  label.classList.add("label-active");

  const dropdownMenuList = container.querySelector(".dropdown-menu__options");
  dropdownMenuList.classList.remove("hide");
  dropdownMenuList.classList.remove("dropdown-options-inactive");
  dropdownMenuList.classList.add("dropdown-options-active");
  console.log({ dropdownMenuList });

  console.log(container.getAttribute("data-search-type"));
}

function closeMenuOptions(event) {
  console.log("Changed input on ", event.currentTarget);
  let inputIsEmpty = event.currentTarget.value === "";
  console.log({ inputIsEmpty });

  const container = event.currentTarget.closest(".dropdown-menu");

  const label = container.querySelector(".dropdown-menu__sort-label");
  label.classList.remove("label-active");

  const dropdownMenuList = container.querySelector(".dropdown-menu__options");

  dropdownMenuList.classList.remove("dropdown-options-active");
  dropdownMenuList.classList.add("dropdown-options-inactive");
  dropdownMenuList.classList.add("hide");

  container.classList.remove("input-container-active");
  if (inputIsEmpty) {
    event.currentTarget.value = event.currentTarget.getAttribute("name");
  }
}
