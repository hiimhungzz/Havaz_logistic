import React, { useCallback } from "react";
import { Row, Col, Button, Form, Select, Divider } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import TypeOfficeSelect from "components/Select/TypeOfficeSelect";
import ActiveSelect from "components/Select/ActiveSelect";
import _ from "lodash";

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
          onChange={(e) => {
            _changeQuery({ name: "name", value: e.target.value });
          }}
          placeholder={"Tên văn phòng"}
        />
      </Col>
      <Col xs={6}>
        <TypeOfficeSelect
          allowClear
          loadOnMount
          onChange={(data) => {
            _changeQuery({ name: "type", value: data ? data.value : 0 });
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
