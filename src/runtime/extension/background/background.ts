console.log("background is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  /* if token requested, fetch and send back */
  if (request.type === "get token") {
    (async () => {
      const data = await chrome.storage.local.get("token");
      const token = data["token"] ?? null;
      sendResponse(token);
    })();
    return true;
  }

  /* if token provided, save for future use */
  else if (request.type === "set token") {
    chrome.storage.local.set({ token: request.token });
  }

  else if(request.type === "get setting"){
    (async () => {
      const data = await chrome.storage.local.get(request.key as string);
      let item = data[request.key] ?? null;
      if(item === "_undefined_") item = undefined;
      sendResponse(item);
    })();
    return true;
  }

  else if(request.type === "set setting"){

    /* map undefined to string */
    if(request.value === undefined) request.value = "_undefined_";
    chrome.storage.local.set({ [request.key]: request.value });
  }
});