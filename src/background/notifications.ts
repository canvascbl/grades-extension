import { openSettings } from "./index";

const canvasCblLogoUrl = chrome.runtime.getURL("img/logo-256px.png");

const getId = (id: string) => `${id}-${Date.now()}`;

const notLinkedNotificationId = "notLinked";
const fetchDataErrorNotfication = "fetchDataError";

export function displayNotLinkedNotification(): void {
  chrome.notifications.create(getId(notLinkedNotificationId), {
    type: "basic",
    iconUrl: canvasCblLogoUrl,
    title: "Grades Extension not linked to CanvasCBL",
    message: "The CanvasCBL grades extension can't show your grades!",
    buttons: [
      {
        title: "Link to CanvasCBL",
      },
    ],
  });
}

export function displayFetchDataErrorNotification(): void {
  chrome.notifications.create(getId(fetchDataErrorNotfication), {
    type: "basic",
    iconUrl: canvasCblLogoUrl,
    title: "Error fetching grades",
    message: "Click to learn more and resolve",
    buttons: [
      {
        title: "Learn more",
      },
    ],
  });
}

function listener(notificationId: string): void {
  const dashLoc = notificationId.indexOf("-");
  const id = dashLoc < 0 ? notificationId : notificationId.slice(0, dashLoc);

  switch (id) {
    case notLinkedNotificationId:
      openSettings();
      break;
    case fetchDataErrorNotfication:
      openSettings();
      break;
  }
}

chrome.notifications.onClicked.addListener(listener);
chrome.notifications.onButtonClicked.addListener(listener);
