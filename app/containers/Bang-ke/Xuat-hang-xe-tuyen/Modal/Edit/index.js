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
import { Row, Col, Button, Form } from "antd";
import { Input, OfficeStaffSelect } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import Top from "./Top";

import View from "./View";
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
const Modal = ({ className, definitions, modal, setOrders, setExportingId, exporting_id, setItemRead, setShowChot }) => {
  const [form] = Form.useForm();
  const [isCreateDone, setCreateDone] = useState(false);
  const [listRouter, setListRouter] = useState([])
  const [inputRight, setInputRight] = useState("")
  const [rightSelectedRowKeys, setRightSelectedRowKeys] = useState([]);

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
                destination_id: order.destination?.id,
                depot_destination_name: order.destination?.name,
                source_name: order.source?.name,
                destinationId: order.destination?.id,
                description: order.description,
                receiver_address: order.receiver?.address,
                receiver_name: order.receiver?.name,
                receiver_phone: order.receiver?.phone,
                sender_name: order.sender?.name,
                sender_address: order.sender?.address,
                sender_phone: order.sender?.phone,
                num_of_package: order.num_of_package,
                item_status: order.item_status,
                note: order.note,
                order_fee: order.order_fee,
                order_cod: order.order_cod,
                create_time: moment(order.created_at).format(
                  DATE_TIME_FORMAT.DD_MM_YYYY
                ),
                status: order.status,
                payment_type: order.payment_type,
                d_shipping_fee: order.d_shipping_fee,
                r_shipping_fee: order.r_shipping_fee,
                cod_fee: order.cod_fee,
                discount: order.discount
              };
            })
          )
        );
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
          create_time: result.value.data.create_time,
          staff_create: result.value.data.staff_create,
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
          create_time: result.value.data.create_time,
          staff_create: result.value.data.staff_create,
        });
      }
    },
    [form]
  );
  /*
   * Handler tìm kiếm left table
   */
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


  const onSelectTrip = useCallback(async (id) => {

  }, []);

  const onUpdateOrder = useCallback(async (id) => {

  }, []);

  useEffect(() => {
    clearTimeout(rightTimer);
    rightTimer = setTimeout(() => {
      setOrders(rightDataSource.get("raw"));
    }, 300);
  }, [rightDataSource, setOrders]);

  useLayoutEffect(() => {
    if (modal.get("isEdit")) {
      _handleRead(modal.get("cTableId"));
    }
  }, [_handleRead, modal]);
  // -----------------------
  return (
    <Form
      form={form}
      onFinish={() => { }}
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

        </Col>
        {
          isCreateDone || modal.get("isEdit") ? (
            <Col xs={24}>
              <div>
                <div className="d-flex align-items-center right-title">
                  <h3 className="mb-0">Danh sách đơn hàng trong bảng kê</h3>
                </div>
              </div>
              <View
                _handleRead={_handleRead}
                cTableId={modal.get("cTableId")}
                listRouter={listRouter}
                onClickItem={(item) => {
                  _handleMoveToLeftScanner(item.id)
                }}
                payment_types={definitions.get("payment_types")}
                exporting_item_statuses={definitions.get("exporting_item_statuses")}
                definitions={definitions}
                filters={rightDataSource.get("filters")}
                moveLoading={moveRightLoading}
                dataSource={rightDataSource.get("raw")}
                selectedRowKeys={rightSelectedRowKeys}
                setSelectedRowKeys={setRightSelectedRowKeys}
              />
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
`;
