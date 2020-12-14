import { Button, Form, Input } from "antd";
import { DefineSelect } from "components";
import { makeSelectDefinitions } from "containers/App/selectors";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
let inputTimer = null;
const FormService = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
    definitions,
    setParams,
    data
}) => {
    let { units } = definitions.toJS()
    let unit = _.map(units, (value, key) => {
        return value
    })
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
                unit_id: itemSelected && itemSelected.unit_id || undefined
            }}
            form={form}
        >
            <div class="label_title">Mã loại hàng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="code"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập mã loại hàng",
                    },
                ]}
            >
                <Input
                    disabled={itemSelected ? true : false}
                    placeholder={"Mã loại hàng"} />
            </Form.Item>
            <div class="label_title">Tên loại hàng<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập tên loại hàng",
                    },
                ]}
            >
                <Input placeholder={"Tên loại hàng"} />
            </Form.Item>
            <div class="label_title">Loại giá trị<span class="mark-required-color">(*)</span></div>
            <Form.Item
                name="unit_id"
                rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập loại giá trị",
                    },
                ]}
            >
                <DefineSelect
                    value={itemSelected && itemSelected.unit_id || undefined}
                    placeholder="Chọn loại giá"
                    dataBin={unit}
                    change={(data) => {
                        form.setFieldsValue({
                            unit_id: data
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
FormService.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(FormService))`
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
