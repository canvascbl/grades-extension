import { Module, connect } from "newton-redux-reborn";
import { Store } from "webext-redux";
import moment from "moment";
import State from "../../background/redux/types";
import {
  CanvasState,
  DetailedGrades,
  UserProfile,
} from "../../background/redux/types/canvas";

const rightSide = document.querySelector("#right-side");

function generateGradeId() {
  return `${Math.random()}`;
}

interface CourseHomeInjectionProps {
  detailedGrades?: DetailedGrades;
  loadingGrades?: CanvasState["loadingGrades"];
  fetchedAt?: CanvasState["fetchedAt"];
  canvasUserProfile?: UserProfile;
  gradesFetchError?: CanvasState["gradesFetchError"];
}

class CourseHomeInjection extends Module {
  private props: CourseHomeInjectionProps = {};
  private courseId: number = parseInt(
    window.location.pathname.replace("/courses/", "")
  );

  constructor(props) {
    super(props);

    this.props = props;

    window.addEventListener("beforeunload", () => {
      // @ts-ignore
      this.unsubscribe();
    });

    this.displayGrade();
  }

  onChange = (changeMap) => {
    if (
      changeMap.detailedGrades.hasChanged ||
      changeMap.loadingGrades.hasChanged
    ) {
      this.displayGrade();
    }
  };

  displayGrade = () => {
    const {
      detailedGrades,
      loadingGrades,
      fetchedAt,
      canvasUserProfile,
      gradesFetchError,
    } = this.props;

    const domGrade = document.getElementById(`canvascbl-grade`);

    let grade: string;

    if (loadingGrades) {
      grade = "...";
    } else if (
      !detailedGrades ||
      !canvasUserProfile ||
      !detailedGrades[canvasUserProfile.id] ||
      !detailedGrades[canvasUserProfile.id][this.courseId]
    ) {
      // it's ok if there's no grade for this class
      grade = "Course not graded";
    } else if (gradesFetchError) {
      grade = `Err0: ${gradesFetchError}`;
    } else if (Object.keys(detailedGrades).length > 1) {
      grade = "Err2: This extension doesn't yet support observers.";
    } else {
      grade = this.props.detailedGrades[canvasUserProfile.id][this.courseId]
        .grade.grade;
    }

    const displayFetchedAt = fetchedAt
      ? `From ${moment(fetchedAt).calendar({
          sameDay: "h:mm A",
          lastDay: "[yesterday at] h:mm A",
          lastWeek: "[Last] dddd [at] h:mm A",
          sameElse: "DD/MM/YYYY [at] h:mm A",
        })}`
      : "";

    if (domGrade) {
      domGrade.innerText = grade;
      document.getElementById(
        "canvascbl-grade-fetchedat"
      ).innerText = displayFetchedAt;
    } else {
      const gradeContainer = document.createElement("div");

      const gradeTitleContainer = document.createElement("div");
      gradeTitleContainer.className = "h2 shared-space";

      const gradeTitle = document.createElement("h2");
      gradeTitle.innerText = "Grade";

      gradeTitleContainer.appendChild(gradeTitle);
      gradeContainer.appendChild(gradeTitleContainer);

      const breakdownLink = document.createElement("a");
      breakdownLink.href = `https://app.canvascbl.com/#/dashboard/grades/${this.courseId}`;
      breakdownLink.target = "_blank";
      breakdownLink.className = "canvascbl-class-grade-breakdown-link";
      breakdownLink.innerText = "See Breakdown";

      const gradeAttributionContainer = document.createElement("a");
      gradeAttributionContainer.href = "https://canvascbl.com/";
      gradeAttributionContainer.target = "_blank";

      const gradeAttribution = document.createElement("div");
      gradeAttribution.className = "canvascbl-class-grade-attribution";
      gradeAttributionContainer.appendChild(gradeAttribution);

      const gradeDisplay = document.createElement("span");
      gradeDisplay.className = "canvascbl-class-grade";
      gradeDisplay.innerText = grade;
      gradeDisplay.id = "canvascbl-grade";

      gradeContainer.appendChild(gradeDisplay);

      const fetchedAtDisplay = document.createElement("div");
      fetchedAtDisplay.className = "canvascbl-grade-fetchedat";
      fetchedAtDisplay.id = "canvascbl-grade-fetchedat";
      fetchedAtDisplay.innerText = displayFetchedAt;
      gradeContainer.appendChild(fetchedAtDisplay);

      gradeContainer.appendChild(breakdownLink);
      gradeContainer.appendChild(gradeAttributionContainer);

      rightSide.appendChild(gradeContainer);
    }
  };
}

function mapStateToProps(state: State) {
  return {
    detailedGrades: state.canvas.detailedGrades,
    loadingGrades: state.canvas.loadingGrades,
    fetchedAt: state.canvas.fetchedAt,
    canvasUserProfile: state.canvas.userProfile,
    gradesFetchError: state.canvas.gradesFetchError,
  };
}

const ConnectedCourseHomeInjection = connect(mapStateToProps)(
  CourseHomeInjection
);

const store = new Store();

store.ready().then(() => {
  new ConnectedCourseHomeInjection(store);
});
