import "core-js/stable";
import "regenerator-runtime/runtime";

import "./redux";
import { connectToStore } from "./redux";
import Storage from "./storage";
import RefreshListener from "./refreshListener";
import ErrorListener from "./errorListener";

connectToStore(Storage);
connectToStore(RefreshListener);
connectToStore(ErrorListener);

export const openSettings = (): void =>
  chrome.tabs.create({
    url: chrome.runtime.getURL("/ui/settings/index.html"),
  });

chrome.browserAction.onClicked.addListener(() => openSettings());

chrome.runtime.onInstalled.addListener(
  (details) => details.reason === "install" && openSettings()
);
