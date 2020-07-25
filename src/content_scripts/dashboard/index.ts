import { connect, Module } from "newton-redux-reborn";
import { Store } from "webext-redux";
import moment from "moment";
import State from "../../background/redux/types";
import {
  CanvasState,
  DetailedGrades,
  UserProfile,
} from "../../background/redux/types/canvas";

function generateGradeId() {
  return `${Math.random()}`;
}

interface DashboardInjectionProps {
  detailedGrades?: DetailedGrades;
  loadingGrades?: CanvasState["loadingGrades"];
  fetchedAt?: CanvasState["fetchedAt"];
  canvasUserProfile?: UserProfile;
  gradesFetchError?: CanvasState["gradesFetchError"];
}

interface InjectionMap {
  grade?: string;
  injectionId?: string;
}

class DashboardInjection extends Module {
  private props: DashboardInjectionProps = {};
  private canvasCardsById: { [courseId: number]: Element } = {};
  private injections: { [courseId: number]: InjectionMap } = {};

  constructor(props: DashboardInjectionProps) {
    super(props);

    this.props = props;

    // unsubscribe when necessary
    window.addEventListener("beforeunload", () => {
      // @ts-ignore
      this.unsubscribe();
    });

    this.populateCanvasCardsById();
    this.injectRefImg();
    this.displayGrades();
  }

  onChange = (changeMap) => {
    if (
      changeMap.detailedGrades.hasChanged ||
      changeMap.loadingGrades.hasChanged
    ) {
      this.displayGrades();
    }
  };

  displayGrades = () => {
    if (this.props.detailedGrades && this.props.canvasUserProfile) {
      Object.keys(
        this.props.detailedGrades[this.props.canvasUserProfile.id]
      ).forEach((courseId) => this.displayGrade(parseInt(courseId)));
    }
  };

