document.addEventListener("DOMContentLoaded", function () {
  const disableButton = document.getElementById("disableButton");
  const enableButton = document.getElementById("enableButton");

  disableButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: disableExtension,
      });
    });
  });
  enableButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "enableExtension" });
    });
  });
});

function disableExtension() {
  console.log("Wtyczka wyłączona");
  enableExtension = false;
}
