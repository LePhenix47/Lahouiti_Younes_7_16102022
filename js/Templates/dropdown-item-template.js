class DropdownItemTemplate {
  constructor(dataArray, type) {
    this.dataArray = dataArray;
    this.type = type;
  }

  createListItems() {
    let template = "";
    for (let i = 0; i < this.dataArray.length; i++) {
      let text = this.dataArray[i];
      text = text.substring(0, 1).toUpperCase() + text.substring(1);
      template += `
                            <li class="dropdown-menu__option-item dropdown-menu__option-item--${this.type}">${text}</li>
`;
    }

    return template;
  }
}
