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

//
function resetQueryItemLists(arrayOfItemLists) {
  for (item of arrayOfItemLists) {
    item.classList.remove("hidden-by-option-query");
  }
}

function resetMainSearchItemLists(arrayOfItemLists) {
  for (item of arrayOfItemLists) {
    item.classList.remove("hidden-by-main-search");
  }
}

/*
Callback function that removes the list items not corresponding to the search made by the user
*/

function createTag(event) {
  const valueOfInput = event.currentTarget.value;
  const container = event.currentTarget.parentElement;

  console.log({ container });

  const listItemsNodeList = container.querySelectorAll(
    ".dropdown-menu__options>*"
  );

  const listItemsArray = Array.from(listItemsNodeList);

  let visibleListItemArray = filterHiddenListItems(listItemsArray);
  console.log({ visibleListItemArray });

  // resetQueryItemLists(visibleListItemArray);

  const cardsArray = getAllVisibleCards();

  arrayOfItemsSearchedByUser = [];

  let valueInputtedToLowerCase = transformText(valueOfInput, "lowercase", true);
  /**/
  if (!cardsArray.length) {
    console.log("No cards are visible");
    return;
  }

  for (let i = 0; i < visibleListItemArray.length; i++) {
    const listItem = visibleListItemArray[i];

    let itemTextToLowerCase = transformText(
      listItem.innerText,
      "lowercase",
      true
    );

    /*
    Boolean value
    to know if the text inside the item
    DOESN'T correspond to the value inputted by the user
    */

    let itemIsNotResearchedByUser = !itemTextToLowerCase.includes(
      valueInputtedToLowerCase
    );

    if (itemIsNotResearchedByUser) {
      //We remove the item of the list inside the array of items searched by the user
      listItem.classList.add("hidden-by-option-query");
    } else {
      //We add the item of the list inside the array of items searched by the user
      listItem.classList.remove("hidden-by-option-query");

      listItem.addEventListener("click", createTemplateTag);
    }
  }
}

//
function filterHiddenListItems(arrayOfListItems) {
  let filteredArray = [];
  for (item of arrayOfListItems) {
    let listItemIsHidden = item.classList.value.includes(
      "hidden-by-main-search"
    );
    if (listItemIsHidden) {
      continue;
    }
    filteredArray.push(item);
  }

  return filteredArray;
}

//Function that updates all 3 dropdown menus list items whenever the main input changes
function updateDropdownMenus() {
  const remainingCards = getAllVisibleCards();
  const remainingCardsInfos = getAllCardInfos(remainingCards);

  console.log({ remainingCards, remainingCardsInfos });

  const dropdownMenusNodeList = document.querySelectorAll(".dropdown-menu"); //⚠ Node list

  const dropdownMenusArray = Array.from(dropdownMenusNodeList);

  for (dropdownMenu of dropdownMenusArray) {
    let typeOfDropdownMenu = dropdownMenu.getAttribute("data-search-type");

    switch (typeOfDropdownMenu) {
      case "ingredients": {
        console.log(
          "%cIngredients",
          "background: #3282F7; color: black; font-size:20px"
        );

        let arrayOfIngredients = getAllArrayOfIngredientsInVisibleCards();
        updateAvailableListItems(
          arrayOfIngredients,
          dropdownMenu,
          remainingCards
        );
        break;
      }

      case "devices": {
        console.log(
          "%cDevices",
          "background: #68D9A4; color: black; font-size:20px"
        );

        let arrayOfDevices = getAllDevicesInVisibleCards();

        updateAvailableListItems(arrayOfDevices, dropdownMenu, remainingCards);
        break;
      }

      case "utensils": {
        console.log(
          "%cUtensils",
          "background: #ED6454; color: black; font-size:20px"
        );

        let arrayOfUtensils = getAllUtensilsInVisibleCards();
        updateAvailableListItems(arrayOfUtensils, dropdownMenu, remainingCards);
        break;
      }

      default: {
        console.log(
          "%cError in the switch case at line: 149 of create-tag.js",
          "background: crimson; font-size:20px"
        );
        break;
      }
    }
  }
}

