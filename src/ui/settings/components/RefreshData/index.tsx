import React from "react";
import { connect } from "react-redux";
import State from "../../../../background/redux/types";
import { getGrades } from "../../../../background/redux/actions/canvas";
import moment from "moment";
import { Button } from "react-bootstrap";

function RefreshData(props) {
  const {
    gradesFetchedAt,
    loadingGrades,
    refetchGrades,
    accessTokenExists,
  } = props;

  if (!accessTokenExists) {
    return null;
  }

  return (
    <>
      <h2>Refresh Grades</h2>
      <p className="lead mb-2">Grades feeling a little stale?</p>
      <p className="text-secondary">
        The CanvasCBL Grades Extension automatically fetches grades as you use
        Canvas. <br />
        If you feel like the grades being displayed aren't recent enough, click
        below to refresh them.
      </p>
      <p className="text-info">
        {!loadingGrades &&
          (gradesFetchedAt > 0
            ? `Grades were last fetched
            ${moment(gradesFetchedAt).calendar({
              sameDay: "[today] [at] h:mm A",
              lastDay: "[yesterday] [at] h:mm A",
              lastWeek: "[last] dddd [at] h:mm A",
              sameElse: "DD/MM/YYYY",
            })}.`
            : "Grades haven't been fetched yet, but we'll automatically fetch them when you go to Canvas.")}
        {loadingGrades && "Grades are loading..."}
      </p>
      <Button
        variant="outline-secondary"
        onClick={() => refetchGrades()}
        disabled={!!loadingGrades}
      >
        Refresh my grades
      </Button>
    </>
  );
}

const ConnectedRefreshData = connect(
  (state: State) => ({
    gradesFetchedAt: state.canvas.fetchedAt,
    loadingGrades: state.canvas.loadingGrades,
    gradesFetchError: state.canvas.gradesFetchError,
    accessTokenExists: !!state.oauth2.token.access,
  }),
  (dispatch) => ({
    refetchGrades: () =>
      dispatch(
        getGrades(["detailed_grades", "user_profile", "courses", "observees"])
      ),
  })
)(RefreshData);

export default ConnectedRefreshData;
