import React, {Props} from 'react';
import {Button} from "react-bootstrap";

function ConnectToCanvasCBL(props) {
  return (
    <>
      <h2>Connect to CanvasCBL</h2>
      <p className="lead mb-2">
        In order to pull grades from CanvasCBL, you'll need to connect the
        extension to your CanvasCBL account.
      </p>
        <Button href={process.env.API_BASE_URL
          ? `${process.env.API_BASE_URL}request`
          : "https://tinyapi.canvascbl.com/grades-extension/request"} variant="outline-secondary">Connect to CanvasCBL</Button>
    </>
  )
}

export default ConnectToCanvasCBL
