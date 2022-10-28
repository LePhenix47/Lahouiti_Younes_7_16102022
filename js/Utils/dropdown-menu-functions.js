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

    dropdownIsOpened = true;
  }
}

//Function that adds the items for each individual dropdown menu
function addListItemsForDropdown(container, dropdownMenuList) {
  const valueOfSearchTypeOnContainer = container.dataset.searchType;

  console.log({ container, dropdownMenuList });

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

  console.log({ dropdownMenuList });
  const listItemsHTMLCollection = dropdownMenuList.children; //⚠ HTML Collection
  const listItemsArray = Array.from(listItemsHTMLCollection);
  console.log({ listItemsArray });
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
  console.log("Changed input on ", event.currentTarget);
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

  console.log("visibleCardsDataArray");
  console.log(visibleCardsRecipeDataArray);

  //We retrieve the data of the visible cards
  let visibleCardsDataArray = [];

  visibleCardsArray.forEach((card) => {
    arrayOfRecipes.forEach((recipe) => {
      if (Number(card.dataset.id) === recipe.id) {
        visibleCardsDataArray.push(recipe);
      }
    });
  });

  console.log({ visibleCardsDataArray });
  //
  arrayOfIngredientsVisible = visibleCardsDataArray.map((recipe) => {
    return recipe.ingredients;
  });

  arrayOfIngredientsVisible = getValuesInArrayOfArrays(
    arrayOfIngredientsVisible
  ).map((ingredients) => {
    return ingredients.ingredient;
  });
  console.log({ arrayOfIngredientsVisible });

  arrayOfIngredientsVisible = transformArrayText(arrayOfIngredientsVisible);
  //
  //
  arrayOfDevicesVisible = visibleCardsDataArray.map((recipe) => {
    return recipe.appliance;
  });
  arrayOfDevicesVisible = transformArrayText(arrayOfDevicesVisible);
  //
  //
  arrayOfUtensilsVisible = visibleCardsDataArray.map((recipe) => {
    return recipe.ustensils;
  });
  arrayOfUtensilsVisible = getValuesInArrayOfArrays(arrayOfUtensilsVisible);
  arrayOfUtensilsVisible = transformArrayText(arrayOfUtensilsVisible);

  //

  console.log({
    arrayOfIngredientsVisible,
    arrayOfDevicesVisible,
    arrayOfUtensilsVisible,
  });

  dropdownMenus.forEach((dropdownMenu) => {
    const typeOfDropDown = dropdownMenu.dataset.searchType;
    console.log({ typeOfDropDown });

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

function hideListItemsNotInVisibleCards(dropdownMenu, arrayToBeComparedWith) {
  const unorderedList = dropdownMenu.querySelector(".dropdown-menu__options");
  const listItemsNodeList = unorderedList.querySelectorAll(
    ".dropdown-menu__option-item"
  ); //⚠ Node list

  let listItemsArray = Array.from(listItemsNodeList);

  console.log(listItemsNodeList, listItemsArray);

  let listItemsTextArray = transformArrayTextForListItems(listItemsArray);

  let itemShouldBeShown = false;

  console.groupCollapsed("Verifying item presence");
  listItemsNodeList.forEach((item, indexOfItem) => {
    arrayToBeComparedWith.forEach((cardInfo) => {});
  });
  console.groupEnd("Verifying item presence");
}

//Function that splits a string on a certain character and transforms it into an array
function splitStringToArray(string, characterToSplitTheString) {
  return string.split(characterToSplitTheString);
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
