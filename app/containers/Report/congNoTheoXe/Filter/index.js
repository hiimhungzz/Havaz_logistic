/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Row, Col, Select, Button, DatePicker } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { DefineInput, DefineSelect, RangePicker } from "components";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import _ from "lodash";
/*
 * Bộ lọc
 */
const Filter = ({ className, params, setParams, definitions }) => {
  const format = "DD-MM-YYYY";
  const queryFillter = useCallback(
    (value, name) => {
      setParams((props) => {
        let nextState = { ...props };
        nextState[name] = value;
        return nextState;
      });
    },
    [setParams]
  );
  const _handleChangeFilter = useCallback(
    (value, name) => {
        if (value) {
          setParams((props) => {
            let nextState = { ...props };
            nextState['startAt'] = value[0];
            nextState['endAt'] = value[1];
            return nextState;
          });
        }
    },
    [setParams]
  );
  const _clearFilter = useCallback(() => {
    setOrderCode(undefined)
  }, [setParams]);
  return (

    < div className={className} >
      <Row gutter={[8, 8]}>
        <Col span={10}>
          <RangePicker
            format={[format, format]}
            ranges={""}
            value={[params['startAt'], params['endAt']]}
            onChange={(e) => _handleChangeFilter(e)}
          />
        </Col>
        <Col span={6}>
            <DefineSelect
                placeholder="Chọn lái xe"
                dataBin={[]}
                disabled={false}
                change={(e) => {
                  queryFillter(e, 'vehicleId')
                }
                }
                value={params['vehicleId']}
            />
        </Col>
        <Col span={2} >
          <Button onClick={_clearFilter}>Xóa bộ lọc</Button>
        </Col>
      </Row>
    </div >
  );
};
Filter.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(Filter))`
  .ant-picker {
    width: 51%
  }
`;