  populateCanvasCardsById = () => {
    const cards: NodeListOf<Element> = document.querySelectorAll(
      "div.ic-DashboardCard__header"
    );

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let cardCourseId = 0;
      const links = card.querySelectorAll("a");
      for (let j = 0; j < links.length; j++) {
        const href = links[j].href;
        const path = new URL(href).pathname;
        if (path.startsWith("/courses/")) {
          cardCourseId = parseInt(path.replace("/courses/", ""));
        }
      }

      this.canvasCardsById[cardCourseId] = card;
    }
  };

  displayGrade = (courseId: number, retry = 0) => {
    const injection: InjectionMap = this.injections[courseId] || {};
    const existingGrade: Element | null = injection.injectionId
      ? document.getElementById(`canvascbl-grade-${injection.injectionId}`)
      : null;
    const card: Element = this.canvasCardsById[courseId];

    const {
      detailedGrades,
      loadingGrades,
      fetchedAt,
      canvasUserProfile,
      gradesFetchError,
    } = this.props;

    // try 3 times
    if (!card && retry < 3) {
      setTimeout(
        () => this.displayGrade(courseId, retry + 1),
        // increase retry time by 50ms per retry
        250 + 250 * retry
      );
      return;
    } else if (!card) {
      // unsuccessful
      console.error(`Error displaying grade for course ${courseId}.`);
      return;
    }

    if (!detailedGrades && !canvasUserProfile && !fetchedAt && !loadingGrades) {
      // return because there's nothing to display
      return;
    }

    let grade: string;
    let errorMsg: string;

    if (
      !detailedGrades ||
      !canvasUserProfile ||
      !detailedGrades[canvasUserProfile.id] ||
      !detailedGrades[canvasUserProfile.id][courseId] ||
      gradesFetchError
    ) {
      grade = "Err0";
      errorMsg = gradesFetchError
        ? `Error fetching grades: ${gradesFetchError.data.error}`
        : "Unknown error getting grades.";
    } else if (loadingGrades) {
      grade = "...";
    } else if (Object.keys(detailedGrades).length > 1) {
      grade = "Err2";
      errorMsg = "This extension doesn't yet support observers.";
    } else {
      grade = this.props.detailedGrades[canvasUserProfile.id][courseId].grade
        .grade;
    }

    const displayFetchedAt = fetchedAt
      ? `From ${moment(fetchedAt).calendar({
          sameDay: "h:mm A",
          lastDay: "[yesterday at] h:mm A",
          lastWeek: "[Last] dddd [at] h:mm A",
          sameElse: "DD/MM/YYYY [at] h:mm A",
        })}`
      : "";

    if (injection.grade === grade) {
      return;
    }

    injection.grade = grade;

    const breakdownText = errorMsg
      ? "Try again later or contact support."
      : `Click for a breakdown.`;

    if (existingGrade) {
      (existingGrade as HTMLDivElement).innerText = grade;
      document.getElementById(
        `canvascbl-fetchedat-${injection.injectionId}`
      ).innerText = displayFetchedAt;
      const breakdown = document.getElementById(
        `canvascbl-breakdown-${injection.injectionId}`
      );
      if (breakdown.innerText !== breakdownText) {
        breakdown.innerText = breakdownText;
      }
    } else {
      const id = generateGradeId();

      injection.injectionId = id;

      const linkContainer = document.createElement("a");
      linkContainer.className = "not_external";
      linkContainer.href = `https://app.canvascbl.com/#/dashboard/grades/${courseId}`;
      linkContainer.target = "_blank";

      const gradeContainer = document.createElement("div");
      gradeContainer.className = "canvascbl-dashboard-grade-container";

      const expandedGradeContainer = document.createElement("div");
      expandedGradeContainer.className =
        "canvascbl-dashboard-expanded-grade-container";

      const gradeDisplayExp = document.createElement("span");
      gradeDisplayExp.id = `canvascbl-fetchedat-${id}`;
      // const grd = document.createElement("span");
      // grd.className = "canvascbl-dashboard-expanded-grade-container-grade";
      gradeDisplayExp.append(errorMsg ? errorMsg : displayFetchedAt);
      expandedGradeContainer.appendChild(gradeDisplayExp);

      const separator = document.createElement("hr");
      separator.className = "canvascbl-hr";
      expandedGradeContainer.appendChild(separator);

      const breakdown = document.createElement("span");
      breakdown.id = `canvascbl-breakdown-${id}`;
      breakdown.innerText = breakdownText;
      expandedGradeContainer.appendChild(breakdown);

      gradeContainer.appendChild(expandedGradeContainer);

      const gradeDisplay = document.createElement("span");
      gradeDisplay.className = "canvascbl-dashboard-grade";
      gradeDisplay.innerText = grade;
      gradeDisplay.id = `canvascbl-grade-${id}`;

      gradeContainer.appendChild(gradeDisplay);
      linkContainer.appendChild(gradeContainer);
      card.appendChild(linkContainer);
    }

    this.injections[courseId] = injection;
  };

  injectRefImg = () => {
    const refImg = document.createElement("a");
    refImg.className = "canvascbl-dashboard-ref not_external";
    refImg.href = "https://canvascbl.com";
    refImg.target = "_blank";

    const icFooterLogo = document.querySelector(".footer-logo");
    icFooterLogo.parentNode.insertBefore(refImg, icFooterLogo.nextSibling);
  };
}

function mapStateToProps(state: State): DashboardInjectionProps {
  return {
    detailedGrades: state.canvas.detailedGrades,
    loadingGrades: state.canvas.loadingGrades,
    fetchedAt: state.canvas.fetchedAt,
    canvasUserProfile: state.canvas.userProfile,
    gradesFetchError: state.canvas.gradesFetchError,
  };
}

const ConnectedDashboardInjection = connect(mapStateToProps)(
  DashboardInjection
);

const store = new Store();

store.ready().then(() => {
  new ConnectedDashboardInjection(store);
});
