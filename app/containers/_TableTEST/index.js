/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback, useLayoutEffect } from "react";
import { Row, Col, Spin, Button } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Map } from "immutable";
import {
  useLoadBangKeXhXeTrungChuyen,
  useLoadDrivers,
  useLoadVehicles,
  useLoadDriversActive
} from "utils/hooks";
import Modal from "./Modal";
import List from "./List";
import moment from "moment";
import _ from "lodash";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import * as qs from "query-string";

const a =
  [
    {
      "id": "7869794873",
      "code": "7869794873",
      "create_time": "2020-09-24T07:05:18.000000Z",
      "time_start": null,
      "driver": "Ho\u00e0ng Anh Tu\u1ea5n",
      "driver_phone": "",
      "license_plate": "29A-34771",
      "status": 2,
      "staff_create": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
      "updated_at": "2020-09-24T07:05:27.000000Z",
      "orders": [
        {
          "id": "167869770349",
          "code": "167869770349",
          "source": {
            "id": 2,
            "name": "M\u1ef9 \u0110\u00ecnh",
            "code": "MDI"
          },
          "destination": {
            "id": 9,
            "name": "S\u01a1n La",
            "code": "MMM"
          },
          "status": 6,
          "sender": {
            "phone": "0587180074",
            "name": "0587180074",
            "address": null
          },
          "receiver": {
            "phone": "0339543419",
            "name": "0339543419",
            "address": null
          },
          "num_of_package": 2,
          "payment_type": 2,
          "items": [
            {
              "number": 1,
              "type_of": 29,
              "description": "1",
              "fee": 66000,
              "fee_currency": "VND",
              "quantity": 12,
              "num_of_package": 2
            }
          ],
          "order_fee": 66000,
          "order_cod": 0,
          "discount": 0,
          "cod_fee": 0,
          "final_fee": 66000,
          "note": "",
          "undelivered_reason": null,
          "cod_transferred": false,
          "creator": {
            "id": 963,
            "name": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
            "code": "HA.CN.003"
          },
          "created_at": "2020-09-24T07:01:24.000000Z",
          "updated_at": "2020-09-24T09:30:24.000000Z"
        },
        {
          "id": "167869793809",
          "code": "167869793809",
          "source": {
            "id": 2,
            "name": "M\u1ef9 \u0110\u00ecnh",
            "code": "MDI"
          },
          "destination": {
            "id": 9,
            "name": "S\u01a1n La",
            "code": "MMM"
          },
          "status": 6,
          "sender": {
            "phone": "0587180074",
            "name": "0587180074",
            "address": null
          },
          "receiver": {
            "phone": "0339543419",
            "name": "0339543419",
            "address": null
          },
          "num_of_package": 1,
          "payment_type": 1,
          "items": [
            {
              "number": 1,
              "type_of": 30,
              "description": "1",
              "fee": 110000,
              "fee_currency": "VND",
              "quantity": 2,
              "num_of_package": 1
            }
          ],
          "order_fee": 110000,
          "order_cod": 0,
          "discount": 0,
          "cod_fee": 0,
          "final_fee": 110000,
          "note": "",
          "undelivered_reason": null,
          "cod_transferred": false,
          "creator": {
            "id": 963,
            "name": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
            "code": "HA.CN.003"
          },
          "created_at": "2020-09-24T07:05:08.000000Z",
          "updated_at": "2020-09-24T09:30:24.000000Z"
        },
        {
          "id": "167861862018",
          "code": "167861862018",
          "source": {
            "id": 2,
            "name": "M\u1ef9 \u0110\u00ecnh",
            "code": "MDI"
          },
          "destination": {
            "id": 9,
            "name": "S\u01a1n La",
            "code": "MMM"
          },
          "status": 6,
          "sender": {
            "phone": "0587180074",
            "name": "0587180074",
            "address": null
          },
          "receiver": {
            "phone": "0339543419",
            "name": "0339543419",
            "address": null
          },
          "num_of_package": 1,
          "payment_type": 1,
          "items": [
            {
              "number": 1,
              "type_of": 30,
              "description": "1",
              "fee": 110000,
              "fee_currency": "VND",
              "quantity": 5,
              "num_of_package": 1
            }
          ],
          "order_fee": 110000,
          "order_cod": 0,
          "discount": 0,
          "cod_fee": 0,
          "final_fee": 110000,
          "note": "",
          "undelivered_reason": null,
          "cod_transferred": false,
          "creator": {
            "id": 963,
            "name": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
            "code": "HA.CN.003"
          },
          "created_at": "2020-09-23T10:04:25.000000Z",
          "updated_at": "2020-09-24T09:30:24.000000Z"
        }
      ]
    },
    {
      "id": "7859514563",
      "code": "7859514563",
      "create_time": "2020-09-23T03:51:18.000000Z",
      "time_start": null,
      "driver": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
      "driver_phone": "",
      "license_plate": "29LD03039",
      "status": 1,
      "staff_create": "\u0110\u1ed3ng V\u0103n S\u01a1n",
      "updated_at": "2020-09-23T04:11:24.000000Z",
      "orders": [
        {
          "id": "167850798855",
          "code": "167850798855",
          "source": {
            "id": 2,
            "name": "M\u1ef9 \u0110\u00ecnh",
            "code": "MDI"
          },
          "destination": {
            "id": 9,
            "name": "S\u01a1n La",
            "code": "MMM"
          },
          "status": 2,
          "sender": {
            "phone": "0587180074",
            "name": "Ho\u00e0ng Anh",
            "address": null
          },
          "receiver": {
            "phone": "0339543419",
            "name": "Kh\u00e1nh H\u00d2a",
            "address": "125 Ho\u00e0ng Ng\u00e2n"
          },
          "num_of_package": 3,
          "payment_type": 1,
          "items": [
            {
              "number": 1,
              "type_of": 29,
              "description": "1",
              "fee": 70000,
              "fee_currency": "VND",
              "quantity": 12,
              "num_of_package": 2
            },
            {
              "number": 3,
              "type_of": 0,
              "description": "Item 2",
              "fee": 120000,
              "fee_currency": "VND",
              "quantity": 1,
              "num_of_package": 1
            }
          ],
          "order_fee": 190000,
          "order_cod": 10000,
          "discount": 10000,
          "cod_fee": 0,
          "final_fee": 180000,
          "note": "h\u00e0ng d\u1ec5 v\u1ee1",
          "undelivered_reason": null,
          "cod_transferred": false,
          "creator": {
            "id": 963,
            "name": "B\u00f9i Th\u1ecb Kh\u00e1nh H\u00f2a",
            "code": "HA.CN.003"
          },
          "created_at": "2020-09-22T04:45:58.000000Z",
          "updated_at": "2020-09-24T09:30:24.000000Z"
        }
      ]
    },

    {
      "id": "7843685175",
      "code": "7843685175",
      "create_time": "2020-09-21T09:55:17.000000Z",
      "time_start": null,
      "driver": "\u0110\u1eb7ng Qu\u1ed1c Tu\u00e2n",
      "driver_phone": "",
      "license_plate": "34LD - 0277",
      "status": 1,
      "staff_create": "\u0110\u1ed3ng V\u0103n S\u01a1n",
      "updated_at": "2020-09-22T04:08:34.000000Z",
      "orders": [
        {
          "id": "167843114808",
          "code": "167843114808",
          "source": {
            "id": 2,
            "name": "M\u1ef9 \u0110\u00ecnh",
            "code": "MDI"
          },
          "destination": {
            "id": 9,
            "name": "S\u01a1n La",
            "code": "MMM"
          },
          "status": 2,
          "sender": {
            "phone": "0969915534",
            "name": "Nguyexn Ho\u00e0ng",
            "address": null
          },
          "receiver": {
            "phone": "0339543419",
            "name": "B\u00f9i h\u00f2a",
            "address": "125 Ho\u00e0ng Ng\u00e2n"
          },
          "num_of_package": 5,
          "payment_type": 2,
          "items": [
            {
              "number": 1,
              "type_of": 0,
              "description": "Ki\u1ec7n 1",
              "fee": 100000,
              "fee_currency": "VND",
              "quantity": 1,
              "num_of_package": 2
            },
            {
              "number": 2,
              "type_of": 29,
              "description": "2",
              "fee": 40000,
              "fee_currency": "VND",
              "quantity": 6,
              "num_of_package": 3
            }
          ],
          "order_fee": 140000,
          "order_cod": 6820000,
          "discount": 16000,
          "cod_fee": 56000,
          "final_fee": 180000,
          "note": "H\u00e0ng d\u1ec5 v\u1ee1. nh\u1eb9 tay",
          "undelivered_reason": null,
          "cod_transferred": false,
          "creator": {
            "id": 1,
            "name": "\u0110\u1ed3ng V\u0103n S\u01a1n",
            "code": null
          },
          "created_at": "2020-09-21T08:24:37.000000Z",
          "updated_at": "2020-09-24T09:30:24.000000Z"
        }
      ]
    },
  ]
