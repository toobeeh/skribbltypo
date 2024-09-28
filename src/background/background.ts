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

  else if(request.type === "get setting"){
    (async () => {
      const data = await chrome.storage.sync.get(request.key as string);
      const item = data[request.key] ?? null;
      sendResponse(item);
    })();
    return true;
  }

  else if(request.type === "set setting"){
    chrome.storage.sync.set({ [request.key]: request.value });
  }
});