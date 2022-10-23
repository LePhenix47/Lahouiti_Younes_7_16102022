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
    return normalizeString(string);
  } else {
    return string;
  }
}

/*
This function is used in 2 different parts:
1. Inside the createTag() callback function that updates a singular dropdown menu
2. Inside the updateAllDropdownMenus() function that updates all 3 dropdown menus
*/
//Function that removes the list items not corresponding to the search made by the user

/*
⚠ ⚠ ⚠
NEEDS TO BE REFACTORED ↓
⚠ ⚠ ⚠
*/
function updateListItems(valueInputted, container) {
  let arrayOfIems = [];

  if (container) {
    updateListiItemsWithContainer(container, valueInputted);
  } else {
    updateListiItemsWithoutContainer(valueInputted);
  }

  // console.table(arrayOfNewDevices);
  // console.table(arrayOfNewUtensils);
}
/*
⚠ ⚠ ⚠
NEEDS TO BE REFACTORED ↑
⚠ ⚠ ⚠
*/

function resetItemLists(arrayOfItemLists) {
  for (item of arrayOfItemLists) {
    item.classList.remove("hide");
  }
}

function updateListiItemsWithContainer(container, valueInputted) {
  const listItemsNodeList = container.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list

  const listItemsArray = Array.from(listItemsNodeList);

  console.log({ container });

  if (container.classList.value.includes("ingredients")) {
    console.log(
      "Container for ingredients?",
      container.classList.value.includes("ingredients")
    );
  } else if (container.classList.value.includes("devices")) {
    console.log(
      "Container for devices?",
      container.classList.value.includes("devices")
    );
  } else if (container.classList.value.includes("utensils")) {
    console.log(
      "Container for utensils?",
      container.classList.value.includes("utensils")
    );
  } else {
  }

  resetItemLists(listItemsArray);

  const cardsArray = getAllVisibleCards();
  let cardInfos = getAllCardInfos(cardsArray);

  console.log(cardsArray);

  arrayOfItemsSearchedByUser = [];

  /**/
  if (!cardsArray.length) {
    console.log("No cards are visible");
    return;
  }
  for (let i = 0; i < listItemsArray.length; i++) {
    const listItem = listItemsArray[i];

    if (i < cardInfos.length) {
      //To avoid any overflow while looping the array
      arrayOfNewIngredients = [
        ...new Set(
          arrayOfNewIngredients.concat(cardInfos[i]?.cardRecipeIngredientsArray)
        ),
      ];
      arrayOfNewDevices = [
        ...new Set(arrayOfNewDevices.concat(cardInfos[i]?.cardRecipeDevices)),
      ];

      arrayOfNewUtensils = [
        ...new Set(arrayOfNewUtensils.concat(cardInfos[i]?.cardRecipeUtensils)),
      ];
    }

    /*
    Boolean value
    to know if the text inside the item
    IS NOT present in the visible cards
    */
    let itemIsNotIncludedInVisibleCards = !checkIfRecipeArrayContainsQuery(
      arrayOfNewIngredients,
      transformText(listItem.innerText.trim(), "lowercase", true)
    );

    /*
    Boolean value
    to know if the text inside the item
    DOESN'T correspond to the value inputted by the user
    */

    let itemIsNotResearchedByUser = !transformText(
      listItem.innerText,
      "lowercase",
      true
    ).includes(transformText(valueInputted, "lowercase", true));

    switch (itemIsNotIncludedInVisibleCards) {
      case true: {
        listItem.classList.add("hide");
        break;
      }
      case false: {
        if (itemIsNotResearchedByUser) {
          //We remove the item of the list inside the array of items searched by the user
          listItem.classList.add("hide");
          listItem.removeEventListener("click", createTemplateTag);
        } else {
          //We add the item of the list inside the array of items searched by the user
          listItem.classList.remove("hide");
          listItem.addEventListener("click", createTemplateTag);
        }
        break;
      }
    }
  }

  console.table(arrayOfNewIngredients);
  console.log({ arrayOfIems });
}

function updateListiItemsWithoutContainer(valueInputted) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list

  const listItemsArray = Array.from(listItemsNodeList);

  resetItemLists(listItemsArray);

  const cardsArray = getAllVisibleCards();
  let cardInfos = getAllCardInfos(cardsArray);

  let arrayOfIems = [];

  console.log(cardsArray);

  arrayOfItemsSearchedByUser = [];

  let arrayOfNewIngredients = [];

  let arrayOfNewDevices = [];

  let arrayOfNewUtensils = [];
  /**/
  if (!cardsArray.length) {
    return;
  }
  for (let i = 0; i < listItemsArray.length; i++) {
    const listItem = listItemsArray[i];

    if (i < cardInfos.length) {
      //To avoid any overflow while looping the array
      arrayOfNewIngredients = [
        ...new Set(
          arrayOfNewIngredients.concat(cardInfos[i]?.cardRecipeIngredientsArray)
        ),
      ];
      arrayOfNewDevices = [
        ...new Set(arrayOfNewDevices.concat(cardInfos[i]?.cardRecipeDevices)),
      ];

      arrayOfNewUtensils = [
        ...new Set(arrayOfNewUtensils.concat(cardInfos[i]?.cardRecipeUtensils)),
      ];
    }

    /*
    Boolean value
    to know if the text inside the item
    IS NOT present in the visible cards
    */
    let itemIsNotIncludedInVisibleCards = !checkIfRecipeArrayContainsQuery(
      arrayOfNewIngredients,
      transformText(listItem.innerText.trim(), "lowercase", true)
    );

    /*
    Boolean value
    to know if the text inside the item
    DOESN'T correspond to the value inputted by the user
    */

    let itemIsNotResearchedByUser = !transformText(
      listItem.innerText,
      "lowercase",
      true
    ).includes(transformText(valueInputted, "lowercase", true));

    switch (itemIsNotIncludedInVisibleCards) {
      case true: {
        listItem.classList.add("hide");
        break;
      }
      case false: {
        if (itemIsNotResearchedByUser) {
          //We remove the item of the list inside the array of items searched by the user
          listItem.classList.add("hide");
          listItem.removeEventListener("click", createTemplateTag);
        } else {
          //We add the item of the list inside the array of items searched by the user
          listItem.classList.remove("hide");
          listItem.addEventListener("click", createTemplateTag);
        }
        break;
      }
    }
  }

  console.table(arrayOfNewIngredients);
  console.log({ arrayOfIems });
}
//Callback function called whenever the user inputs something
function createTag(event) {
  const valueOfInput = event.currentTarget.value;
  updateListItems(valueOfInput);
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
