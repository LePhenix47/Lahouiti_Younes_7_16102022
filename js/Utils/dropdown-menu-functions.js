let dropdownIsOpened = false;

//Function to open the dropdown menu whenever we click on each button
function openMenuOptions(event) {
  if (dropdownIsOpened) {
    closeMenuOptions(event);
    dropdownIsOpened = false;
    event.currentTarget.setAttribute("type", "button");
  } else {
    event.currentTarget.setAttribute("type", "text");
    let userHasNotInputted =
      event.currentTarget.value === event.currentTarget.getAttribute("name");

    if (userHasNotInputted) {
      event.currentTarget.value = "";
    }
    const inputContainer = event.currentTarget.closest(".dropdown-menu");
    inputContainer.classList.add("input-container-active");

    const label = inputContainer.querySelector(".dropdown-menu__sort-label");
    label.classList.add("label-active");

    const dropdownMenuList = inputContainer.querySelector(
      ".dropdown-menu__options"
    );

    dropdownMenuList.classList.remove("hide");
    dropdownMenuList.classList.remove("dropdown-options-inactive");
    dropdownMenuList.classList.add("dropdown-options-active");

    filterDropdownMenusListItems("hidden-by-query");

    dropdownIsOpened = true;
  }
}

//Function that adds the items for each individual dropdown menu
function addListItemsForDropdown(container, dropdownMenuList) {
  const valueOfSearchTypeOnContainer = container.dataset.searchType;

  switch (valueOfSearchTypeOnContainer) {
    case "ingredients": {
      console.log("%cSearch type = ingredients", "background: #3282F7");
      addItemsInHTML(dropdownMenuList, arrayOfIngredients, "ingredients");
      break;
    }
    case "devices": {
      console.log("%cSearch type = devices", "background: #68D9A4");
      addItemsInHTML(
        dropdownMenuList,
        arrayOfDevices,
        valueOfSearchTypeOnContainer
      );
      break;
    }
    case "utensils": {
      console.log("%cSearch type = utensils", "background: #ED6454");
      addItemsInHTML(
        dropdownMenuList,
        arrayOfUtensils,
        valueOfSearchTypeOnContainer
      );
      break;
    }
    default: {
      throw "Error, couldn't find either of the three search types";
    }
  }

  const listItemsHTMLCollection = dropdownMenuList.children; //⚠ HTML Collection
  const listItemsArray = Array.from(listItemsHTMLCollection);
  listItemsArray.forEach((item) => {
    item.addEventListener("click", createTemplateTag);
  });
}

//Function that adds the list items in HTML
function addItemsInHTML(
  dropdownMenuList,
  arrayOfListItems,
  searchTypeOfContainer
) {
  dropdownMenuList.innerHTML = new DropdownItemTemplate(
    arrayOfListItems,
    searchTypeOfContainer
  ).createListItems();
}

//Functions that closes the dropdown menu
function closeMenuOptions(event) {
  const container = event.currentTarget.closest(".dropdown-menu");

  const label = container.querySelector(".dropdown-menu__sort-label");
  label.classList.remove("label-active");

  const dropdownMenuList = container.querySelector(".dropdown-menu__options");
  dropdownMenuList.classList.remove("dropdown-options-active");
  dropdownMenuList.classList.add("dropdown-options-inactive");
  dropdownMenuList.classList.add("hide");

  container.classList.remove("input-container-active");
  event.currentTarget.value = event.currentTarget.getAttribute("name");
}

//Function that returns an array containing all the dropdown menus
function getAllDropdownMenus() {
  const dropdownMenusNodeList = document.querySelectorAll(".dropdown-menu"); //⚠ Node list
  const dropdownMenusArray = Array.from(dropdownMenusNodeList);
  return dropdownMenusArray;
}

function updateDropdownMenus() {
  const dropdownMenus = getAllDropdownMenus();
  const visibleCardsArray = getAllVisibleCards();

  //Will have the array of infos with the
  let visibleCardsRecipeDataArray = [];

  visibleCardsRecipeDataArray = arrayOfRecipes.filter(
    (recipe, indexOfRecipe) => {
      return (
        Number(visibleCardsArray[indexOfRecipe]?.dataset.id) ===
        indexOfRecipe + 1
      );
    }
  );

  arrayOfIngredientsVisible = getIngredientsFromVisibleCards();
  //
  arrayOfDevicesVisible = getDevicesFromVisibleCards();
  //
  arrayOfUtensilsVisible = getUtensilsFromVisibleCards();
  //

  console.log({
    arrayOfIngredientsVisible,
    arrayOfDevicesVisible,
    arrayOfUtensilsVisible,
  });

  dropdownMenus.forEach((dropdownMenu) => {
    const typeOfDropDown = dropdownMenu.dataset.searchType;

    switch (typeOfDropDown) {
      case "ingredients": {
        hideListItemsNotInVisibleCards(dropdownMenu, arrayOfIngredientsVisible);
        break;
      }

      case "devices": {
        hideListItemsNotInVisibleCards(dropdownMenu, arrayOfDevicesVisible);
        break;
      }

      case "utensils": {
        hideListItemsNotInVisibleCards(dropdownMenu, arrayOfUtensilsVisible);
        break;
      }

      default: {
        throw `Error: the type of dropdown '${typeOfDropDown}' does not correspond to any dropdown menu type`;
      }
    }
  });
}

