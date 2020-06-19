// add some JS that will be injected into Canvas.

console.log('Josh is in charge now');

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

function displayGrade(courseId, grade) {
  const domGrade = document.getElementById(courseGradeIds[courseId]);
  const card = courseCards[courseId];

  if (domGrade) {
    domGrade.innerText = grade;
  } else {
    const gradeContainer = document.createElement("div");
    gradeContainer.className = "canvascbl-dashboard-grade-container";
    const gradeDisplay = document.createElement("span");
    gradeDisplay.className = "canvascbl-dashboard-grade";
    gradeDisplay.innerText = grade;

    const gradeId = generateGradeId();
    gradeDisplay.id = gradeId;
    courseGradeIds[courseId] = gradeId;

    gradeContainer.appendChild(gradeDisplay);
    card.appendChild(gradeContainer);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.type) {
    case "DISPLAY_GRADE":
      displayGrade(msg.courseId, msg.grade);
      return;
  }
});
displayGrade(536, "A");
displayGrade(555, "A");
displayGrade(545, "A");
displayGrade(594, "A");
displayGrade(559, "A-");
displayGrade(751, "A");