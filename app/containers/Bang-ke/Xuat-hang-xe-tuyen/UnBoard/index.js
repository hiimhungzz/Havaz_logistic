/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import styled from "styled-components";
import _ from "lodash";
import PropTypes from "prop-types";
import Filter from "./Filter";
import { Map } from "immutable";
import moment from "moment";
import List from "./List";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

/*
 * Danh sách bảng kê xuất hàng xe tuyến
 *
 * Hiển thị danh sách bảng kê xuất hàng xe tuyến, at the '/bang-ke/xuat-hang/xe-tuyen' route
 *
 */
const Page = ({
  className,
  cTablesLoading,
  cTables,
  setReLoadCTables,
  onEditCTableRecord,
}) => {
  const [filter, setFilter] = useState(
    Map({
      cTableId: "",
      license_plate: "",
      time_start: undefined,
      begin: moment().startOf("day"),
      finish: moment().endOf("day"),
    })
  );
  // Handler

  const _handleCancelCTableRecord = useCallback(
    async (cTableId) => {
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `/v1/exportings/${cTableId}/cancel`,
        method: "POST",
        data: {
          note: "Huỷ chuyến",
        },
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi hủy bản kê." });
      } else {
        Ui.showSuccess({ message: "Hủy bản kê thành công." });
        setReLoadCTables(true)
      }
    },
    [setReLoadCTables]
  );
  // -----------------------

  let _handleFiltered = useCallback(() => {
    return cTables
      .filter((cTable) => {
        return (
          (filter.get("cTableId")
            ? cTable.get("code").includes(filter.get("cTableId"))
            : true) &&
          (filter.get("license_plate")
            ? cTable.get("license_plate").includes(filter.get("license_plate"))
            : true) &&
          (filter.get("time_start")
            ? cTable.get("time_start") === filter.get("time_start")
            : true) &&
          (filter.get("route")
            ? cTable.getIn(["trip_route", "route_id"]) === filter.get("route")
            : true) &&
          (filter.get("begin") && cTable.get("create_time")
            ? moment(cTable.get("create_time")).isBetween(
              moment(filter.get("begin").startOf("day")),
              moment(filter.get("finish").endOf("day"))
            )
            : true)
        );
      })
      .toJS()
      .map((dt) => {
        return {
          cTableId: dt.code,
          license_plate: dt.license_plate,
          time_start: dt.time_start,
          // create_time: moment(dt.create_time).format(DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM),
          creator: dt.creator,
          create_time: dt.create_time,
          staff_create: dt.creator?.name,
          driver: dt.drivers ? (dt.drivers[0] && dt.drivers[0]?.name) : '',
          trip_bus: dt.trip_bus,
          status: dt.status,
          trip_route: dt.trip_route,
          seats: `${dt.occupy_seats}/${dt.seats}`,
          // amount: _.sumBy(dt.orders, (x) => x.order_fee),
          amount: _.sumBy(dt.orders, (x) => (_.get(x, 'order_fee.amount', 0) - _.get(x, 'discount', 0)) + _.get(x, 'cod_fee.amount', 0) + _.get(x, 'r_shipping_fee.amount', 0) + _.get(x, 'd_shipping_fee.amount', 0) ),
          numberPackage: _.sumBy(dt.orders, (x) => x.num_of_package),
          children: _.map(dt.orders, (order, orderId) => {
            return {
              stt: orderId + 1,
              order_id: order.code,
              destination_id: order.destination?.id,
              depot_destination_name: order.destination?.name,
              receiver_address: order.receiver?.address,
              note: order.note,
              description: order.description,
              receiver_phone: order.receiver?.phone,
              source_name: order.source?.name,
              receiver_name: order.receiver?.name,
              sender_name: order.sender?.name,
              sender_phone: order.sender?.phone,
              sender_address: order.sender?.address,
              num_of_package: order.num_of_package,
              order_fee: order.order_fee,
              order_cod: order.order_cod,
              d_shipping_fee: order.d_shipping_fee,
              r_shipping_fee: order.r_shipping_fee,
              cod_fee: order.cod_fee,
              discount: order.discount,
              create_time: moment(order.created_at).format(
                DATE_TIME_FORMAT.DD_MM_YYYY
              ),
              status: order.status,

            };
          }),
        };
      });
  }, [filter, cTables]);
  let filtered = _handleFiltered();
  // ---------------
  return (
    <Row className={className} gutter={[16, 8]}>
      <Col xs={24}>
        <Filter filter={filter} setFilter={setFilter} />
      </Col>
      <Col xs={24}>
        <Spin spinning={cTablesLoading}>
          <List
            dataSource={filtered}
            onCancelCTableRecord={_handleCancelCTableRecord}
            onEditCTableRecord={onEditCTableRecord}
          />
        </Spin>
      </Col>
    </Row>
  );
};
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(Page)`
  margin-bottom: 0;
  .page-content {
    padding: 8px 8px;
    border: 1px solid #ebedf2;
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
