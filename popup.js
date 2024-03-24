document.addEventListener("DOMContentLoaded", function () {
  const enableButton = document.getElementById("enableButton");
  const disableButton = document.getElementById("disableButton");

  enableButton.addEventListener("click", function () {
    console.log("czujniks");
    alert("Włącz wtyczkę");
    chrome.runtime.sendMessage({ command: "enable" });
  });

  disableButton.addEventListener("click", function () {
    alert("Wyłącz wtyczkę");
    chrome.runtime.sendMessage({ command: "disable" });
  });
});
