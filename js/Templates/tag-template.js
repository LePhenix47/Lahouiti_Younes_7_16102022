class TagTemplate {
  constructor(tagText, tagType) {
    this.tagText = tagText;
    this.tagType = tagType;
  }

  createTag() {
    console.log(
      "TAG TEMPLATE \nText of tag:",
      this.tagText,
      "\nType of search =",
      this.tagType
    );
    let template = `
              <div class="main-index__tag main-index__tag--${this.tagType}-bg">
                  <p class="main-index__tag-text">${this.tagText}</p>
                  <button class="main-index__tag-close-button">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                          xmlns="http://www.w3.org/2000/svg" class="main-index__tag-close-button-icon-svg">
                          <path
                              d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                              fill="white" />
                      </svg>
                  </button>
              </div>
        `;

    return template;
  }
}
