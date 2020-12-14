import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, Radio , Card, Select, AutoComplete } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined  } from "@ant-design/icons";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";
import ServiceBase from 'utils/ServiceBase';
import { Ui } from "utils/Ui";
import { validatePhone } from "./constants"
const { Option } = Select;
const _Option = AutoComplete.Option;
var fnTimeOut;

const AddOn = ({
    form,
    className,
    _data,
    onChange,
    _disabled,
    _result
}) => {
    const [isCustomer, SetIsCustomer] = useState(0)
    const [Customer, SetCustomer] = useState()
    const searchTimeOut = function (customerCode) {
        window.clearTimeout(fnTimeOut);
        fnTimeOut = window.setTimeout(function () {
            getlistPrice(customerCode);
        }, 800);
    };
    const getlistPrice = useCallback(async (customerCode) => {  
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: '/v1/common/user/get-code',
            data: {
                code: customerCode
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetCustomer(result.value.data)
            
        }
    },[])
    useEffect(() => {
        if(!_data.customer_type) {
            form.setFieldsValue({
                'customer_type': null,
            })
            onChange(0, 'customer_type')
        } else {
            SetIsCustomer(_data.customer_type == 0 ? 0 : 2)
        }
        
        getlistPrice()
    }, [])
    // console.log('<< THONG TIN NGUOI GUI >>')
    return (
        <Card title="Thông tin người gửi" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}} bodyStyle={{minHeight: '165px'}}>
            <Row justify="start">
            <Col span="23" style={{marginTop: '10px'}}>
                <Radio.Group 
                    onChange={(e)=>{
                        let { value } = e.target
                        SetIsCustomer(value)
                        if(value === 0){
                            onChange(value, 'customer_type')
                        }
                    }} 
                    value={isCustomer}>
                    <Radio value={0}>Khách hàng cá nhân</Radio>
                    <Radio value={2}>Khách hàng doanh nghiệp</Radio>
                </Radio.Group>
            </Col>
            {
                isCustomer === 2 ? (
                    <>
                    <Col span={24} style={{marginTop: '10px'}}>
                        <span>Mã khách hàng </span>
                        <Form.Item
                            name="customer_type"
                            // initialValue={_data['destination']['id']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy chọn VP đích',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn khách hàng"
                                showSearch
                                disabled={_disabled}
                                onChange={(e) => {
                                        let customerById = _.filter(Customer, function(o) { return o['key'] == e })
                                        onChange(e, 'customer_type')
                                        form.setFieldsValue({
                                            'senderphone': customerById[0].phone,
                                        })
                                        onChange(customerById[0].name, 'sender.name')
                                        onChange(customerById[0].phone, 'sender.phone')
                                    }
                                }
                                filterOption={(input, option) =>
                                    option
                                }
                                onSearch={
                                    (e) => {
                                        searchTimeOut(e)
                                    }
                                }
                                value={_data['destination']['id']}
                                _key={'destination_id'}
                            >
                                {
                                    _.map(Customer, (i) => {
                                        return (<Option key={i['key'] ? i['key'] : i['id']}
                                            value={i['key'] ? i['key'] : i['id']}>{i['name']} ({i['code']}) </Option>)
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    </>
                ) : <Col span={24} style={{marginTop: '10px', minHeight: '54px'}}></Col>
            }

            <Col span={11} style={{marginTop: '10px'}}>
                <span>SĐT người gửi <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                <Form.Item
                    name="senderphone"
                    initialValue={_data['sender']['phone']}
                    rules={[
                        {
                            required: false,
                            message: 'Hãy nhập SĐT',
                        },
                        {
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    callback(new Error(`Hãy nhập SĐT`));
                                } else if (!validatePhone(value)) {
                                    callback(new Error(`SĐT không đúng định dạng`));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ]}
                >
                    <AutoComplete
                        dropdownMatchSelectWidth={600}
                        onChange={(str) => {
                            let objAddress = _.filter(_result, ['id', str])
                            if(objAddress && objAddress.length > 0){
                                objAddress = objAddress[0];
                                console.log(objAddress)
                                onChange(objAddress.sender_phone, 'sender.phone')
                                onChange(objAddress?.sender_name, 'sender.name')    
                                onChange(objAddress?.receiver_phone, 'receiver.phone')    
                                onChange(objAddress?.receiver_name, 'receiver.name')
                                form.setFieldsValue({
                                    'senderphone': objAddress.sender_phone,
                                    'receiverphone': objAddress?.receiver_phone,
                                })
                            } else {
                                onChange(str, 'sender.phone')
                            }
                        }}
                        placeholder="SĐT"
                        disabled={_disabled}
                    >
                      {_result.map((i) => (
                        <_Option key={i?.id} value={i?.id}>
                                <span>Người gửi : </span>
                                <i style={{color: 'red', fontWeight: 'bold'}}>{i?.sender_phone}</i>
                                <i style={{marginLeft: '4px', marginRight: '4px'}}>-</i>
                                <i style={{marginLeft: '4px', color: 'red'}}>{i?.sender_name}</i>
                                <span style={{marginLeft: '5px'}}> || Người nhận : </span>
                                <i style={{color: 'red', fontWeight: 'bold'}}>{i?.receiver_phone}</i>
                                <i style={{marginLeft: '4px', marginRight: '4px'}}>-</i>
                                <i style={{marginLeft: '4px', color: 'red'}}>{i?.receiver_name}</i>
                        </_Option>
                      ))}
                    </AutoComplete>
                </Form.Item>
            </Col>
            <Col span={2} ></Col>
            <Col span={11} style={{marginTop: '10px'}}>
                <span>Họ tên người gửi</span>
                <Input
                    value={_data['sender']['name']}
                    placeholder="Họ tên"
                    _key={'sender.name'}
                    disabled={_disabled}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'sender.name')
                    }}
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