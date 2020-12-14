/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input } from "components";
import { HourSelect, RangePicker } from "components";
import { momentRange } from "utils/helper";
import moment from 'moment';
/*
 * Bộ lọc
 */
const Filter = ({ className, filter, setFilter, setParams, params }) => {
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
        {/* <Col xs={6}>
          <Input
            value={filter.get("cTableId")}
            onChange={(e) => _handleChangeFilter(e.target.value, "cTableId")}
            placeholder="Tìm mã bảng kê"
          />
        </Col> */}
        {/* <Col xs={4}>
          <Input
            value={filter.get("license_plate")}
            onChange={(e) =>
              _handleChangeFilter(e.target.value, "license_plate")
            }
            placeholder="Tìm BKS"
          />
        </Col> */}
        {/* <Col xs={5}>
          <HourSelect
            value={filter.get("time_start")}
            onChange={(e) => _handleChangeFilter(e, "time_start")}
            placeholder="Chọn giờ xuất bến"
          />
        </Col> */}
        <Col xs={9}>
          <RangePicker
            format={['DD-MM-YYYY', 'DD-MM-YYYY']}
            ranges={momentRange}
            value={[moment(params.begin), moment(params.finish)]}
            onChange={(dates) => {
              let startDate = dates && dates.length > 0 ? moment(dates[0].startOf("day")) : undefined;
              let endDate = dates && dates.length > 0 ? moment(dates[1].endOf("day")) : undefined;
              setParams((prevState) => {
                let nextState = { ...prevState };
                nextState.begin = startDate;
                nextState.finish = endDate;
                return nextState;
              });
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
Filter.propTypes = {
  className: PropTypes.any,
};
export default styled(Filter)`
  padding-top:10px;
`;
