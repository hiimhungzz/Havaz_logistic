import { Col, DatePicker, Row } from "antd";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";

const Filter = memo(({ setParams, params }) => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <DatePicker
            allowClear={false}
            onChange={(date) => {
              setParams((prevState) => {
                let nextState = { ...prevState };
                nextState.day = date;
                return nextState;
              });
            }}
            style={{ width: '100%' }}
            value={params.day}
            format={'DD-MM-YYYY'}
          />
        </Col>
      </Row>
    </div>
  );
}
);
Filter.propTypes = {
  className: PropTypes.any,
};
export default styled(Filter)`
  padding: 1rem 1rem 0.5rem 1rem;
  .label {
    padding: 0px 0px 8px;
  }
`;
