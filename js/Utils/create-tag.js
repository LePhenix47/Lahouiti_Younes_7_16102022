function createTag(event) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list
  const listItemsArray = Array.from(listItemsNodeList);

  const arrayOfItemsSearchedByUser = [];

  for (listItem of listItemsArray) {
    listItem.addEventListener("click", createTemplateTag);

    let itemIsNotResearchedByUser = !listItem.innerText
      .toLowerCase()
      .includes(event.currentTarget.value.toLowerCase());

    if (itemIsNotResearchedByUser) {
      listItem.classList.add("hide");
      arrayOfItemsSearchedByUser?.pop(listItem.innerText);
    } else {
      listItem.classList.remove("hide");
      arrayOfItemsSearchedByUser.push(listItem.innerText);
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
  }
}

function createTemplateTag(event) {
  console.log("click! event = ");

  const tagText = event.currentTarget.innerText;

  const searchType = event.currentTarget
    .closest(".dropdown-menu")
    .getAttribute("data-search-type");

  console.log("Text of tag:", tagText, "\nType of search =", searchType);

  IndexApp.createTagsForQuery(tagsContainer, tagText, searchType);
}
