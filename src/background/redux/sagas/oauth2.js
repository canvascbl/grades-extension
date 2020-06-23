import { all, put, call, select, takeLeading } from "redux-saga/effects";
import axios from "axios";
import moment from "moment";
import {
  OAUTH2_GET_TOKEN_FROM_CODE,
  OAUTH2_REFRESH_TOKEN,
} from "../types/oauth2";
import {
  getOAuth2TokenFromCodeError,
  gotOAuth2TokenFromCode,
  refreshedToken,
  refreshTokenError,
} from "../actions/oauth2";

const apiRequest = axios.create({
  baseURL:
    process.env.API_BASE_URL ||
    "https://tinyapi.canvascbl.com/grades-extension/",
  method: "get",
  withCredentials: false,
});

function* getTokenFromCode({ code }) {
  try {
    const tokenRequest = yield call(apiRequest, {
      url: "token",
      params: {
        code,
      },
    });

    const data = tokenRequest.data;

    yield put(
      gotOAuth2TokenFromCode(
        data.access_token,
        data.refresh_token,
        data.user.id,
        data.expires_at
      )
    );
  } catch (e) {
    if (e.response) {
      yield put(
        getOAuth2TokenFromCodeError({
          statusCode: e.response.headers["x-canvascbl-api-status-code"],
          data: e.response.data,
        })
      );
    } else {
      yield put(
        getOAuth2TokenFromCodeError({
          statusCode: 0,
          data: {
            error: "couldn't connect to server",
          },
        })
      );
    }
  }
}

export function* doRefreshToken({ onlyIfNecessary }) {
  const { expiresAt, accessToken, refreshToken } = yield select((state) => ({
    expiresAt: state.oauth2.token.expiresAt,
    accessToken: state.oauth2.token.access,
    refreshToken: state.oauth2.token.refresh,
  }));

  if (onlyIfNecessary) {
    const tokenExp = moment(expiresAt);
    if (accessToken && tokenExp.subtract(2, "minutes").isAfter(moment())) {
      // token is still valid, do nothing.
      yield put(refreshedToken(accessToken, expiresAt, false));
      return;
    }
  }

  try {
    const refreshReq = yield call(apiRequest, {
      url: "refresh-token",
      params: {
        refresh_token: refreshToken,
      },
    });
    const data = refreshReq.data;

    yield put(refreshedToken(data.access_token, data.expires_at, true));
  } catch (e) {
    if (e.response) {
      yield put(
        refreshTokenError({
          statusCode: e.response.headers["x-canvascbl-api-status-code"],
          data: e.response.data,
        })
      );
    } else {
      yield put(
        refreshTokenError({
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
  yield takeLeading(OAUTH2_GET_TOKEN_FROM_CODE, getTokenFromCode);
  yield takeLeading(OAUTH2_REFRESH_TOKEN, doRefreshToken);
}

export default function* oauth2RootSaga() {
  yield all([watcher()]);
}
