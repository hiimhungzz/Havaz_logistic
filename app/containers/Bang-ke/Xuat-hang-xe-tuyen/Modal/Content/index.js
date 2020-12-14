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
import { HourSelect, RangePicker } from "components";
import { momentRange } from "utils/helper";
import { Row, Col, Button, Form, Input } from "antd";
import { OfficeStaffSelect } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import Top from "./Top";
import {
  RightOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import Left from "./Left";
import Right from "./Right";
import { Map } from "immutable";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import moment from "moment";
import { Ui } from "utils/Ui";

function compareSmall(dateTimeA, dateTimeB) {
  var momentA = moment(dateTimeA, "DD/MM/YYYY");
  var momentB = moment(dateTimeB, "DD/MM/YYYY");
  if (momentA > momentB) return false;
  else if (momentA <= momentB) return true;
  else return true;
}

let leftDelay = 800;
let leftTimer = null;
let rightTimer = null;
let timer1 = null;
let timer2 = null;
/*
 * Thêm / Sửa Bảng kê xuất hàng xe tuyến
 */
const Modal = ({ className, definitions, modal, setOrders, setExportingId, exporting_id, setItemRead, setShowChot }) => {
  const [form] = Form.useForm();
  const [isCreateDone, setCreateDone] = useState(false);
  const [loaddingCreate, setLoaddingCreate] = useState(false);
  const [listRouter, setListRouter] = useState([])
  const [leftSearch, setLeftSearch] = useState({ office: undefined, id: "" });
  const [inputLeft, setInputLeft] = useState("")
  const [inputRight, setInputRight] = useState("")
  const [leftSelectedRowKeys, setLeftSelectedRowKeys] = useState([]);
  const [rightSelectedRowKeys, setRightSelectedRowKeys] = useState([]);

  const [moveLeftLoading, setMoveLeftLoading] = useState(false);
  const [moveRightLoading, setMoveRightLoading] = useState(false);
  const [searchOrder, setSearchOrder] = useState("");
  const [audioError] = useState(new Audio("https://soundoftext.nyc3.digitaloceanspaces.com/3ee53b00-f5b7-11e7-b289-2f4fa9c8406d.mp3"));
  const [audioSuccess] = useState(new Audio("https://soundoftext.nyc3.digitaloceanspaces.com/9850b900-f6fc-11ea-a817-e5cf1b56d23a.mp3"));
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
  const _handleCreate = useCallback(
    async (values) => {
      if (!_.get(values, "trip_a") && !_.get(values, "trip_b") || !values.depot_destination) {
        Ui.showWarning({ message: 'Vui lòng nhập dữ liệu' })
      } else {
        setLoaddingCreate(true)
        let param = {
          trip_id: _.get(values, "trip_a") || _.get(values, "trip_b"),
          status: 1,
          destination_id: _.get(values, "depot_destination.key", 2),
          total_orders: 0,
          note: "ghi chu",
          orders: [],
        };
        let url = "v1/exportings";
        let result = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: url,
          data: param,
          method: "POST",
        });
        if (result.hasErrors) {
          setLoaddingCreate(false)
          Ui.showError({
            message: `Có lỗi khi tạo mới bảng kê xe tuyến.`,
          });
        } else {
          setExportingId((prevState) => {
            let nextState = { ...prevState };
            nextState = result.value.exporting_id;
            return nextState;
          });
          setLoaddingCreate(false)
          setCreateDone(true)
          setShowChot(true)
        }
      }
    },
    []
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
                order_id: order.code,
                destination: order.destination?.name,
                depot_destination_name: order.destination?.name,
                source_name: order.source?.name,
                destination_id: order.destination?.id,
                destinationId: order.destination?.id,
                description: order.description,
                receiver_address: order.receiver?.address,
                receiver_name: order.receiver?.name,
                receiver_phone: order.receiver?.phone,
                sender_name: order.sender?.name,
                sender_address: order.sender?.address,
                sender_phone: order.sender?.phone,
                num_of_package: order.num_of_package,
                note: order.note,
                order_fee: order.order_fee,
                order_cod: order.order_cod,
                create_time: moment(order.created_at).format(
                  DATE_TIME_FORMAT.DD_MM_YYYY
                ),
                status: order.status,
                payment_type: order.payment_type,
                staff_create: order.staff_create,
                // 
                d_shipping_fee: order.d_shipping_fee,
                r_shipping_fee: order.r_shipping_fee,
                cod_fee: order.cod_fee,
                discount: order.discount
              };
            })
          )
        );
        const trip_id = result.value.data.trip_route && result.value.data.trip_route.trip_id;
        let result_journey = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: `v1/common/journey?trip_id=${trip_id}`,
          method: "GET",
          data: {
          },
        });
        setListRouter(result_journey.value.data)
        setItemRead({
          route: result.value.data.trip_route.route_id,
          trip_a: result.value.data.trip_route.direction === 1 ? result.value.data.trip_route.trip_id : null,
          trip_b: result.value.data.trip_route.direction === 2 ? result.value.data.trip_route.trip_id : null,
          depot_destination: {
            key: result.value.data.destination.id,
            label: result.value.data.destination.name,
          },
          trip: result.value.data.trip_route.tripId,
          driver: result.value.data.driver,
          driver_phone: result.value.data.driver_phone,
          code: result.value.data.code,
          staff_create: result.value.data.staff_create,
          create_time: result.value.data.create_time,
        })
        form.setFieldsValue({
          route: result.value.data.trip_route.route_id,
          trip_a: result.value.data.trip_route.direction === 1 ? result.value.data.trip_route.trip_id : null,
          trip_b: result.value.data.trip_route.direction === 2 ? result.value.data.trip_route.trip_id : null,
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
        // to do remove
        if (inputName === 'note') {
          next['id'] = inputValue;
        }
        return next;
      });
    },
    [setLeftSearch]
  );

  /*
   * Handler chuyển order từ bảng bên trái sang bảng bên phải
   */
  const _handleMoveToRight = useCallback(async () => {
    leftDelay = 0;
    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let left = [];
    for (const x of leftData) {
      if (leftSelectedRowKeys.includes(x.id)) {
        // Goi api trươc khi move sang
        let result = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/add-item`,
          data: {
            order_id: x.id
          },
          method: "POST",
        });
        if (result.value) {
          // Check VP đích có thuộc lộ trình không thì hiện cảnh báo
          const checkVp = listRouter.filter(trip => trip.id === x.destinationId)
          if (checkVp && checkVp.length === 0) {
            moveData.push({ ...x, color: 'warning' });
            // Ui.showWarning({ message: 'Văn phòng đích của đơn hàng không nằm trong lộ trình chuyến' })
          } else {
            moveData.push(x);
          }
        } else {
          left.push(x);
          Ui.showError({ message: `Có lỗi khi chuyển đơn hàng`, });
        }
      } else {
        left.push(x);
      }
    }
    let right = [...rightData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setLeftSelectedRowKeys([]);
  }, [leftSelectedRowKeys, leftDataSource, rightDataSource, exporting_id, listRouter]);

  // byScanner
  const _handleMoveToRightScanner = useCallback(async (idScanner) => {
    leftDelay = 0;

    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let left = [];
    setMoveLeftLoading(true);
    for (const x of leftData) {
      if (x.id === idScanner) {
        // Goi api trươc khi move sang
        let result = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/add-item`,
          data: {
            order_id: x.id
          },
          method: "POST",
        });
        if (result.value) {
          // Check VP đích có thuộc lộ trình không thì hiện cảnh báo
          const checkVp = listRouter.filter(trip => trip.id === x.destinationId)
          if (checkVp && checkVp.length === 0) {
            moveData.push({ ...x, color: 'warning' });
            Ui.showWarning({ message: 'Văn phòng đích của đơn hàng không nằm trong lộ trình chuyến' })
          } else {
            moveData.push(x);
          }
        } else {
          left.push(x);
          Ui.showError({ message: `Có lỗi khi chuyển đơn hàng`, });
        }
      } else {
        left.push(x);
      }
    }
    setMoveLeftLoading(false);
    let right = [...rightData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setInputLeft("")
  }, [leftDataSource, rightDataSource, exporting_id, listRouter]);

  const _handleMoveToLeftScanner = useCallback(async (idScannerRight) => {
    leftDelay = 0;
    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let right = [];
    setMoveRightLoading(true);
    for (const x of rightData) {
      if (x.id === idScannerRight) {
        let result = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/remove-item`,
          data: {
            order_id: x.id
          },
          method: "POST",
        });
        if (result.value) {
          moveData.push(x);
        } else {
          right.push(x);
          Ui.showError({ message: `Có lỗi khi chuyển đơn hàng`, });
        }
      } else {
        right.push(x);
      }
    }
    setMoveRightLoading(false);
    let left = [...leftData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setInputRight("")
  }, [leftDataSource, rightDataSource, exporting_id]);

  /*
   * Handler chuyển order từ bảng bên phải sang bảng bên trái
   */
  const _handleMoveToLeft = useCallback(async () => {
    leftDelay = 0;
    // Lấy data được select
    let leftData = leftDataSource.get("raw");
    let rightData = rightDataSource.get("raw");
    let moveData = [];
    let right = [];
    for (const x of rightData) {
      if (rightSelectedRowKeys.includes(x.id)) {
        let result = await ServiceBase.requestJson({
          baseUrl: API_BASE_URL,
          url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/remove-item`,
          data: {
            order_id: x.id
          },
          method: "POST",
        });
        if (result.value) {
          moveData.push(x);
        } else {
          right.push(x);
          Ui.showError({ message: `Có lỗi khi chuyển đơn hàng`, });
        }
      } else {
        right.push(x);
      }
    }
    let left = [...leftData, ...moveData];
    setLeftDataSource((prev) => prev.set("raw", left));
    setRightDataSource((prev) => prev.set("raw", right));
    setRightSelectedRowKeys([]);
  }, [leftDataSource, rightSelectedRowKeys, rightDataSource, exporting_id]);
  /*
   * Handler move all {to}
   */
  const _handleMoveAll = useCallback(
    async (to) => {
      if (to === "right") {
        setMoveRightLoading(true);
        let leftData = leftDataSource.get("raw");
        let rightData = rightDataSource.get("raw");
        let moveData = [];
        let left = [];
        for (const x of leftData) {
          // Goi api trươc khi move sang
          let result = await ServiceBase.requestJson({
            baseUrl: API_BASE_URL,
            url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/add-item`,
            data: {
              order_id: x.id
            },
            method: "POST",
          });
          if (result.value) {
            moveData.push(x);
            // Check VP đích có thuộc lộ trình không thì hiện cảnh báo
            const checkVp = listRouter.filter(trip => trip.id === x.destinationId)
            if (checkVp && checkVp.length === 0) {
              Ui.showWarning({ message: 'Văn phòng đích của đơn hàng không nằm trong lộ trình chuyến' })
            }
          } else {
            left.push(x);
            Ui.showError({ message: `Có lỗi khi chuyển đơn hàng ${x.id}`, });
          }
        }

        let right = [...rightData, ...moveData];
        setLeftDataSource((prev) => prev.set("raw", left));
        setRightDataSource((prev) => prev.set("raw", right));
        setLeftSelectedRowKeys([]);
        setTimeout(() => {
          setMoveRightLoading(false);
        }, [500]);
      }
      if (to === "left") {
        setMoveLeftLoading(true);
        let leftData = leftDataSource.get("raw");
        let rightData = rightDataSource.get("raw");
        let moveData = [];
        let right = [];
        for (const x of rightData) {
          let result = await ServiceBase.requestJson({
            baseUrl: API_BASE_URL,
            url: `v1/exportings/${modal.get("isEdit") ? modal.get("cTableId") : exporting_id}/remove-item`,
            data: {
              order_id: x.id
            },
            method: "POST",
          });
          if (result.value) {
            moveData.push(x);
          } else {
            right.push(x);
            Ui.showError({ message: `Có lỗi khi chuyển đơn hàng ${x.id}`, });
          }
        }
        let left = [...leftData, ...moveData];
        setLeftDataSource((prev) => prev.set("raw", left));
        setRightDataSource((prev) => prev.set("raw", right));
        setRightSelectedRowKeys([]);
        setTimeout(() => {
          setMoveLeftLoading(false);
        }, [500]);
      }
    },
    [leftDataSource, rightDataSource, exporting_id]
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
        page: 1,
        per_page: 10000,
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
              note: item.note,
              id: item.id,
              num_of_package: item.num_of_package,
              destination: item.destination?.name,
              destination_id: item.destination?.id,
              destinationId: item.destination?.id,
              order_fee: item.order_fee,
              description: item.description,
              receiver_address: item.receiver?.address,
              receiver_name: item.receiver?.name,
              receiver_phone: item.receiver?.phone,
              sender_address: item.sender?.address,
              sender_name: item.sender?.name,
              order_cod: item.order_cod,
              payment_type: item.payment_type,
              status: item.status,
              create_time: moment(item.created_at).format(
                DATE_TIME_FORMAT.DD_MM_YYYY
              ),
              // 
              d_shipping_fee: item.d_shipping_fee,
              r_shipping_fee: item.r_shipping_fee,
              cod_fee: item.cod_fee,
              discount: item.discount,
              staff_create: item.staff_create,
            };
          })
        )
      );
    }
    setMoveLeftLoading(false);
  }, []);

  const onSelectTrip = useCallback(async (id) => {
    if (id) {
      setMoveLeftLoading(true);
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `v1/common/journey?trip_id=${id}`,
        method: "GET",
        data: {
        },
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi xảy ra khi chọn chiều" });
      } else {
        setMoveLeftLoading(false);
        const routerList = result.value.data
        setListRouter(routerList)
        if (routerList.length > 0) {
          form.setFieldsValue({
            depot_destination: {
              key: routerList[routerList.length - 1].id,
              label: routerList[routerList.length - 1].name,
            },
          });
        }

      }
      setMoveLeftLoading(false);
    }

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
    <Form
      form={form}
      onFinish={_handleCreate}
    >
      <Row className={className}>
        <Col xs={24}>
          <Top
            isCreateDone={isCreateDone}
            modal={modal}
            form={form}
            onSelectTrip={onSelectTrip}
            onRefreshListRouterCheck={() => {
              setListRouter([])
            }} />
          {
            !modal.get("isEdit") ? (
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Button disabled={isCreateDone} loading={loaddingCreate} type="primary" htmlType="submit">Tạo bảng kê</Button>
              </div>
            ) : null
          }

        </Col>
        {
          isCreateDone || modal.get("isEdit") ? (
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
                    <Col span={7}>
                      <Input
                        value={searchOrder}
                        placeholder="Nhập đơn hàng"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setSearchOrder(inputValue)
                          if (inputValue === '') {
                            const leftRaw = leftDataSource.get("raw");
                            setLeftDataSource((prev) => {
                              let next = prev;
                              next = next.set("filtered", leftRaw);
                              return next;
                            });
                          } else {
                            const leftRaw = leftDataSource.get("raw");
                            const leftDataSourceNew = leftRaw.filter(x => x.id.includes(inputValue))
                            setLeftDataSource((prev) => {
                              let next = prev;
                              next = next.set("filtered", leftDataSourceNew);
                              return next;
                            });
                          }
                        }}
                      />
                    </Col>
                    <div style={{ marginTop: 10, marginBottom: 10, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                      <Col xs={16}>
                        <RangePicker
                          format={['DD-MM-YYYY', 'DD-MM-YYYY']}
                          ranges={momentRange}
                          onChange={(dates) => {
                            const date1 = dates ? moment(dates[0].startOf("day")).format("DD/MM/YYYY") : undefined;
                            const date2 = dates ? moment(dates[1].startOf("day")).format("DD/MM/YYYY") : undefined;
                            const leftDataSourceNew = leftDataSource.get("raw").filter(x => {
                              return compareSmall(date1, x.create_time) && compareSmall(x.create_time, date2)
                            })
                            setLeftDataSource((prev) => {
                              let next = prev;
                              next = next.set("filtered", leftDataSourceNew);
                              return next;
                            });
                          }}
                        />
                      </Col>
                    </div>
                  </Row>
                  <Left
                    listRouter={listRouter}
                    onClickItem={(item) => {
                      _handleMoveToRightScanner(item.id)
                    }}
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
                      <Input
                        placeholder="|||||||"
                        title="Scan mã đơn hàng ở cột bên trái để chuyển"
                        // style={{ backgroundColor: "#666666" }}
                        value={inputLeft}
                        onChange={(e) => {
                          let value = e.target.value
                          setInputLeft(value)
                          clearTimeout(timer1);
                          timer1 = setTimeout(async () => {
                            const checkEmpty = leftDataSource.get("filtered").filter(item => item.id === value).length > 0
                            if (checkEmpty) {
                              await _handleMoveToRightScanner(value)
                              Ui.showSuccess({ message: "Scan mã đơn hàng thành công" });
                              audioSuccess.play()
                            } else {
                              Ui.showWarning({ message: 'Bản ghi không tồn tại' })
                              audioError.play()
                              setInputLeft("")
                            }
                          }, 100);
                        }}
                      />
                    </Col>
                    <Col style={{ textAlign: "center" }} xs={24}>
                      <Button
                        title="Chọn đơn hàng ở cột bên trái để chuyển"
                        disabled={_.size(leftSelectedRowKeys) === 0}
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={_handleMoveToRight}
                      />
                    </Col>
                    {/* <Col style={{ textAlign: "center" }} xs={24}>
                      <Button
                        disabled={_.size(leftDataSource.get("raw")) === 0}
                        title="Chuyển tất cả đơn hàng sang phải"
                        type="danger"
                        icon={<DoubleRightOutlined />}
                        onClick={() => _handleMoveAll("right")}
                      />
                    </Col> */}
                    {/* <Col style={{ textAlign: "center" }} xs={24}>
                      <Button
                        disabled={_.size(rightDataSource.get("raw")) === 0}
                        title="Chuyển tất cả đơn hàng sang trái"
                        type="danger"
                        icon={<DoubleLeftOutlined />}
                        onClick={() => _handleMoveAll("left")}
                      />
                    </Col> */}
                    <Col style={{ textAlign: "center" }} xs={24}>
                      <Button
                        disabled={_.size(rightSelectedRowKeys) === 0}
                        type="primary"
                        icon={<LeftOutlined />}
                        onClick={_handleMoveToLeft}
                      />
                    </Col>

                    <Col style={{ textAlign: "center" }} xs={24}>
                      <Input
                        placeholder="|||||||"
                        title="Scan mã đơn hàng ở cột bên phải để chuyển"
                        // style={{ backgroundColor: "#666666" }}
                        value={inputRight}
                        onChange={(e) => {
                          let value = e.target.value
                          setInputRight(value)
                          clearTimeout(timer2);
                          timer2 = setTimeout(async () => {
                            const checkEmpty = rightDataSource.get("raw").filter(item => item.id === value).length > 0
                            if (checkEmpty) {
                              await _handleMoveToLeftScanner(value)
                              Ui.showSuccess({ message: "Scan mã đơn hàng thành công" });
                              audioSuccess.play()
                            } else {
                              Ui.showWarning({ message: 'Bản ghi không tồn tại' })
                              audioError.play()
                              setInputRight("")
                            }
                          }, 100);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="right">
                  <div className="d-flex align-items-center right-title">
                    <h3 className="mb-0">Danh sách đơn hàng trong bảng kê</h3>
                  </div>
                  <Right
                    listRouter={listRouter}
                    onClickItem={(item) => {
                      _handleMoveToLeftScanner(item.id)
                    }}
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
          ) : null
        }
      </Row>
    </Form>
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
  .ant-input:focus {
    border-color: #5070f2;
     outline: 0; 
    -webkit-box-shadow: 0 0 0 2px rgba(40, 72, 229, 0.2); 
    box-shadow: 0 0 0 2px rgba(40, 72, 229, 0.2);
  }
`;
