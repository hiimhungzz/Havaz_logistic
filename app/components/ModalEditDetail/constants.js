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

export const finalFee = function (objOder) {
  let final_fee = 0;
  if (objOder['order_fee']['amount'] && objOder['order_fee']['amount'] > 0)
    final_fee += objOder['order_fee']['amount']

  if (objOder.cod_fee && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['discount'])
    final_fee = final_fee - objOder['discount']

  return final_fee
}


export const tongCuocNguoiNhanTra = function (objOder) {
  let final_fee = 0,
      discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  if (objOder.cod_fee  && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 2 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee']  && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 2 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee']  && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 2 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  final_fee += objOder?.order_cod

  return final_fee
}

export const TongCuoc = (objOder, paying_side) => {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === paying_side && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  // if (objOder.cod_fee  && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === paying_side && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
  //   final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === paying_side && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === paying_side && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']


  return final_fee
}