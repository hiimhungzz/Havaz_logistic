/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Row, Col, Select, Button, DatePicker } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { DefineInput, DefineSelect, RangePicker, OfficeStaffSelect } from "components";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import _ from "lodash";
/*
 * Bộ lọc
 */
const Filter = ({ className, params, setParams, exportData }) => {
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
          nextState['from_date'] = value[0];
          nextState['to_date'] = value[1];
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
      <Row gutter={[16, 8]}>
        <Col span={8}>
          <RangePicker
            format={[format, format]}
            ranges={""}
            value={[params['from_date'], params['to_date']]}
            onChange={(e) => _handleChangeFilter(e)}
          />
        </Col>
        <Col span={6}>
          <OfficeStaffSelect
            placeholder="VP Nhận hàng"
            allowClear
            loadOnMount
            onChange={(data) => {
              setParams((prevState) => {
                let nextState = { ...prevState };
                nextState.received_hub_id = data ? data.value : null;
                return nextState;
              });
            }}
          />
        </Col>
        <Col span={10}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1, alignItems: 'center', paddingBottom: 10 }}>
            <Button onClick={exportData}>Xuất file</Button> &nbsp;
            <Button onClick={_clearFilter}>Xóa bộ lọc</Button>
          </div>
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
  .ant-row {
    margin-right: 5px !important;
    margin-left: 5px !important;
  }
`;
