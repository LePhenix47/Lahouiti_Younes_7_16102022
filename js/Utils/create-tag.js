/*
				Given the fact that we want to have a research without it being accent sensitive
				we'll normalize the text inside each item list
				Here's the article explaining the code below:
				https://ricardometring.com/javascript-replace-special-characters
				Also here's the MDN doc:
				https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 */
//Function that replaces any latin characters with accents into a latin character without accents
//For more details look at the article in the comment a few lines above
function normalizeString(string) {
  return string
    .normalize("NFD") // returns the unicode NORMALIZATION FORM of the string using a canonical DECOMPOSITION (NFD).
    .replace(/[\u0300-\u036f]/g, "");
}

//Function that can transform text to uppercase, lowercase and also normalize it
//Returns a trimmed string
function transformText(string, textCase, normalize) {
  switch (textCase) {
    case "lowercase": {
      string = string.toLowerCase();
      break;
    }

    case "uppercase:": {
      string = string.toUpperCase();
      break;
    }

    case "titlecase": {
      string =
        string.substring(0, 1).toUpperCase() +
        string.substring(1).toLowerCase();
      break;
    }

    default: {
      throw "Text transformation has failed";
    }
  }

  if (normalize) {
    return normalizeString(string.trim());
  } else {
    return string.trim();
  }
}

function getAllVisibleCards() {
  const cardsNodeList = document.querySelectorAll(
    ".main-index__recipes-container>*"
  ); //⚠ Node list
  const cardsArray = Array.from(cardsNodeList);
  const arrayOfVisibleCards = [];

  //Loop
  cardsArray.forEach(function (card) {
    let cardIsHidden = card.classList.value.includes("hide");
    if (cardIsHidden) {
      return;
    }
    arrayOfVisibleCards.push(card);
  });

  return arrayOfVisibleCards;
}

//Compares 2 strings and returns true if the 2 strings match perfectly
function compareStrings(string1, string2) {
  let theStringsDoNotHaveTheSameLength = string1.length !== string2.length;

  if (theStringsDoNotHaveTheSameLength) {
    return false;
  } else {
    for (let i = 0; i < string1.length; i++) {
      const letterOfString1 = string1[i];
      const letterOfString2 = string2[i];
      const lettersAreNotTheSame = letterOfString1 !== letterOfString2;
      if (lettersAreNotTheSame) {
        return false;
      }
    }
  }

  return true;
}

function createTag(event) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list
  const listItemsArray = Array.from(listItemsNodeList);

  const arrayOfItemsSearchedByUser = [];

  const valueOfInput = transformText(
    event.currentTarget.value,
    "lowercase",
    true
  );

  listItemsArray.forEach(function (listItem) {
    let listItemText = transformText(listItem.innerText, "lowercase", true);
    let itemIsNotResearchedByUser = !listItemText.includes(valueOfInput);

    if (itemIsNotResearchedByUser) {
      listItem.classList.add("hidden-by-query");
      listItem.addEventListener("click", createTemplateTag);
      arrayOfItemsSearchedByUser?.splice(listItemsArray.indexOf(listItem), 1);
    } else {
      listItem.classList.remove("hidden-by-query");
      arrayOfItemsSearchedByUser.push(listItem.innerText);
    }
  });

  if (!arrayOfItemsSearchedByUser.length) {
    console.log(
      "No tag matched with the query:",
      event.currentTarget.value.toLowerCase()
    );
    console.table(arrayOfItemsSearchedByUser);
  }
}

function createTemplateTag(event) {
  console.groupCollapsed("Array of selected options by user");
  console.table(selectedOptionsArray);
  console.groupEnd("Array of selected options by user");

  console.log("click");

  const tagText = event.currentTarget.innerText;
  let tagTemplateHasAlreadyBeenCreated = false;

  selectedOptionsArray.forEach((selectedOption) => {
    if (selectedOption === tagText) {
      tagTemplateHasAlreadyBeenCreated = true;
    }
  });

  if (tagTemplateHasAlreadyBeenCreated) {
    return;
  }

  const searchType = event.currentTarget
    .closest(".dropdown-menu")
    .getAttribute("data-search-type");

  // event.currentTarget.closest(".dropdown-menu").dataset.searchType;

  const tagTypeContainer = tagsContainer.querySelector(
    `.main-index__tags-for-${searchType}`
  );

  selectedOptionsArray.push(tagText);

  IndexApp.createTagsForQuery(tagTypeContainer, tagText, searchType);

  resetCards();
  updateCardsUIByTags();
}

