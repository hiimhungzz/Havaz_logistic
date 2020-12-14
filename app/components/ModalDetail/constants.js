import moment from "moment";
import React, { memo, useState, useCallback } from "react";
import { Space, Col, Button } from "antd";
import { EditTwoTone, DeleteTwoTone, PrinterTwoTone } from "@ant-design/icons";
const format = "YYYY-MM-DD";
let startOf = moment().startOf("day");
let endOf = moment().endOf("day");
let startAt = moment(startOf).format(format);
let endAt = moment(endOf).format(format);

export const ARR_HTTT_ORDER = [
  {
    key: 1,
    name: "Người gửi trả"
  },
  {
    key: 2,
    name: "Người nhận trả"
  },
  // {
  //   key: 3,
  //   name: "Thanh toán cuối tháng",
  // },
];

export const validatePhone = (phone) => {
  return /^((02[0-9]?)|03|05|07|08|09)+([0-9]{8})$/.test(phone)
}