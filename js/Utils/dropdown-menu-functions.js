function openMenuOptions(event) {
  //   console.log("Focused on ", event.currentTarget);
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
  console.log({ dropdownMenuList });
  addListitemsForDropdown(inputContainer, dropdownMenuList);
}

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
}

function closeMenuOptions(event) {
  //   console.log("Changed input on ", event.currentTarget);
  //   const container = event.currentTarget.closest(".dropdown-menu");
  //   const label = container.querySelector(".dropdown-menu__sort-label");
  //   label.classList.remove("label-active");
  //   const dropdownMenuList = container.querySelector(".dropdown-menu__options");
  //   dropdownMenuList.classList.remove("dropdown-options-active");
  //   dropdownMenuList.classList.add("dropdown-options-inactive");
  //   dropdownMenuList.classList.add("hide");
  //   container.classList.remove("input-container-active");
  //   event.currentTarget.value = event.currentTarget.getAttribute("name");
}
