import React, { useCallback } from "react";
import { Row, Col, Button, Form, Select, Divider } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import _ from "lodash";
import GroupCustomerSelect from "components/Select/GroupCustomerSelect";

const { Option } = Select;

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
          placeholder={"Mã khách hàng"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <Input
          placeholder={"Tên khách hàng"}
          onChange={(e) => {
            _changeQuery({ name: "name", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <GroupCustomerSelect
          allowClear
          loadOnMount
          onChange={(data) => {
            _changeQuery({
              name: "group_id",
              value: data ? data.value : "",
            });
          }}
        />
      </Col>
      <Col xs={6}>
        <Input
          placeholder={"SĐT"}
          onChange={(e) => {
            _changeQuery({ name: "phone", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <Select
          onChange={(data) => {
            _changeQuery({ name: "use_logis", value: data });
          }}
          defaultValue={1} style={{ width: '100%' }}>
          <Option value={1}>Khách hàng doanh nghiệp</Option>
          <Option value={null}>Tất cả</Option>
        </Select>
      </Col>
      {/* <Col xs={6}>
        <Input
          placeholder={"Tỉnh"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={6}>
        <Input
          placeholder={"Địa chỉ"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col> */}
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
