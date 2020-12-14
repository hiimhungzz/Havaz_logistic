
import React, { useCallback, useState } from "react";
import { Row, Col, Button, Form, Tag } from "antd";
import { DrawerBase } from "components";
import styled from "styled-components";
import Content from "./Content";
import { LeftOutlined, PrinterTwoTone } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";
import { Ui } from "utils/Ui";
import Print from "../Print";
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { connect } from "react-redux";

/*
 * Tạo mới/ Sửa bảng kê
 */
const FromNewModal = ({ modal, profile, definitions, handleShowModal }) => {
  const [form] = Form.useForm();
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
        url: `v1/exportings/${tableId}/finalize`,
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
      setDataBin({
        code: modal.get("cTableId"),
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

  const _handleSubmitSave = useCallback(
    async (values) => {
      if (isChot.isPrint) {
        _handlePrintCTable(values, isChot.func);
        return;
      }
      let param = {
        trip_id: _.get(values, "trip_a") || _.get(values, "trip_b"),
        status: 1,
        destination_id: _.get(values, "depot_destination.key", 2),
        total_orders: _.size(orders) || 0,
        note: "ghi chu",
        orders: _.map(orders, (order) => order.id),
      };
      let url = modal.get("isEdit")
        ? `v1/exportings/${modal.get("cTableId")}/change-orders/`
        : "v1/exportings";
      let result = await ServiceBase.requestJson({
        baseUrl: API_BASE_URL,
        url: url,
        data: param,
        method: "POST",
      });
      if (result.hasErrors) {
        Ui.showError({
          message: `Có lỗi khi ${
            modal.get("isEdit") ? "sửa" : "tạo mới"
            } bảng kê xe tuyến.`,
        });
      } else {
        Ui.showSuccess({
          message: `${
            modal.get("isEdit") ? "Sửa" : "Tạo mới"
            } bảng kê xe tuyến thành công.`,
        });
        if (isChot.chot) {
          _handleFinalizeCTable(
            modal.get("isEdit")
              ? modal.get("cTableId")
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
  const _handleChot = useCallback(
    async (handlePrint) => {
      setIsChot({ chot: true, func: handlePrint });
      setTimeout(() => {
        form.submit();
      }, 200);
    },
    [form]
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
            Sửa bảng kê xuất hàng xe tuyến
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
            "Tạo bảng kê nhận hàng tại nhà"
          )}
      </h3>

      {modal.get("isEdit") ? (
        <div>
          <i>{modal.get("cTableId")}</i> &nbsp;
          <Tag
            color={definitions.getIn([
              "export_statuses",
              `${modal.get("cTableStatus")}`,
              "color",
            ])}
          >
            {definitions.getIn([
              "export_statuses",
              `${modal.get("cTableStatus")}`,
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
            !modal.get("cTableStatus") ||
            modal.get("cTableStatus") === 1) && (
              <Col>
                <Button
                  size="small"
                  onClick={form.submit}
                  htmlType="submit"
                  type="ghost"
                >
                  Lưu
              </Button>
              </Col>
            )}
          {(!modal.get("cTableStatus") || modal.get("cTableStatus") === 1) && (
            <Col>
              <Button size="small" onClick={_handleChot} type="primary">
                Chốt & In
              </Button>
            </Col>
          )}
        </Row>
      }
    >
      <Form form={form} onFinish={_handleSubmitSave}>
        <Content
          definitions={definitions}
          form={form}
          setOrders={setOrders}
          modal={modal}
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
