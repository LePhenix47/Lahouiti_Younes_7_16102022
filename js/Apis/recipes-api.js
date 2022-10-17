class Api {
  constructor(url) {
    this.url = url;
  }

  async get() {
    let data = undefined;
    try {
      let response = await fetch(this.url);

      if (!response.ok) {
        throw `An error has occured while attempting to retrieve data: ${JSON.stringify(
          response
        )}`;
      }
      data = await response.json();
    } catch (apiError) {
      console.log(
        "%c" + apiError,
        "padding: 10px; font-size: 24px; background: crimson"
      );
      data = apiError;
    }
    return data;
  }
}

class RecipesApi extends Api {
  constructor(url) {
    super(url);
  }

  getRecipes() {
    return this.get();
  }
}
