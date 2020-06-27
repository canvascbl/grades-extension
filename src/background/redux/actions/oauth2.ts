import {
  OAUTH2_GET_TOKEN_FROM_CODE,
  OAUTH2_GET_TOKEN_FROM_CODE_ERROR,
  OAUTH2_GOT_TOKEN_FROM_CODE,
  OAUTH2_REFRESH_TOKEN,
  OAUTH2_REFRESH_TOKEN_ERROR,
  OAUTH2_REFRESHED_TOKEN,
  OAuth2GetTokenFromCodeAction,
  OAuth2GetTokenFromCodeErrorAction,
  OAuth2GotTokenFromCodeAction,
  OAuth2RefreshedTokenAction,
  OAuth2RefreshTokenAction,
  OAuth2RefreshTokenErrorAction,
} from "../types/oauth2";
import { APIError } from "../types";

export function getOAuth2TokenFromCode(
  code: string
): OAuth2GetTokenFromCodeAction {
  return {
    type: OAUTH2_GET_TOKEN_FROM_CODE,
    code,
  };
}

export function getOAuth2TokenFromCodeError(
  e: APIError
): OAuth2GetTokenFromCodeErrorAction {
  return {
    type: OAUTH2_GET_TOKEN_FROM_CODE_ERROR,
    e,
  };
}

export function gotOAuth2TokenFromCode(
  accessToken: string,
  refreshToken: string,
  userId: number,
  expiresAt: string
): OAuth2GotTokenFromCodeAction {
  return {
    type: OAUTH2_GOT_TOKEN_FROM_CODE,
    accessToken,
    refreshToken,
    userId,
    expiresAt,
  };
}

export function refreshToken(onlyIfNecessary = true): OAuth2RefreshTokenAction {
  return {
    type: OAUTH2_REFRESH_TOKEN,
    onlyIfNecessary,
  };
}

export function refreshTokenError(e: APIError): OAuth2RefreshTokenErrorAction {
  return {
    type: OAUTH2_REFRESH_TOKEN_ERROR,
    e,
  };
}

export function refreshedToken(
  accessToken: string,
  expiresAt: string,
  didRefresh: boolean
): OAuth2RefreshedTokenAction {
  return {
    type: OAUTH2_REFRESHED_TOKEN,
    accessToken,
    expiresAt,
    didRefresh,
  };
}
