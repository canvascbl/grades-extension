import { APIError } from "./index";

export interface OAuth2State {
  tokenFromCodeError?: APIError;
  refreshTokenError?: APIError;
  token: {
    access: string;
    refresh: string;
    expiresAt: string;
    userId: number;
  };
}

export const OAUTH2_GET_TOKEN_FROM_CODE = "OAUTH2_GET_TOKEN_FROM_CODE";

export interface OAuth2GetTokenFromCodeAction {
  type: typeof OAUTH2_GET_TOKEN_FROM_CODE;
  code: string;
}

export const OAUTH2_GET_TOKEN_FROM_CODE_ERROR =
  "OAUTH2_GET_TOKEN_FROM_CODE_ERROR";

export interface OAuth2GetTokenFromCodeErrorAction {
  type: typeof OAUTH2_GET_TOKEN_FROM_CODE_ERROR;
  e: APIError;
}

export const OAUTH2_GOT_TOKEN_FROM_CODE = "OAUTH2_GOT_TOKEN_FROM_CODE";

export interface OAuth2GotTokenFromCodeAction {
  type: typeof OAUTH2_GOT_TOKEN_FROM_CODE;
  accessToken: string;
  refreshToken: string;
  userId: number;
  expiresAt: string;
}

export const OAUTH2_REFRESH_TOKEN = "OAUTH2_REFRESH_TOKEN";

export interface OAuth2RefreshTokenAction {
  type: typeof OAUTH2_REFRESH_TOKEN;
  onlyIfNecessary: boolean;
}

export const OAUTH2_REFRESH_TOKEN_ERROR = "OAUTH2_REFRESH_TOKEN_ERROR";

export interface OAuth2RefreshTokenErrorAction {
  type: typeof OAUTH2_REFRESH_TOKEN_ERROR;
  e: APIError;
}

export const OAUTH2_REFRESHED_TOKEN = "OAUTH2_REFRESHED_TOKEN";

export interface OAuth2RefreshedTokenAction {
  type: typeof OAUTH2_REFRESHED_TOKEN;
  accessToken: string;
  expiresAt: string;
  didRefresh: boolean;
}

export type OAuth2ActionTypes =
  | OAuth2GetTokenFromCodeAction
  | OAuth2GetTokenFromCodeErrorAction
  | OAuth2GotTokenFromCodeAction
  | OAuth2RefreshTokenAction
  | OAuth2RefreshTokenErrorAction
  | OAuth2RefreshedTokenAction;
