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
  page: 1,
  startDate: startAt,
  endDate: endAt,
  'filterBy[id]': undefined,
  'filterBy[source_id]': undefined,
  'filterBy[created_by]': undefined,
  'filterBy[status]': undefined,
  'filterBy[create_date]': undefined,
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
        "payment_type": null,
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
      current_page: 1,
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
    'filterBy[id]': params['filterBy[id]'] ? params['filterBy[id]'] : undefined,
    'filterBy[status]': params['filterBy[status]'] ? params['filterBy[status]'] : undefined,
    'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
  }
  return param
}

export const formatParams_khoKetNoi = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    'filterBy[id]': params['filterBy[id]'] ? `${params['filterBy[id]']}:like` : undefined,
    'filterBy[source_id]': params['filterBy[source_id]'] ? params['filterBy[source_id]'] : undefined,
    'filterBy[created_by]': params['filterBy[created_by]'] ? params['filterBy[created_by]'] : undefined,
    'filterBy[status]': (params['filterBy[status]'] && params['filterBy[status]'].length ) ? `${params['filterBy[status]'].toString()}:in` : undefined,
    'filterBy[create_date]': params['startDate'] ? `${params['startDate']},${params['endDate']}:btw` : undefined
  }
  return param
}

export const formatParams_khoNhan = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    // startDate: params.startDate ? params.startDate : undefined,
    // endDate: params.endDate ? params.endDate : undefined,
    'filterBy[id]': params['filterBy[id]'] ? params['filterBy[id]'] : undefined,
    'filterBy[source_id]': params['filterBy[source_id]'] ? params['filterBy[source_id]'] : undefined,
    'filterBy[created_by]': params['filterBy[created_by]'] ? params['filterBy[created_by]'] : undefined,
    'filterBy[status]': (params['filterBy[status]'] && params['filterBy[status]'].length ) ? `${params['filterBy[status]'].toString()}:in` : undefined,
    // 'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
    'filterBy[received_date]': params['startDate'] ? `${params['startDate']},${params['endDate']}:btw` : undefined
  }
  return param
}

export const formatParams_daXuat = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    // startDate: params.startDate ? params.startDate : undefined,
    // endDate: params.endDate ? params.endDate : undefined,
    'filterBy[id]': params['filterBy[id]'] ? params['filterBy[id]'] : undefined,
    'filterBy[source_id]': params['filterBy[source_id]'] ? params['filterBy[source_id]'] : undefined,
    'filterBy[created_by]': params['filterBy[created_by]'] ? params['filterBy[created_by]'] : undefined,
    'filterBy[status]': params['filterBy[status]'] ? params['filterBy[status]'] : undefined,
    // 'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
    'filterBy[exported_date]': params['startDate'] ? `${params['startDate']},${params['endDate']}:btw` : undefined
  }
  return param
}

export const formatParams_huy = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    // startDate: params.startDate ? params.startDate : undefined,
    // endDate: params.endDate ? params.endDate : undefined,
    'filterBy[id]': params['filterBy[id]'] ? params['filterBy[id]'] : undefined,
    'filterBy[source_id]': params['filterBy[source_id]'] ? params['filterBy[source_id]'] : undefined,
    'filterBy[created_by]': params['filterBy[created_by]'] ? params['filterBy[created_by]'] : undefined,
    'filterBy[status]': params['filterBy[status]'] ? params['filterBy[status]'] : undefined,
    // 'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
    'filterBy[canceled_date]': params['startDate'] ? `${params['startDate']},${params['endDate']}:btw` : undefined
  }
  return param
}

export const formatParams_tuChoi = (params) => {
  let param = {
    per_page: params.per_page ? params.per_page : undefined ,
    page: params.page ? params.page : undefined,
    // startDate: params.startDate ? params.startDate : undefined,
    // endDate: params.endDate ? params.endDate : undefined,
    'filterBy[id]': params['filterBy[id]'] ? params['filterBy[id]'] : undefined,
    'filterBy[source_id]': params['filterBy[source_id]'] ? params['filterBy[source_id]'] : undefined,
    'filterBy[created_by]': params['filterBy[created_by]'] ? params['filterBy[created_by]'] : undefined,
    'filterBy[status]': params['filterBy[status]'] ? params['filterBy[status]'] : undefined,
    // 'filterBy[create_date]': params['filterBy[create_date]'] ? params['filterBy[create_date]'] : undefined,
    'filterBy[deleted_at]': params['startDate'] ? `${params['startDate']},${params['endDate']}:btw` : undefined
  }
  return param
}

export const formatDataSubmit = (data) => {
  let temp = {...data}
  temp['source'] = undefined
  if(temp['cod_fee'] && temp['cod_fee']['amount'] < 0 || !temp['cod_fee']['amount']){
    temp['cod_fee'] = undefined
  }
  if(temp['r_shipping_fee'] && !temp['r_shipping_fee']['paying_side']){
    temp['r_shipping_fee'] = undefined
  }
  if(temp['d_shipping_fee'] && !temp['d_shipping_fee']['paying_side']){
    temp['d_shipping_fee'] = undefined
  }
  if(temp.order_cod === null)
    temp.order_cod = 0
  
  return temp
}

export const CuocVanChuyenThuNguoiGui =  (objOder) => {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee'] && objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 1 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)


  return final_fee
}

export const CuocVanChuyenThuNguoiNhan =  (objOder) => {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee'] && objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)


  return final_fee
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

export const FormatMoney = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
}

export const TongCuocNguoiNhanTra = (objOder) => {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  if (objOder.cod_fee && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 2 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 2 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 2 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['order_cod'])
    final_fee += objOder['order_cod'] || 0

  return final_fee
}

export const TongCuocNguoiGuiTra = (objOder) => {
  let final_fee = 0,
    discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 1 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  // if (objOder.cod_fee  && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 1 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
  //   final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 1 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 1 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']


  return final_fee
}