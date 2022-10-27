//Callback function that will be called every single time a user inputs something in the search bar
function searchRecipe(event) {
  event.preventDefault();
  const valueOfInput = transformText(
    event.currentTarget.value,
    "lowercase",
    true
  );

  console.log(event);

  const queryIsOverTwoCharsLong = verifyCharacterLength(
    valueOfInput,
    "over",
    3
  );

  console.log({ queryIsOverTwoCharsLong });

  resetCards();
  updateCounterOfVisibleCards();

  if (queryIsOverTwoCharsLong) {
    console.log({ arrayOfRecipes });
    updateCardsUIByMainSearch(valueOfInput);
    updateDropdownMenus();
    updateCounterOfVisibleCards();
  } else {
    return;
  }
}

//Function that verifies the length of a string of character
//⚠ Includes whitespaces too ⚠

function verifyCharacterLength(string, operator, number) {
  switch (operator) {
    case "over" || ">": {
      return string.length >= number;
    }

    case "equals" || "=": {
      return string.length === number;
    }

    case "under" || "<": {
      return string.length <= number;
    }
    default: {
      throw "Error: Unknown comparison operator";
    }
  }
}

function updateCardsUIByMainSearch(valueInputted) {
  const visibleCardsNodeList = document.querySelectorAll(
    ".main-index__recipes-container>*"
  ); //⚠ Node list
  const visibleCardsArray = Array.from(visibleCardsNodeList);

  console.groupCollapsed("visibleCardsArray.forEach");
  visibleCardsArray.forEach(function (card, indexOfCard) {
    const { name, description, ingredients } = arrayOfRecipes[indexOfCard];

    console.log({ name, description, ingredients });

    //For the title
    const cardTitle = transformText(name, "lowercase", true);
    let valueContainsTitle = cardTitle.includes(valueInputted);

    //For the description
    const cardDescription = transformText(description, "lowercase", true);
    let valueContainsDescription = cardDescription.includes(valueInputted);

    //For the ingredients
    const cardIngredients = ingredients;
    let valueContainsIngredients = cardIngredients.some((ingredients) => {
      console.log({ ingredients });
      //We get the ingredient inside the array of ingredients and normalize it
      let ingredientOfArray = ingredients.ingredient;
      ingredientOfArray = transformText(ingredientOfArray, "lowercase", true);

      //We compare their values
      return ingredientOfArray.includes(valueInputted);
    });

    console.log({ valueContainsIngredients });

    const inputIncludesCardInfo =
      valueContainsTitle ||
      valueContainsDescription ||
      valueContainsIngredients;

    console.log(indexOfCard, arrayOfRecipes[indexOfCard]);
    console.log({ card });
    if (inputIncludesCardInfo) {
      console.log(
        "%cis relevant to the search",
        "background: green; font-size: 20px"
      );
      return;
    } else {
      card.classList.add("hide");
      console.log(
        "%cis IRRELEVANT to the search",
        "background: crimson; font-size: 20px"
      );
    }
  });
  console.groupEnd("visibleCardsArray.forEach");

  const remainingAmountOfCards = getAmountOfVisibleCards();
  if (remainingAmountOfCards) {
    resetRecipeNotFoundMessage();
  } else {
    sendRecipeNotFoundMessage(valueInputted);
  }
}

function resetCards() {
  const cardsArray = getAllCards();

  cardsArray.forEach((card) => {
    return card.classList.remove("hide");
  });
}

function getAllCards() {
  const cardsNodeList = document.querySelectorAll(
    ".main-index__recipes-container>*"
  ); //⚠ Node list
  const cardsArray = Array.from(cardsNodeList);

  return cardsArray;
}

function getAmountOfVisibleCards() {
  return getAllVisibleCards().length;
}

function updateCounterOfVisibleCards() {
  const amountOfVisibleCards = getAmountOfVisibleCards();
  amountOfVisibleCardsParagraph.textContent = `Recettes trouvées: ${amountOfVisibleCards}`;
}

function sendRecipeNotFoundMessage(valueInputted) {
  recipeNotFoundParagraph.textContent = `Aïe, nous n'avons pas trouvé de recette pour "${valueInputted}" (╯°□°）╯︵ ┻━┻`;
}

function resetRecipeNotFoundMessage() {
  recipeNotFoundParagraph.textContent = "";
}
