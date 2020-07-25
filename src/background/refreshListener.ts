import { Module, connect } from "newton-redux-reborn";
import moment from "moment";
import { CanvasState } from "./redux/types/canvas";
import State from "./redux/types/index";
import { Dispatch } from "redux";
import { getGrades } from "./redux/actions/canvas";
import { displayNotLinkedNotification } from "./notifications";

interface RefreshListenerStateProps {
  gradesFetchedAt?: CanvasState["fetchedAt"];
  loadingGrades?: CanvasState["loadingGrades"];
  gradesErrorExists?: boolean;
  userIsSignedIn?: boolean;
}

interface RefreshListenerDispatchProps {
  fetchGrades?: () => void;
}

type RefreshListenerProps = RefreshListenerStateProps &
  RefreshListenerDispatchProps;

class RefreshListener extends Module {
  private props: RefreshListenerProps = {};

  constructor(props) {
    super(props);

    this.props = props;

    chrome.webRequest.onBeforeRequest.addListener(this.handleCanvasWebRequest, {
      urls: [
        // dashboard
        "*://dtechhs.instructure.com/",
        // course home page
        "*://dtechhs.instructure.com/courses/*",
      ],
      types: [
        "main_frame",
        // canvas can run in iframes
        "sub_frame",
      ],
    });
  }

  shouldRefreshGrades = (): boolean => {
    if (!this.props.gradesFetchedAt) {
      return true;
    }

    return (
      !this.props.loadingGrades &&
      moment(this.props.gradesFetchedAt).add(1, "hour").isBefore()
    );
  };

  handleCanvasWebRequest = (): void => {
    if (!this.props.userIsSignedIn) {
      displayNotLinkedNotification();
      return;
    }

    if (this.shouldRefreshGrades()) {
      this.props.fetchGrades();
    }
  };
}

function mapStateToProps(state: State): RefreshListenerStateProps {
  return {
    gradesFetchedAt: state.canvas.fetchedAt,
    loadingGrades: state.canvas.loadingGrades,
    gradesErrorExists: !!state.canvas.gradesFetchError,
    userIsSignedIn: !!state.oauth2.token.access,
  };
}

function mapDispatchToProps(dispatch: Dispatch): RefreshListenerDispatchProps {
  return {
    fetchGrades: () =>
      dispatch(
        getGrades(["user_profile", "courses", "detailed_grades", "observees"])
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RefreshListener);
