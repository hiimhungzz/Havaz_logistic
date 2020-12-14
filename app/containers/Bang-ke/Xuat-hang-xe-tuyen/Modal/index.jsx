/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState } from "react";
import { Row, Col, Button, Form, Tag } from "antd";
import { DrawerBase } from "components";
import styled from "styled-components";
import Content from "./Content";
import Edit from "./Edit";
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
  const [itemRead, setItemRead] = useState(null);
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
              idBangKe={modal.get("cTableId")}
              profile={profile}
            />
          </div>
        ) : (
            "Tạo bảng kê xuất hàng xe tuyến"
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
          {((!modal.get("cTableStatus") || modal.get("cTableStatus") === 1) && isShowChot) && (
            <Col>
              <Button size="middle"
                onClick={() => {
                  _handleFinalizeCTable(
                    modal.get("isEdit")
                      ? modal.get("cTableId")
                      : exporting_id
                  );
                }}
                type="primary">
                Chốt
              </Button>
            </Col>
          )}
        </Row>
      }
    >
      {
        modal.get("isEdit") && modal.get("cTableStatus") === 2 ? (
          <Edit
            setShowChot={setShowChot}
            definitions={definitions}
            setOrders={setOrders}
            modal={modal}
            setExportingId={setExportingId}
            exporting_id={exporting_id}
            setItemRead={setItemRead}
          />
        ) : (
            <Content
              setShowChot={setShowChot}
              definitions={definitions}
              setOrders={setOrders}
              modal={modal}
              setExportingId={setExportingId}
              exporting_id={exporting_id}
              setItemRead={setItemRead}
            />
          )
      }

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
