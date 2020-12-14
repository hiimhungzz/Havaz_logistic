export const RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount";
export const DAEMON = "@@saga-injector/daemon";
export const ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount";
export const JWT_TOKEN = "jwtToken";
export const CURRENT_USER = "currentUser";
export const APP_PARAM = "APP_PARAM";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const DATE_TIME_FORMAT = {
  DD_MM_YYYY: "DD/MM/YYYY",
  DD_MM_YYYY__HH_MM: "DD/MM/YYYY HH:mm",
  YYYY_MM_DD: "YYYY-MM-DD",
  HH_MM: "HH:mm",
};
export const CTABLE_EXPORT = {
  1: {
    text: "Tạo mới",
    color: "#007bff",
  },
  2: {
    text: "Đã chốt",
    color: "#28a745",
  },
  3: {
    text: "Đã hủy",
    color: "#dc3545",
  },
};
export const ORDER_EXPORT = {
  1: "Tạo mới",
  2: "Đã nhận",
  3: "Đã gửi",
  4: "Đã hủy",
  5: "Chưa gửi",
};


export const URI = {
  URI_VP: "v1/van-phong/list-not-paginate",
  URI_ORDER_CREATE: "/v1/orders",
  URI_ORDER_READ: "v1/orders/",
  URI_ORDER_LIST: "v1/orders/",
  URI_ORDER_REJECT: "v1/rejected-orders",
  URI_STAFF_LIST: "v1/nhan-vien/list",
  URI_ORDER_INFO : "/v1/orders-info",
  URI_REPORT_GET_RECEIVED_ORDER : "/v1/accounting/get-received-orders",
  URI_REPORT_GET_DELIVERED_ORDER : "/v1/accounting/get-delivered-orders",
  URI_SMS : "/v1/app/sms",
  URI_ORDER_ADDRESS : "/v1/order-address"
};
