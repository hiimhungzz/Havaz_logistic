import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, InputNumber, Select } from "antd";
import { DefineSelect } from "components";
import ServiceBase from 'utils/ServiceBase';
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { Ui } from "utils/Ui";
var fnTimeOut;
const { Option } = Select;
const AddOn = ({
    form,
    className,
    DataSet,
    DataBin,
    isDisabled,
    rowKey,
    definitions,
    _data,
    _disabled
}) => {
    let danhSachHang = [];
    let { service_type_product } = definitions.toJS()
    const [_service_type_product] = useState(service_type_product)
    _.forEach(_service_type_product, (v) => {
        danhSachHang.push(v)
    })
    let tempAddOn = [],
        tempDataAddOn = {};

    const [addOn, SetAddOn] = useState(tempAddOn)
    const [dataAddOn, SetDataAddOn] = useState(tempDataAddOn)
    const pushAddOn = useCallback(async () => {
        if (_disabled)
            return

        let key = new Date().getTime()
        SetDataAddOn((props) => {
            let nextState = { ...props };
            nextState[key] = {
                description: "",
                fee: '',
                type_of: null,
                quantity: '',
                num_of_package: "",
                input_description: ""
            }
            return nextState;
        })
        SetAddOn([...addOn, { id: key, select: `${rowKey}_select_${key}`, input_num_of_package: `${rowKey}_input_${key}`, input_quantity: `${rowKey}_input_${key}_quantity}`, input_fee: `${rowKey}_input_${key}_fee}` , input_description : `${rowKey}_input_${key}_description}`}])
    }, [addOn, _disabled])

    const removeAddOn = useCallback(async (id) => {
        if (_disabled)
            return

        SetDataAddOn(_.omit(dataAddOn, id))
        SetAddOn(addOn.filter((e) => (e['id'] !== id)))
    }, [addOn, dataAddOn, _disabled])

    const fillter = useCallback(
        (value, key, name) => {
            SetDataAddOn((props) => {
                let nextState = { ...props };
                nextState[key][name] = value
                // if(name === 'type_of' || name === 'num_of_package'){
                //     nextState[key].description = `${nextState[key]?.num_of_package}_${_service_type_product[nextState[key]?.type_of]?.name}`
                    // console.log(`${nextState[key]?.num_of_package}_${_service_type_product[nextState[key]?.type_of]?.name}`)?
                // }
                return nextState;
            });
        }, [SetDataAddOn]
    );
    const getPrice = useCallback((item, objkey) => {
        if (item.quantity && item.type_of && _data.destination_id && _data.customer_type >= 0 && !_data.id)
            getlistPrice(item, objkey)
    }, [_data]);
    const searchTimeOut = function (item, objkey) {
        window.clearTimeout(fnTimeOut);
        fnTimeOut = window.setTimeout(function () {
            getPrice(item, objkey);
        }, 800);
    };
    const getlistPrice = useCallback(async (item, objkey) => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: '/v1/price-matrix/get-price',
            data: {
                quantity: item.quantity,
                service_type_id: item.type_of,
                destination_hub: _data.destination_id,
                customer_id: _data.customer_type
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            fillter(result.value.amount, objkey['id'], 'fee')
            let formQuantity = {};
            formQuantity[objkey['input_fee']] = result.value.amount
            form.setFieldsValue(formQuantity)
        }
    }, [_data])

    useEffect(() => {
        if (!_.isEmpty(dataAddOn)) {
            let arrTeam = []
            _.forEach(dataAddOn, (value, key) => {
                arrTeam.push(value)
            })
            DataSet(arrTeam)
        }
    }, [dataAddOn])

    useEffect(() => {
        let index = 1;
        let formData = {};
        _.forEach(DataBin, (i) => {
            tempAddOn.push({ id: index, select: `${rowKey}_select${index}`, input_num_of_package: `${rowKey}_input_${index}`, input_quantity: `${rowKey}_input_${index}_quantity}`, input_fee: `${rowKey}_input_${index}_fee}`, input_description:  `${rowKey}_input_${index}_description}` })
            tempDataAddOn[index] = i
            formData[`${rowKey}_select${index}`] = i['type_of']
            formData[`${rowKey}_input_${index}_fee}`] = i['fee']
            formData[`${rowKey}_input_${index}_quantity}`] = i['quantity']
            formData[`${rowKey}_input_${index}`] = i['num_of_package'] || null
            formData[`${rowKey}_input_${index}_description}`] = i['description'] || null
            index++
        })
        form.setFieldsValue(formData)
        SetAddOn(tempAddOn)
        SetDataAddOn(tempDataAddOn)
    }, [])

    useEffect(() => {
        _.forEach(addOn, (i) => {
            getPrice(dataAddOn[i['id']], i)
        })

    }, [_data.destination_id, _data.customer_type])
    // console.log('render > thong tin hang')
    return (
        <>
            {
                _.map(addOn, (i, index) => {
                    return (
                        <Row className={className}>
                            <Col span={1}>
                                <p style={{ paddingTop: '29px', marginBottom: '0px' }}>
                                    {index + 1}
                                </p>
                            </Col>
                            <Col span={5} >
                                <span>Loại hàng <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['select']}
                                    initialValue={dataAddOn[i['id']]?.type_of}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn loại hàng',
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn loại hàng"
                                        showSearch
                                        allowClear
                                        disabled={_disabled}
                                        onChange={(e) => {
                                            fillter(e, i['id'], 'type_of')
                                            searchTimeOut(dataAddOn[i['id']], i)
                                        }
                                        }
                                        filterOption={(input, option) =>
                                            option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onSearch={
                                            (e) => {
                                            }
                                        }
                                        value={dataAddOn[i['id']]?.type_of}
                                        _key={'destination_id'}
                                    >
                                        {
                                            _.map(danhSachHang, (i) => {
                                                return (<Option key={i['key'] ? i['key'] : i['id']}
                                                    value={i['key'] ? i['key'] : i['id']}>{i['name']} </Option>)
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={1} ></Col>
                            <Col span={2} >
                                <span>Số lượng
                                    {dataAddOn[i['id']]?.type_of !== 0 ? (<span style={{ color: '#dc2d2d' }}>(*)</span>) : ""}</span>
                                <Form.Item
                                    name={i['input_quantity']}
                                    initialValue={dataAddOn[i['id']]?.quantity}
                                    rules={[
                                        {
                                            required: dataAddOn[i['id']]?.type_of !== 0 ? true : false,
                                            message: 'Hãy nhập số lượng',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="Số lượng"
                                        _key={i['input_quantity']}
                                        style={{ "width": "100%" }}
                                        disabled={_disabled === true ? true : (dataAddOn[i['id']]?.type_of !== 0 ? false : true)}
                                        // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(e) => {
                                            fillter(e, i['id'], 'quantity')
                                            // fillter(`${index + 1}`, i['id'], 'description')
                                            searchTimeOut(dataAddOn[i['id']], i)
                                            // pushDataToDetail()
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} className="type-custome">
                                <p style={{ marginTop: '-25px' }}>Đơn vị</p>
                                <span>{_service_type_product[dataAddOn[i['id']]?.type_of] ? `(${_service_type_product[dataAddOn[i['id']]?.type_of].unit?.text})` : ''}</span>
                            </Col>
                            <Col span={3} >
                                <span>Cước phí <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_fee']}
                                    initialValue={dataAddOn[i['id']]?.fee}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập cước phí',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="Cước phí"
                                        _key={i['input_fee']}
                                        style={{ "width": "100%" }}
                                        disabled={_disabled === true ? true : (dataAddOn[i['id']]?.type_of ? true : false)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(e) => {
                                            fillter(e, i['id'], 'fee')
                                            // pushDataToDetail()
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1} ></Col>
                            <Col span={2} >
                                <span>Số kiện <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_num_of_package']}
                                    initialValue={dataAddOn[i['id']]?.num_of_package}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập số kiện',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="Số kiện"
                                        _key={i['input_num_of_package']}
                                        style={{ "width": "100%" }}
                                        disabled={_disabled || isDisabled}
                                        // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(e) => {
                                            fillter(e, i['id'], 'num_of_package')
                                            // fillter(`Kiện ${index+1}`, i['id'], 'input_quantity')
                                            // pushDataToDetail()
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={4} >
                                <span>Mô tả<span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_description']}
                                    initialValue={dataAddOn[i['id']]?.input_description}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập miêu tả',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Mô tả"
                                        _key={i['input_description']}
                                        style={{ "width": "100%" }}
                                        disabled={_disabled || isDisabled}
                                        // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={(e) => {
                                            let { value } = e.target;
                                            fillter(value, i['id'], 'description')
                                            // fillter(`Kiện ${index+1}`, i['id'], 'input_quantity')
                                            // pushDataToDetail()
                                        }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={1} className="a-thong-tin-hang">
                                {
                                    index !== 0 ? (<>
                                        <a href="javascript:void(0)" onClick={() => removeAddOn(i['id'])} className="a-thong-tin-hang">
                                            <CloseCircleOutlined style={{ color: 'red' }} />
                                        </a>
                                    </>) : (<>
                                        <a href="javascript:void(0)" onClick={() => pushAddOn()} className="a-thong-tin-hang">
                                            <PlusCircleOutlined />
                                        </a>
                                    </>)
                                }
                            </Col>
                        </Row>
                    )
                })
            }
        </>
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
    .a-thong-tin-hang {
        margin-top: 30px;
        margin-left: 10px;
    }
    Div.ant-row {
        margin-bottom: 0px !important;
    }
    .ant-col {
        padding-top: 5px !important;
        padding-bottom: 5px !important;
    }
    .type-custome {
        margin-top: 25px;
        padding-left: 30px;
    }
`