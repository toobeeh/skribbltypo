import Popup from "./Popup.svelte";

const popup = new Popup({
  target: document.body,
  props: {
    mode: "external"
  },
});

/* check if skribbl currently active */
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if(tabs.length > 0 && tabs[0].url !== undefined) {
    const url = URL.parse(tabs[0].url);
    if(url?.hostname === "skribbl.io") {
      popup.$set({ mode: "skribbl" });
    }
  }
});