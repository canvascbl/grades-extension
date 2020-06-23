import { APIError } from "./index";

export interface DetailedGrade {
  grade: {
    grade: string;
    rank: number;
    most_above: number;
    all_above: number;
  };
  averages: {
    [outcomeId: number]: {
      did_drop_worst_score: boolean;
      average: number;
    };
  };
}

export interface DetailedGrades {
  [canvasUserId: number]: DetailedGrade;
}

export interface UserProfile {
  avatar_url: string;
  bio?: string;
  calendar: {
    ics: string;
  };
  effective_locale: string;
  login_id: string;
  lti_user_id: string;
  name: string;
  primary_email: string;
  short_name: string;
  sortable_name: string;
  time_zone: string;
}

export interface Observee {
  created_at: string;
  id: number;
  name: string;
  observation_link_root_account_ids: Array<number>;
  short_name: string;
  sortable_name: string;
}

export type Observees = Array<Observee>;

export interface CourseEnrollment {
  associated_user_id?: number;
  enrollment_state: string;
  limit_privileges_to_course_section: boolean;
  role: string;
  role_id: number;
  user_id: number;
}

export interface Course {
  account_id: number;
  apply_assignment_group_weights: boolean;
  blueprint: boolean;
  calendar: {
    ics: string;
  };
  course_code: string;
  created_at: string;
  default_view: string;
  end_at: string;
  enrollment_term_id: string;
  enrollments: Array<CourseEnrollment>;
  grade_passback_setting?: string;
  grading_standard_id: number;
  hide_final_grades: boolean;
  id: number;
  is_public: boolean;
  is_public_to_auth_users: boolean;
  image_download_url?: string;
  license: string;
  locale: string;
  name: string;
  overriden_course_visibility: string;
  public_syllabus: boolean;
  public_syllabus_to_auth: boolean;
  restrict_enrollments_to_course_dates: false;
  root_account_id: number;
  start_at: string;
  storage_quota_mb: number;
  time_zone: string;
  uuid: string;
  workflow_state: string;
  canvascbl_hidden?: boolean;
}

export type Courses = Array<Course>;

export interface GradesResponse {
  detailed_grades?: DetailedGrades;
  user_profile?: UserProfile;
  observees?: Observees;
  courses?: Courses;
}

export interface CanvasState {
  detailedGrades?: DetailedGrades;
  userProfile?: UserProfile;
  observees?: Observees;
  courses?: Courses;
  // Date.now() of when the data was fetched
  fetchedAt?: number;
  gradesFetchError?: APIError;
}

export const CANVAS_GET_GRADES = "CANVAS_GET_GRADES";

export type CanvasGradesSupportedInclude =
  | "detailed_grades"
  | "user_profile"
  | "observees"
  | "courses";

export interface CanvasGetGradesAction {
  type: typeof CANVAS_GET_GRADES;
  include: Array<CanvasGradesSupportedInclude>;
}

export const CANVAS_GET_GRADES_ERROR = "CANVAS_GET_GRADES_ERROR";

export interface CanvasGetGradesErrorAction {
  type: typeof CANVAS_GET_GRADES_ERROR;
  e: APIError;
}

export const CANVAS_GOT_GRADES = "CANVAS_GOT_GRADES";

export interface CanvasGotGradesAction {
  type: typeof CANVAS_GOT_GRADES;
  detailedGrades?: DetailedGrades;
  userProfile?: UserProfile;
  observees?: Observees;
  courses?: Courses;
}

export type CanvasActionTypes =
  | CanvasGetGradesAction
  | CanvasGetGradesErrorAction
  | CanvasGotGradesAction;
