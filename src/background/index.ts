import "core-js/stable";
import "regenerator-runtime/runtime";

import "./redux";
import { connectToStore } from "./redux";
import Storage from "./storage";
import RefreshListener from "./refreshListener";

connectToStore(Storage);
connectToStore(RefreshListener);
