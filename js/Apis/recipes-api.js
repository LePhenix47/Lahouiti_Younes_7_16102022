class Api {
  constructor(url) {
    this.url = url;
  }

  async get() {
    try {
      let response = await fetch(this.url);

      if (!response.ok) {
        throw `An error has occured while attempting to retrieve data: ${JSON.stringify(
          response
        )}`;
      }
      return await response.json();
    } catch (apiError) {
      console.log(
        "%c" + apiError,
        "padding: 10px; font-size: 24px; background: crimson"
      );
      return await apiError;
    }
  }
}

class RecipesApi extends Api {
  constructor(url) {
    super(url);
  }

  async getRecipes() {
    return await this.get();
  }
}
