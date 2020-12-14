import moment from "moment";
import React, { memo, useState, useCallback } from "react";
import { Space, Col, Button } from "antd";
import { EditTwoTone, DeleteTwoTone, PrinterTwoTone } from "@ant-design/icons";
const format = "YYYY-MM-DD";
let startOf = moment().startOf("day");
let endOf = moment().endOf("day");
let startAt = moment(startOf).format(format);
let endAt = moment(endOf).format(format);

/*
 *
 */
export const HEADER_TABLE = [
  {
    title: "Mã đơn",
    width: 100,
    dataIndex: "code",
    key: "code",
    fixed: "left",
  },
  {
    title: "VP đích",
    width: 100,
    dataIndex: "depot_id",
    key: "depot_id",
    fixed: "left",
  },
  {
    title: "Địa chỉ nhận",
    width: 250,
    dataIndex: "sender_address",
    key: "sender_address",
    fixed: "left",
  },
  {
    title: "Người nhận",
    width: 200,
    dataIndex: "receiver_name",
    key: "receiver_name",
    fixed: "left",
  },
  {
    title: "Người gửi",
    width: 200,
    dataIndex: "sender_name",
    key: "sender_name",
  },
  {
    title: "Số kiện",
    width: 70,
    dataIndex: "total_package",
    key: "total_package",
  },
  {
    title: "Cước phí",
    width: 100,
    dataIndex: "final_fee",
    key: "final_fee",
  },
  {
    title: "COD",
    width: 100,
    dataIndex: "cod",
    key: "cod",
  },
  {
    title: "HTTT",
    width: 150,
    dataIndex: "payment_type",
    key: "payment_type",
  },
  {
    title: "Người tạo",
    width: 150,
    dataIndex: "adm_create",
    key: "adm_create",
  },
  {
    title: "Thời gian tạo",
    width: 150,
    dataIndex: "time_create",
    key: "time_create",
  },
  {
    title: "Trạng thái",
    width: 100,
    dataIndex: "status",
    key: "status",
  },
  {
    title: "THAO TÁC",
    width: 180,
    dataIndex: "7",
    key: "7",
    fixed: "right",
    render: (text, record) => (
      <Space>
        <Button
          type="link"
          onClick={() => {
            console.log(record);
          }}
        >
          <EditTwoTone />
        </Button>
        <Button type="link">
          <DeleteTwoTone />
        </Button>
        <Button type="link">
          <PrinterTwoTone />
        </Button>
      </Space>
    ),
  },
];

export const TEMP_BODY = {
  total: 19,
  per_page: 10,
  page: 0,
  startDate: startAt,
  endDate: endAt,
  'filterBy[id]': undefined,
  'filterBy[status]': undefined,
  'filterBy[create_date]': undefined,
  'filterBy[receiver_phone]': undefined,
  'filterBy[sender_phone]': undefined
};

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

export const ARR_STATUS_ORDER = [
  {
    key: 1,
    name: "CREATED",
    color: "#00FFFF",
  },
  {
    key: 2,
    name: "RECEIVED",
    color: "#00FF99",
  },
  {
    key: 3,
    name: "DELIVERED",
    color: "#CC0000",
  },
  {
    key: 4,
    name: "CANCELED",
    color: "#CC0000",
  },
  {
    key: 5,
    name: "UNDELIVERED",
    color: "#CC0000",
  },
];

export const ARR_TEAMP_VP = [
  {
    key: 1,
    name: "VP Mỹ Đình",
  },
  {
    key: 2,
    name: "VP Hòa Bình",
  },
  {
    key: 3,
    name: "VP Tây Bắc",
  },
  {
    key: 3,
    name: "VP Trung Chuyển",
  },
];

export const JSON_BASE = {
        "source": {
            "id": undefined,
            "name": undefined
        },
        "destination": {
            "id": undefined,
            "name": undefined
        },
        "status": 1,
        "sender": {
            "phone": undefined,
            "name": undefined,
            "address": null
        },
        "receiver": {
            "phone": undefined,
            "name": undefined,
            "address": null
        },
        "num_of_package": 1,
        "payment_type": 1,
        "order_fee": undefined,
        "order_cod": 0,
        "note": undefined,
        "created_at": undefined,
        "updated_at": undefined
    }



export const JSON_TEMP = (param) => {
  let { per_page } = param;
  let arr = {
    data: [],
    pagination: {
      last_page: 31,
      per_page: 5,
      next: "http://localhost:300/api/v1/logistics/employee?page=2",
      page: 1,
      total: 230,
    },
  };
  return arr;
};

export const formatParams = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    // startDate: params.startDate ? params.startDate : undefined,
    // endDate: params.endDate ? params.endDate : undefined,
    'filterBy[id]': params['filterBy[id]'] ? `${params['filterBy[id]']}:like` : undefined,
    'filterBy[status]': params['filterBy[status]'] ? params['filterBy[status]'] : undefined,
    'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
    'filterBy[receiver_phone]': params['filterBy[receiver_phone]'] ? `${params['filterBy[receiver_phone]']}:like` : undefined,
    'filterBy[sender_phone]': params['filterBy[sender_phone]'] ? `${params['filterBy[sender_phone]']}:like` : undefined,
  }
  return param
}