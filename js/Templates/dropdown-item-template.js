class DropdownItemTemplate {
  constructor(dataArray, type) {
    this.dataArray = dataArray;
    this.type = type;
  }

  createListItems() {
    let template = "";
    for (let i = 0; i < this.dataArray.length; i++) {
      let text = this.dataArray[i];
      text = transformText(text, "titlecase", false);
      template += `
          <li class="dropdown-menu__option-item dropdown-menu__option-item--${this.type}">${text}</li>
`;
    }

    return template;
  }
}
