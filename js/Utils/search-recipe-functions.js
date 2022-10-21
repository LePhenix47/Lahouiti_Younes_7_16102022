function searchRecipes(event) {
  event?.preventDefault();
  const valueOfInput = event.currentTarget.value;
  const queryIsOverTwoCharsLong = verifyCharacterLength(valueOfInput, 3);
  console.log(queryIsOverTwoCharsLong);

  const tagsAddedInSearchNodeList =
    document.querySelectorAll(".main-index__tag"); //⚠ Node list

  const tagsAddedInSearchArray = Array.from(tagsAddedInSearchNodeList);
  const tagsTextArray = [];

  for (tagAdded of tagsAddedInSearchArray) {
    const tagText = tagAdded.querySelector(".main-index__tag-text");
    console.log(tagText);
    tagsTextArray.push(tagText.innerText);
  }

  console.table(tagsTextArray);

  console.log(tagsAddedInSearchArray);

  queryParameters = replaceCharacter(valueOfInput, " ", "_");

  keywordsParameters = "";

  for (let i = 0; i < tagsTextArray.length; i++) {
    const tagText = tagsTextArray[i];
    if (i === tagsTextArray.length - 1) {
      //If it's the last item on the list → we don't add a '+' sign
      keywordsParameters += `${replaceCharacter(tagText, " ", "_")}`;
    } else {
      keywordsParameters += `${replaceCharacter(tagText, " ", "_")}+`;
    }
  }
  updateUrl(queryParameters, keywordsParameters);
  console.log({ keywordsParameters });

  if (queryIsOverTwoCharsLong) {
  } else {
    return;
  }
}

function verifyCharacterLength(string, number) {
  return string.length >= number;
}

function replaceCharacter(
  string,
  characterToBeRemoved,
  characterToBeReplacedBy
) {
  return string.split(characterToBeRemoved).join(characterToBeReplacedBy);
}
