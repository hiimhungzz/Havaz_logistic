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
import Print from "../Print";
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { connect } from "react-redux";
/*
 * Tạo mới/ Sửa bảng kê
 */
const FromNewModal = ({
  modal,
  definitions,
  handleShowModal,
  profile,
  drivers,
  vehicles,
}) => {
  const [form] = Form.useForm();
  const [isShowChot, setShowChot] = useState(modal.get("isEdit") ? true : false);
  const [isChot, setIsChot] = useState(false);
  const [importing_id, setImportId] = useState(null)
  const [orders, setOrders] = useState([]);
  const [dataBin, setDataBin] = useState({});

  const _handleOnClose = useCallback(() => {
    form.resetFields();
    setTimeout(() => handleShowModal(false), 10);
  }, [form, handleShowModal]);
  /**
   * Handler in bảng kê
   * @param {any} values thông tin bảng kê
   * @param {function} func function in bảng kê
   */
  const _handlePrintCTable = useCallback(
    async (values, func) => {
      setDataBin({
        code: modal.get("mTableId"),
        ...values,
        current_hub: profile.current_hub.name,
        destination_name: _.get(values, "depot_destination.label", ""),
        create_time: moment().format(DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM),
        staff_create: _.get(profile, "name", ""),
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

  const _handleChot = useCallback(
    async (mTableId) => {
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: `v1/importings/${mTableId}/finalize`,
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
        orders: _.map(orders, (order) => ({
          order_id: order.id,
          status: order.rightAction,
          note: order.rightNote,
        })),
      };
      let url = modal.get("isEdit")
        ? `v1/importings/${modal.get("mTableId")}/change-orders`
        : "v1/importings";
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: url,
        data: param,
        method: "POST",
      });
      if (result.hasErrors) {
        Ui.showError({ message: "Có lỗi khi tạo mới bảng kê nhập hàng." });
      } else {
        Ui.showSuccess({ message: "Tạo mới bảng kê nhập hàng thành công." });
        if (isChot) {
          _handleChot(
            modal.get("isEdit")
              ? modal.get("mTableId")
              : result.value.importing_id
          );
          return;
        }
        _handleOnClose();
      }
    },
    [_handleChot, _handleOnClose, _handlePrintCTable, isChot, modal, orders]
  );

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
            Sửa bảng kê nhập hàng
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
            "Tạo bảng kê nhập hàng"
          )}
      </h3>
      {modal.get("isEdit") ? (
        <div>
          <i>{modal.get("mTableId")}</i> &nbsp;
          <Tag
            color={definitions.getIn([
              "export_statuses",
              `${modal.get("mTableStatus")}`,
              "color",
            ])}
          >
            {definitions.getIn([
              "export_statuses",
              `${modal.get("mTableStatus")}`,
              "text",
            ])}
          </Tag>
          Thời gian tạo:&nbsp;
          <strong>
            {moment(modal.get("create_time")).format(
              DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM
            )}
          </strong>
        </div>
      ) : null}
    </div>
  );
  console.log("isShowChot", isShowChot);
  console.log("sdadas", modal.get("mTableStatus"));
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
          {(!modal.get("isEdit") ||
            !modal.get("mTableStatus") ||
            modal.get("mTableStatus") === 1) && (
              <Col>
                {/* <Button
                onClick={form.submit}
                htmlType="submit"
                type="ghost"
                size="small"
              >
                Lưu
              </Button> */}
              </Col>
            )}
          {(!modal.get("mTableStatus") || modal.get("mTableStatus") === 1) && (isShowChot || modal.get("isEdit")) && (
            <Col>
              <Button
                size="middle "
                onClick={() => {
                  if (modal.get("isEdit")) {
                    _handleChot(modal.get("mTableId"));
                  } else {
                    _handleChot(importing_id);
                  }
                }}
                type="primary"
              >
                Chốt
              </Button>
            </Col>
          )}
        </Row>
      }
    >
      <Form
        form={form}
        onFinish={_handleSubmitSave}
        initialValues={{ type: 1, mTableId: "" }}
      >
        <Content
          setShowChot={setShowChot}
          form={form}
          setOrders={setOrders}
          modal={modal}
          setImportId={setImportId}
          importing_id={importing_id} />
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
