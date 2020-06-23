import { combineReducers } from "redux";

import oauth2 from "./oauth2";
import canvas from "./canvas";

export default combineReducers({
  oauth2,
  canvas,
});
