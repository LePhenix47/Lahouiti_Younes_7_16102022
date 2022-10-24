let dropdownIsOpened = false;

//Callback function that opens the dropdown menu whenever we click on each button
function openMenuOptions(event) {
  if (dropdownIsOpened) {
    closeMenuOptions(event);
    dropdownIsOpened = false;
    //We transform the input into a button
    event.currentTarget.setAttribute("type", "button");
  } else {
    //We transform the button into an input
    event.currentTarget.setAttribute("type", "text");
    //After transforming the button into an input, we want to remove the
    //value of the button
    let userHasNotInputted =
      event.currentTarget.value === event.currentTarget.getAttribute("name");

    if (userHasNotInputted) {
      event.currentTarget.value = "";
    }
    //
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

    resetItemsInsideList(dropdownMenuList);

    //
    dropdownIsOpened = true;
  }
}

//Function that resets all the hidden items list excluding the main search
function resetItemsInsideList(container) {
  const listItemsNodeList = container.querySelectorAll(
    ".dropdown-menu__options>*"
  );

  const listItemsArray = Array.from(listItemsNodeList);

  let visibleListItemArray = filterHiddenListItems(listItemsArray);
  console.log({ visibleListItemArray });

  resetQueryItemLists(visibleListItemArray);
}

//
function initiateDropdownMenus() {
  const dropdownMenusNodeList = document.querySelectorAll(".dropdown-menu"); //⚠ Node list
  const dropdownMenusArray = Array.from(dropdownMenusNodeList);

  for (dropdownMenu of dropdownMenusArray) {
    const dropdownMenuList = dropdownMenu.querySelector(
      ".dropdown-menu__options"
    );

    addListitemsForDropdown(dropdownMenu, dropdownMenuList);
  }
}

//Adds the items for each individual dropdown menu
function addListitemsForDropdown(container, dropdownMenuList) {
  const valueOfSearchTypeOnContainer =
    container.getAttribute("data-search-type");
  switch (valueOfSearchTypeOnContainer) {
    case "ingredients": {
      console.log("%cSearch type = ingredients", "background: #3282F7");

      addListItemsInHTML(
        dropdownMenuList,
        arrayOfIngredients,
        valueOfSearchTypeOnContainer
      );

      break;
    }
    case "devices": {
      console.log("%cSearch type = devices", "background: #68D9A4");

      addListItemsInHTML(
        dropdownMenuList,
        arrayOfDevices,
        valueOfSearchTypeOnContainer
      );

      break;
    }
    case "utensils": {
      console.log("%cSearch type = utensils", "background: #ED6454");

      addListItemsInHTML(
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
}

function addListItemsInHTML(
  container,
  arrayOfListItems,
  searchTypeOfContainer
) {
  console.log({ container, arrayOfListItems, searchTypeOfContainer });
  container.innerHTML = new DropdownItemTemplate(
    arrayOfListItems,
    searchTypeOfContainer
  ).createListItems();

  const dropdownMenuListItemsNodeList = container.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠ Node list

  const dropdownMenuListItemsArray = Array.from(dropdownMenuListItemsNodeList);

  console.log({ dropdownMenuListItemsArray });
  for (listItem of dropdownMenuListItemsArray) {
    listItem.addEventListener("click", createTemplateTag);
  }
}

//Functions that closes the dropdown menu
function closeMenuOptions(event) {
  const buttonInputName = event.currentTarget.getAttribute("name");

  const container = event.currentTarget.closest(".dropdown-menu");

  const label = container.querySelector(".dropdown-menu__sort-label");
  label.classList.remove("label-active");

  const dropdownMenuList = container.querySelector(".dropdown-menu__options");
  dropdownMenuList.classList.remove("dropdown-options-active");
  dropdownMenuList.classList.add("dropdown-options-inactive");
  dropdownMenuList.classList.add("hide");

  container.classList.remove("input-container-active");
  event.currentTarget.value = buttonInputName;
}
