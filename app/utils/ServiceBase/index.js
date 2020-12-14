/* eslint-disable default-case */
import Axios from "axios";
import _ from "lodash";
import Result from "./result";
import { $Cookies } from "../cookies";
import { API_BASE_URL, JWT_TOKEN } from "../constants";
import HttpStatus from "http-status-codes";
import { Ui } from "utils/Ui";
import Globals from "utils/globals";

export default class ServiceBase {
  static async requestJson(opts) {
    let axiosResult = null;
    let result = null;
    let headers =
      $Cookies.get("XSRF-TOKEN") && Globals.isAuthenticated
        ? {
          // "Accept":'application/json',
          "Content-Type": _.get(opts, "contentType", "application/json"),
          "X-XSRF-TOKEN": $Cookies.get("XSRF-TOKEN"),
          Accept: "application/json",
          // "Authorization" : "Bearer 8|u286oc0yo9UeWok2DDAkbOOIzcbmu5b1AfIiRchBrK1grFfPgxqbGBkjmOWXLgqbtJdWJhAvQvnm1J5A"
        }
        : {
          "Content-Type": _.get(opts, "contentType", "application/json"),
          Accept: "application/json",
          // "Authorization" : "Bearer 8|u286oc0yo9UeWok2DDAkbOOIzcbmu5b1AfIiRchBrK1grFfPgxqbGBkjmOWXLgqbtJdWJhAvQvnm1J5A"
        };
    const axiosRequestConfig = {
      withCredentials: true,
      baseURL: opts.baseUrl || API_BASE_URL,
      timeout: 300000,
      headers,

    };
    try {
      switch (opts.method) {
        case "GET":
          axiosResult = await Axios.get(opts.url, {
            ...axiosRequestConfig,
            params: opts.data,
          });
          break;
        case "POST":
          axiosResult = await Axios.post(
            opts.url,
            opts.data,
            axiosRequestConfig
          );
          break;
        case "PUT":
          axiosResult = await Axios.put(
            opts.url,
            opts.data,
            axiosRequestConfig
          );
          break;
        case "DELETE":
          axiosResult = await Axios.delete(opts.url, axiosRequestConfig);
          break;
        case "EXPORT":
          axiosResult = await Axios.get(`${opts.url}`, {
            ...axiosRequestConfig,
            responseType: 'blob',
            params: opts.data,
          });
          break;
      }
      result = new Result(axiosResult.data, null);
      if (axiosResult.status === 204) {
        result = {
          ...result,
          statusCode: 204,
        };
      }
    } catch (error) {
      let messages = error?.response?.data?.message || error.message;
      let statusCode = _.get(error, "response.status", HttpStatus.NO_CONTENT);
      if (statusCode === HttpStatus.UNAUTHORIZED) {
        Globals.clear();
        Ui.showError({ message: "Hết phiên đăng nhập" });
        setTimeout(() => {
          window.location.href = "/signin";
        }, 500);
        return;
      } else if (statusCode === HttpStatus.NO_CONTENT) {
        result = new Result(null, "Có lỗi xảy ra.");
      } else {
        result = new Result(null, messages);
      }
    }
    return result;
  }
}
