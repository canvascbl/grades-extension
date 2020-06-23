import {
  OAUTH2_GET_TOKEN_FROM_CODE_ERROR,
  OAUTH2_GOT_TOKEN_FROM_CODE,
  OAUTH2_REFRESH_TOKEN_ERROR,
  OAUTH2_REFRESHED_TOKEN,
  OAuth2ActionTypes,
  OAuth2State,
} from "../types/oauth2";

const defaultState: OAuth2State = {
  token: {
    access: "",
    refresh: "",
    expiresAt: "",
    userId: 0,
  },
};

export default function oauth2(
  state: OAuth2State = defaultState,
  action: OAuth2ActionTypes
): OAuth2State {
  switch (action.type) {
    case OAUTH2_GET_TOKEN_FROM_CODE_ERROR:
      return {
        ...state,
        tokenFromCodeError: action.e,
      };
    case OAUTH2_GOT_TOKEN_FROM_CODE:
      return {
        ...state,
        token: {
          access: action.accessToken,
          refresh: action.refreshToken,
          userId: action.userId,
          expiresAt: action.expiresAt,
        },
        tokenFromCodeError: undefined,
      };
    case OAUTH2_REFRESH_TOKEN_ERROR:
      return {
        ...state,
        refreshTokenError: action.e,
      };
    case OAUTH2_REFRESHED_TOKEN:
      return {
        ...state,
        token: {
          ...state.token,
          access: action.accessToken,
          expiresAt: action.expiresAt,
        },
        refreshTokenError: undefined,
      };
    default:
      return state;
  }
}
