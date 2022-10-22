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

/*
This function is used in 2 different parts:
1. Inside the createTag() callback function that updates a singular dropdown menu
2. Inside the updateAllDropdownMenus() function that updates all 3 dropdown menus
*/
//Function that removes the list items not corresponding to the search made by the user
function updateListItems(valueInputted, container) {
  let listItemsNodeList = undefined;
  if (container !== undefined) {
    listItemsNodeList = container.querySelectorAll(".dropdown-menu__options>*"); //⚠Node list
  } else {
    listItemsNodeList = document.querySelectorAll(".dropdown-menu__options>*"); //⚠Node list
  }
  const listItemsArray = Array.from(listItemsNodeList);

  arrayOfItemsSearchedByUser = [];

  for (let i = 0; i < listItemsArray.length; i++) {
    const listItem = listItemsArray[i];

    //Boolean value
    //to know if the text inside the item DOESN'T correspond to the value inputted by the user
    let itemIsNotResearchedByUser = !transformText(
      listItem.innerText,
      "lowercase",
      true
    ).includes(transformText(valueInputted, "lowercase", true));

    if (itemIsNotResearchedByUser) {
      //We remove the item of the list inside the array of items searched by the user
      listItem.classList.add("hide");
      arrayOfItemsSearchedByUser?.splice(i, 1);
    } else {
      //We add the item of the list inside the array of items searched by the user
      listItem.classList.remove("hide");
      arrayOfItemsSearchedByUser.push(listItem.innerText);

      listItem.addEventListener("click", createTemplateTag);
    }
  }
  if (!arrayOfItemsSearchedByUser.length) {
    console.log("No tag matched with the query:", valueInputted);
    // console.table(arrayOfItemsSearchedByUser);
  }
}

//Callback function
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

//Function to remove a tag
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
