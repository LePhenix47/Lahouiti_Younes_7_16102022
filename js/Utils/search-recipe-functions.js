function searchRecipes(event) {
  event?.preventDefault();
  const valueOfInput = event.currentTarget.value;
  const queryIsOverTwoCharsLong = verifyCharacterLength(valueOfInput, 3);
  console.log(queryIsOverTwoCharsLong);

  addQueryParametersToUrl(valueOfInput);
  addKeywordParametersToUrl();

  updateUrl(queryParameters, keywordsParameters);

  if (queryIsOverTwoCharsLong) {
    updateRecipeCardsUI();
  } else {
    return;
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

function updateRecipeCardsUI() {
  const cardsElementsObject = getCardsInContainer();
  console.log(getCardsInContainer());
  //↓
  console.group("Cards array attributes");

  const parameterValuesObject = getQueryAndKeywordParameters();
  console.log(parameterValuesObject);

  for (card of cardsElementsObject.cardsArray) {
    let cardInfos = getInfosFromCard(card);
    let recipeIsSearchedByUser = parameterValuesObject.queryInputted.includes(
      cardInfos.cardRecipeDescription
    );

    console.log(cardInfos);
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
  const objectToBeReturned = { cardsContainer, cardsArray };

  return objectToBeReturned;
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
