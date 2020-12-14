import React, { useCallback } from "react";
import { Row, Col, DatePicker, Input } from "antd";
import styled from "styled-components";
import { OfficeStaffSelect } from "components";

import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
const { RangePicker } = DatePicker;

let inputTimer = null;

const Filter = ({ setParams, params }) => {
  const _changeQuery = useCallback(
    (payload) => {
      if (inputTimer) {
        clearTimeout(inputTimer);
      }
      inputTimer = setTimeout(() => {
        setParams((prevState) => {
          let nextState = { ...prevState };
          nextState[payload.name] = payload.value;
          return nextState;
        });
      }, 500);
    },
    [setParams]
  )

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={8}>
          <OfficeStaffSelect
            allowClear
            loadOnMount
            onChange={(data) => {
              setParams((prevState) => {
                let nextState = { ...prevState };
                nextState.hub_id = data ? data.value : null;
                return nextState;
              });
            }}
          />
        </Col>
        <Col xs={8}>
          <RangePicker
            value={[moment(params.day_from), moment(params.day_to)]}
            onChange={(dates) => {
              let startDate = dates && dates.length > 0 ? moment(dates[0].startOf("day")) : undefined;
              let endDate = dates && dates.length > 0 ? moment(dates[1].endOf("day")) : undefined;
              setParams((prevState) => {
                let nextState = { ...prevState };
                nextState.day_from = startDate;
                nextState.day_to = endDate;
                return nextState;
              });
            }}
            style={{ width: "100%" }}
            format={"DD-MM-YYYY"}
            ranges={{
              "Hôm nay": [moment(), moment()],
              "Tuần hiện tại": [
                moment().startOf("week"),
                moment().endOf("week"),
              ],
              "Tháng hiện tại": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
              "Tuần trước": [
                moment()
                  .add(-1, "weeks")
                  .startOf("week"),
                moment()
                  .add(-1, "weeks")
                  .endOf("week"),
              ],
              "Tháng trước": [
                moment()
                  .add(-1, "months")
                  .startOf("month"),
                moment()
                  .add(-1, "months")
                  .endOf("month"),
              ],
              "Tuần sau": [
                moment()
                  .add(1, "weeks")
                  .startOf("week"),
                moment()
                  .add(1, "weeks")
                  .endOf("week"),
              ],
              "Tháng sau": [
                moment()
                  .add(1, "months")
                  .startOf("month"),
                moment()
                  .add(1, "months")
                  .endOf("month"),
              ],
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
  padding: 1rem 1rem 0.5rem 1rem;
  .label {
    padding: 0px 0px 8px;
  }
`;
