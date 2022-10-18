function createTag(event) {
  const listItemsNodeList = document.querySelectorAll(
    ".dropdown-menu__options>*"
  ); //⚠Node list
  const listItemsArray = Array.from(listItemsNodeList);

  for (listItem of listItemsArray) {
    listItem.addEventListener("click", createTemplateTag);

    console.log({ listItem });

    let itemIsNotResearchedByUser = !listItem.innerText
      .toLowerCase()
      .includes(event.currentTarget.value.toLowerCase());

    if (itemIsNotResearchedByUser) {
      listItem.classList.add("hide");
    } else {
      listItem.classList.remove("hide");
    }
  }
}

function createTemplateTag(event) {
  console.log("click! event = ", event);
}
