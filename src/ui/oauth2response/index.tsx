import React, { useEffect } from "react";
import { render } from "react-dom";
import { Store } from "webext-redux";
import { connect, Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Button, Spinner } from "react-bootstrap";
import { OAuth2State } from "../../background/redux/types/oauth2";
import { getOAuth2TokenFromCode } from "../../background/redux/actions/oauth2";

const store = new Store();

function OAuth2Response(props) {
  const { oauth2, dispatch }: { oauth2: OAuth2State; dispatch } = props;
  const { token, tokenFromCodeError } = oauth2;
  const { access } = token;

  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    if (code) {
      dispatch(getOAuth2TokenFromCode(code));
    }
  }, [code, dispatch]);

  const error: boolean = !code || !!tokenFromCodeError;
  const success = !!access;

  let errorRender: JSX.Element = (
    <p className="text-danger">
      Unknown error.{" "}
      <a href="https://go.canvascbl.com/help/contact">Contact us</a> or try
      again later.
    </p>
  );

  const tryAgain = (
    <>
      <p className="text-danger">Something's wrong and we can't connect.</p>
      <Button
        href={
          process.env.API_BASE_URL
            ? `${process.env.API_BASE_URL}request`
            : "https://tinyapi.canvascbl.com/grades-extension/request"
        }
        variant="primary"
      >
        Try again
      </Button>
    </>
  );

  if (code && tokenFromCodeError) {
    const errorText = tokenFromCodeError.data.error;

    switch (errorText) {
      case "invalid code":
        errorRender = tryAgain;
        break;
      default:
        errorRender = tryAgain;
    }
  }

  if (!code) {
    errorRender = tryAgain;
  }

  return (
    <div id="app">
      <div className="container">
        <h1 className="mt-5">
          {error && "Error "}Connect{success ? "ed" : "ing"} to CanvasCBL
          {!error && !success && "..."}
        </h1>
        <p className="text-muted">
          {error
            ? "There was an error connecting to CanvasCBL."
            : success
            ? "We're all set."
            : "Hold on a sec while we connect to your CanvasCBL account."}
        </p>
        <hr />
        {!error && !success && (
          <div className="text-center">
            <Spinner animation="border" />{" "}
          </div>
        )}
        {error && errorRender}
        {success && (
          <p className="text-success">
            We're all done here! Hop on over to Canvas to see your grades in
            supported classes.
          </p>
        )}
      </div>
    </div>
  );
}

const ConnectedOAuth2Response = connect((state) => ({
  oauth2: state.oauth2,
}))(OAuth2Response);

store.ready().then(() =>
  render(
    <Provider store={store}>
      <ConnectedOAuth2Response />
    </Provider>,
    document.getElementById("app")
  )
);
