class IndexApp {
  constructor() {
    this.usersDataApi = new PhotographersApi(getApiDataForGitHub());
  }

  static init() {}
}

//In order to make the GitHub Pages page work we must use a relative path to the data directory
function getApiDataForGitHub() {
  const urlAPI = window.location.origin.includes("http://127.0.0.1:5500")
    ? "http://127.0.0.1:5500/P6/workstation/data/photographers.json"
    : "../data/photographers.json";

  return urlAPI;
}
