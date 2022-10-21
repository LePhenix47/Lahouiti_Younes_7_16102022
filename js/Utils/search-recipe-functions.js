function searchRecipes(event) {
  event?.preventDefault();
  const valueOfInput = event.currentTarget.value;
  const queryIsOverTwoCharsLong = verifyCharacterLength(valueOfInput, 3);
  console.log(queryIsOverTwoCharsLong);

  addQueryParametersToUrl(valueOfInput);

  addKeywordParametersToUrl();

  updateUrl(queryParameters, keywordsParameters);

  resetCards();

  if (queryIsOverTwoCharsLong) {
    updateRecipeCardsUI();
  } else {
    return;
  }
}

function resetCards() {
  const cardsArray = getCardsInContainer();
  for (card of cardsArray) {
    card.classList.remove("hide");
  }
}

function verifyCharacterLength(string, number) {
  return string.length >= number;
}

function replaceCharacter(
  string,
  characterToBeRemoved,
  characterToBeReplacedBy
) {
  return string.split(characterToBeRemoved).join(characterToBeReplacedBy);
}
/*
Function to search the recipe
*/

const recipeNotFoundParagraph = document.querySelector(
  ".recipe-card__not-found-message"
);

function updateRecipeCardsUI() {
  //↓
  console.groupCollapsed("Cards array attributes");

  const parameterValuesObject = getQueryAndKeywordParameters();
  console.log(parameterValuesObject);

  let cardInfos = getAllCardInfos();
  const cardsArray = getCardsInContainer();

  const remainingCards = [];

  for (let i = 0; i < cardsArray.length; i++) {
    const card = cardsArray[i];

    /*
    
    Here is where we'll add/remove the cards 
    */
    const titleOfRecipe = transformText(
      cardInfos[i].cardRecipeTitle,
      "lowercase",
      true
    );
    let recipeIsSearchedByUser =
      titleOfRecipe.includes(parameterValuesObject.queryInputted) ||
      titleOfRecipe.includes(parameterValuesObject.keywordsAddedWithTags);

    console.log(
      "Is the recipe in",
      transformText(cardInfos[i].cardRecipeTitle, "lowercase", true),
      "searched by the user? \nUser inputted",
      parameterValuesObject.queryInputted,
      "ANSWER:",
      recipeIsSearchedByUser
    );

    if (recipeIsSearchedByUser) {
      card.classList.remove("hide");
      remainingCards.push(card);
    } else {
      card.classList.add("hide");
      remainingCards?.splice(i, 1);
    }
    if (!remainingCards.length) {
      recipeNotFoundParagraph.textContent = `Oops, nous n'avons pas trouvé une recette pour "${parameterValuesObject.queryInputted}" ¯\\_(ツ)_/¯`;
    } else {
      recipeNotFoundParagraph.textContent = "";
    }
  }
  console.groupEnd("Cards array attributes");
  //↑
}

//Function that return an object with the container of the cards and the array of cards
function getCardsInContainer() {
  const cardsContainer = document.querySelector(
    ".main-index__recipes-container"
  );

  const cardsNodeList = cardsContainer.querySelectorAll(".recipe-card"); //⚠Node list
  const cardsArray = Array.from(cardsNodeList);

  return cardsArray;
}

function getInfosFromCard(card) {
  const cardRecipeTitle = card.getAttribute("data-name");
  const cardRecipeDescription = card.getAttribute("title");
  const cardRecipeIngredientsElementsNodeList = card.querySelectorAll(
    ".recipe-card__ingredient-item-name"
  ); //⚠ Node list
  const cardRecipeIngredientsElementsArray = Array.from(
    //Contains an array with <span> HTML elements
    cardRecipeIngredientsElementsNodeList
  );
  //We retrieve the text inside the <span> elements
  let cardRecipeIngredientsArray = [];
  for (ingredient of cardRecipeIngredientsElementsArray) {
    cardRecipeIngredientsArray.push(ingredient.innerText);
  }
  const cardRecipeUtensils = card.getAttribute("data-utensils");
  const cardRecipeDevices = card.getAttribute("data-devices");

  return {
    cardRecipeTitle,
    cardRecipeDescription,
    cardRecipeIngredientsArray,
    cardRecipeUtensils,
    cardRecipeDevices,
  };
}

function getAllCardInfos() {
  let cardInfos = [];
  const cardsArray = getCardsInContainer();

  for (card of cardsArray) {
    cardInfos = [...cardInfos, getInfosFromCard(card)];
  }
  return cardInfos;
}
