/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useEffect, memo } from "react";
import { Row, Col, Radio, Divider, Form, Input } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Label } from "components";
import _ from "lodash";
import {
  makeSelectTrip,
  makeSelectRoute,
  makeSelectProfile,
} from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

/*
 * Bộ lọc
 */
const Top = memo(({ className, form, type, setType, profile }) => {
  const _handleChangeInput = useCallback(
    (inputName, inputValue) => {
      /**
       * Set dữ liệu vào form
       */
      setType((type) => type.set(inputName, inputValue));
    },
    [setType]
  );
  return (
    <div className={className}>
      <Row justify="end" gutter={[8, 8]}>
        <Col xs={24}>
          <Label>
            NV lập: <strong>{_.get(profile, "name", "")}</strong>
          </Label>
        </Col>
        <Col xs={24}>
          <Row gutter={8}>
            {/* <Col md={24}>
              <Form.Item noStyle shouldUpdate={true}>
                {({ getFieldValue }) => {
                  return (
                    <Form.Item style={{ marginBottom: 0 }} name="type">
                      <Radio.Group
                        onChange={(type) =>
                          _handleChangeInput("type", type.target.value)
                        }
                        value={type.get("type")}
                      >
                        <Radio value={1}>Số bảng kê xuất xe tuyến</Radio>
                        <Radio value={2}>Số bảng kê xuất trung chuyển</Radio>
                      </Radio.Group>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col> */}
            <Col md={6}>
              <Input
                onChange={(cTableId) =>
                  _handleChangeInput("cTableId", cTableId.target.value)
                }
                value={type.get("cTableId")}
              />
            </Col>

            <Col md={24}>
              <Divider style={{ margin: "5px 0" }} type="horizontal" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
});
Top.propTypes = {
  className: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  trip: makeSelectTrip(),
  route: makeSelectRoute(),
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default withConnect(styled(Top)``);
