import React, { useCallback } from "react";
import { Row, Col, Button, Form, Select, Divider } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import _ from "lodash";
import ActiveSelect from "components/Select/ActiveSelect";
let timer1 = null;
const Filter = ({ className, setParams }) => {
  const _changeQuery = useCallback(
    (payload) => {
      if (timer1) {
        clearTimeout(timer1);
      }
      timer1 = setTimeout(() => {
        setParams((prevState) => {
          let nextState = { ...prevState };
          nextState[payload.name] = payload.value;
          console.log("nextState", nextState);
          return nextState;
        });
      }, 500);
    },
    [setParams]
  );
  return (
    <Row gutter={[16, 16]}>
      <Col xs={6}>
        <Input
          placeholder={"Nhập biển kiểm soát"}
          onChange={(e) => {
            _changeQuery({ name: "bks", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <Input
          placeholder={"Nhập số điện thoại"}
          onChange={(e) => {
            _changeQuery({ name: "phone", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <ActiveSelect
          onSelect={(value) => {
            _changeQuery({ name: "active", value });
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
