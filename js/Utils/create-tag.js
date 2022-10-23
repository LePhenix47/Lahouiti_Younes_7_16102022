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

function updateListItemsByMainSearch() {}

function resetItemLists(arrayOfItemLists) {
  for (item of arrayOfItemLists) {
    item.classList.remove("hide");
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

  resetItemLists(listItemsArray);

  const cardsArray = getAllVisibleCards();
  let cardInfos = getAllCardInfos(cardsArray);

  console.log({ cardsArray, cardInfos });

  let arrayOfItemsToBeComparedBy = [];

  arrayOfItemsSearchedByUser = [];

  let valueInputtedToLowerCase = transformText(valueOfInput, "lowercase", true);
  /**/
  if (!cardsArray.length) {
    console.log("No cards are visible");
    return;
  }
  for (let i = 0; i < listItemsArray.length; i++) {
    const listItem = listItemsArray[i];

    let itemTextToLowerCase = transformText(
      listItem.innerText.trim(),
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
      listItem.classList.add("hide");
    } else {
      //We add the item of the list inside the array of items searched by the user
      listItem.classList.remove("hide");
      listItem.addEventListener("click", createTemplateTag);
    }
  }
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
