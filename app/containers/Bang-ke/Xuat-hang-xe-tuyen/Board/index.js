/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Map } from "immutable";
import Filter from "./Filter";
import Main from "./Main";
import moment from "moment";

/*
 * Danh sách bảng kê xuất hàng xe tuyến dạng board
 *
 * Hiển thị danh sách bảng kê xuất hàng xe tuyến, at the '/bang-ke/xuat-hang/xe-tuyen' route tab 2
 *
 */
const Page = ({
  className,
  cTables,
  setCTables,
  orders,
  onShowOrderModal,
  onEditCTableRecord,
  setReLoadCTables,
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

  let _handleFiltered = useCallback(() => {
    return cTables.filter((cTable) => {
      return (
        (filter.get("cTableId")
          ? cTable.get("code").includes(filter.get("cTableId"))
          : true) &&
        (filter.get("license_plate")
          ? cTable.get("license_plate").includes(filter.get("license_plate"))
          : true) &&
        (filter.get("trip_bus")
          ? cTable.get("trip_bus").includes(filter.get("trip_bus"))
          : true) &&
        (filter.get("route")
          ? cTable.getIn(["trip_route", "route_id"]) === filter.get("route")
          : true) &&
        (filter.get("time_start")
          ? cTable.get("time_start") === filter.get("time_start")
          : true) &&
        (filter.get("begin") && cTable.get("create_time")
          ? moment(cTable.get("create_time")).isBetween(
              moment(filter.get("begin").startOf("day")),
              moment(filter.get("finish").endOf("day"))
            )
          : true)
      );
    });
  }, [filter, cTables]);
  let filtered = _handleFiltered();
  // -----------------------

  return (
    <Row className={className} gutter={[16, 8]}>
      <Col xs={24}>
        <Filter filter={filter} setFilter={setFilter} />
      </Col>
      <Col xs={24}>
        <Main
          orders={orders}
          cTables={filtered}
          setCTables={setCTables}
          setReLoadCTables={setReLoadCTables}
          onShowOrderModal={onShowOrderModal}
          onEditCTableRecord={onEditCTableRecord}
        />
      </Col>
    </Row>
  );
};
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(Page)`
  margin-bottom: 0 !important;
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
