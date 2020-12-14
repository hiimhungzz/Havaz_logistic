import { Button, Checkbox, Form, Input, Modal, Spin, InputNumber, Col, Row } from "antd";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";


const FormStepIncrease = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
    onSelectItem,
    item,
    _handleReset
}) => {
    const [form] = Form.useForm();
    const [isVisiableModal, setVisiableModal] = useState(false);
    const _hideModal = useCallback(() => {
        setVisiableModal(false)
    });
    const onFinish = async (values) => {
        await onSave(values)
        form.resetFields();
    };
    const onFinishFailed = () => {
        // console.log('Failed:', errorInfo);
    };
    return (
        <>
            <Form
                onFinishFailed={onFinishFailed}
                onFinish={onFinish}
                className={className}
                name="control-hooks"
                initialValues={{
                    min: '',
                    max: '',
                    type: true
                }}
                form={form}
            >
                {/* <div>
                    <div class="label_title">Giá trị nhỏ nhất<span class="mark-required-color">(*)</span></div>
                    <Form.Item
                        name="min"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nhỏ nhất",
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            disabled={itemSelected ? true : false}
                            placeholder={"Giá trị nhỏ nhất"} />
                    </Form.Item>
                </div>

                <div class="label_title">Giá trị lớn nhất<span class="mark-required-color">(*)</span></div>
                <Form.Item
                    name="max"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập lớn nhất",
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder={"Giá trị lớn nhất"} />
                </Form.Item> */}
                <Row gutter={[16, 16]}>
                    <Col xs={10}>
                        <div className="label">Giá trị nhỏ nhất<span class="mark-required-color">(*)</span></div>
                        <div className="label">Giá trị lớn nhất<span class="mark-required-color">(*)</span></div>
                    </Col>
                    <Col span={14}>
                        <Form.Item
                            name="min"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập nhỏ nhất",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                disabled={itemSelected ? true : false}
                                placeholder={"Giá trị nhỏ nhất"} />
                        </Form.Item>
                        <Form.Item
                            name="max"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lớn nhất",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder={"Giá trị lớn nhất"} />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            valuePropName="checked"
                            rules={[
                                {
                                    required: true,
                                    message: "Nhập checkbox",
                                },
                            ]}
                        >
                            <Checkbox>Lũy kế</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

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
                    <Button
                        onClick={() => {
                            setVisiableModal(true)
                        }}
                        type="danger"
                        style={{ height: 35 }}
                    >
                        Xóa lũy kế
                    </Button>
                    <Button
                        htmlType="submit"
                        type="primary"
                        style={{ height: 35, float: "right" }}
                    >
                        Lưu
                </Button>
                </div>
                <Modal
                    title="Xóa lũy kế đã khai báo"
                    visible={isVisiableModal}
                    onOk={() => {
                        _handleReset()
                        setVisiableModal(false)
                    }}
                    onCancel={_hideModal}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <p>Bạn chắc chắn muốn xóa tất cả lũy kế đã khai báo ? </p>
                </Modal>
            </Form>
        </>
    )
        ;
});
FormStepIncrease.propTypes = {
    className: PropTypes.any,
};
export default styled(FormStepIncrease)`
.label {
    font-weight: bold;
    min-height: 32px;
    margin-bottom: 24px;
}
}`;
