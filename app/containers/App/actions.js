/*
 *
 * App actions
 *
 */
import { createRoutine } from "redux-saga-routines";
import {
  BROWSE_GLOBAL_CONFIG,
  BROWSE_TRIP,
  BROWSE_ROUTE,
  SET_AUTHENTICATED,
  LOGOUT,
  SET_LEFT_MENU
} from "./constants";

const browseGlobalConfig = createRoutine(BROWSE_GLOBAL_CONFIG, null, {
  prefix: BROWSE_GLOBAL_CONFIG,
});
const browseTrip = createRoutine(BROWSE_TRIP, null, {
  prefix: BROWSE_TRIP,
});
const browseRoute = createRoutine(BROWSE_ROUTE, null, {
  prefix: BROWSE_ROUTE,
});
const setAuthenticated = ({ isAuthenticated, profile }) => (
  {
    type: SET_AUTHENTICATED,
    payload: {
      isAuthenticated,
      profile,
    },
  }
);

const setLeftMenu = (menu) => (
  {
    type: SET_LEFT_MENU,
    payload: menu,
  }
);

const logOut = () => ({
  type: LOGOUT,
});
export {
  browseGlobalConfig,
  browseTrip,
  browseRoute,
  setAuthenticated,
  logOut,
  setLeftMenu,
};
