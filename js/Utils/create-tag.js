/*
        Given the fact that we want to have a research without it being accent sensitive
        we'll normalize the text inside each item list

        Here's the article explaining the code below:

        https://ricardometring.com/javascript-replace-special-characters
        */
function normalizeString(string) {
  return string
    .normalize("NFD") // returns the unicode NORMALIZATION FORM of the string using a canonical DECOMPOSITION (NFD).
    .replace(/[\u0300-\u036f]/g, "");
}

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

function updateRecipeDataArrays() {}

//Function to
function createTag(event) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list
  const listItemsArray = Array.from(listItemsNodeList);

  arrayOfItemsSearchedByUser = [];

  const valueOfInput = event.currentTarget.value;

  for (let i = 0; i < listItemsArray.length; i++) {
    const listItem = listItemsArray[i];

    //Boolean value
    //to know if the text inside the item DOESN'T correspond to the value inputted by the user
    let itemIsNotResearchedByUser = !transformText(
      listItem.innerText,
      "lowercase",
      true
    ).includes(transformText(valueOfInput, "lowercase", true));

    if (itemIsNotResearchedByUser) {
      listItem.classList.add("hide");
      arrayOfItemsSearchedByUser?.splice(i, 1);
    } else {
      listItem.classList.remove("hide");
      arrayOfItemsSearchedByUser.push(listItem.innerText);

      listItem.addEventListener("click", createTemplateTag);
    }
  }

  // console.log("Value inputted: ", valueOfInput);
  // console.groupCollapsed("Array of items searched by the user");
  // console.log(arrayOfItemsSearchedByUser);
  // console.groupEnd("Array of items searched by the user");

  if (!arrayOfItemsSearchedByUser.length) {
    // console.log("No tag matched with the query:", valueOfInput);
    // console.table(arrayOfItemsSearchedByUser);
  }
}

function createTemplateTag(event) {
  // console.groupCollapsed("Array of selected options by user");
  // console.table(selectedOptionsArray);
  // console.groupEnd("Array of selected options by user");

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
  // console.log("Text of tag:", tagText, "\nType of search =", searchType);

  IndexApp.createTagsForQuery(tagTypeContainer, tagText, searchType);
  addKeywordParametersToUrl();
  updateUrl(queryParameters, keywordsParameters);
}

//Function to remove a tag
function removeTag(event) {
  // console.log(event.currentTarget);
  const tagElement = event.currentTarget.parentElement;

  const containerOfTag = tagElement.parentElement;

  const textTag = tagElement.querySelector(".main-index__tag-text");

  // console.log(textTag.innerText);

  for (let i = 0; i < selectedOptionsArray.length; i++) {
    const selectedOption = selectedOptionsArray[i];

    let tagToDeleteHasBeenFound = selectedOption === textTag.innerText;

    if (tagToDeleteHasBeenFound) {
      // console.log("Found", selectedOption, textTag);
      selectedOptionsArray.splice(i, 1);
      // console.table(selectedOptionsArray);
      containerOfTag.removeChild(tagElement);
      addKeywordParametersToUrl();
      // console.log(keywordsParameters.slice(i));
      updateUrl(queryParameters, keywordsParameters);
    }
  }
}
