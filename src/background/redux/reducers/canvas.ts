import {
  CANVAS_GET_GRADES_ERROR,
  CANVAS_GOT_GRADES,
  CanvasActionTypes,
  CanvasState,
} from "../types/canvas";

export default function canvas(
  state: CanvasState = {},
  action: CanvasActionTypes
): CanvasState {
  switch (action.type) {
    case CANVAS_GET_GRADES_ERROR:
      return {
        ...state,
        gradesFetchError: action.e,
      };
    case CANVAS_GOT_GRADES:
      return {
        ...state,
        detailedGrades: action.detailedGrades,
        userProfile: action.userProfile,
        observees: action.observees,
        courses: action.courses,
        fetchedAt: Date.now(),
        gradesFetchError: undefined,
      };
    default:
      return state;
  }
}
