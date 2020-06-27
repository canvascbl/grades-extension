import { all } from "redux-saga/effects";

import oauth2 from "./oauth2";
import canvas from "./canvas";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function* rootSaga() {
  yield all([oauth2(), canvas()]);
}
