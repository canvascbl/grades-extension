import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "remote-redux-devtools";
import { wrapStore } from "webext-redux";
import rootReducer from "./reducers";
import { getInitialState } from "../storage";
import rootSaga from "./sagas";

let store;
const waitingToConnect = [];

async function init() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  // default only on when process.env.NODE_ENV === "development"
  // host defaults to "localhost" when port is set
  // can't use their server and send tokens to it...
  const composeEnhancers = composeWithDevTools({
    name: "CanvasCBL Grades Extension",
    port: 9000,
  });

  const initialState = await getInitialState();

  const s = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(rootSaga);

  wrapStore(s);

  store = s;

  waitingToConnect.forEach((m) => {
    new m(store);
  });
}

init();

export function connectToStore(c: (props) => void): void {
  if (store) {
    new c(store);
  } else {
    waitingToConnect.push(c);
  }
}
