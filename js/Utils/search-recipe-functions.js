function searchRecipes(event) {
  let queryOverTwoCharsLong = event.currentTarget.value.length >= 3;
  console.log(queryOverTwoCharsLong);

  if (queryOverTwoCharsLong) {
  } else {
    return;
  }
}
