//Callback function called every single time the user inputs something in the search bar
function searchRecipes(event) {
  event?.preventDefault();
  const valueOfInput = event.currentTarget.value;
  const queryIsOverTwoCharsLong = verifyCharacterLength(valueOfInput, 3);

  addQueryParametersToUrl(valueOfInput);

  addKeywordParametersToUrl();

  updateUrl(queryParameters, keywordsParameters);

  resetCards();

  if (queryIsOverTwoCharsLong) {
    updateRecipeCardsUI();
    updateDropdownMenus();
  } else {
    return;
  }
}

//Function made to update the value of every single dropdown menu

//Function that restores all the hidden recipe cards
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

const amountOfVisibleCardsParagraph = document.querySelector(
  ".main-index__cards-found-paragraph"
);
/*
⚠ ⚠ ⚠
NEEDS TO BE REFACTORED ↓
⚠ ⚠ ⚠
*/
//Function that updates the cards appearing according to the query of the user
function updateRecipeCardsUI() {
  //↓
  console.groupCollapsed("Cards array attributes");

  const parameterValuesObject = getQueryAndKeywordParameters();
  console.log(parameterValuesObject);

  const cardsArray = getCardsInContainer();
  let cardInfos = getAllCardInfos(cardsArray);

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
    const descriptionOfRecipe = transformText(
      cardInfos[i].cardRecipeDescription,
      "lowercase",
      true
    );

    const ingredientsOfRecipeArray = cardInfos[i].cardRecipeIngredientsArray;

    //All the different local variables
    let containsTitle = false;
    let containsDescription = false;
    let containsIngredients = false;
    let containsDevices = false;
    let containsUtensils = false;

    let recipeIsSearchedByUser = false;

    if (!parameterValuesObject.keywordsAddedWithTags) {
      //Main search by its title, description or ingredients
      containsTitle = checkIfRecipeStringContainsQuery(
        titleOfRecipe,
        parameterValuesObject.queryInputted
      );
      containsDescription = checkIfRecipeStringContainsQuery(
        descriptionOfRecipe,
        parameterValuesObject.queryInputted
      );
      containsIngredients = checkIfRecipeArrayContainsQuery(
        ingredientsOfRecipeArray,
        parameterValuesObject.queryInputted
      );
      recipeIsSearchedByUser =
        containsDescription || containsTitle || containsIngredients;
    } else {
      /*       
      Main search by its title, description or ingredients AND by its tags
      ⚠ Must be an INTERSECTION between the two ⚠
      ex: "lim" search + tag "Lait de coco" → Only the "Limonade de coco" recipe card should appear
      */
      containsTitle = checkIfRecipeStringContainsQuery(
        titleOfRecipe,
        parameterValuesObject.queryInputted,
        parameterValuesObject.keywordsAdded
      );
      containsDescription = checkIfRecipeStringContainsQuery(
        descriptionOfRecipe,
        parameterValuesObject.queryInputted,
        parameterValuesObject.keywordsAdded
      );
      containsIngredients = checkIfRecipeArrayContainsQuery(
        ingredientsOfRecipeArray,
        parameterValuesObject.queryInputted,
        parameterValuesObject.keywordsAdded
      );
      recipeIsSearchedByUser =
        containsDescription || containsTitle || containsIngredients;

      recipeIsSearchedByUser =
        ((containsDescription || containsTitle || containsIngredients) &&
          containsDevices) ||
        containsUtensils;
    }

    if (recipeIsSearchedByUser) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  }

  console.groupEnd("Cards array attributes");

  const remainingCards = getAllVisibleCards();
  console.log({ remainingCards });

  amountOfVisibleCardsParagraph.classList.remove("hide");
  amountOfVisibleCardsParagraph.textContent = `Recettes trouvées: ${remainingCards.length}`;

  if (!remainingCards.length) {
    recipeNotFoundParagraph.textContent = `Oops, nous n'avons pas trouvé une recette pour "${parameterValuesObject.queryInputted}" ¯\\_(ツ)_/¯`;
  } else {
    recipeNotFoundParagraph.textContent = "";
  }
  infosFromVisibleCard = [];

  infosFromVisibleCard = getAllCardInfos(remainingCards);
  console.log({ infosFromVisibleCard });
}
/*
⚠ ⚠ ⚠
NEEDS TO BE REFACTORED ↑
⚠ ⚠ ⚠
*/

//Function that return an object with the container of the cards and the array of cards
function getCardsInContainer() {
  const cardsContainer = document.querySelector(
    ".main-index__recipes-container"
  );

  const cardsNodeList = cardsContainer.querySelectorAll(".recipe-card"); //⚠Node list
  const cardsArray = Array.from(cardsNodeList);

  return cardsArray;
}

function getAllVisibleCards() {
  const cardsNodeList = document.querySelectorAll(
    ".main-index__recipes-container>*"
  );

  const cardsArray = Array.from(cardsNodeList);

  const remainingCardsArray = [];

  for (card of cardsArray) {
    let cardIsHidden = card.classList.value.includes("hide");
    if (cardIsHidden) {
      continue;
    }
    remainingCardsArray.push(card);
  }
  return remainingCardsArray;
}

//Function that returns an object with the: title, utensils, devices, description and
//an array of ingredients with its values normalized and set to lowercase
function getInfosFromCard(card) {
  //We get the infos of the card through its HTML attributes
  const cardRecipeTitle = card.getAttribute("data-name");
  const cardRecipeUtensils = card.getAttribute("data-utensils");
  const cardRecipeDevices = card.getAttribute("data-devices");

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
    //We transform all the text inside to make the string match easier later on
    cardRecipeIngredientsArray.push(
      transformText(
        replaceCharacter(ingredient.innerText, " :", ""),
        "lowercase",
        true
      )
    );
  }

  return {
    cardRecipeTitle: transformText(cardRecipeTitle, "lowercase", true),
    cardRecipeDescription: transformText(
      cardRecipeDescription,
      "lowercase",
      true
    ),
    cardRecipeIngredientsArray,
    cardRecipeUtensils: transformText(cardRecipeUtensils, "lowercase", true),
    cardRecipeDevices: transformText(cardRecipeDevices, "lowercase", true),
  };
}

//Function that returns an array of objects with all the infos about the card
function getAllCardInfos(arrayOfCards) {
  let cardInfos = [];
  for (card of arrayOfCards) {
    cardInfos = [...cardInfos, getInfosFromCard(card)];
  }
  return cardInfos;
}
//Function to check if the title or description of a recipe card contains the string inputted by the user
function checkIfRecipeStringContainsQuery(
  stringOfRecipe,
  queryByUser,
  keywordsAdded
) {
  switch (keywordsAdded) {
    case undefined: {
      return stringOfRecipe.includes(queryByUser);
    }
    default: {
      return (
        stringOfRecipe.includes(queryByUser) &&
        stringOfRecipe.includes(keywordsAdded)
      );
    }
  }
}
//Function to check if
function checkIfRecipeArrayContainsQuery(
  ingredientsArray,
  queryByUser,
  keywordsAdded
) {
  switch (keywordsAdded) {
    case undefined: {
      for (ingredient of ingredientsArray) {
        if (ingredient.includes(queryByUser)) {
          return true;
        }
      }
      return false;
    }
    default: {
      for (ingredient of ingredientsArray) {
        if (
          ingredient.includes(queryByUser) &&
          ingredient.includes(keywordsAdded)
        ) {
          return true;
        }
      }
      return false;
    }
  }
}
