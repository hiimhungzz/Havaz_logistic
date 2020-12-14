import React, { useCallback, memo } from "react";
import { Row, Col, Form, Input, Select } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Label } from "components";
import _ from "lodash";
import { OfficeStaffSelect } from "components";
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
const Top = memo(({ className, form, profile, trip, route }) => {
  const _handleChangeInput = useCallback(
    (inputName, inputValue) => {
      /**
       * Set dữ liệu vào form
       */
      let fields =
        inputName === "route"
          ? {
              trip_a: undefined,
              trip_b: undefined,
              [inputName]: inputValue,
            }
          : { [inputName]: inputValue };
      form.setFieldsValue(fields);
    },
    [form]
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
            <Col md={6}>
              <Form.Item name="route">
                <Select
                  allowClear={true}
                  showSearch
                  showArrow
                  placeholder="Chọn lái xe"
                  onChange={(route) => _handleChangeInput("route", route)}
                  filterOption={(input, option) => {
                    return (
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  options={route.size > 0 ? route.toList().toJS() : []}
                />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item name="route">
                <Input placeholder="Chọn BKS"/>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        {/* <Col xs={24}>
          <Row gutter={8}>
            <Col md={6}>
              <Form.Item name="route">
                <Select
                  allowClear={true}
                  showSearch
                  showArrow
                  placeholder="Chọn tuyến"
                  onChange={(route) => _handleChangeInput("route", route)}
                  filterOption={(input, option) => {
                    return (
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  options={route.size > 0 ? route.toList().toJS() : []}
                />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item noStyle shouldUpdate={true}>
                {({ getFieldValue }) => {
                  let filtered = _.filter(
                    trip.get("A"),
                    (trip) =>
                      getFieldValue("route") &&
                      trip.route_id === getFieldValue("route")
                  );
                  return (
                    <Form.Item name="trip_a">
                      <Select
                        allowClear
                        disabled={
                          getFieldValue("trip_b") || !getFieldValue("route")
                        }
                        value={getFieldValue("trip_a")}
                        showSearch
                        showArrow
                        placeholder="Chọn chuyến chiều A"
                        filterOption={(input, option) => {
                          return (
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {_.map(filtered, (trip, tripId) => {
                          return (
                            <Select.Option
                              style={{ background: trip.background }}
                              key={tripId + trip.trip_id}
                              value={trip.trip_id}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "row",
                                }}
                              >
                                <div>{trip.time_run}</div>
                                <div>{trip.license_plate}</div>
                                <div>{trip.seats}</div>
                              </div>
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item noStyle shouldUpdate={true}>
                {({ getFieldValue }) => {
                  let filtered = _.filter(
                    trip.get("B"),
                    (trip) =>
                      getFieldValue("route") &&
                      trip.route_id === getFieldValue("route")
                  );
                  return (
                    <Form.Item name="trip_b">
                      <Select
                        disabled={
                          getFieldValue("trip_a") || !getFieldValue("route")
                        }
                        allowClear
                        showSearch
                        showArrow
                        placeholder="Chọn chuyến chiều B"
                        filterOption={(input, option) => {
                          return (
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {_.map(filtered, (trip, tripId) => {
                          return (
                            <Select.Option
                              style={{ background: trip.background }}
                              key={tripId + trip.trip_id}
                              value={trip.trip_id}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "row",
                                }}
                              >
                                <div>{trip.time_run}</div>
                                <div>{trip.license_plate}</div>
                                <div>{trip.seats}</div>
                              </div>
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item name="depot_destination">
                <OfficeStaffSelect
                  allowClear={true}
                  placeholder="Chọn VP đích"
                  typeSearch="local"
                  onChange={(e) => _handleChangeInput(e, "depot_destination")}
                />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Divider style={{ margin: "5px 0" }} type="horizontal" />
            </Col>
          </Row>
        </Col> */}
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
