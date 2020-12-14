/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useEffect, memo } from "react";
import { Row, Col, Form, Divider, Select } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Label } from "components";
import _ from "lodash";
import { OfficeSelectByType } from "components";
import { browseTrip, browseRoute } from "containers/App/actions";
import {
  makeSelectTrip,
  makeSelectRoute,
  makeSelectProfile,
} from "containers/App/selectors";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
/*
 * Bộ lọc
 */
const Top = memo(
  ({ className, form, profile, trip, route, onBrowseTrip, onBrowseRoute, drivers, vehicles, exporting_id, modal }) => {
    const _handleChangeInput = useCallback(
      (inputName, inputValue) => {
        /**
         * Set dữ liệu vào form
         */
        form.setFieldsValue({ [inputName]: inputValue });
      },
      [form]
    );
    useEffect(() => {
      onBrowseTrip();
      onBrowseRoute();
    }, [onBrowseTrip, onBrowseRoute]);
    return (
      <div className={className}>
        <Row justify="end" gutter={[8, 8]}>
          <Col xs={24}>
            <Label>
              NV lập: <strong> {modal.get("staff_create")}</strong>
            </Label>
          </Col>
          <Col xs={24}>
            <Row gutter={8}>
              <Col md={6}>
                <Form.Item noStyle shouldUpdate={true}>
                  {({ getFieldValue }) => {
                    let filtered = _.map(drivers.toJS(), dr => ({ value: dr.id, label: dr.name }))
                    return (
                      <Form.Item name="driver">
                        <Select
                          onChange={async (data, driver) => {
                            if (exporting_id) {
                              let result = await ServiceBase.requestJson({
                                url: `/v1/transshipment/${exporting_id}/save-driver`,
                                method: "POST",
                                data: {
                                  driver_id: data
                                },
                              });
                              if (result.hasErrors) {
                                Ui.showError({ message: "Có lỗi thao tác" });
                              } else {

                              }
                            }
                          }}
                          options={filtered}
                          allowClear
                          value={getFieldValue("driver")}
                          showSearch
                          showArrow
                          placeholder="Chọn lái xe"
                          filterOption={(input, option) => {
                            return (
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                        />

                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item noStyle shouldUpdate={true}>
                  {({ getFieldValue }) => {
                    let filtered = _.map(vehicles.toJS(), ve => ({ value: ve.id, label: ve.bks }))
                    return (
                      <Form.Item name="vehicle">
                        <Select
                          onChange={async (data, car) => {
                            if (exporting_id) {
                              let result = await ServiceBase.requestJson({
                                url: `/v1/transshipment/${exporting_id}/save-car`,
                                method: "POST",
                                data: {
                                  car_id: data
                                },
                              });
                              if (result.hasErrors) {
                                Ui.showError({ message: "Có lỗi thao tác" });
                              } else {

                              }
                            }
                          }}
                          value={getFieldValue("vehicle")}
                          options={filtered}
                          allowClear
                          showSearch
                          showArrow
                          placeholder="Chọn xe"
                          filterOption={(input, option) => {
                            return (
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item 
                  noStyle shouldUpdate={true}>
                  {({ getFieldValue }) => {
                    return (
                      <Form.Item 
                      rules={[
                          {
                              required: true,
                              message: 'Hãy chọn văn phòng',
                          },
                      ]}
                      name="depot_destination">
                        <OfficeSelectByType
                          allowClear={true}
                          placeholder="Chọn VP đích"
                          typeSearch="local"
                          type={1}
                          onChange={(e) => _handleChangeInput(e, "depot_destination")}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
);
Top.propTypes = {
  className: PropTypes.any,
};
const mapDispatchToProps = (dispatch) => {
  return {
    onBrowseTrip: () => dispatch(browseTrip()),
    onBrowseRoute: () => dispatch(browseRoute()),
  };
};
const mapStateToProps = createStructuredSelector({
  trip: makeSelectTrip(),
  route: makeSelectRoute(),
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
export default withConnect(styled(Top)``);
