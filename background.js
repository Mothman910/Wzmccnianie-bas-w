chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.command === "enable") {
    console.log("Włącz wtyczkę");
    // Tutaj podejmij działania związane z włączeniem wtyczki
  } else if (message.command === "disable") {
    console.log("Wyłącz wtyczkę");
    // Tutaj podejmij działania związane z wyłączeniem wtyczki
  }
});
