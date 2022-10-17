class IndexApp {
  constructor() {
    this.usersDataApi = new PhotographersApi(getApiDataForGitHub());
  }

  static init(container) {}
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

//In order to make the GitHub Pages page work we must use a relative path to the data directory
function getApiDataForGitHub() {
  const urlAPI = window.location.origin.includes("http://127.0.0.1:5500")
    ? "http://127.0.0.1:5500/P6/workstation/data/photographers.json"
    : "./data/photographers.json";

  return urlAPI;
}
