import React, { useCallback } from "react";
import { Row, Col, Button, Form, Select, Divider } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import _ from "lodash";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
import ActiveSelect from "components/Select/ActiveSelect";

let inputTimer = null;
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
    <Row gutter={[16, 16]}>
      <Col xs={8}>
        <Input
          placeholder={"Mã vùng"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={8}>
        <Input
          placeholder={"Tên vùng"}
          onChange={(e) => {
            _changeQuery({ name: "name", value: e.target.value });
          }}
        />
      </Col>

    </Row>
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
