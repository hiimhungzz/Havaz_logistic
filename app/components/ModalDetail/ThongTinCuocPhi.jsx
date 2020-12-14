import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, InputNumber, Card , Select} from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined  } from "@ant-design/icons";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";
import ServiceBase from 'utils/ServiceBase';
import { Ui } from "utils/Ui";
const { TextArea } = Input;
var fnTimeOut;

const AddOn = ({
    form,
    className,
    _data,
    onChange,
    _disabled,
    definitions
}) => {
    let _orderStatus = [];
    let { payment_types } = definitions.toJS()
    const [ _payment_types ] = useState(payment_types)
    _.forEach(_payment_types, (v)=>{
        _orderStatus.push(v)
    })
    // console.log('<< THONG TIN CUOC PHI >>')
    const searchTimeOut = function (order_cod) {
        window.clearTimeout(fnTimeOut);
        fnTimeOut = window.setTimeout(function () {
            getlistPrice(order_cod);
        }, 800);
    };
    const getlistPrice = useCallback(async (order_cod) => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: '/v1/cod/get-cod',
            data: {
                price: order_cod
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            onChange(result.value.amount, 'cod_fee.amount')
            
        }
    },[_data])

    const sumTotal = useCallback(() => {
        let result = 0;
        if(_data['order_fee'] && _data['order_fee']['amount'] && _data['order_fee']['amount'] >= 0)
            result+=_data['order_fee']['amount']
        if(_data?.cod_fee?.amount && _data?.cod_fee?.amount >= 0)
            result+=_data?.cod_fee?.amount

        if(_data['r_shipping_fee'] && _data['r_shipping_fee']['amount'] && _data['r_shipping_fee']['amount'] >= 0)
            result+=_data['r_shipping_fee']['amount']

        if(_data['d_shipping_fee'] && _data['d_shipping_fee']['amount'] && _data['d_shipping_fee']['amount'] >= 0)
            result+=_data['d_shipping_fee']['amount']

        if(_data['discount'] && _data['discount'] <= result)
            result-=_data['discount']

        return result

    }, [_data])

    const sumTotalByCobByFee = useCallback(() => {
        let result = 0;
        if(_data['order_fee'] && _data['order_fee']['amount'] && _data['order_fee']['amount'] >= 0)
            result+=_data['order_fee']['amount']
        
        return result
    },[_data])
    const validateFee = useCallback((key) => {
        let result = false;
        if(_data[key] && _data[key]['amount'] && _data[key]['amount'] !== "")
            result = true;
        
        return result
    },[_data])
    form.setFieldsValue({
        'discount': _data['discount']
      })
    return (
        <Card title="Thông tin cước phí & thanh toán" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}}>
            <Row justify="start">
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>Cước vận chuyển(VNĐ)</span>
                    <InputNumber
                        _key={'order_fee'}
                        value={_data['order_fee']['amount']}
                        placeholder="0"
                        disabled={true}
                        style={{ "width": "100%" }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            onChange(e, 'order_fee.amount')
                        }}
                    />
                </Col>
                <Col span={1} ></Col>
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>HTTT cước vận chuyển <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="payment_type"
                        initialValue={_data['order_fee']['paying_side']}
                        rules={[
                            {
                                required: true,
                                message: 'Chọn HTTT cước vận chuyển',
                            }
                        ]}
                    >
                        <Select
                            placeholder="HTTT cước vận chuyển"
                            showSearch
                            allowClear
                            disabled={_disabled}
                            onChange={(e) => {
                                    onChange(e, 'order_fee.paying_side')
                                }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={_data['order_fee']['paying_side']}
                            _key={'payment_type'}
                        >
                            {
                                _.map(_orderStatus, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['text']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row justify="start">
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>Tiền thu hộ COD</span>
                    <InputNumber
                        _key={'order_cod'}
                        value={_data['order_cod']}
                        placeholder="0"
                        disabled={_disabled}
                        style={{ "width": "100%" }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            onChange(e, 'order_cod')
                            searchTimeOut(e)
                        }}
                    />
                </Col>
                <Col span={1} ></Col>
                <Col span={6} >
                    <span>Cước thu hộ(COD)</span>
                    <InputNumber
                        value={_data?.cod_fee?.amount}
                        placeholder="0"
                        _key={'cod_fee'}
                        style={{ "width": "100%" }}
                        disabled={true}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            // onChange(e, 'cod_fee')
                        }
                        } />
                </Col>
                <Col span={1} ></Col>
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>HTTT cước COD 
                        {
                            _data?.cod_fee?.amount > 0 ? (<span style={{ color: '#dc2d2d' }}>(*)</span>) : ""
                        }
                    </span>
                    <Form.Item
                        name="cod_fee"
                        initialValue={_data?.cod_fee?.paying_side}
                        rules={[
                            {
                                required: false,
                                message: 'Chọn HTTT cước COD',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (_data?.cod_fee?.amount && _data?.cod_fee?.amount > 0 && !value) {
                                        callback(new Error(`Chọn HTTT cước COD`));
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Select
                            placeholder="HTTT cước COD"
                            showSearch
                            allowClear
                            disabled={_disabled}
                            onChange={(e) => {
                                    onChange(e, 'cod_fee.paying_side')
                                }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={_data?.cod_fee?.paying_side}
                            _key={'payment_type'}
                        >
                            {
                                _.map(_orderStatus, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['text']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start">
                <Col span={6} style={{marginBottom: '10px'}}>
                </Col>
                <Col span={1} ></Col>
                <Col span={6} >
                    <span>Cước ship nhận</span>
                    <InputNumber
                        value={_data?.r_shipping_fee?.amount}
                        placeholder="0"
                        _key={'r_shipping_fee'}
                        style={{ "width": "100%" }}
                        disabled={_disabled}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            onChange(e, 'r_shipping_fee.amount')
                        }
                        } />
                </Col>
                <Col span={1} ></Col>
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>HTTT cước ship nhận {
                            validateFee('r_shipping_fee') ? (<span style={{ color: '#dc2d2d' }}>(*)</span>) : ""
                        }</span>
                    <Form.Item
                        name="r_shipping_fee"
                        initialValue={_data?.r_shipping_fee?.paying_side}
                        rules={[
                            {
                                required: false,
                                message: 'Chọn HTTT cước ship nhận ',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (validateFee('r_shipping_fee') === true && !value) {
                                        callback(new Error(`Chọn HTTT cước ship nhận`));
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Select
                            placeholder="HTTT cước ship nhận "
                            showSearch
                            allowClear
                            disabled={_disabled}
                            onChange={(e) => {
                                    onChange(e, 'r_shipping_fee.paying_side')
                                }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={_data?.r_shipping_fee?.paying_side}
                            _key={'r_shipping_fee'}
                        >
                            {
                                _.map(_orderStatus, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['text']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start">
                <Col span={6} style={{marginBottom: '10px'}}>
                </Col>
                <Col span={1} ></Col>
                <Col span={6} >
                    <span>Cước ship trả</span>
                    <InputNumber
                        value={_data?.d_shipping_fee?.amount}
                        placeholder="0"
                        _key={'d_shipping_fee'}
                        style={{ "width": "100%" }}
                        disabled={_disabled}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        onChange={(e) => {
                            onChange(e, 'd_shipping_fee.amount')
                        }
                        } />
                </Col>
                <Col span={1} ></Col>
                <Col span={6} style={{marginBottom: '10px'}}>
                    <span>HTTT cước ship trả {
                            validateFee('d_shipping_fee') ? (<span style={{ color: '#dc2d2d' }}>(*)</span>) : ""
                        }</span>
                    <Form.Item
                        name="d_shipping_fee"
                        initialValue={_data?.d_shipping_fee?.paying_side}
                        rules={[
                            {
                                required: false,
                                message: 'Chọn HTTT cước ship trả',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (validateFee('d_shipping_fee') === true && !value) {
                                        callback(new Error(`Chọn HTTT cước ship trả`));
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <Select
                            placeholder="HTTT cước ship trả"
                            showSearch
                            allowClear
                            disabled={_disabled}
                            onChange={(e) => {
                                    onChange(e, 'd_shipping_fee.paying_side')
                                }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={_data?.d_shipping_fee?.paying_side}
                            _key={'d_shipping_fee'}
                        >
                            {
                                _.map(_orderStatus, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['text']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start">
                <Col span={6} >
                    <span>Giảm giá</span>
                    <Form.Item
                        name={'discount'}
                        initialValue={_data['discount']}
                        rules={[
                            {
                                required: false,
                                message: 'nhập số tiền giảm',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (value < 0) {
                                        callback(new Error(`Phải lớn hơn không`));
                                    } else if (value > sumTotalByCobByFee()) {
                                        callback(new Error(`không được lớn hơn cước phí!`));
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ]}
                    >
                        <InputNumber
                            value={_data['discount']}
                            placeholder="Giảm giá"
                            _key={'discount'}
                            style={{ "width": "100%" }}
                            disabled={_disabled}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                onChange(e, 'discount')
                            }
                            } 
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="start">
                <p style={{marginTop: '3%', marginBottom: '15px'}}>
                    <span>Tổng cước</span><br/>
                    <span>
                        {
                            `${sumTotal()}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                    </span>
                </p>
            </Row>
            
            
            <Row justify="start">
                
                <Col span={24} >
                    <span>Ghi chú</span>
                    <TextArea
                        disabled={false}
                        placeholder={""}
                        autoSize={{
                            minRows: 3,
                            maxRows: 6
                        }}
                        value={_data['note']}
                        onChange={(e) => {
                            let { value } = e.target;
                            onChange(value, 'note')
                        }
                        }
                    />
                </Col>
            </Row>
        </Card>
    )
}
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});

const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(AddOn))`
    
`