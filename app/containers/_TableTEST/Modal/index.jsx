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
            color={definitions
              .getIn(["export_statuses", `${modal.get("mTableStatus")}`])
              .get("color")}
          >
            {definitions
              .getIn(["export_statuses", `${modal.get("mTableStatus")}`])
              .get("text")}
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
              <Button size="middle" onClick={() => { }} type="primary">
                Chốt
              </Button>
            </Col>
          )}
        </Row>
      }
    >
      dsadsa
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