//Function that hides list items that are not present in the visible cards
function updateAvailableListItems(remainingInfosArray, dropdownMenu) {
  const unorderedList = dropdownMenu.querySelector(".dropdown-menu__options");

  const listItemsNodeList = unorderedList.querySelectorAll(
    ".dropdown-menu__options>*"
  );

  const listItemsArray = Array.from(listItemsNodeList);

  resetMainSearchItemLists(listItemsArray);

  console.log({ listItemsArray });
  console.groupCollapsed("List items array");

  let showListItem = false;

  for (listItem of listItemsArray) {
    let listItemTextToLowerCase = transformText(
      listItem.innerText,
      "lowercase",
      true
    );

    for (remainingInfo of remainingInfosArray) {
      //Because of the fact that we stored the utensils in an single string
      //We must compare it in an ambiguous way
      let listItemIsIncluded = unorderedList.classList.value.includes(
        "utensils"
      )
        ? remainingInfo.includes(listItemTextToLowerCase)
        : compareStrings(remainingInfo, listItemTextToLowerCase);

      if (listItemIsIncluded) {
        console.log(listItemTextToLowerCase);
        console.log(
          "%cshould be inside the list",
          "background: limegreen; color:black; font-size:16px"
        );
        showListItem = true;
        break;
      }
      showListItem = false;
    }

    if (showListItem) {
      console.log(listItemTextToLowerCase, " → removing hide class");
      listItem.classList.remove("hidden-by-main-search");
      listItem.addEventListener("click", createTemplateTag);
    } else {
      console.log(
        listItemTextToLowerCase,
        " → adding hidden-by-main-search class"
      );
      listItem.classList.add("hidden-by-main-search");
    }
  }
  console.groupEnd("List items array");
  console.log({ remainingInfosArray, dropdownMenu });
}

//Callback function that creates a tag
function createTemplateTag(event) {
  const tagText = event.currentTarget.innerText;

  for (selectedOption of selectedOptionsArray) {
    if (selectedOption === tagText) {
      return;
    }
  }

  const searchType = event.currentTarget
    .closest(".dropdown-menu")
    .getAttribute("data-search-type");
  const tagTypeContainer = tagsContainer.querySelector(
    `.main-index__tags-for-${searchType}`
  );

  selectedOptionsArray.push(tagText);

  IndexApp.createTagsForQuery(tagTypeContainer, tagText, searchType);
  addKeywordParametersToUrl();
  updateUrl(queryParameters, keywordsParameters);
  /* 
  Whenever we add a tag → Search the type of tag → get all the infos inside every card with
  */
  updateRecipeCardsUIWithTags();

  updateCounterOfVisibleCards();
  /* */
}

//Function to remove a tag from the DOM
function removeTag(event) {
  // console.log(event.currentTarget);
  const tagElement = event.currentTarget.parentElement;

  const containerOfTag = tagElement.parentElement;

  const textTag = tagElement.querySelector(".main-index__tag-text");

  for (let i = 0; i < selectedOptionsArray.length; i++) {
    const selectedOption = selectedOptionsArray[i];

    let tagToDeleteHasBeenFound = selectedOption === textTag.innerText;

    if (tagToDeleteHasBeenFound) {
      selectedOptionsArray.splice(i, 1);
      containerOfTag.removeChild(tagElement);
      addKeywordParametersToUrl();
      updateUrl(queryParameters, keywordsParameters);
    }
  }
  //Resets the cards to 0
  resetCards();

  //To update the cards with the value inputted by the user
  updateRecipeCardsUIWithMainSearch();

  //Re-updates them with the remaining tags
  updateRecipeCardsUIWithTags();

  //To update the amount of visible cards
  updateCounterOfVisibleCards();

  //Re-updates the dropdown menu option lists
  updateDropdownMenus();
}
/* */

function getAllTagsAdded() {
  const tagsNodeList = document.querySelectorAll(".main-index__tags-for>*"); //⚠ Node list
  const tagsArray = Array.from(tagsNodeList);
  if (tagsArray.length) {
    console.log(
      tagsArray.length,
      `${tagsArray.length > 1 ? "tags" : "tag"} found!`
    );
    console.log(tagsArray);
  } else {
    console.log(tagsArray, tagsArray.length);
    console.log("Tags not found");
  }
  return tagsArray;
}

