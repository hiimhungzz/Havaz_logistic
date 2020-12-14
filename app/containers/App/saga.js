import { takeLatest, call, put } from "redux-saga/effects";
import { LOGOUT } from "./constants";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL, BASE_URL } from "utils/constants";
import { browseTrip, browseRoute, browseGlobalConfig, setLeftMenu } from "./actions";

/**
 * Xử lý lấy dữ liệu route
 */
const browseGlobalConfigRequest = async () => {
  return ServiceBase.requestJson({
    url: "v1/common/definitions",
    baseUrl: API_BASE_URL,
    method: "GET",
  });
};
export function* handleBrowseGlobalConfig() {
  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(browseGlobalConfigRequest);
    if (result.hasErrors) {
      yield put(browseGlobalConfig.failure(result.errors));
    } else {
      yield put(browseGlobalConfig.success(result.value));
    }
  } catch (error) {
    yield put(browseGlobalConfig.failure(error));
  }
}

const getLeftMenu = async () => {
  return ServiceBase.requestJson({
    url: "v1/common/menu",
    baseUrl: API_BASE_URL,
    method: "GET",
  });
};

export function* handleGetGlobalLeftMenu() {
  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(getLeftMenu);
    if (result.hasErrors) {
      // yield put(browseGlobalConfig.failure(result.errors));
    } else {
      yield put(setLeftMenu(result.value.data));
    }
  } catch (error) {
    // yield put(browseGlobalConfig.failure(error));
  }
}

/**
 * Xử lý lấy dữ liệu route
 */
const browseRouteRequest = async () => {
  return ServiceBase.requestJson({
    url: "v1/common/route",
    baseUrl: API_BASE_URL,
    method: "GET",
  });
};
export function* handleBrowseRoute() {
  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(browseRouteRequest);
    if (result.hasErrors) {
      yield put(browseRoute.failure(result.errors));
    } else {
      yield put(browseRoute.success(result.value.data));
    }
  } catch (error) {
    yield put(browseRoute.failure(error));
  }
}
/**
 * Xử lý lấy dữ liệu trip
 */
const browseTripRequest = async () => {
  return ServiceBase.requestJson({
    url: "v1/common/trips",
    baseUrl: API_BASE_URL,
    method: "GET",
    // data: {
    //   init_shipment: 1,
    // }
  });
};
export function* handleBrowseTrip() {
  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(browseTripRequest);
    if (result.hasErrors) {
      yield put(browseTrip.failure(result.errors));
    } else {
      yield put(browseTrip.success(result.value.data));
    }
  } catch (error) {
    yield put(browseTrip.failure(error));
  }
}
/**
 * Xử lý logout hệ thống
 */
const logoutRequest = async () => {
  return ServiceBase.requestJson({
    url: "logout",
    baseUrl: BASE_URL,
    method: "POST",
  });
};
export function* handleLogout() {
  try {
    // Call our request helper (see 'utils/request')
    yield call(logoutRequest);
  } catch (err) {
  }
}
// Individual exports for testing
export default function* Logout() {
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(browseGlobalConfig.TRIGGER, handleBrowseGlobalConfig);
  yield takeLatest(browseGlobalConfig.TRIGGER, handleGetGlobalLeftMenu);
  yield takeLatest(browseTrip.TRIGGER, handleBrowseTrip);
  yield takeLatest(browseRoute.TRIGGER, handleBrowseRoute);
}
