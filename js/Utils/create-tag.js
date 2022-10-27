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

  console.log(cardsArray);
  //Loop
  cardsArray.forEach(function (card) {
    console.log(card);
    let cardIsHidden = card.classList.value.includes("hide");
    if (cardIsHidden) {
      return;
    }
    arrayOfVisibleCards.push(card);
  });

  console.log({ arrayOfVisibleCards });

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
  const dropdownMenuContainer = event.currentTarget.closest(".dropdown-menu");
  console.log({ dropdownMenuContainer });
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

  console.groupCollapsed("Array of items searched by the user");
  console.log(arrayOfItemsSearchedByUser);
  console.groupEnd("Array of items searched by the user");
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
  console.log("Text of tag:", tagText, "\nType of search =", searchType);

  IndexApp.createTagsForQuery(tagTypeContainer, tagText, searchType);
}

//Function to remove a tag
function removeTag(event) {
  console.log(event.currentTarget);
  const tagElement = event.currentTarget.parentElement;

  const containerOfTag = tagElement.parentElement;

  const textTag = tagElement.querySelector(".main-index__tag-text");

  console.log(textTag.textContent);

  for (let i = 0; i < selectedOptionsArray.length; i++) {
    const selectedOption = selectedOptionsArray[i];
    if (selectedOption === textTag.textContent) {
      console.log("Found", selectedOption, textTag);
      selectedOptionsArray.splice(i, 1);
      console.table(selectedOptionsArray);
      containerOfTag.removeChild(tagElement);
    }
  }
}