function getSortedTagsByType() {
  const arrayOfTags = getAllTagsAdded();

  const tagsArrayOfIngredients = [];
  const tagsArrayOfDevices = [];
  const tagsArrayOfUtensils = [];

  if (!arrayOfTags.length) {
    console.log(
      "%cArray is empty",
      "background: crimson; font-size: 20px; padding: 5px"
    );
    return;
  }
  for (tag of arrayOfTags) {
    const textOfTag = transformText(tag.innerText, "lowercase", true);

    switch (tag.getAttribute("data-tag-type")) {
      case "ingredients": {
        tagsArrayOfIngredients.push(textOfTag);
        break;
      }
      case "devices": {
        tagsArrayOfDevices.push(textOfTag);
        break;
      }
      case "utensils": {
        tagsArrayOfUtensils.push(textOfTag);
        break;
      }
    }
  }

  console.log("Result:", [
    tagsArrayOfIngredients,
    tagsArrayOfDevices,
    tagsArrayOfUtensils,
  ]);

  return [tagsArrayOfIngredients, tagsArrayOfDevices, tagsArrayOfUtensils];
}

function updateRecipeCardsUIWithTags() {
  const arrayOfSortedTags = getSortedTagsByType();

  const cardsArray = getAllVisibleCards();
  let cardDataInfos = getAllCardInfos(cardsArray);

  console.log({ arrayOfSortedTags });
  let noTagsWereAdded = !arrayOfSortedTags;

  if (noTagsWereAdded) {
    console.log(
      "%cNo tags were added",
      "background: crimson; font-size: 20px; padding: 5px"
    );
    return;
  }
  const tagArrayOfIngredients = arrayOfSortedTags[0];
  const tagArrayOfDevices = arrayOfSortedTags[1];
  const tagArrayOfUtensils = arrayOfSortedTags[2];

  console.log({ arrayOfSortedTags });

  let containsIngredientTags = checkIfArrayHasLength(tagArrayOfIngredients);

  let containsDeviceTags = checkIfArrayHasLength(tagArrayOfDevices);

  let containsUtensilsTags = checkIfArrayHasLength(tagArrayOfUtensils);

  console.log(cardDataInfos);

  console.log({
    containsIngredientTags,
    containsDeviceTags,
    containsUtensilsTags,
  });

  //Will be used to verify if the tags that matched with the card infos is an intersection and not an union
  /*Part 1 */
  //We iterate through each VISIBLE card
  for (let i = 0; i < cardsArray.length; i++) {
    const card = cardsArray[i];

    let counterForIntersectionOfTags = 0;
    let cardShouldBeHidden = false;
    //If the user added a tag for the ingredients
    if (containsIngredientTags) {
      //We iterate through each tag for ingredients that was added
      for (tagIngredient of tagArrayOfIngredients) {
        //We iterate through each ingredient in the card itself
        for (ingredient of cardDataInfos[i].cardRecipeIngredientsArray) {
          //If the tag is included in the list of ingredients
          //We increment the counter and pass onto the next ingredient in array of tags for ingredients
          let textInTagMatchesIngredientName = compareStrings(
            tagIngredient,
            ingredient
          );

          if (textInTagMatchesIngredientName) {
            counterForIntersectionOfTags++;
            break;
          }
        }
      }
      //If the amount of matching tags is smaller than the length of the array of tags
      // Then there's no intersection and we hide the card
      console.log(
        "counterForIntersectionOfTags:",
        counterForIntersectionOfTags,
        "vs tagArrayOfIngredients.length:",
        tagArrayOfIngredients.length
      );

      if (counterForIntersectionOfTags >= tagArrayOfIngredients.length) {
        cardShouldBeHidden = false;
        console.log(card, "contains an intersection of ingredient tags");
      } else {
        cardShouldBeHidden = true;
        console.log(
          card,
          "DOES NOT contain an intersection of ingredient tags"
        );
      }
    }

    //To check if the ingredients of the card contain an intersection of the tags for the ingredients
    if (cardShouldBeHidden) {
      card.classList.add("hide");
      continue;
    }
    counterForIntersectionOfTags = 0;
    /*End of Part 1 */

    /*Part 2 */
    //A card can contain only ONE device
    if (containsDeviceTags && tagArrayOfDevices.length === 1) {
      let textInTagMatchesDeviceName = compareStrings(
        tagArrayOfDevices[0],
        cardDataInfos[i].cardRecipeDevices
      );
      console.log(
        `Is the device "${cardDataInfos[i].cardRecipeDevices}" included in the tag "${tagArrayOfDevices[0]}" ?`,
        textInTagMatchesDeviceName
      );
      if (textInTagMatchesDeviceName) {
        counterForIntersectionOfTags++;
      }

      if (counterForIntersectionOfTags === 1) {
        cardShouldBeHidden = false;
        console.log(card, "contains an intersection of device tags");
      } else {
        cardShouldBeHidden = true;
        console.log(card, "DOES NOT contain an intersection of device tags");
      }
    } else if (tagArrayOfDevices.length > 1) {
      console.log(
        "There are ",
        tagArrayOfDevices.length,
        " tags for devices but a card can only contain one device"
      );
      cardShouldBeHidden = true;
    }

    //To check if the devices of the card contain an intersection of the tags for the devices
    if (cardShouldBeHidden) {
      card.classList.add("hide");
      continue;
    }
    counterForIntersectionOfTags = 0;
    /*End of Part 2 */

    /*Part 3 */
    if (containsUtensilsTags) {
      for (tagUtensil of tagArrayOfUtensils) {
        let textInTagMatchesUtensilName =
          cardDataInfos[i].cardRecipeUtensils.includes(tagUtensil);
        console.log(
          `Do the utensils: "${cardDataInfos[i].cardRecipeUtensils}" include the tag "${tagUtensil}" ?`,
          textInTagMatchesUtensilName
        );
        if (textInTagMatchesUtensilName) {
          counterForIntersectionOfTags++;
          continue;
        }
      }

      if (counterForIntersectionOfTags >= tagArrayOfUtensils.length) {
        cardShouldBeHidden = false;
        console.log(card, "contains an intersection of utensils tags");
      } else {
        cardShouldBeHidden = true;
        console.log(card, "DOES NOT contain an intersection of utensils tags");
      }
    }

    //To check if the utensils of the card contain an intersection of the tags for the utensils
    if (cardShouldBeHidden) {
      card.classList.add("hide");
    }
    /*End of Part 3 */
  }
  console.log("updateRecipeCardsUIWithTags()");
  updateDropdownMenus();
  updateCounterOfVisibleCards();
}

