/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import { Ui } from "utils/Ui";
import ServiceBase from 'utils/ServiceBase';
import { URI } from "utils/constants";
import { ARR_HTTT_ORDER } from "../constants";
import _ from "lodash"
const { TextArea } = Input;
const { Option } = Select;

const DetailOrder = ({
    objOrder,
    tabActive
}) => {
    const [form] = Form.useForm();
    const [OrderStatus, SetOrderStatus] = useState([])
    const [Source, SetSource] = useState([])

    const getlistSource = useCallback(async (objParam,) => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: URI['URI_VP'],
            data: {
                q: "",
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetSource(result.value.data);
        }
    })
    useEffect(() => {
        if (tabActive === 'DETAIL') {
            getlistSource()
            SetOrderStatus(ARR_HTTT_ORDER)
        }
    }, [tabActive])
    return (
        <Form form={form}>
            <Row justify="start" gutter={[24, 32]}>
                <Col span={9} style={{ "fontSize": "17px" }}>Thông tin khách</Col>
            </Row>
            <Row justify="start" gutter={[24, 24]}>
                <Col span={6}>
                    <span>VP đích <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="destination_id"
                        initialValue={objOrder['destination']['id']}
                        rules={[
                            {
                                required: true,
                                message: 'Hãy chọn VP đích',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn VP đích"
                            showSearch
                            disabled={true}
                            onChange={(e) => {
                                fillter(e, 'destination_id')
                            }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={objOrder['destination']['id']}
                            _key={'destination_id'}
                        >
                            {
                                _.map(Source, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['name']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>
                        Địa chỉ nhận
                </span>
                    <Input
                        value={objOrder['receiver']['address']}
                        placeholder="Địa chỉ nhận hàng"
                        disabled={true}
                        _key={'receiver_address'}
                    />
                </Col>
            </Row>
            <Row justify="start" gutter={[24, 24]}>
                <Col span={6}>
                    <span>SĐT người nhận <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="receiverphone"
                        initialValue={objOrder['receiver']['phone']}
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập SĐT',
                            },
                        ]}
                    >
                        <Input
                            _key={'receiverphone'}
                            value={objOrder['receiver']['phone']}
                            placeholder="SĐT"
                            disabled={true}
                            onChange={(e) => {
                                let { value } = e.target;
                                fillter(value, 'receiver.phone')
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>Họ tên người nhận</span>
                    <Input
                        value={objOrder['receiver']['name']}
                        placeholder="Họ tên"
                        _key={'receiver.name'}
                        disabled={true} />
                </Col>
                <Col span={6}>
                    <span>SĐT người gửi <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="senderphone"
                        initialValue={objOrder['sender']['phone']}
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập SĐT',
                            },
                        ]}
                    >
                        <Input
                            _key={'sender.phone'}
                            value={objOrder['sender']['phone']}
                            placeholder="SĐT"
                            disabled={true}
                            onChange={(e) => {
                                let { value } = e.target;
                                fillter(value, 'sender.phone')
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <span>Họ tên người gửi</span>
                    <Input
                        value={objOrder['sender']['name']}
                        placeholder="Họ tên"
                        _key={'sender.name'}
                        disabled={true} />
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ "borderTop": "2px dotted" }}></Col>
            </Row>
            <Row justify="start" gutter={[24, 24]} style={{ "marginTop": "20px" }}>
                <Col span={9} style={{ "fontSize": "17px" }}>Thông tin hàng & thanh toán</Col>
            </Row>
            <Row justify="start" gutter={[24, 24]}>
                <Col span={6}>
                    <span>Số kiện <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="num_of_package"
                        initialValue={objOrder['num_of_package']}
                        value={objOrder['num_of_package']}
                        rules={[
                            {
                                required: true,
                                message: "Nhập số kiện",
                            },
                        ]}
                    >
                        <Input
                            _key={'num_of_package'}
                            value={objOrder['num_of_package']}
                            placeholder="Nhập số kiện"
                            disabled={true}
                            onChange={(e) => {
                                let { value } = e.target;
                                fillter(value, 'num_of_package')
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>Cước phí(VNĐ) <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="order_fee"
                        initialValue=""
                        rules={[
                            {
                                required: true,
                                message: 'Nhập Cước phí',
                            },
                        ]}
                    >
                        <InputNumber
                            _key={'order_fee'}
                            value={objOrder['order_fee']}
                            placeholder="0"
                            disabled={true}
                            style={{ "width": "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                fillter(e, 'order_fee')
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>COD</span>
                    <InputNumber
                        value={objOrder['order_cod']}
                        placeholder="0"
                        _key={'order_cod'}
                        style={{ "width": "100%" }}
                        disabled={true}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            fillter(e, 'order_cod')
                        }
                        } />
                </Col>
                <Col span={5}>
                    <span>HTTT</span>
                    <DefineSelect
                        placeholder=""
                        dataBin={OrderStatus}
                        disabled={true}
                        change={(e) => {
                            fillter(e, 'payment_type')
                        }
                        }
                        value={objOrder['payment_type']}
                    />
                </Col>
            </Row>
            <Row justify="start" gutter={[24, 8]}>
            </Row>
            <Row justify="start" gutter={[24, 8]}>
                <Col span={23}>
                    <span>Ghi chú</span>
                    <TextArea
                        disabled={true}
                        placeholder={""}
                        autoSize={{
                            minRows: 3,
                            maxRows: 6
                        }}

                        value={objOrder['note']}
                    />
                </Col>
            </Row>
        </Form>
    )
};

export default DetailOrder;