//Function that resets the dropdown menu list items by their className
//Can filter list items hidden by the main search (with "hidden-by-main-search")
// or by the query that the user inputted inside the advaned options input (with "hidden-by-query")
function filterDropdownMenusListItems(className) {
  const dropdownMenus = getAllDropdownMenus();
  dropdownMenus.forEach((dropdownMenu) => {
    const unorderedList = dropdownMenu.querySelector(".dropdown-menu__options");
    const listItemsNodeList = unorderedList.querySelectorAll(
      ".dropdown-menu__options>*"
    ); //⚠ Node list

    const listItemsArray = Array.from(listItemsNodeList);

    listItemsArray.forEach((listItem, indexOfListItem, listItemsArray) => {
      listItemsArray[indexOfListItem].classList.remove(className);
    });
  });
}

//Function that hides all the list items not present on the infos of the visible cards
function hideListItemsNotInVisibleCards(dropdownMenu, arrayToBeComparedWith) {
  const unorderedList = dropdownMenu.querySelector(".dropdown-menu__options");
  const listItemsNodeList = unorderedList.querySelectorAll(
    ".dropdown-menu__option-item"
  ); //⚠ Node list

  let itemShouldBeShown = false;

  let stringMatch = false;

  listItemsNodeList.forEach((item) => {
    itemShouldBeShown = false;
    stringMatch = false;
    let itemInnerTextToLowerCase = transformText(
      item.innerText,
      "lowercase",
      true
    );

    arrayToBeComparedWith.forEach((cardInfoText) => {
      stringMatch = compareStrings(itemInnerTextToLowerCase, cardInfoText);
      if (stringMatch) {
        itemShouldBeShown = true;
        //break
        return;
      }
    });

    if (!itemShouldBeShown) {
      item.classList.add("hidden-by-main-search");
    }
  });
}

//Function that splits a string on a certain character and transforms it into an array
function splitStringToArray(string, characterToSplitTheString) {
  return string.split(characterToSplitTheString);
}

function replaceCharacterByAnother(
  string,
  characterToReplace,
  characterToBeReplacedBy
) {
  return string.replace(characterToReplace, characterToBeReplacedBy);
}

//Function that transforms an array of arrays into a singular array
function getValuesInArrayOfArrays(arrayOfArrays) {
  let newArray = [];

  arrayOfArrays.forEach((array) => {
    array.forEach((value) => {
      newArray.push(value);
    });
  });

  return newArray;
}

//
function getAllInfosFromVisibleCards() {
  const visibleCardsArray = getAllVisibleCards();
  let visibleCardsDataArray = [];

  visibleCardsArray.forEach((card) => {
    arrayOfRecipes.forEach((recipe) => {
      if (Number(card.dataset.id) === recipe.id) {
        visibleCardsDataArray.push(recipe);
      }
    });
  });

  return visibleCardsDataArray;
}

//Function that gets all the
function getIngredientsFromVisibleCards() {
  const visibleCardsDataArray = getAllInfosFromVisibleCards();

  let ingredientsArray = visibleCardsDataArray.map((recipe) => {
    return recipe.ingredients;
  });

  ingredientsArray = getValuesInArrayOfArrays(ingredientsArray).map(
    (ingredients) => {
      return ingredients.ingredient;
    }
  );

  ingredientsArray = transformArrayText(ingredientsArray);

  return [...new Set(ingredientsArray)];
}

//Function that gets all the
function getDevicesFromVisibleCards() {
  const visibleCardsDataArray = getAllInfosFromVisibleCards();

  let devicesArray = [];

  visibleCardsDataArray.forEach((recipe) => {
    let appliance = transformText(recipe.appliance, "lowercase", true);
    devicesArray.push(appliance);
  });

  return [...new Set(devicesArray)];
}

//Function that gets all the
function getUtensilsFromVisibleCards() {
  const visibleCardsDataArray = getAllInfosFromVisibleCards();

  let utensilsArray = [];

  utensilsArray = visibleCardsDataArray.map((recipe) => {
    return recipe.ustensils;
  });

  utensilsArray = getValuesInArrayOfArrays(utensilsArray);

  utensilsArray = transformArrayText(utensilsArray);

  return [...new Set(utensilsArray)];
}
