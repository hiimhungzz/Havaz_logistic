import { Button, Col, Form, Input, Row, Select, Icon } from "antd";

import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import OfficeKhiemNghiemSelect from "components/Select/OfficeKhiemNghiemSelect";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const OrderModal = ({
  className,
  onHiddenModal,
  onRefreshList,
  itemSelected,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    let list_adm_list_depot = [];
    values.adm_list_depot.map((item) => {
      list_adm_list_depot.push(item.key);
    });
    const checkOffice = values.adm_list_depot.filter(
      (x) => x.key === values.adm_diem_ket_noi.key
    );
    console.log("checkOffice", checkOffice);
    if (checkOffice.length > 0) {
      const params = {
        id: itemSelected.id,
        adm_diem_ket_noi: values.adm_diem_ket_noi.key,
        adm_list_depot: list_adm_list_depot,
      };
      console.log("params", params);
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: "v1/nhan-vien/staff-edit",
        data: params,
      });
      console.log("result", result);
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
      } else {
        Ui.showSuccess({ message: result.value.data.message });
        onHiddenModal();
        onRefreshList();
      }
    } else {
      Ui.showError({
        message: "Văn phòng trực thuộc phải có trong văn phòng kiêm nghiệm",
      });
    }
  };
  const onFinishFailed = () => {
    // console.log('Failed:', errorInfo);
  };
  const adm_list_depot_ok = [];
  return (
    <Form
      onFinishFailed={onFinishFailed}
      onFinish={onFinish}
      name="control-hooks"
      initialValues={{
        name: itemSelected && itemSelected.name,
        phone: itemSelected && itemSelected.phone,
        code: itemSelected && itemSelected.code,
        adm_diem_ket_noi: itemSelected && {
          key: itemSelected.id_office,
          label: itemSelected.adm_diem_ket_noi,
        },
        adm_list_depot: itemSelected && itemSelected.adm_list_depot,
      }}
      form={form}
    >
      {itemSelected ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={8}>
              <Form.Item name="name">
                <Input disabled placeholder={"Tên nhân viên"} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item name="code">
                <Input disabled placeholder={"Mã nhân viên"} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item name="phone">
                <Input disabled placeholder={"Số điện thoại"} />
              </Form.Item>
            </Col>
          </Row>
          &nbsp; &nbsp; &nbsp;
          <div style={{ margin: 30 }} />
          <Row gutter={[16, 16]}>
            <Col xs={12}>
              <h5 style={{ fontSize: 16 }}>Văn phòng trực thuộc</h5>
              <Form.Item name="adm_diem_ket_noi">
                <OfficeKhiemNghiemSelect
                  mode="single"
                  placeholder="Văn phòng trực thuộc"
                  allowClear
                  loadOnMount
                  onChange={(data) => {
                    form.setFieldsValue({ adm_diem_ket_noi: data });
                  }}
                />
                {/* <OfficeStaffSelect
                  allowClear
                  loadOnMount
                  onChange={(data) => {
                    form.setFieldsValue({ adm_diem_ket_noi: data });
                  }}
                /> */}
              </Form.Item>
            </Col>
            <Col xs={12}>
              <h5 style={{ fontSize: 16 }}>Văn phòng kiêm nghiệm</h5>
              <Form.Item name="adm_list_depot">
                <OfficeKhiemNghiemSelect
                  mode="multiple"
                  placeholder="Văn phòng kiêm nghiệm"
                  allowClear
                  loadOnMount
                  onChange={(data) => {
                    form.setFieldsValue({ adm_list_depot: data });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ) : null}
      {/* <div className="action">
        <Button
          size="large"
          htmlType="submit"
        >
          <I className="fa fa-save" />
                Save
              </Button>
      </div> */}
      <div
        className="action"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          padding: "10px 20px",
          background: "#fff",
          textAlign: "left",
        }}
      >
        <Button type="danger" style={{ height: 35 }} onClick={onHiddenModal}>
          Thoát
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          style={{ height: 35, float: "right" }}
        >
          Cập nhật
        </Button>
      </div>
    </Form>
  );
};
OrderModal.propTypes = {
  className: PropTypes.any,
};
export default styled(OrderModal)`
  .action {
    position: absolute,
    left: 0,
    width: "100%",
    bottom: 0,
    borderTop: 1px solid #e9e9e9,
    padding: 10px 38px,
    background: #fff,
    textAlign: left,
  }
}`;
