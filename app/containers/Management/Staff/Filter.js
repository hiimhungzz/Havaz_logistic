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
      <Col xs={6}>
        <Input
          placeholder={"Tên nhân viên"}
          onChange={(e) => {
            _changeQuery({ name: "name", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={3}>
        <Input
          placeholder={"Mã nhân viên"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <OfficeStaffSelect
          allowClear
          loadOnMount
          onChange={(data) => {
            _changeQuery({ name: "office_id", value: data ? data.value : 0 });
          }}
        />
      </Col>
      <Col xs={6}>
        <Input
          placeholder={"Số điện thoại"}
          onChange={(e) => {
            _changeQuery({ name: "phone", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={3}>
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
