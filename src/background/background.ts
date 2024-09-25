console.log("background is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  /* if token requested, fetch and send back */
  if (request.type === "get token") {
    (async () => {
      const data = await chrome.storage.sync.get("token");
      const token = data["token"] ?? null;
      sendResponse(token);
    })();
    return true;
  }

  /* if token provided, save for future use */
  else if (request.type === "set token") {
    chrome.storage.sync.set({ token: request.token });
  }
});