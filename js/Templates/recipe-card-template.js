class RecipeCardTemplate {
  constructor(recipeArray) {
    this.recipeArray = recipeArray;
  }

  createRecipeCards() {
    let firstPartOfTemplate = "";
    let secondPartOfTemplate = "";
    let thirdPartOfTemplate = "";

    let totalTemplates = "";
    for (let recipeElement of this.recipeArray) {
      const { id, name, servings, appliance, ustensils, description, time } =
        recipeElement;

      firstPartOfTemplate = `
         <div class="recipe-card" data-id="${id}" data-name="${name}" data-servings="${servings}" data-devices="${appliance}" data-utensils="${ustensils}"
                        >
                        <div class="recipe-card__image-container"></div>
                        <div class="recipe-card__text-container">
                            <div class="recipe-card__title-prep-time">
                                <h2 class="recipe-card__recipe-name">${name}</h2>
                                <p class="recipe-card__recipe-prep-time">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class="clock-svg">
                                        <path
                                            d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z"
                                            fill="black" />
                                    </svg>
                                    ${time} min
                                </p>
                            </div>
                            <div class="recipe-card__ingredients-instructions">
                                <ul class="recipe-card__ingredients-list">
        `;
      //Need to add another for loop here
      for (let ingredientOfRecipe of recipeElement.ingredients) {
        const { ingredient, quantity, unit } = ingredientOfRecipe;

        secondPartOfTemplate += `
         <li class="recipe-card__ingredient-item">
                                        <span class="recipe-card__ingredient-item-name">${ingredient} ${
          !!quantity ? ":" : ""
        }</span>
                                        ${!!quantity ? quantity : ""} ${
          !!unit ? unit : ""
        }
                                    </li>`;
      }
      thirdPartOfTemplate = `  </ul>
                                <p class="recipe-card__instructions">${description}</p>
                            </div>
                        </div>
                    </div>

      `;
      let template =
        firstPartOfTemplate + secondPartOfTemplate + thirdPartOfTemplate;
      secondPartOfTemplate = "";

      totalTemplates += template;
    }
    return totalTemplates;
  }
}