function checkIfArrayHasLength(array) {
  if (array.length) {
    return true;
  }
  return false;
}
/*
  cardRecipeIngredientsArray

 , cardRecipeDevices

 , cardRecipeUtensils
*/
function getAllArrayOfIngredientsInVisibleCards() {
  let arrayOfArraysOfIngredients = [];

  const remainingCards = getAllVisibleCards();
  const remainingCardsInfos = getAllCardInfos(remainingCards);

  for (cardInfo of remainingCardsInfos) {
    arrayOfArraysOfIngredients = arrayOfArraysOfIngredients.concat(
      cardInfo.cardRecipeIngredientsArray
    );
  }

  arrayOfArraysOfIngredients = [...new Set(arrayOfArraysOfIngredients)];

  console.table(arrayOfArraysOfIngredients);

  return arrayOfArraysOfIngredients;
}

function getAllDevicesInVisibleCards() {
  let arrayOfDevices = [];

  const remainingCards = getAllVisibleCards();
  const remainingCardsInfos = getAllCardInfos(remainingCards);

  for (cardInfo of remainingCardsInfos) {
    arrayOfDevices.push(cardInfo.cardRecipeDevices);
  }

  arrayOfDevices = [...new Set(arrayOfDevices)];

  return arrayOfDevices;
}

function getAllUtensilsInVisibleCards() {
  let arrayOfUtensils = [];

  const remainingCards = getAllVisibleCards();
  const remainingCardsInfos = getAllCardInfos(remainingCards);

  for (cardInfo of remainingCardsInfos) {
    arrayOfUtensils.push(cardInfo.cardRecipeUtensils);
  }
  arrayOfUtensils = [...new Set(arrayOfUtensils)];

  console.log({ arrayOfUtensils });
  return arrayOfUtensils;
}