//Function to remove a tag
function removeTag(event) {
  const tagElement = event.currentTarget.parentElement;

  const containerOfTag = tagElement.parentElement;

  const textTag = tagElement.querySelector(".main-index__tag-text");

  for (let i = 0; i < selectedOptionsArray.length; i++) {
    const selectedOption = selectedOptionsArray[i];
    if (selectedOption === textTag.textContent) {
      selectedOptionsArray.splice(i, 1);
      console.table(selectedOptionsArray);
      containerOfTag.removeChild(tagElement);
    }
  }

  resetCards();
  updateCardsUIByTags();
  updateCounterOfVisibleCards();
  filterDropdownMenusListItems("hidden-by-main-search");
}

function getAllTagsText() {
  const tagsNodeLIst = document.querySelectorAll(".main-index__tag"); //⚠ Node list
  let tagsArray = Array.from(tagsNodeLIst);

  if (!tagsArray.length) {
    return [];
  } else {
    tagsArray = tagsArray.map((tag) => {
      let typeOfTheTag = tag.dataset.tagType;
      tag = transformText(tag.innerText, "lowercase", true);
      return `${tag},${typeOfTheTag}`;
    });
    return tagsArray;
  }
}

//
function getInfosOfCard(card) {
  const cardIdNumber = Number(card.dataset.id);

  if (!cardIdNumber) {
    throw "Error, function has been called but argument added inside the function is in the wrong format";
  }
  console.log({ card, cardIdNumber, arrayOfRecipes });

  let cardInfos = arrayOfRecipes.filter((recipe) => {
    return recipe.id === cardIdNumber;
  });

  console.log({ cardInfos });

  return cardInfos;
}

//Function that has as a parameter the recipe card itself and returns its array of ingredients
function getIngredientsOfCard(card) {
  const cardInfos = getInfosOfCard(card);

  let ingredientsArraysOfObjectsOfCard = cardInfos.map((infos) => {
    return infos.ingredients;
  });

  console.log(
    ingredientsArraysOfObjectsOfCard,
    ingredientsArraysOfObjectsOfCard[0]
  );

  ingredientsArraysOfObjectsOfCard = ingredientsArraysOfObjectsOfCard[0].map(
    (ingredientsObject) => {
      return ingredientsObject.ingredient;
    }
  );

  ingredientsArraysOfObjectsOfCard = transformArrayText(
    ingredientsArraysOfObjectsOfCard
  );

  return ingredientsArraysOfObjectsOfCard;
}
//Function that has as a parameter the recipe card itself and returns its device
function getDeviceOfCard(card) {
  const cardInfos = getInfosOfCard(card);

  let deviceOfCard = cardInfos.map((infos) => {
    return infos.appliance;
  });

  return deviceOfCard;
}
//Function that has as a parameter the recipe card itself and returns its array of utensils
function getUtensilsOfCard(card) {
  const cardInfos = getInfosOfCard(card);

  let utensilsOfCard = cardInfos.map((infos) => {
    return infos.utensils;
  });

  console.log({ utensilsOfCard });

  return utensilsOfCard;
}