const Page = ({ className, definitions }) => {
  // const a  = useSelector(state=>state.App.getIn(['definitions']));

  const [filter, setFilter] = useState(
    Map({
      MTableId: "",
      license_plate: "",
      time_start: undefined,
      begin: moment().startOf("day"),
      finish: moment().endOf("day"),
    })
  );

  let _handleFiltered = useCallback(() => {
    // console.log("a", a);
    return a.map((dt) => {
      return {
        mTableId: dt.code,
        license_plate: dt.license_plate,
        time_start: dt.time_start,
        created_at: dt.created_at,
        create_time: moment(dt.create_time).format(
          DATE_TIME_FORMAT.DD_MM_YYYY
        ),
        staff_create: dt.staff_create,
        status: dt.status,
        amount: _.sumBy(dt.orders, (x) => x.order_fee),
        numberPackage: _.sumBy(dt.orders, (x) => x.num_of_package),
        driver: dt.driver,
        driver_phone: dt.driver_phone,
        children: _.map(dt.orders, (order, orderId) => {
          return {
            stt: orderId + 1,
            order_id: order.code,
            depot_destination_name: `${order.source?.name} - ${order.destination?.name
              }`,
            receiver_address: order.receiver?.address,
            receiver_phone: order.receiver?.phone,
            receiver_name: order.receiver?.name,
            sender_name: order.sender?.name,
            sender_address: order.sender?.address,
            sender_phone: order.sender?.phone,
            num_of_package: order.num_of_package,
            order_fee: order.order_fee,
            order_cod: order.order_cod,
            create_time: moment(order.created_at).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            ),
            status: order.status,
          };
        }),
      };
    });
  }, [filter]);

  let filtered = _handleFiltered();
  return (
    <Row className={className} gutter={[16, 0]}>
      <Col xs={24}>

      </Col>
      <Col xs={24}>
        <div className="page-content">
          <div className="page-content__title">
            DANH SÁCH BẢNG KÊ NHẬP HÀNG VÀO VP
          </div>
          <div className="page-content__action">
            <Button type="primary" onClick={() => { }}>
              Thêm mới
            </Button>
          </div>
        </div>


        <List
          dataSource={filtered}
          onCancelMTableRecord={() => { }}
          onEditMTableRecord={() => { }}
        />
      </Col>
    </Row>
  );
};

const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(Page))`
  margin-bottom: 0px !important;
  .page-content {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-content__action {
      display: flex;
      flex-wrap: wrap;
      .ant-btn {
        margin-left: 5px;
      }
    }
  }
`;
