import MessageSender = chrome.runtime.MessageSender;
// import MessageSender from "chrome";

import "core-js/stable";
import "regenerator-runtime/runtime";

import "./redux";
import { connectToStore } from "./redux";
import Storage from "./storage";

connectToStore(Storage);

// async function messageHandler(msg: any, sender: MessageSender): Promise<void> {
//   switch (msg.type) {
//     case "RECIEVE_OAUTH2_CODE":
//       const { code } = msg;
//   }
// }
//
// chrome.runtime.onMessage.addListener((msg, sender) => {
//   messageHandler(msg, sender);
//   return true;
// });
