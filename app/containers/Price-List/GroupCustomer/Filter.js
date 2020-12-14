import { Col, Row } from "antd";
import { Input } from "components";
import BillSelect from "components/Select/BillSelect";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";

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
          placeholder={"Mã nhóm khách hàng"}
          onChange={(e) => {
            _changeQuery({ name: "code", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={8}>
        <Input
          placeholder={"Tên nhóm khách hàng"}
          onChange={(e) => {
            _changeQuery({ name: "name", value: e.target.value });
          }}
        />
      </Col>
      <Col xs={8}>
        <BillSelect
          allowClear
          loadOnMount
          onChange={(data) => {
            _changeQuery({
              name: "price_title_id",
              value: data ? data.value : 0,
            });
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
