import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import State, { APIError } from "../../../../background/redux/types";
import {
  CanvasCBLUserProfile,
  UserProfile,
} from "../../../../background/redux/types/canvas";
import { getCanvasCBLUserProfile } from "../../../../background/redux/actions/canvas";

interface ConnectToCanvasCBLStateProps {
  accessTokenExists: boolean;
  canvasUserProfile: UserProfile;
  canvascblUserProfile: CanvasCBLUserProfile;
  canvascblUserProfileFetchError?: APIError;
}

interface ConnectToCanvasCBLDispatchProps {
  getCanvascblUserProfile: () => void;
}

type ConnectToCanvasCBLProps = ConnectToCanvasCBLStateProps &
  ConnectToCanvasCBLDispatchProps;

function ConnectToCanvasCBL(props: ConnectToCanvasCBLProps): JSX.Element {
  const {
    accessTokenExists,
    canvasUserProfile,
    canvascblUserProfile,
    getCanvascblUserProfile,
    canvascblUserProfileFetchError,
  } = props;

  useEffect(() => {
    // make sure we can get but dont have a name
    if (accessTokenExists && !canvasUserProfile && !canvascblUserProfile) {
      // fetch canvascbl profile
      getCanvascblUserProfile();
    }
  }, [
    accessTokenExists,
    canvasUserProfile,
    canvascblUserProfile,
    getCanvascblUserProfile,
  ]);

  const userProfile: CanvasCBLUserProfile | UserProfile | undefined =
    canvascblUserProfile || canvasUserProfile;

  const name: string = userProfile ? userProfile.name : "loading...";
  const email: string = userProfile
    ? "email" in userProfile
      ? userProfile.email
      : "primary_email" in userProfile
      ? userProfile.primary_email
      : "error"
    : "loading...";

  return (
    <>
      <h2>Connect{accessTokenExists && "(ed)"} to CanvasCBL</h2>
      <p className="lead mb-2">
        {accessTokenExists
          ? "You're already connected to CanvasCBL. Click the button below to re-connect."
          : "In order to pull grades from CanvasCBL, you'll need to connect the extension to your CanvasCBL account."}
      </p>
      {accessTokenExists && !canvascblUserProfileFetchError && (
        <p className="text-success mt-2">
          Connected as {name} ({email}).
        </p>
      )}
      <Button
        href={
          process.env.API_BASE_URL
            ? `${process.env.API_BASE_URL}request`
            : "https://tinyapi.canvascbl.com/grades-extension/request"
        }
        variant="outline-secondary"
        className="mb-3"
      >
        {accessTokenExists ? "Rec" : "C"}onnect to CanvasCBL
      </Button>

      {canvascblUserProfileFetchError && (
        <p className="text-danger mt-2">
          There was an error (
          <code className="text-danger">
            {canvascblUserProfileFetchError.data.error}
          </code>
          ) while contacting CanvasCBL. Try again later or, if it continues to
          not work, reconnect to CanvasCBL.
        </p>
      )}
    </>
  );
}

const ConnectedConnectToCanvasCBL = connect(
  (state: State): ConnectToCanvasCBLStateProps => ({
    accessTokenExists: !!state.oauth2.token.access,
    canvasUserProfile: state.canvas.userProfile,
    canvascblUserProfile: state.canvas.canvascblUserProfile,
    canvascblUserProfileFetchError: state.canvas.canvascblUserProfileFetchError,
  }),
  (dispatch): ConnectToCanvasCBLDispatchProps => ({
    getCanvascblUserProfile: () => dispatch(getCanvasCBLUserProfile()),
  })
)(ConnectToCanvasCBL);

export default ConnectedConnectToCanvasCBL;
