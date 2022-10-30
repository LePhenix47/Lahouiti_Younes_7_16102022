/*
      We're going to stock the different variables inside URL parameters

      https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState      
    */
function updateUrl(query, keywords) {
  window.history.replaceState(
    null,
    null,
    `?query=${query}&keywords=${keywords}`
  );
}

//Function that returns the URL of a parameter
function getUrlParameter(parameterName) {
  const urlParams = new URL(window.location.href);
  if (urlParams.searchParams.has(parameterName)) {
    return urlParams.searchParams.get(parameterName);
  }
  return `The parameter ${parameterName} has NOT been found`;
}

function getQueryAndKeywordParameters() {
  let queryInputted = getUrlParameter("query");
  queryInputted = transformText(queryInputted, "lowercase", true);

  let keywordsAddedWithTags = getUrlParameter("keywords");

  keywordsAddedWithTags = transformText(
    keywordsAddedWithTags,
    "lowercase",
    true
  );
  keywordsAddedWithTags = replaceCharacter(keywordsAddedWithTags, "_", " ");

  return { queryInputted, keywordsAddedWithTags };
}

/*
Functions to set values to the parameters in the URL
*/
//For the query=
function addQueryParametersToUrl(valueInputtedByUser) {
  queryParameters = replaceCharacter(valueInputtedByUser, " ", "+");
}

function addKeywordParametersToUrl() {
  const tagsAddedInSearchNodeList =
    document.querySelectorAll(".main-index__tag"); //⚠ Node list

  const tagsAddedInSearchArray = Array.from(tagsAddedInSearchNodeList);
  tagsTextArray = [];

  for (tagAdded of tagsAddedInSearchArray) {
    const tagText = tagAdded.querySelector(".main-index__tag-text");
    tagsTextArray.push(tagText.innerText);
  }

  keywordsParameters = "";

  keywordsParameters = keywordParametersHelper(
    tagsTextArray,
    keywordsParameters
  );
}

//For the keywords=
function keywordParametersHelper(arrayOfTags, keywords) {
  for (let i = 0; i < arrayOfTags.length; i++) {
    const tagText = arrayOfTags[i];
    if (i === arrayOfTags.length - 1) {
      //If it's the last item on the list → we don't add a '+' sign
      keywords += `${replaceCharacter(tagText, " ", "_")}`;
    } else {
      keywords += `${replaceCharacter(tagText, " ", "_")}+`;
    }
  }

  return keywords;
}
