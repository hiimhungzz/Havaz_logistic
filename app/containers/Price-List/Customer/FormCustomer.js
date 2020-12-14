import { Button, Card, Checkbox, Col, Form, Input, Row, DatePicker } from "antd";
import PropTypes from "prop-types";
import { DefineSelect } from "components";
import React, { memo } from "react";
import styled from "styled-components";
import moment from 'moment';
import GroupCustomerSelect from "components/Select/GroupCustomerSelect";
import _ from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const FormCustomer = memo(({
    className,
    onHiddenModal,
    onRefreshList,
    itemSelected,
    onSave,
    definitions
}) => {
    let { cities } = definitions.toJS()
    let city = _.map(cities, (value, k) => {
        return value
    })
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        // console.log("values", values);
        onSave(values)
    };
    const onFinishFailed = () => {
        // console.log('Failed:', errorInfo);
    };
    return (
        <Form labelWidth={200}
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            name="control-hooks"
            className={className}
            initialValues={{
                name: itemSelected && itemSelected.name || '',
                address: itemSelected && itemSelected.address || '',
                customer_group: itemSelected && itemSelected.customer_group ? {
                    key: itemSelected.customer_group.id,
                    label: itemSelected.customer_group.code
                } : undefined,
                phone: itemSelected && itemSelected.phone || '',
                city: itemSelected && itemSelected.city && itemSelected.city.id || undefined,
            }}
            form={form}
        >
            <Row justify="start" gutter={[8, 8]}>
                {/* <span class="mark-required-color">*</span> */}
                <Col span={24} style={{ paddingBottom: '0px !important' }}  >
                    <Card bordered={false}  >
                        <Row gutter={[8, 8]}>
                            <Col xs={12} >
                                <div class="label_title">Tên khách hàng <span class="mark-required-color">(*)</span></div>
                                <Form.Item
                                    labelAlign="left"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên khách hàng',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={12} >
                                <div class="label_title">Mã số thuế</div>
                                <Form.Item
                                    name="dddd"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Vui lòng nhập mã số thuế',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12} >
                                <div class="label_title">Địa chỉ hóa đơn</div>
                                <Form.Item
                                    name="address"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Vui lòng nhập địa chỉ hóa đơn',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={8} className="checkbox">
                                <Checkbox>Ngưng hoạt động</Checkbox>
                            </Col>
                            <Col xs={12} >
                                <div class="label_title">Nhóm khách hàng <span class="mark-required-color">(*)</span></div>
                                <Form.Item
                                    name="customer_group"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn nhóm khách hàng",
                                        },
                                    ]}
                                >
                                    <GroupCustomerSelect
                                        allowClear
                                        loadOnMount
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={12} >
                                <div class="label_title">Thành phố <span class="mark-required-color">(*)</span></div>
                                <Form.Item
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn thành phố',
                                        },
                                    ]}
                                >
                                    <DefineSelect
                                        // value={itemSelected && itemSelected.city.id || undefined}
                                        placeholder="Chọn thành phố"
                                        dataBin={city}
                                        change={(data) => {
                                            form.setFieldsValue({
                                                city: data
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={24} style={{ paddingBottom: '0px !important' }}>
                    <Card title="Thông tin liên hệ" bordered={false} >
                        <Row gutter={[8, 8]}>
                            <Col xs={12} >
                                <div class="label_title">Họ tên người gửi</div>
                                <Form.Item
                                    name="nameSender"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Vui lòng nhập họ tên người gửi',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={12} >
                                <div class="label_title">SĐT người gửi <span class="mark-required-color">(*)</span></div>
                                <Form.Item
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập SĐT',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} >
                                <div class="label_title">Địa chỉ người gửi</div>
                                <Form.Item
                                    name="addrsssess"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Hãy nhập địa chỉ',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>
                </Col>
                <Col span={24} style={{ paddingBottom: '0px !important' }} >
                    <Card bordered={false} title="Ghi chú" bordered={false}  >
                        <Row gutter={[8, 8]}>
                            <Col span={24} >
                                <TextArea
                                    placeholder={""}
                                    autoSize={{
                                        minRows: 3,
                                        maxRows: 6
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
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
            </Row>
        </Form >
    );
});
FormCustomer.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(FormCustomer))`
.ant-row.ant-row-start {
    margin: 0px 0px !important;
    }
    .ant-card-head-title {
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .ant-card-body {
        15px
    }
    .ant-row {
        margin-bottom: 0px !important;
    }
    .ant-card-head {
        min-height: 35px;
        padding-left: 15px
    }
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
    .ant-form-item-label > label {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 32px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        width: 133px;
    }
    .ant-form-item-label > label.ant-form-item-required::before {
        position: absolute;
        bottom: 13px;
        right: 0;
    }
    .label_title {
        font-weight: 700;
    }
    .checkbox{
        display: flex;
        align-items: center;
    }
`;
