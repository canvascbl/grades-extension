import { OAuth2State } from "./oauth2";
import { CanvasState } from "./canvas";

export interface APIError {
  statusCode: number;
  while?: string;
  data: {
    error: string;
  };
}

export default interface State {
  oauth2: OAuth2State;
  canvas: CanvasState;
}
