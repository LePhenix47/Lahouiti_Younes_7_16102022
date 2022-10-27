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
    addListitemsForDropdown(inputContainer, dropdownMenuList);
    dropdownIsOpened = true;
  }
}

//Adds the items for each individual dropdown menu
function addListitemsForDropdown(container, dropdownMenuList) {
  const valueOfSearchTypeOnContainer =
    container.getAttribute("data-search-type");
  switch (valueOfSearchTypeOnContainer) {
    case "ingredients": {
      console.log("%cSearch type = ingredients", "background: #3282F7");
      dropdownMenuList.innerHTML = new DropdownItemTemplate(
        arrayOfIngredients,
        valueOfSearchTypeOnContainer
      ).createListItems();
      break;
    }
    case "devices": {
      console.log("%cSearch type = devices", "background: #68D9A4");
      dropdownMenuList.innerHTML = new DropdownItemTemplate(
        arrayOfDevices,
        valueOfSearchTypeOnContainer
      ).createListItems();
      break;
    }
    case "utensils": {
      console.log("%cSearch type = utensils", "background: #ED6454");
      dropdownMenuList.innerHTML = new DropdownItemTemplate(
        arrayOfUtensils,
        valueOfSearchTypeOnContainer
      ).createListItems();
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

function getAllDropdownMenus() {
  const dropdownMenusNodeList = document.querySelectorAll(".dropdown-menu"); //⚠ Node list
  const dropdownMenusArray = Array.from(dropdownMenusNodeList);
  return dropdownMenusArray;
}

function updateDropdownMenus() {
  const dropdownMenus = getAllDropdownMenus();
  const visibleCardsArray = getAllVisibleCards();

  dropdownMenus.forEach((dropdownMenu, index) => {
    const typeOfDropDown = dropdownMenu.dataset.searchType;
    console.log({ typeOfDropDown });

    //Will have the array of infos with the
    const visibleCardsDataArray = arrayOfRecipes.filter((recipe, index) => {
      return Number(visibleCardsArray[index]?.dataset.id) === index + 1;
    });

    console.log("visibleCardsDataArray", visibleCardsDataArray);

    const { ingredients, devices, utensils } = arrayOfRecipes;

    console.log({ ingredients, devices, utensils });

    switch (typeOfDropDown) {
      case "ingredients": {
        break;
      }

      case "devices": {
        break;
      }

      case "utensils": {
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

  const listItemsArray = Array.from(listItemsNodeList);
}
