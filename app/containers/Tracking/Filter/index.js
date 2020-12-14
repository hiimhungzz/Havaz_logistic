/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Row, Col, Select, Button, DatePicker } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { DefineInput, DefineSelect, Input } from "components";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { TEMP_BODY } from "../constants";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash"
const { RangePicker } = DatePicker;
/*
 * Bộ lọc
 */
var fnTimeOut;
const Filter = ({ className, params, setParams, definitions }) => {
  let { order_statuses } = definitions.toJS()
  let orderStatus = _.map(order_statuses, (value, k) => {
    return value
  })
  const format = "YYYY-MM-DD";
  const searchTimeOut = function (value, key) {
    window.clearTimeout(fnTimeOut);
    fnTimeOut = window.setTimeout(function () {
      if (key) {
        queryFillter(value, key);
      }
    }, 800);
  };
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
  const _clearFilter = useCallback(() => {
    setParams(TEMP_BODY);
    setOrderCode(undefined)
    setSender_phone(undefined)
    setReceiver_phone(undefined)
  }, [setParams]);
  const [orderCode, setOrderCode] = useState(params['filterBy[id]']);
  const [sender_phone, setSender_phone] = useState(params['filterBy[sender_phone]']);
  const [receiver_phone, setReceiver_phone] = useState(params['filterBy[receiver_phone]']);
  return (

    < div className={className} >
      <Row gutter={[8, 8]}>
        <Col xs={4}>
          <DefineInput
            value={orderCode}
            placeholder="Mã đơn hàng"
            change={(e) => {
              let { value } = e.target;
              setOrderCode(value)
              searchTimeOut(value, 'filterBy[id]');
            }}
          />
        </Col>
        <Col xs={4}>
          <DefineSelect
            placeholder="Chọn trạng thái"
            search={
              (e) => {
                searchTimeOut(e)
              }
            }
            change={(e) => {
              queryFillter(e, 'filterBy[status]')
            }
            }
            dataBin={orderStatus}
            value={params['filterBy[status]']}
          />
        </Col>
        <Col xs={4}>
          <DefineInput
            value={receiver_phone}
            placeholder="SĐT người nhận"
            change={(e) => {
              let { value } = e.target;
              setReceiver_phone(value)
              searchTimeOut(value, 'filterBy[receiver_phone]');
            }}
          />
        </Col>
        <Col xs={4}>
          <DefineInput
            value={sender_phone}
            placeholder="SĐT người gửi"
            change={(e) => {
              let { value } = e.target;
              setSender_phone(value)
              searchTimeOut(value, 'filterBy[sender_phone]');
            }}
          />
        </Col>
        
        <Col span={6}>
          <DatePicker 
            onChange={(e, v)=>{
              queryFillter(v, 'filterBy[create_date]')
            }}
            value={params['filterBy[create_date]'] ? moment(params['filterBy[create_date]']) : null}  
          />
        </Col>
        <Col span={2} style={{paddingLeft: '0px', marginLeft: '-11px'}}>
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
`;
