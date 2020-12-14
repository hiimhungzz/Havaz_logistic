import React, { useCallback } from "react";
import { Row, Col, Button, Form, Select, Divider, DatePicker } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import _ from "lodash";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
import moment from "moment";
const { RangePicker } = DatePicker;
let inputTimer = null;
const monthFormat = "YYYY/MM";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const Filter = ({ className, setParams }) => {
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
  );
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={10}>
          <RangePicker
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
