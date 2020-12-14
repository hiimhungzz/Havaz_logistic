import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, Card } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";
import { validatePhone } from "./constants"

const { Option } = Select;


const AddOn = ({
    form,
    className,
    _data,
    onChange,
    _disabled,
    _Source
}) => {
    const [Source, SetSource] = useState([]);
    // danh sách HUB
    const getlistSource = useCallback(async (objParam) => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: URI['URI_VP'],
            data: {
                q: "",
                type:1
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetSource(result.value.data);
        }
    })

    useEffect(() => {
        getlistSource()
    }, [])
    // console.log('<< THONG TIN NGUOI NHAN >>')
    return (
        <Card title="Thông tin người nhận" bordered={true} headStyle={{ backgroundColor: 'rgba(233, 195, 43, 0.7)' }} bodyStyle={{ minHeight: '209px' }}>
            <Row justify="start">
                <Col span={11} >
                    <span>VP đích <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="destination_id"
                        initialValue={_data['destination']['id']}
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
                            disabled={_disabled === true ? true : (_data.id ? true : false)}
                            onChange={(e) => {
                                onChange(e, 'destination_id')
                            }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            value={_data['destination']['id']}
                            _key={'destination_id'}
                        >
                            {
                                _.map(_Source, (i) => {
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
                        value={_data['receiver']['address']}
                        placeholder="Địa chỉ nhận hàng"
                        disabled={_disabled}
                        _key={'receiver_address'}
                        onChange={(e) => {
                            let { value } = e.target;
                            onChange(value, 'receiver.address')
                        }}
                    />
                </Col>
                <Col span={11} style={{ marginTop: '10px' }}>
                    <span>SĐT người nhận <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name="receiverphone"
                        initialValue={_data['receiver']['phone']}
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
                        <Input
                            _key={'receiverphone'}
                            value={_data['receiver']['phone']}
                            placeholder="SĐT"
                            disabled={_disabled}
                            onChange={(e) => {
                                let { value } = e.target;
                                onChange(value, 'receiver.phone')
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={2} ></Col>
                <Col span={11} style={{ marginTop: '10px' }}>
                    <span>Họ tên người nhận</span>
                    <Input
                        value={_data['receiver']['name']}
                        placeholder="Họ tên"
                        _key={'receiver.name'}
                        disabled={_disabled}
                        onChange={(e) => {
                            let { value } = e.target;
                            onChange(value, 'receiver.name')
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