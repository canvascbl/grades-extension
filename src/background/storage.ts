import { set, get } from "idb-keyval";
import { Module, connect } from "newton-redux";

import State from "./redux/types";

export async function getInitialState(): Promise<State> {
  const [
    accessToken,
    refreshToken,
    tokenExpiresAt,
    userId,
  ] = await Promise.all([
    get("access_token"),
    get("refresh_token"),
    get("token_expires_at"),
    get("user_id"),
  ]);

  return {
    oauth2: {
      token: {
        access: accessToken as string,
        refresh: refreshToken as string,
        expiresAt: tokenExpiresAt as string,
        userId: userId as number,
      },
    },
    canvas: {},
  };
}

interface StorageProps {
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: string;
  userId: number;
}

class Storage extends Module {
  private props: StorageProps;
  constructor(props) {
    super(props);

    console.log("storage props", props);
  }

  onChange = async (changeMap) => {
    console.log("storage changed", changeMap);
    const sets: Array<Promise<void>> = [];

    if (changeMap.accessToken.hasChanged) {
      sets.push(set("access_token", this.props.accessToken));
    }
    if (changeMap.refreshToken.hasChanged) {
      sets.push(set("refresh_token", this.props.refreshToken));
    }
    if (changeMap.tokenExpiresAt.hasChanged) {
      sets.push(set("token_expires_at", this.props.tokenExpiresAt));
    }
    if (changeMap.userId.hasChanged) {
      sets.push(set("user_id", this.props.userId));
    }

    await Promise.all(sets);
  };
}

function mapStateToProps(state: State): StorageProps {
  return {
    accessToken: state.oauth2.token.access,
    refreshToken: state.oauth2.token.refresh,
    tokenExpiresAt: state.oauth2.token.expiresAt,
    userId: state.oauth2.token.userId,
  };
}

export default connect(mapStateToProps)(Storage);
