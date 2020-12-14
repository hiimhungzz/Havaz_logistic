/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Row, Col, Button, Form, Tag } from "antd";
import { DrawerBase } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import Content from "./Content";
import { LeftOutlined } from "@ant-design/icons";
import _ from "lodash";
import ServiceBase from "utils/ServiceBase";
import moment from "moment";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import { Ui } from "utils/Ui";
import Print from "containers/Bang-ke/Xuat-hang-vp-vp/Print";
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { connect } from "react-redux";
/*
 * Tạo mới/ Sửa bảng kê
 */
const FromNewModal = ({
  modal,
  definitions,
  profile,
  handleShowModal,
  drivers,
  vehicles,
}) => {
  const [form] = Form.useForm();
  const [isShowChot, setShowChot] = useState(modal.get("isEdit") ? true : false);
  const [exporting_id, setExportingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isChot, setIsChot] = useState({
    chot: false,
    func: null,
    isPrint: false,
  });
  const [dataBin, setDataBin] = useState({});
  const _handleOnClose = useCallback(() => {
    setTimeout(() => handleShowModal(false), 10);
  }, [handleShowModal]);

  /**
   * Handler chốt bảng kê
   * @param {string} tableId bảng kê
   */
  const _handleFinalizeCTable = useCallback(
    async (tableId) => {
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `v1/transshipment/${tableId}/finalize`,
        data: {},
        method: "POST",
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi chốt bảng kê." });
      } else {
        Ui.showSuccess({ message: "Chốt bảng kê thành công." });
        _handleOnClose();
      }
    },
    [_handleOnClose]
  );

  /**
   * Handler in bảng kê
   * @param {any} values thông tin bảng kê
   * @param {function} func function in bảng kê
   */
  const _handlePrintCTable = useCallback(
    async (values, func) => {
      console.log("valuesvalues", values);
      setDataBin({
        ...values,
        code: modal.get("mTableId"),
        current_hub: profile.current_hub.name,
        destination_name: _.get(values, "depot_destination.label", ""),
        staff_create: (modal.get("staff_create")),
        create_time: (modal.get("create_time")),
        // create_time: moment(values.create_time).format(DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM),
        // staff_create: _.get(profile, "name", ""),
        orders: _.map(orders, (order, orderId) => {
          return {
            ...order,
            daTra: 0,
            conLai: 0,
          };
        }),
      });
      setTimeout(() => func(), 200);
    },
    [modal, orders, profile]
  );

  const _handleSubmitSave = useCallback(
    async (values) => {
      if (isChot.isPrint) {
        _handlePrintCTable(values, isChot.func);
        return;
      }
      let param = {
        car_id: _.get(values, "vehicle"),
        driver_id: _.get(values, "driver"),
        destination_id: _.get(values, "depot_destination.key", 2),
        note: "ghi chu",
        status: 1,
        orders: _.map(orders, (order) => ({ order_id: order.id })),
      };
      let url = modal.get("isEdit")
        ? `v1/transshipment/${modal.get("mTableId")}/change-orders`
        : "v1/transshipment";
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: url,
        data: param,
        method: "POST",
      });
      if (result.hasErrors) {
        Ui.showError({
          message: `Có lỗi khi ${modal.get("isEdit") ? "sửa" : "tạo mới"
            } bảng kê trung chuyến.`,
        });
      } else {
        Ui.showSuccess({
          message: `${modal.get("isEdit") ? "Sửa" : "Tạo mới"
            } bảng kê trung chuyển thành công.`,
        });
        if (isChot.chot) {
          _handleFinalizeCTable(
            modal.get("isEdit")
              ? modal.get("mTableId")
              : result.value.exporting_id
          );
          return;
        }
        _handleOnClose();
      }
    },
    [
      _handleFinalizeCTable,
      _handleOnClose,
      _handlePrintCTable,
      isChot.chot,
      isChot.func,
      isChot.isPrint,
      modal,
      orders,
    ]
  );

  const _handleChot = useCallback(async () => {
    let result = await ServiceBase.requestJson({
      baseUrl: API_BASE_URL,
      url: `v1/transshipment/${modal.get("isEdit") ? modal.get("mTableId") : exporting_id}/finalize`,
      data: {},
      method: "POST",
    });
    if (result.hasErrors) {
      Ui.showError({
        message: `Có lỗi khi chốt bảng kê`,
      });
    } else {
      Ui.showSuccess({
        message: `Chốt bảng kê thành công`,
      });
      setTimeout(() => handleShowModal(false), 10);
    }
  }, [exporting_id]);
  /**
   * Hiển thị title
   */
  let title;

  // Nếu là thêm mới đơn hàng
  title = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h3 style={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
        <LeftOutlined
          title="Quay lại"
          onClick={_handleOnClose}
          style={{ fontWeight: "bold", fontSize: "1.5rem", marginRight: 5 }}
        />
        {modal.get("isEdit") ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            Sửa bảng kê xuất hàng trung chuyển
            <Print
              onPrint={(handlePrint) => {
                setIsChot({ isPrint: true, func: handlePrint });
                setTimeout(() => {
                  form.submit();
                }, 200);
              }}
              dataBin={dataBin}
            />
          </div>
        ) : (
            "Tạo bảng kê xuất hàng trung chuyển"
          )}
      </h3>
      {modal.get("isEdit") ? (
        <div>
          <i>{modal.get("mTableId")}</i> &nbsp;
          <Tag
            color={modal.get("mTableStatus") ? definitions
              .getIn(["export_statuses", `${modal.get("mTableStatus")}`])
              .get("color") : ''}
          >
            {modal.get("mTableStatus") ? definitions
              .getIn(["export_statuses", `${modal.get("mTableStatus")}`])
              .get("text") : ''}
          </Tag>
          Thời gian tạo:&nbsp;
          <strong>
            {modal.get("create_time")}

            {/* {moment(modal.get("create_time")).format(
              DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM 
            )} */}
          </strong>
        </div>
      ) : null}
    </div>
  );
  return (
    <DrawerBase
      onClose={_handleOnClose}
      closable={false}
      placement="right"
      visible={modal.get("visible")}
      title={title}
      destroyOnClose={true}
      width="90%"
      footer={
        <Row justify="end" gutter={[8, 0]}>
          {((!modal.get("mTableStatus") || modal.get("mTableStatus") === 1) && isShowChot) && (
            <Col>
              <Button size="middle" onClick={_handleChot} type="primary">
                Chốt
              </Button>
            </Col>
          )}
        </Row>
      }
    >
      <Form form={form} onFinish={_handleSubmitSave}>
        <Content
          form={form}
          setShowChot={setShowChot}
          setExportingId={setExportingId}
          exporting_id={exporting_id}
          setOrders={setOrders}
          modal={modal}
          drivers={drivers}
          vehicles={vehicles}
        />
      </Form>
    </DrawerBase>
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default withConnect(styled(FromNewModal)``);
