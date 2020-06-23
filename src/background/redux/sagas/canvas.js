import { all, put, call, select, takeLeading } from "redux-saga/effects";
import axios from "axios";
import { doRefreshToken } from "./oauth2";
import { getGrades, getGradesError, gotGrades } from "../actions/canvas";
import { CANVAS_GET_GRADES } from "../types/canvas";

const apiRequest = axios.create({
  baseURL:
    process.env.CANVASCBL_API_BASE_URL || "https://api.canvascbl.com/api/v1/",
  method: "get",
  withCredentials: false,
});

function* doGetGrades({ include }) {
  // refresh token if necessary
  try {
    yield call(doRefreshToken, { onlyIfNecessary: true });
  } catch (e) {
    yield put(getGradesError({ ...e, while: "refreshing oauth2 token" }));
    return;
  }

  const { accessToken } = yield select((state) => ({
    accessToken: state.oauth2.token.access,
  }));

  try {
    const gradesReq = yield call(apiRequest, {
      url: "grades",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        include,
      },
    });

    yield put(gotGrades(gradesReq.data));
  } catch (e) {
    if (e.response) {
      yield put(
        getGradesError({
          statusCode: e.response.status,
          data: e.response.data,
        })
      );
    } else {
      yield put(
        getGradesError({
          statusCode: 0,
          data: {
            error: "couldn't connect to server",
          },
        })
      );
    }
  }
}

function* watcher() {
  yield takeLeading(CANVAS_GET_GRADES, doGetGrades);
}

export default function* canvasRootSaga() {
  yield all([watcher()]);
}
