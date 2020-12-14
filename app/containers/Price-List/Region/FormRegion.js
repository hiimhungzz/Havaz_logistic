import { Button, Col, Form, Input, Row, Select, Icon } from "antd";

import PropTypes from "prop-types";
import React, { useCallback, memo, useEffect } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const FormService = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
}) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        onSave(values)
    };
    const onFinishFailed = () => {
        // console.log('Failed:', errorInfo);
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
            }}
            form={form}
        >
            <div class="label_title">Mã vùng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="code"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập mã vùng",
                    },
                ]}
            >
                <Input
                    disabled={itemSelected ? true : false}
                    placeholder={"Mã vùng"} />
            </Form.Item>
            <div class="label_title">Tên vùng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập tên vùng",
                    },
                ]}
            >
                <Input placeholder={"Tên vùng"} />
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
FormService.propTypes = {
    className: PropTypes.any,
};
export default styled(FormService)`
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