//Function that updates the cards inside the container depending on whether or not they match the intersection of the tags added
function updateCardsUIByTags() {
  const cards = getAllVisibleCards();
  const tagsAdded = filterTagsByType();

  const { arrayOfIngredientsTag, arrayOfDevicesTag, arrayOfUtensilsTag } =
    tagsAdded;

  let noTagsArePresent =
    !arrayOfIngredientsTag && !arrayOfDevicesTag && !arrayOfUtensilsTag;

  if (noTagsArePresent) {
    console.log("No tags were added in");
    return;
  }

  arrayOfIngredientsVisible = getIngredientsFromVisibleCards();
  //
  arrayOfDevicesVisible = getDevicesFromVisibleCards();
  //
  arrayOfUtensilsVisible = getUtensilsFromVisibleCards();

  console.log({
    arrayOfIngredientsVisible,
    arrayOfDevicesVisible,
    arrayOfUtensilsVisible,
  });

  let cardShouldBeHidden = false;
  //We loop through each visible card
  cards.forEach((card, indexOfCard, cards) => {
    let counterForIntersectingTags = 0;

    let ingredientsArrayOfCard = getIngredientsOfCard(card);

    let deviceOfCard = getDeviceOfCard(card);
    let utensilsArrayOfCard = getUtensilsOfCard(card);

    if (arrayOfIngredientsTag.length) {
      console.log("Need to check intersection of ingredients");
      //If the user added some tags for the ingredients
      //We loop through each ingredient tag added

      console.log({ ingredientsArrayOfCard });

      arrayOfIngredientsTag.forEach((tagIngredient) => {
        //We loop through each ingredient from the visible cards
        ingredientsArrayOfCard.forEach((ingredientFromVisibleCard) => {
          console.log(
            { tagIngredient },
            "matches with",
            {
              ingredientFromVisibleCard,
            },
            "?",
            tagIngredient === ingredientFromVisibleCard
          );
          if (tagIngredient === ingredientFromVisibleCard) {
            //If the ingredient of the tag matches the ingredients from the card
            //we increment the counter and we break out of this loop
            counterForIntersectingTags++;
            return;
          }
        });
      });

      if (counterForIntersectingTags >= arrayOfIngredientsTag.length) {
        console.log(card, " should be shown");
        cardShouldBeHidden = false;
      } else {
        console.log(card, " must be HIDDEN");
        cardShouldBeHidden = true;
      }
    }

    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
      return;
    }

    if (arrayOfDevicesTag.length) {
      console.log("Need to check intersection of devices");

      if (counterForIntersectingTags === arrayOfDevicesTag.length) {
        console.log();
        cardShouldBeHidden = false;
      } else {
        console.log();
        cardShouldBeHidden = true;
      }
    }
    //Check if the card has an intersection of the devices tags
    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
      return;
    }
    if (arrayOfUtensilsTag.length) {
      console.log("Need to check intersection of utensils");

      if (counterForIntersectingTags === arrayOfUtensilsTag.length) {
        console.log();
        cardShouldBeHidden = false;
      } else {
        console.log();
        cardShouldBeHidden = true;
      }
    }
    //Check if the card has an intersection of the utensils tags
    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
    }
    //
  });

  updateDropdownMenus();
  updateCounterOfVisibleCards();
}

function filterTagsByType() {
  const tagsAdded = getAllTagsText();

  if (!tagsAdded.length) {
    return [];
  }

  let arrayOfIngredientsTag = [];
  let arrayOfDevicesTag = [];
  let arrayOfUtensilsTag = [];

  tagsAdded.forEach((tag) => {
    let tagText = splitStringToArray(tag, ",")[0];
    let typeOfTag = splitStringToArray(tag, ",")[1];

    switch (typeOfTag) {
      case "ingredients": {
        arrayOfIngredientsTag.push(tagText);
        break;
      }
      case "devices": {
        arrayOfDevicesTag.push(tagText);
        break;
      }
      case "utensils": {
        arrayOfUtensilsTag.push(tagText);
        break;
      }
    }

    console.log({ tagText, typeOfTag });

    console.log({
      arrayOfIngredientsTag,
      arrayOfDevicesTag,
      arrayOfUtensilsTag,
    });
  });

  return { arrayOfIngredientsTag, arrayOfDevicesTag, arrayOfUtensilsTag };
}

//Function that normalizes all the text inside an array
function transformArrayText(array) {
  array.forEach((value, index, arrayItself) => {
    arrayItself[index] = transformText(value, "lowercase", true);

    return value;
  });

  return array;
}

function transformArrayTextForListItems(array) {
  array.forEach((value, index, arrayItself) => {
    arrayItself[index] = transformText(value.innerText, "lowercase", true);

    return arrayItself[index];
  });

  return array;
}
