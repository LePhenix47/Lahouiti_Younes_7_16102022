/*
        Given the fact that we want to have a research without it being accent sensitive
        we'll normalize the text inside each item list

        Here's the article explaining the code below:

        https://ricardometring.com/javascript-replace-special-characters

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

    let itemIsHiddenByMainSearch = listItem.classList.value.includes(
      "hidden-by-main-search"
    );
    console.log(
      "Is the item",
      itemTextToLowerCase,
      "hidden by the main search?",
      itemIsHiddenByMainSearch
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
      //The issue is here
      let listItemIsIncluded = remainingInfo.includes(listItemTextToLowerCase);
      // let listItemIsIncluded = listItemTextToLowerCase.includes(remainingInfo);
      //
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
}

/*
  cardRecipeIngredientsArray

  cardRecipeDevices

  cardRecipeUtensils
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
