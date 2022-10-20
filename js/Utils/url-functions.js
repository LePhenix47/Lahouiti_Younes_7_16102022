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

function getUrlParameter(parameterName) {
  const urlParams = new URLSearchParams(window.location.href);
  if (urlParams.has(parameterName)) {
    return urlParams.get(parameterName);
  }
  return `The parameter ${parameterName} has NOT been found`;
}
