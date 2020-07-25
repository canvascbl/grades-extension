import { Module, connect } from "newton-redux-reborn";
import State, { APIError } from "./redux/types";
import { displayFetchDataErrorNotification } from "./notifications";

interface ErrorListenerStateProps {
  gradesFetchError?: APIError;
}

type ErrorListenerProps = ErrorListenerStateProps;

class ErrorListener extends Module {
  private props: ErrorListenerProps;

  constructor(props) {
    super(props);
  }

  onChange = (changeMap) => {
    if (changeMap.gradesFetchError.hasChanged) {
      if (this.props.gradesFetchError) {
        displayFetchDataErrorNotification();
      }
    }
  };
}

function mapStateToProps(state: State): ErrorListenerProps {
  return {
    gradesFetchError: state.canvas.gradesFetchError,
  };
}

export default connect(mapStateToProps)(ErrorListener);
