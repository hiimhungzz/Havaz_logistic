/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, memo, useState, useEffect } from "react";
import { Row, Col, Form, Divider, Select } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Label } from "components";
import _ from "lodash";
import { OfficeSelectByType } from "components";
import {
  makeSelectTrip,
  makeSelectRoute,
  makeSelectProfile,
} from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";
import { normalize, schema } from "normalizr";
import { Map, fromJS } from "immutable";

/*
 * Bộ lọc
 */
const Top = memo(({ className, form, profile, route, onSelectTrip, onRefreshListRouterCheck, modal, isCreateDone }) => {
  console.log("", modal);
  const [trip, setTrip] = useState(Map({}))
  const _handleChangeInput = useCallback(
    (inputName, inputValue) => {
      onRefreshListRouterCheck()
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

  const getTrip = useCallback(async () => {
    let result = await ServiceBase.requestJson({
      url: "v1/common/trips",
      baseUrl: API_BASE_URL,
      method: "GET",
      data: {
        init_shipment: 1,
      }
    });
    if (result.hasErrors) {
      Ui.showError({
        message: `Có lấy danh sách chuyến`,
      });
    } else {
      let A = [];
      let B = [];
      _.forEach(result.value.data, (trip) => {
        const drivers = trip.drivers.map((item, index) => `${index === 0 ? '' : ', '}${item.name}`)
        let itemPush = {
          trip_id: trip.trip_id,
          route_id: trip.route_id,
          day: trip.day,
          seats: `${trip.occupy_seats}/${trip.seats}`,
          time_run: `${trip.time_run} - ${trip.time_run}`,
          not_code: `${trip.not_code}`,
          background: trip.trip_service.color,
          license_plate: trip.trip_bus?.license_plate,
          drivers: drivers,
        };
        if (trip.direction === 1) {
          A.push(itemPush);
        } else {
          B.push(itemPush);
        }
      });
      const tripSchema = new schema.Object({
        A: new schema.Array(
          new schema.Entity("A", {}, { idAttribute: "trip_id" })
        ),
        B: new schema.Array(
          new schema.Entity("B", {}, { idAttribute: "trip_id" })
        ),
      });
      const normalizedTripData = normalize({ A, B }, tripSchema);
      setTrip(Map(normalizedTripData.entities))
    }
  })

  useEffect(() => {
    getTrip()
  }, [])

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
            <Col md={4}>
              <Form.Item name="route">
                <Select
                  disabled={isCreateDone || modal.get("isEdit")}
                  allowClear={true}
                  showSearch
                  showArrow
                  placeholder="Chọn tuyến"
                  onChange={(route) => _handleChangeInput("route", route)}
                  filterOption={(input, option) => {
                    return (
                      option.label
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  options={route.size > 0 ? route.toList().toJS() : []}
                />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item noStyle shouldUpdate={true}>
                {({ getFieldValue }) => {
                  let filtered = _.filter(
                    trip.get("A"),
                    (trip) =>
                      getFieldValue("route") ? trip.route_id === getFieldValue("route") : trip
                  );
                  return (
                    <Form.Item name="trip_a">
                      <Select
                        disabled
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        onChange={(id) => {
                          form.setFieldsValue({
                            'trip_b': undefined,
                          })
                          onSelectTrip(id)
                        }}
                        allowClear
                        showSearch
                        showArrow
                        placeholder="Chọn chuyến chiều A"
                        filterOption={(input, option) => {
                          try {
                            return (
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          } catch (error) {

                          }
                        }}
                      >
                        {_.map(filtered, (trip, tripId) => {
                          return (
                            <Select.Option

                              style={{ background: trip.background }}
                              key={tripId + trip.trip_id}
                              value={trip.trip_id}
                              label={`${trip.time_run} - ${trip.license_plate}`}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "row",
                                }}
                              >
                                <div >{trip.time_run}</div>
                                <div >{trip.day}</div>
                                <div >{trip.not_code}</div>
                                <div >{trip.license_plate}</div>
                                <div >{trip.seats}</div>
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
            <Col md={8}>
              <Form.Item noStyle shouldUpdate={true}>
                {({ getFieldValue }) => {
                  let filtered = _.filter(
                    trip.get("B"),
                    (trip) =>
                      getFieldValue("route") ? trip.route_id === getFieldValue("route") : trip
                  );
                  return (
                    <Form.Item name="trip_b">
                      <Select
                        disabled
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 500 }}
                        onChange={(id) => {
                          form.setFieldsValue({
                            'trip_a': undefined,
                          })
                          onSelectTrip(id)
                        }}
                        allowClear
                        showSearch
                        showArrow
                        placeholder="Chọn chuyến chiều B"
                        filterOption={(input, option) => {
                          try {
                            return (
                              option.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          } catch (error) {

                          }
                        }}
                      >
                        {_.map(filtered, (trip, tripId) => {
                          return (
                            <Select.Option
                              style={{ background: trip.background }}
                              key={tripId + trip.trip_id}
                              value={trip.trip_id}
                              label={`${trip.time_run} - ${trip.license_plate}`}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "row",
                                }}
                              >
                                <div >{trip.time_run}</div>
                                <div >{trip.day}</div>
                                <div >{trip.not_code}</div>
                                <div >{trip.license_plate}</div>
                                <div >{trip.seats}</div>
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
            <Col md={4}>
              <Form.Item name="depot_destination">
                <OfficeSelectByType
                  disabled={isCreateDone || modal.get("isEdit")}
                  allowClear={true}
                  placeholder="Chọn VP đích"
                  typeSearch="local"
                  type={2}
                  // onChange={(e) => _handleChangeInput(e, "depot_destination")}
                  onChange={(e) => {
                    form.setFieldsValue({
                      'depot_destination': e,
                    });
                  }}
                />
              </Form.Item>
            </Col>
            {/* <Col md={24}>
              <Divider style={{ margin: "5px 0" }} type="horizontal" />
            </Col> */}
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
export default withConnect(styled(Top)`

.ant-select-dropdown {
  width: 5000px !important;
  overflow-y: visible !important;
}

`);
