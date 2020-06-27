import React from "react";
import { Provider, connect } from "react-redux";
import { Store } from "webext-redux";
import { render } from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ConnectToCanvasCBL from "./components/ConnectToCanvasCBL";
import RefreshData from "./components/RefreshData";

const store = new Store();

function Settings() {
  return (
    <div className="d-flex flex-column h-100">
      <div className="container">
        <h1 className="mt-5">CanvasCBL Grades Extension</h1>
        <p className="text-muted">
          Come back to this page at any time by clicking on the extension.
          <br />
          Have feedback? Awesome! Email it to{" "}
          <a href="mailto:sam@canvascbl.com?subject=CanvasCBL Grades Extension Feedback">
            sam@canvascbl.com
          </a>
          .
        </p>
        <hr />
        <ConnectToCanvasCBL />
        <RefreshData />
      </div>
    </div>
  );
}

// const ConnectedSettings = connect((state) => ({
//   oauth2: state.oauth2,
//   canvas: state.canvas,
// }))(Settings);

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Settings />
    </Provider>,
    document.getElementById("app")
  );
});
