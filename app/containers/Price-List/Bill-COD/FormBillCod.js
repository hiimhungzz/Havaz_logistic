import { Button, Checkbox, Form, InputNumber } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import { Ui } from "utils/Ui";


const FormBill = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
    data
}) => {
    const [checkBox, setCheckBox] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const min = values.min;
        const max = values.max;
        const max_e = data.length === 0 ? 0 : data[data.length - 1].max
        if (min > max_e && min < max) {
            onSave({
                ...values,
                price_increase: values.price_increase ? values.price_increase : 0,
                value_first: values.value_first ? values.value_first : 0,
                increase: values.increase ? values.increase : 0,
                value: values.value ? values.value : 0,
            })
        }
        else {
            Ui.showWarning({ message: "Giá trị nhập vào không phù hợp" });
        }
    };
    const onFinishFailed = () => {
    };

    return (
        <Form
            className={className}
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            className={className}
            name="control-hooks"
            initialValues={{
                min: itemSelected && itemSelected.min || "",
                max: itemSelected && itemSelected.max || "",
                value: itemSelected && itemSelected.value || "",
                value_first: itemSelected && itemSelected.value_first || "",
                increase: itemSelected && itemSelected.increase || "",
                price_increase: itemSelected && itemSelected.price_increase || "",
                type: itemSelected && itemSelected.type || "",
            }}
            form={form}
        >

            <div class="label_title">Từ giá trị<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="min"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập giá trị min",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder={"Từ giá trị"} />
            </Form.Item>
            <div class="label_title">Đến giá trị<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="max"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập giá trị max",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder={"Đến giá trị"} />
            </Form.Item>
            <div class="label_title">Giá trị<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="value"
                rules={[
                    {
                        required: false,
                        message: "Vui lòng nhập giá trị",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder={"Giá trị"} />

            </Form.Item>
            <div class="label_title">Giá trị tính đầu<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="value_first"
                rules={[
                    {
                        required: false,
                        message: "Vui lòng nhập tính đầu",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder={"Giá trị tính đầu"} />

            </Form.Item>
            <div class="label_title">Mức tăng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="increase"
                rules={[
                    {
                        required: false,
                        message: "Vui lòng nhập mức tăng",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder={"Mức tăng"} />

            </Form.Item>
            <div class="label_title">Cước tăng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="price_increase"
                rules={[
                    {
                        required: false,
                        message: "Vui lòng nhập cước tăng",
                    },
                ]}
            >
                <InputNumber
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder={"Cước tăng"} />

            </Form.Item>
            <Form.Item
                name="type"
                valuePropName="checked"
            >
                <div className="d-flex">
                    <div style={{ paddingRight: 10 }}>Loại giá trị %</div>
                    <Checkbox></Checkbox>
                </div>
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
FormBill.propTypes = {
    className: PropTypes.any,
};
export default styled(FormBill)`
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
  .ant-input-number {
      width: 100%;
  }
  .label_title {
    font-weight: 700;
}
}`;
