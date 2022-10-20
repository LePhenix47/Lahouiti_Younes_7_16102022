//Function to

function updateRecipeDataArrays() {}
function createTag(event) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list
  const listItemsArray = Array.from(listItemsNodeList);

  const arrayOfItemsSearchedByUser = [];

  for (let i = 0; i < listItemsArray.length; i++) {
    /*
        Given the fact that we want to have a research without being accent sensitive


        Here's the article explaining the code below:

        https://ricardometring.com/javascript-replace-special-characters
        */
    const listItem = listItemsArray[i];
    let itemIsNotResearchedByUser = !listItem.innerText
      .toLowerCase()
      .normalize("NFD") // returns the unicode NORMALIZATION FORM of the string using a canonical DECOMPOSITION (NFD).
      .replace(/[\u0300-\u036f]/g, "")
      .includes(event.currentTarget.value.toLowerCase());

    if (itemIsNotResearchedByUser) {
      listItem.classList.add("hide");
      arrayOfItemsSearchedByUser?.splice(i, 1);
    } else {
      listItem.classList.remove("hide");
      arrayOfItemsSearchedByUser.push(listItem.innerText);

      listItem.addEventListener("click", createTemplateTag);
    }
  }

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
  console.log("Text of tag:", tagText, "\nType of search =", searchType);

  IndexApp.createTagsForQuery(tagTypeContainer, tagText, searchType);
  updateUrl(queryParameters, keywordsParameters);
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
