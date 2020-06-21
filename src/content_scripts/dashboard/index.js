// add some JS that will be injected into Canvas.

function generateGradeId() {
  return `canvascbl-grade-${Math.random()}`;
}

const cards = document.querySelectorAll("div.ic-DashboardCard__header");

const courseCards = {};
const courseGradeIds = {};

for (let i = 0; i < cards.length; i++) {
  const card = cards[i];
  let cardCourseId = 0;
  const links = card.querySelectorAll("a");
  for (let j = 0; j < links.length; j++) {
    const href = links[j].href;
    const path = new URL(href).pathname;
    if (path.startsWith("/courses/")) {
      cardCourseId = path.replace("/courses/", "");
    }
  }

  courseCards[cardCourseId] = card;
}

function getExpandedGradeContainer(
  courseId = 559,
  courseName = "United States History - S2 - Gutierrez",
  calculated = "5 minutes ago but last year because why not"
) {
  const container = document.createElement("div");
  container.className = "canvascbl-dashboard-expanded-grade-container";

  const gradeDisplay = document.createElement("span");
  const grd = document.createElement("span");
  grd.className = "canvascbl-dashboard-expanded-grade-container-grade";
  gradeDisplay.append(`From ${calculated}`);
  container.appendChild(gradeDisplay);

  const separator = document.createElement("hr");
  separator.className = "canvascbl-hr";
  container.appendChild(separator);

  const p2 = document.createElement("span");
  p2.innerText = `Click for a breakdown.`;
  container.appendChild(p2);

  return container;
}

function displayGrade(courseId, grade, retry = 0) {
  const domGrade = document.getElementById(courseGradeIds[courseId]);
  const card = courseCards[courseId];

  // try 3 times
  if (!card && retry < 3) {
    setTimeout(
      () => displayGrade(courseId, grade, retry + 1),
      // increase retry time by 50ms per retry
      250 + 250 * retry
    );
    return;
  } else if (!card) {
    // unsuccessful
    return;
  }

  if (domGrade) {
    domGrade.innerText = grade;
  } else {
    const linkContainer = document.createElement("a");
    linkContainer.className = "not_external";
    linkContainer.href = `https://app.canvascbl.com/#/dashboard/grades/${courseId}`;
    linkContainer.target = "_blank";

    const gradeContainer = document.createElement("div");
    gradeContainer.className = "canvascbl-dashboard-grade-container";
    gradeContainer.appendChild(getExpandedGradeContainer(/* ... */));

    const gradeDisplay = document.createElement("span");
    gradeDisplay.className = "canvascbl-dashboard-grade";
    gradeDisplay.innerText = grade;

    const gradeId = generateGradeId();
    gradeDisplay.id = gradeId;
    courseGradeIds[courseId] = gradeId;

    gradeContainer.appendChild(gradeDisplay);
    linkContainer.appendChild(gradeContainer);
    card.appendChild(linkContainer);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {
    case "DISPLAY_GRADE":
      displayGrade(msg.courseId, msg.grade);
      return;
  }
});

const refImg = document.createElement("a");
refImg.className = "canvascbl-dashboard-ref not_exernal";
refImg.href = "https://canvascbl.com";
refImg.target = "_blank";

const icFooterLogo = document.querySelector(".footer-logo");
icFooterLogo.parentNode.insertBefore(refImg, icFooterLogo.nextSibling);

displayGrade(559, "A-");
