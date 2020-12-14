/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber, Card  } from "antd";
import { DefineSelect } from "components";
import { Ui } from "utils/Ui";
import ServiceBase from 'utils/ServiceBase';
import { URI } from "utils/constants";
import { ARR_HTTT_ORDER } from "../constants";
import _ from "lodash"
import styled from "styled-components";
import DefineThongTinMatHang from './ThongTinMatHang'
import DefineThongTinHang from './ThongTinHang'
const { TextArea } = Input;


const DetailOrder = ({
    objOrder,
    setObjOrder,
    tabActive,
    form,
    className
}) => {
    const [OrderStatus, SetOrderStatus] = useState([])
    const [Source, SetSource] = useState([])
    const [disabled, Setdisabled] = useState(true)
    const getlistSource = useCallback(async (objParam) => {
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
    const fillter = useCallback(
        (value, name) => {
          setObjOrder((props) => {
            let nextState = { ...props };
            let strName = name.split('.')
            if (strName.length === 1) {
              nextState[name] = value;
            } else {
              nextState[strName[0]][strName[1]] = value
            }
            return nextState;
          });
        },
        [setObjOrder]
      );
    // console.log('render > Detail')
    return (
        <Form form={form} className={className} style={{'backgroundColor': 'rgba(236, 236, 235, 0.45)', marginTop: '-16px'}}>
            <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{ "fontSize": "17px" , paddingBottom: '0px !important'}}>
                    <Card title="Thông tin người gửi" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}} bodyStyle={{minHeight: '165px'}}>
                        <Row justify="start">
                            <Col span={11} >
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
                                        disabled={disabled}
                                        onChange={(e) => {
                                            let { value } = e.target;
                                            fillter(value, 'sender.phone')
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} ></Col>
                            <Col span={11} >
                                <span>Họ tên người gửi</span>
                                <Input
                                    value={objOrder['sender']['name']}
                                    placeholder="Họ tên"
                                    _key={'sender.name'}
                                    disabled={disabled}
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        fillter(value, 'sender.name')
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col >
                <Col span={12} style={{ "fontSize": "17px", paddingBottom: '0px !important' }}>
                    <Card title="Thông tin người nhận" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}}>
                        <Row justify="start">
                            <Col span={11} >
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
                                        disabled={disabled}
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
                            <Col span={2} ></Col>
                            <Col span={11} >
                                <span>
                                    Địa chỉ nhận
                                </span>
                                <Input
                                    value={objOrder['receiver']['address']}
                                    placeholder="Địa chỉ nhận hàng"
                                    disabled={disabled}
                                    _key={'receiver_address'}
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        fillter(value, 'receiver.address')
                                    }}
                                />
                            </Col>
                            <Col span={11} style={{marginTop: '10px'}}>
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
                                        disabled={disabled}
                                        onChange={(e) => {
                                            let { value } = e.target;
                                            fillter(value, 'receiver.phone')
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} ></Col>
                            <Col span={11} style={{marginTop: '10px'}}>
                                <span>Họ tên người nhận</span>
                                <Input
                                    value={objOrder['receiver']['name']}
                                    placeholder="Họ tên"
                                    _key={'receiver.name'}
                                    disabled={disabled}
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        fillter(value, 'receiver.name')
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col >
                <Col span={24} style={{ paddingBottom: '0px !important'}}>
                    <Card title="Thông tin hàng" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}}>
                        <DefineThongTinHang 
                            form={form}
                            rowKey="TC"
                            DataSet={(data) => { 
                                // console.log('data>',data)
                                fillter(_.sumBy(data, 'fee') || 0, 'order_fee')
                                fillter(data, 'items')

                            }} 
                            DataBin={objOrder['items']}
                            isDisabled={true}
                        />
                    </Card>
                </Col>
                <Col span={24} style={{paddingBottom: '0px !important'}}>
                    <Card title="Thông tin cước phí & thanh toán" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}}>
                        <Row justify="start">
                            <Col span={6} style={{marginBottom: '10px'}}>
                                <span>HTTT</span>
                                <DefineSelect
                                    placeholder=""
                                    dataBin={OrderStatus}
                                    disabled={disabled}
                                    change={(e) => {
                                        fillter(e, 'payment_type')
                                    }
                                    }
                                    value={objOrder['payment_type']}
                                />
                            </Col>
                            <Col span={1} ></Col>
                            <Col span={6} style={{marginBottom: '10px'}}>
                                <span>Tiền cước COD</span>
                                <InputNumber
                                    _key={'order_cod'}
                                    value={objOrder['order_cod']}
                                    placeholder="0"
                                    disabled={disabled}
                                    style={{ "width": "100%" }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(e) => {
                                        fillter(e, 'order_cod')
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row justify="start">
                            <Col span={6} style={{marginBottom: '10px'}}>
                                <span>Cước vận chuyển(VNĐ)</span>
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
                            </Col>
                            <Col span={1} >
                                <p style={{marginTop: '30px', marginLeft: '43%'}}>
                                    +
                                </p>
                            </Col>
                            <Col span={6} >
                                <span>Cước thu hộ(COD)</span>
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
                            <Col span={1} >
                                <p style={{marginTop: '30px', marginLeft: '43%'}}>
                                    =
                                </p>
                            </Col>
                            <Col span={6} >
                                <p style={{marginTop: '3%', marginBottom: '0px'}}>
                                    <span>Tổng cước</span><br/>
                                    <span>
                                        {
                                            `${objOrder['order_fee'] + objOrder['order_cod']}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        }
                                    </span>
                                </p>
                                
                            </Col>
                            <Col span={24} >
                                <span>Ghi chú</span>
                                <TextArea
                                    disabled={disabled}
                                    placeholder={""}
                                    autoSize={{
                                        minRows: 3,
                                        maxRows: 6
                                    }}
                                    value={objOrder['note']}
                                    onChange={(e) => {
                                        let { value } = e.target;
                                        fillter(value, 'note')
                                    }
                                    }
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {/* <Col span={24} >
                    <Card title="Lý do mất hàng/hỏng hàng" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}} bodyStyle={{paddingLeft: '12px', paddingRight: '12px'}}>
                        <DefineThongTinMatHang />
                    </Card>
                </Col> */}
            </Row>
        </Form>
    )
};


export default styled(DetailOrder)`
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
`;