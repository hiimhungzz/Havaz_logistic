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
import { RangePicker } from "components";
import { momentRange } from "utils/helper";

/*
 * Bộ lọc
 */
const Filter = ({ className, filter, setFilter }) => {
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
        <Col xs={9}>
          <RangePicker
            format={['MM-DD-YYYY', 'MM-DD-YYYY']}
            ranges={momentRange}
            value={[filter.get("begin"), filter.get("finish")]}
            onChange={(e) => _handleChangeFilter(e, "created_at")}
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
