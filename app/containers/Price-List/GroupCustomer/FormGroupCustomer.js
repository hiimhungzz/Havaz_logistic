import { Button, Form, Input } from "antd";
import BillSelectActive from "components/Select/BillSelectActive";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import styled from "styled-components";
let inputTimer = null;
const FormGroupCustomer = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
    setParams
}) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        onSave(values)
    };
    const onFinishFailed = () => {
    };
    return (
        <Form
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            className={className}
            name="control-hooks"
            initialValues={{
                code: itemSelected && itemSelected.code || '',
                name: itemSelected && itemSelected.name || '',
                price_title: itemSelected && itemSelected.price_title ? {
                    key: itemSelected.price_title.id,
                    label: itemSelected.price_title.code
                } : undefined
            }}
            form={form}
        >
            <div class="label_title">Mã nhóm khách hàng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="code"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập mã nhóm khách hàng",
                    },
                ]}
            >
                <Input
                    disabled={itemSelected ? true : false}
                    placeholder={"Mã nhóm khách hàng"} />
            </Form.Item>
            <div class="label_title">Tên nhóm khách hàng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập tên nhóm khách hàng",
                    },
                ]}
            >
                <Input placeholder={"Tên nhóm khách hàng"} />
            </Form.Item>
            <div class="label_title">Mã bảng cước<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="price_title"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập mã bảng cước",
                    },
                ]}
            >
                <BillSelectActive
                    allowClear
                    loadOnMount
                    onChange={(data) => {
                        form.setFieldsValue({
                            value: data ? data.value : 0,
                        });
                    }}
                />
            </Form.Item>
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
                    {itemSelected ? "Cập nhật" : "Lưu"}
                </Button>
            </div>
        </Form>
    );
});
FormGroupCustomer.propTypes = {
    className: PropTypes.any,
};
export default styled(FormGroupCustomer)`
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
  .label_title {
    font-weight: 700;
}
}`;
