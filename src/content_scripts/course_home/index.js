console.log('Josh is in charge now!');
const rightSide = document.querySelector("#right-side");

let gradeAreaId = "";

function generateGradeId() {
  return `canvascbl-grade-${Math.random()}`;
}

function classDisplayGrade(grade) {
  const domGrade = gradeAreaId && document.getElementById(gradeAreaId);

  if (domGrade) {
    domGrade.innerText = grade;
  } else {
    const gradeContainer = document.createElement("div");
    // gradeContainer.classname = "canvascbl-class-grade-container";

    const gradeTitleContainer = document.createElement("div");
    gradeTitleContainer.className = "h2 shared-space";

    const gradeTitle = document.createElement("h2");
    gradeTitle.innerText = "Grade";

    gradeTitleContainer.appendChild(gradeTitle);
    gradeContainer.appendChild(gradeTitleContainer);

    const courseId = window.location.pathname.replace("/courses/", "");
    const breakdownLink = document.createElement("a");
    breakdownLink.href = `https://app.canvascbl.com/#/dashboard/grades/${courseId}`;
    breakdownLink.target = "_blank";
    breakdownLink.className = "canvascbl-class-grade-breakdown-link";
    breakdownLink.innerText = "See Breakdown";

    const gradeAttributionContainer = document.createElement("a");
    gradeAttributionContainer.href = "https://canvascbl.com/";
    gradeAttributionContainer.target = "_blank";

    const bgImgUrl = chrome.runtime.getURL("img/grades_from_canvascbl.png");
    const gradeAttribution = document.createElement("div");
    gradeAttribution.style.backgroundImage = `url(${bgImgUrl})`;
    gradeAttribution.className = "canvascbl-class-grade-attribution";
    gradeAttributionContainer.appendChild(gradeAttribution);

    const gradeDisplay = document.createElement("span");
    gradeDisplay.className = "canvascbl-class-grade";
    gradeDisplay.innerText = grade;

    const gradeId = generateGradeId();
    gradeDisplay.id = gradeId;
    gradeAreaId = gradeId;

    gradeContainer.appendChild(gradeDisplay);
    gradeContainer.appendChild(breakdownLink);
    gradeContainer.appendChild(gradeAttributionContainer);

    rightSide.appendChild(gradeContainer);
  }
}
classDisplayGrade("B+");
