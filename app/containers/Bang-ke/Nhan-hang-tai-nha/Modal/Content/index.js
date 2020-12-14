/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { Row, Col, Button } from "antd";
import { Input, OfficeStaffSelect } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import Top from "./Top";
import {
  RightOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons";
import Left from "./Left";
import Right from "./Right";
import { Map } from "immutable";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import moment from "moment";
import { Ui } from "utils/Ui";

let leftDelay = 800;
let leftTimer = null;
let rightTimer = null;
/*
 * Thêm / Sửa Bảng kê xuất hàng xe tuyến
 */
const Modal = ({ className, definitions, form, modal, setOrders }) => {
  const [leftSearch, setLeftSearch] = useState({ office: undefined, id: "" });
  const [leftSelectedRowKeys, setLeftSelectedRowKeys] = useState([]);
  const [rightSelectedRowKeys, setRightSelectedRowKeys] = useState([]);

  const [moveLeftLoading, setMoveLeftLoading] = useState(false);
  const [moveRightLoading, setMoveRightLoading] = useState(false);

  const [leftDataSource, setLeftDataSource] = useState(
    Map({
      raw: [],
      filters: [],
      filtered: [],
    })
  );
  const [rightDataSource, setRightDataSource] = useState(
    Map({
      raw: [],
      filters: [],
    })
  );

  // Handles

  /*
   * Handler đọc bảng kê
   */
  const _handleRead = useCallback(
    async (cTableId) => {
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `/v1/exportings/${cTableId}?scope=should_exported`,
        method: "GET",
      });
      if (result && result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi đọc bảng kê." });
      } else {
        setRightDataSource((prev) =>
          prev.set(
            "raw",
            _.map(result.value.data.orders, (order, orderId) => {
              return {
                stt: orderId + 1,
                id: order.code,
                destination: order.destination?.name,
                receiver_address: order.receiver?.address,
                receiver_name: order.receiver?.name,
                receiver_phone: order.receiver?.phone,
                sender_name: order.sender?.name,
                sender_address: order.sender?.address,
                sender_phone: order.sender?.phone,
                num_of_package: order.num_of_package,
                order_fee: order.order_fee,
                order_cod: order.order_cod,
                create_time: moment(order.created_at).format(
                  DATE_TIME_FORMAT.DD_MM_YYYY
                ),
                status: order.status,
                payment_type: order.payment_type,
              };
            })
          )
        );
        form.setFieldsValue({
          route: result.value.data.trip_route.route_id,
          depot_destination: {
            key: result.value.data.destination.id,
            label: result.value.data.destination.name,
          },
          trip: result.value.data.trip_route.tripId,
          driver: result.value.data.driver,
          driver_phone: result.value.data.driver_phone,
          code: result.value.data.code,
        });
      }
    },
    [form]
  );
  /*
   * Handler tìm kiếm left table
   */
  const _handleSearch = useCallback(
    (inputValue, inputName) => {
      leftDelay = 800;
      setLeftSearch((prev) => {
        let next = { ...prev };
        if (inputName === "office") {
          next["destination"] = inputValue?.label;
        }
        next[inputName] = inputValue;
        return next;
      });
    },
    [setLeftSearch]
  );
  /*
   * Handler chuyển order từ bảng bên trái sang bảng bên phải
   */
  const _handleMoveToRight = useCallback(() => {
    leftDelay = 0;
    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let left = [];
    _.forEach(leftData, (x) => {
      if (leftSelectedRowKeys.includes(x.id)) {
        moveData.push(x);
      } else {
        left.push(x);
      }
    });
    let right = [...rightData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setLeftSelectedRowKeys([]);
  }, [leftSelectedRowKeys, leftDataSource, rightDataSource]);

  /*
   * Handler chuyển order từ bảng bên phải sang bảng bên trái
   */
  const _handleMoveToLeft = useCallback(() => {
    leftDelay = 0;
    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let right = [];
    _.forEach(rightData, (x) => {
      if (rightSelectedRowKeys.includes(x.id)) {
        moveData.push(x);
      } else {
        right.push(x);
      }
    });
    let left = [...leftData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setRightSelectedRowKeys([]);
  }, [leftDataSource, rightSelectedRowKeys, rightDataSource]);
  /*
   * Handler move all {to}
   */
  const _handleMoveAll = useCallback(
    (to) => {
      if (to === "right") {
        let left = leftDataSource.get("raw");
        setMoveRightLoading(true);
        setRightDataSource((prev) => {
          let next = prev;
          next = next.set("raw", [...prev.get("raw"), ...left]);
          let officeFilter = _.map(
            _.keysIn(_.groupBy(next.get("raw"), (x) => x.destination)),
            (item) => {
              return {
                text: item,
                value: item,
              };
            }
          );
          next = next.set("filters", officeFilter);
          return next;
        });
        setLeftDataSource((prev) => {
          let next = prev;
          next = next.set("raw", []);
          next = next.set("filtered", []);
          next = next.set("filters", []);
          return next;
        });
        setLeftSelectedRowKeys([]);
        setTimeout(() => {
          setMoveRightLoading(false);
        }, [500]);
      }
      if (to === "left") {
        let right = rightDataSource.get("raw");
        setMoveLeftLoading(true);
        leftDelay = 0;
        setLeftDataSource((prev) => {
          let next = prev;
          next = next.set("raw", [...prev.get("raw"), ...right]);
          return next;
        });
        setRightDataSource((prev) => {
          let next = prev;
          next = next.set("raw", []);
          next = next.set("filters", []);
          return next;
        });

        setRightSelectedRowKeys([]);
        setTimeout(() => {
          setMoveLeftLoading(false);
        }, [500]);
      }
    },
    [leftDataSource, rightDataSource]
  );
  const _handleLoadLeftData = useCallback(async () => {
    leftDelay = 0;
    setMoveLeftLoading(true);
    let result = await ServiceBase.requestJson({
      baseUrl: API_BASE_URL,
      url: "/v1/orders",
      method: "GET",
      data: {
        scope: "should_exported",
      },
    });
    if (result.hasErrors) {
      Ui.showError({ message: "Có lỗi xảy ra khi lấy danh sách đơn hàng." });
    } else {
      setLeftDataSource((prev) =>
        prev.set(
          "raw",
          _.map(result.value.data, (item) => {
            return {
              id: item.id,
              num_of_package: item.num_of_package,
              destination: item.destination?.name,
              destinationId: item.destination?.id,
              order_fee: item.order_fee,
              receiver_address: item.receiver?.address,
              receiver_name: item.receiver?.name,
              sender_address: item.sender?.address,
              sender_name: item.sender?.name,
              order_cod: item.order_cod,
              payment_type: item.payment_type,
              status: item.status,
            };
          })
        )
      );
    }
    setMoveLeftLoading(false);
  }, []);

  // Evens
  const leftRaw = leftDataSource.get("raw");
  useLayoutEffect(() => {
    // Delay 800ms sau khi gõ seach
    clearTimeout(leftTimer);
    leftTimer = setTimeout(() => {
      // Lọc dữ liệu theo {search}
      let filter = _.pickBy(leftSearch, (x) => !_.isEmpty(x) && !_.isObject(x));
      let filterResult = _.sortBy(
        _.filter(leftRaw, (x) => {
          let chain = {
            false: false,
          };
          _.forEach(_.keysIn(filter), (f) => {
            if (x[f].includes(filter[f])) {
              chain["true"] = true;
            } else {
              chain["false"] = true;
            }
          });
          return !chain["false"];
        }),
        ["id"]
      );
      let officeFilter = _.map(
        _.keysIn(_.groupBy(filterResult, (x) => x.destination)),
        (item) => {
          return {
            text: item,
            value: item,
          };
        }
      );
      setLeftDataSource((prev) => {
        let next = prev;
        next = next.set("filtered", filterResult);
        next = next.set("filters", officeFilter);
        return next;
      });
    }, leftDelay);
    return () => {
      clearTimeout(leftTimer);
    };
  }, [leftSearch, leftRaw]);
  useEffect(() => {
    clearTimeout(rightTimer);
    rightTimer = setTimeout(() => {
      setOrders(rightDataSource.get("raw"));
    }, 300);
  }, [rightDataSource, setOrders]);
  useLayoutEffect(() => {
    _handleLoadLeftData();
  }, [_handleLoadLeftData]);
  useLayoutEffect(() => {
    if (modal.get("isEdit")) {
      _handleRead(modal.get("cTableId"));
    }
  }, [_handleRead, modal]);
  // -----------------------

  return (
    <Row className={className}>
      <Col xs={24}>
        <Top form={form} />
      </Col>
      <Col xs={24}>
        <div className="Modal-content">
          <div className="left">
            <Row className="left-content" justify="space-between" gutter={8}>
              <Col span={10} className="d-flex align-items-center">
                <h3 className="mb-0">Danh sách hàng tồn xuất</h3>
              </Col>
              <Col span={7}>
                <OfficeStaffSelect
                  allowClear={true}
                  style={{ width: "100%" }}
                  value={leftSearch.office}
                  placeholder="Chọn VP đích"
                  typeSearch="local"
                  onChange={(e) => _handleSearch(e, "office")}
                />
              </Col>
              {/* <Col span={7}>
                <Input
                  value={leftSearch.id}
                  placeholder="Nhập đơn hàng"
                  onChange={(e) => _handleSearch(e.target.value, "id")}
                />
              </Col> */}
            </Row>
            <Left
              payment_types={definitions.get("payment_types")}
              filters={leftDataSource.get("filters")}
              moveLoading={moveLeftLoading}
              dataSource={leftDataSource.get("filtered")}
              selectedRowKeys={leftSelectedRowKeys}
              setSelectedRowKeys={setLeftSelectedRowKeys}
            />
          </div>
          <div className="middle">
            <Row gutter={[0, 8]}>
              <Col style={{ textAlign: "center" }} xs={24}>
                <Button
                  title="Chọn đơn hàng ở cột bên trái để chuyển"
                  disabled={_.size(leftSelectedRowKeys) === 0}
                  type="primary"
                  icon={<RightOutlined />}
                  onClick={_handleMoveToRight}
                />
              </Col>
              <Col style={{ textAlign: "center" }} xs={24}>
                <Button
                  disabled={_.size(leftDataSource.get("raw")) === 0}
                  title="Chuyển tất cả đơn hàng"
                  type="danger"
                  icon={<DoubleRightOutlined />}
                  onClick={() => _handleMoveAll("right")}
                />
              </Col>
              <Col style={{ textAlign: "center" }} xs={24}>
                <Button
                  disabled={_.size(rightSelectedRowKeys) === 0}
                  type="primary"
                  icon={<LeftOutlined />}
                  onClick={_handleMoveToLeft}
                />
              </Col>
              <Col style={{ textAlign: "center" }} xs={24}>
                <Button
                  disabled={_.size(rightDataSource.get("raw")) === 0}
                  type="danger"
                  icon={<DoubleLeftOutlined />}
                  onClick={() => _handleMoveAll("left")}
                />
              </Col>
            </Row>
          </div>
          <div className="right">
            <div className="d-flex align-items-center right-title">
              <h3 className="mb-0">Danh sách đơn hàng trong bảng kê</h3>
            </div>
            <Right
              payment_types={definitions.get("payment_types")}
              filters={rightDataSource.get("filters")}
              moveLoading={moveRightLoading}
              dataSource={rightDataSource.get("raw")}
              selectedRowKeys={rightSelectedRowKeys}
              setSelectedRowKeys={setRightSelectedRowKeys}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};
Modal.propTypes = {
  className: PropTypes.any,
};
export default styled(Modal)`
  .Modal-content {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: calc(50% - 35px) 50px calc(50% - 35px);
    .middle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 70px;

      .ant-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      .right-title {
        flex: 0 0 40px;
      }
    }
    .left {
      display: flex;
      flex-direction: column;
      .left-content {
        flex: 0 0 40px;
      }
    }
  }
`;
