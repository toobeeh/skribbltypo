import { TypoProfileStore } from "@/util/typo/profiles/profile-store";
import { openDB } from "idb";


const db = openDB("skribbl_typo", 1, {
  upgrade: (database) => {
    database.createObjectStore("settings");
    database.createObjectStore("token");
    database.createObjectStore("current_profile");
    database.createObjectStore("profiles");
  },
});

const profileStore = new TypoProfileStore(db, "profiles", "current_profile", "settings", "token");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  /* if token requested, fetch and send back */
  if (request.type === "get token") {
    (async () => {
      const data = await (await db).get("token", "token");
      const token = data ?? null;
      sendResponse(token);
    })();
    return true;
  }

  /* if token provided, save for future use */
  else if (request.type === "set token") {
    (async () => {
      await (await db).put("token", request.token ?? null, "token");
    })();
  }

  else if(request.type === "get setting"){
    (async () => {
      const data = await (await db).get("settings", request.key);
      sendResponse(data);
    })();
    return true;
  }

  else if(request.type === "set setting"){
    (async () => {
      await (await db).put("settings", request.value, request.key);
    })();
  }

  /* if profile list requested, fetch and send back */
  if (request.type === "get profiles") {
    (async () => {
      const profiles = await profileStore.getProfiles();
      sendResponse(profiles);
    })();
    return true;
  }

  /* if profile deletion requested, delete */
  if (request.type === "delete profile") {
    (async () => {
      await profileStore.deleteProfile(request.profile);
      sendResponse(undefined);
    })();
    return true;
  }

  /* if current profile requested, send name back */
  if (request.type === "get profile") {
    (async () => {
      const key = await profileStore.getCurrentProfile();
      sendResponse(key);
    })();
    return true;
  }

  /* if switch profile requested, set */
  if (request.type === "switch profile") {
    (async () => {
      await profileStore.switchToProfile(request.profile);
      sendResponse(undefined);
    })();
    return true;
  }

  /* if create profile requested, create */
  if (request.type === "create profile") {
    (async () => {
      await profileStore.createAndActivateProfile(request.profile);
      sendResponse(undefined);
    })();
    return true;
  }

  /* if reset requested, clear all */
  if (request.type === "reset") {
    (async () => {
      await (await db).clear("settings");
      await (await db).clear("token");
      await (await db).clear("current_profile");
      await (await db).clear("profiles");
      sendResponse(undefined);
    })();
    return true;
  }
});