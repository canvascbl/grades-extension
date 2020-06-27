import {
  CANVAS_GET_CANVASCBL_USER_PROFILE_ERROR,
  CANVAS_GET_GRADES,
  CANVAS_GET_GRADES_ERROR,
  CANVAS_GOT_CANVASCBL_USER_PROFILE,
  CANVAS_GOT_GRADES,
  CanvasActionTypes,
  CanvasState,
} from "../types/canvas";

export default function canvas(
  state: CanvasState = {},
  action: CanvasActionTypes
): CanvasState {
  switch (action.type) {
    case CANVAS_GET_GRADES:
      return {
        ...state,
        loadingGrades: true,
      };
    case CANVAS_GET_GRADES_ERROR:
      return {
        ...state,
        gradesFetchError: action.e,
        loadingGrades: false,
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
        loadingGrades: false,
      };
    case CANVAS_GET_CANVASCBL_USER_PROFILE_ERROR:
      return {
        ...state,
        canvascblUserProfileFetchError: action.e,
      };
    case CANVAS_GOT_CANVASCBL_USER_PROFILE:
      return {
        ...state,
        canvascblUserProfile: action.profile,
        canvascblUserProfileFetchError: undefined,
      };
    default:
      return state;
  }
}
