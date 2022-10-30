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
  let string1Array = string1.split("");
  let string2Array = string2.split("");
  let theStringsDoNotHaveTheSameLength =
    string1Array.length !== string2Array.length;

  let wordsMatch = true;

  if (theStringsDoNotHaveTheSameLength) {
    return false;
  } else {
    string1Array.some((letterOfString1, indexOfLetter) => {
      let lettersAreNotTheSame =
        string1Array[indexOfLetter] !== string2Array[indexOfLetter];

      if (lettersAreNotTheSame) {
        wordsMatch = false;
      }
    });

    return wordsMatch;
  }
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
  }
}

//Function that creates the tag an updates the cards corresponding to the tags
function createTemplateTag(event) {
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

  // resetCards();
  let valueOfInput = getValueOfInput();
  updateCardsUIByMainSearch(valueOfInput);
  updateCardsUIByTags();
  updateDropdownMenus();
  updateCounterOfVisibleCards();
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
      containerOfTag.removeChild(tagElement);
    }
  }

  resetCards();
  let valueOfInput = getValueOfInput();
  updateCardsUIByMainSearch(valueOfInput);
  updateCardsUIByTags();
  updateCounterOfVisibleCards();
  filterDropdownMenusListItems("hidden-by-main-search");
  updateDropdownMenus();
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

  let cardInfos = arrayOfRecipes.filter((recipe) => {
    return recipe.id === cardIdNumber;
  });

  return cardInfos;
}

//Function that has as a parameter the recipe card itself and returns its array of ingredients
function getIngredientsOfCard(card) {
  const cardInfos = getInfosOfCard(card);

  let ingredientsArraysOfObjectsOfCard = cardInfos.map((infos) => {
    return infos.ingredients;
  });

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

  return deviceOfCard[0];
}
//Function that has as a parameter the recipe card itself and returns its array of utensils
function getUtensilsOfCard(card) {
  const cardInfos = getInfosOfCard(card);

  let utensilsOfCard = cardInfos[0].ustensils;

  utensilsOfCard = transformArrayText(utensilsOfCard);

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
    return;
  }

  // arrayOfIngredientsVisible = getIngredientsFromVisibleCards();
  // //
  // arrayOfDevicesVisible = getDevicesFromVisibleCards();
  // //
  // arrayOfUtensilsVisible = getUtensilsFromVisibleCards();

  //We loop through each visible card
  cards.forEach((card, indexOfCard, cards) => {
    let cardShouldBeHidden = false;
    let counterForIntersectingTags = 0;

    let ingredientsArrayOfCard = getIngredientsOfCard(card);

    let deviceOfCard = getDeviceOfCard(card);
    deviceOfCard = transformText(deviceOfCard, "lowercase", true);

    let utensilsArrayOfCard = getUtensilsOfCard(card);
    // utensilsArrayOfCard = transformArrayText(utensilsArrayOfCard);

    if (arrayOfIngredientsTag.length) {
      //If the user added some tags for the ingredients
      //We loop through each ingredient tag added

      arrayOfIngredientsTag.forEach((tagIngredient) => {
        //We loop through each ingredient from the visible cards
        ingredientsArrayOfCard.forEach((ingredientFromVisibleCard) => {
          let ingredientsMatch = compareStrings(
            tagIngredient,
            ingredientFromVisibleCard
          );

          if (ingredientsMatch) {
            //If the ingredient of the tag matches the ingredients from the card
            //we increment the counter and we break out of this loop
            counterForIntersectingTags++;
            return;
          }
        });
      });

      if (counterForIntersectingTags >= arrayOfIngredientsTag.length) {
        cardShouldBeHidden = false;
      } else {
        cardShouldBeHidden = true;
      }
    }

    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
      return;
    }

    //
    //A recipe card can have ONLY 1 device
    if (arrayOfDevicesTag?.length === 1) {
      //arrayOfDevicesTag && arrayOfDevicesTag.length === 1

      const deviceTag = arrayOfDevicesTag[0];
      let deviceTagMatchesCard = compareStrings(deviceTag, deviceOfCard);
      if (deviceTagMatchesCard) {
        cardShouldBeHidden = false;
      } else {
        cardShouldBeHidden = true;
      }
    } else if (arrayOfDevicesTag?.length > 1) {
      cardShouldBeHidden = true;
    } else {
      cardShouldBeHidden = false;
    }
    //Check if the card has an intersection of the devices tags
    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
      return;
    }
    counterForIntersectingTags = 0;

    //
    if (arrayOfUtensilsTag.length) {
      arrayOfUtensilsTag.forEach((utensilTag) => {
        utensilsArrayOfCard.forEach((utensilOfCard) => {
          let utensilsMatch = compareStrings(utensilTag, utensilOfCard);
          if (utensilsMatch) {
            counterForIntersectingTags++;
            return;
          }
        });
      });

      if (counterForIntersectingTags === arrayOfUtensilsTag.length) {
        cardShouldBeHidden = false;
      } else {
        cardShouldBeHidden = true;
      }
    }
    //Check if the card has an intersection of the utensils tags
    if (cardShouldBeHidden) {
      cards[indexOfCard].classList.add("hide");
    }
    //
  });
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
