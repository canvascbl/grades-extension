import {
  CANVAS_GET_CANVASCBL_USER_PROFILE,
  CANVAS_GET_CANVASCBL_USER_PROFILE_ERROR,
  CANVAS_GET_GRADES,
  CANVAS_GET_GRADES_ERROR,
  CANVAS_GOT_CANVASCBL_USER_PROFILE,
  CANVAS_GOT_GRADES,
  CanvasCBLUserProfile,
  CanvasGetCanvasCBLUserProfileAction,
  CanvasGetCanvasCBLUserProfileErrorAction,
  CanvasGetGradesAction,
  CanvasGetGradesErrorAction,
  CanvasGotCanvasCBLUserProfileAction,
  CanvasGotGradesAction,
  GradesResponse,
} from "../types/canvas";
import { APIError } from "../types";

export function getGrades(
  include: CanvasGetGradesAction["include"]
): CanvasGetGradesAction {
  return {
    type: CANVAS_GET_GRADES,
    include,
  };
}

export function getGradesError(e: APIError): CanvasGetGradesErrorAction {
  return {
    type: CANVAS_GET_GRADES_ERROR,
    e,
  };
}

export function gotGrades(resp: GradesResponse): CanvasGotGradesAction {
  return {
    type: CANVAS_GOT_GRADES,
    detailedGrades: resp.detailed_grades,
    userProfile: resp.user_profile,
    observees: resp.observees,
    courses: resp.courses,
  };
}

export function getCanvasCBLUserProfile(): CanvasGetCanvasCBLUserProfileAction {
  return {
    type: CANVAS_GET_CANVASCBL_USER_PROFILE,
  };
}

export function getCanvasCBLUserProfileError(
  e: APIError
): CanvasGetCanvasCBLUserProfileErrorAction {
  return {
    type: CANVAS_GET_CANVASCBL_USER_PROFILE_ERROR,
    e,
  };
}

export function gotCanvasCBLUserProfile(
  profile: CanvasCBLUserProfile
): CanvasGotCanvasCBLUserProfileAction {
  return {
    type: CANVAS_GOT_CANVASCBL_USER_PROFILE,
    profile,
  };
}
