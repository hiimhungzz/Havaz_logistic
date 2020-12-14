/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback } from "react";
import { Row, Col, Select } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input } from "components";
import { HourSelect, RangePicker } from "components";
import { momentRange } from "utils/helper";
import { createStructuredSelector } from "reselect";
import { makeSelectRoute } from "containers/App/selectors";
import { connect } from "react-redux";

/*
 * Bộ lọc
 */
const Filter = ({ className, filter, route, setFilter }) => {
  const _handleChangeFilter = useCallback(
    (value, name) => {
      if (name === "created_at") {
        if (value) {
          setFilter((prev) =>
            prev.update((x) => {
              x = x.set("begin", value[0]);
              x = x.set("finish", value[1]);
              return x;
            })
          );
        } else {
          setFilter((prev) =>
            prev.update((x) => {
              x = x.set("begin", undefined);
              x = x.set("finish", undefined);
              return x;
            })
          );
        }
        return;
      }
      setFilter((prev) => prev.set(name, value));
    },
    [setFilter]
  );

  return (
    <div className={className}>
      <Row gutter={[8, 8]}>
        <Col xs={4}>
          <Input
            value={filter.get("cTableId")}
            onChange={(e) => _handleChangeFilter(e.target.value, "cTableId")}
            placeholder="Tìm mã bảng kê"
          />
        </Col>
        {/* <Col xs={4}>
          <Input
            value={filter.get("license_plate")}
            onChange={(e) =>
              _handleChangeFilter(e.target.value, "license_plate")
            }
            placeholder="Tìm BKS"
          />
        </Col> */}
        <Col xs={4}>
          <Select
            style={{ width: "100%" }}
            allowClear={true}
            showSearch
            showArrow
            placeholder="Chọn tuyến"
            onChange={(route) => _handleChangeFilter(route, "route")}
            filterOption={(input, option) => {
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            options={route.size > 0 ? route.toList().toJS() : []}
          />
        </Col>
        <Col xs={5}>
          <HourSelect
            value={filter.get("time_start")}
            onChange={(e) => _handleChangeFilter(e, "time_start")}
            placeholder="Chọn giờ xuất bến"
          />
        </Col>
        <Col xs={7}>
          <RangePicker
            format={['DD-MM-YYYY', 'DD-MM-YYYY']}
            ranges={momentRange}
            value={[filter.get("begin"), filter.get("finish")]}
            onChange={(e) => _handleChangeFilter(e, "created_at")}
          />
        </Col>
      </Row>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  route: makeSelectRoute(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default withConnect(styled(Filter)`
  padding-top: 10px;
`);
