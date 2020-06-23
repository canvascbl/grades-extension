import React from "react";
import { Provider, connect } from "react-redux";
import { Store } from "webext-redux";
import { render } from "react-dom";
import { getOAuth2TokenFromCode } from "../../background/redux/actions/oauth2";
import { Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ConnectToCanvasCBL from "./components/ConnectToCanvasCBL";
import { getGrades } from "../../background/redux/actions/canvas";

const store = new Store();

function Settings(props) {
  const { oauth2, canvas, dispatch } = props;

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
      </div>
      <p>
        Current oauth2 state: <code>{JSON.stringify(oauth2)}</code>
      </p>
      <p>
        Current canvas state: <code>{JSON.stringify(canvas)}</code>
      </p>
      <Button onClick={() => alert("test")}>Test</Button>
      <button
        onClick={() =>
          dispatch(
            getGrades([
              "user_profile",
              "detailed_grades",
              "courses",
              "observees",
            ])
          )
        }
      >
        Go fetch grades
      </button>
    </div>
  );
}

const ConnectedSettings = connect((state) => ({
  oauth2: state.oauth2,
  canvas: state.canvas,
}))(Settings);

store.ready().then(() => {
  render(
    <Provider store={store}>
      <ConnectedSettings />
    </Provider>,
    document.getElementById("app")
  );
});
