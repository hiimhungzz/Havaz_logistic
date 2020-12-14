import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined  } from "@ant-design/icons";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";

let typeHH = [
]

const AddOn = ({
    form,
    className,
    DataSet,
    DataBin,
    isDisabled,
    rowKey,
    definitions
}) => {
    let { service_type_product } = definitions.toJS()
    const [ _service_type_product ] = useState(service_type_product)
    _.forEach(_service_type_product, (v, k)=>{
        typeHH.push(v)
    })
    let tempAddOn = [],
        tempDataAddOn = {};

    const [addOn, SetAddOn] = useState(tempAddOn)
    const [dataAddOn, SetDataAddOn] = useState(tempDataAddOn)
    const pushAddOn = useCallback(async () => {
        let key = new Date().getTime()
        SetDataAddOn((props) => {
            let nextState = { ...props };
            nextState[key] =  {
                                description: '',
                                fee: '',
                                type_of: 1,
                                quantity: '',
                                numberPack: ""
                            }
            return nextState;
        })
        SetAddOn([...addOn, {id: key ,select: `${rowKey}_select_${key}`, input_numberPack: `${rowKey}_input_${key}`, input_quantity: `${rowKey}_input_${key}_quantity}`,  input_fee: `${rowKey}_input_${key}_fee}`}])
    },[addOn])
   
    const removeAddOn = useCallback(async (id) => {
        SetDataAddOn(_.omit(dataAddOn, id) )
        SetAddOn(addOn.filter((e)=>(e['id'] !== id)))
    },[addOn, dataAddOn])
    
    const fillter = useCallback(
        (value, key ,name) => {
            SetDataAddOn((props) => {
                let nextState = { ...props };
                nextState[key][name] = value
                return nextState;
            });
        }, [SetDataAddOn]
    );

    useEffect(() => {
        if(!_.isEmpty(dataAddOn)) {
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
            tempAddOn.push({id: index ,select: `${rowKey}_select${index}`, input_numberPack: `${rowKey}_input${index}`, input_quantity: `${rowKey}_input_${index}_quantity}`,  input_fee: `${rowKey}_input_${index}_fee}`})
            tempDataAddOn[index] = i
            formData[`${rowKey}_input_${index}_fee}`] = i['fee']
            formData[`${rowKey}_input_${index}_quantity}`] = i['quantity']
            formData[`${rowKey}_input_${index}}`] = i['numberPack'] || null
            index++
        })
        form.setFieldsValue(formData)
        SetAddOn(tempAddOn)
        SetDataAddOn(tempDataAddOn)
    },[])
    // console.log('render > thong tin hang')
    return (
        <>
            {
                _.map(addOn, (i, index)=>{
                    return (
                        <Row className={className}>
                            <Col span={1}>
                                <p style={{paddingTop: '29px',marginBottom: '0px'}}>
                                    {index+1}
                                </p>
                            </Col>
                            <Col span={4} >
                                <span>Loại hàng</span>
                                <DefineSelect
                                    placeholder=""
                                    dataBin={typeHH}
                                    change={(e) => {
                                        fillter(e, i['id'], 'type_of')
                                        // pushDataToDetail()
                                    }
                                    }
                                    value={dataAddOn[i['id']]?.type_of}
                                />
                            </Col>
                            <Col span={1} ></Col>
                            <Col span={4} >
                                <span>Số lượng <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_quantity']}
                                    initialValue={dataAddOn[i['id']]?.quantity}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập số lượng',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="số lượng"
                                        _key={i['input_quantity']}
                                        style={{ "width": "100%" }}
                                        disabled={isDisabled}
                                        // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(e) => {
                                                fillter(e, i['id'], 'quantity')
                                                fillter(`${index+1}` , i['id'], 'description')
                                                // pushDataToDetail()
                                            }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2} className="type-custome">
                                <span>{_service_type_product[dataAddOn[i['id']]?.type_of] ? `(${_service_type_product[dataAddOn[i['id']]?.type_of].unit_name})` : 'N/A'}</span>
                            </Col>
                            <Col span={4} >
                                <span>Cước phí <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_fee']}
                                    initialValue={dataAddOn[i['id']]?.fee}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập số lượng',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        // placeholder="số lượng"
                                        _key={i['input_fee']}
                                        style={{ "width": "100%" }}
                                        disabled={isDisabled}
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
                            <Col span={4} >
                                <span>Số kiện <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                                <Form.Item
                                    name={i['input_numberPack']}
                                    initialValue={dataAddOn[i['id']]?.numberPack}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hãy nhập số lượng',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="số lượng"
                                        _key={i['input_numberPack']}
                                        style={{ "width": "100%" }}
                                        disabled={isDisabled}
                                        // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(e) => {
                                                fillter(e, i['id'], 'numberPack')
                                                // fillter(`Kiện ${index+1}`, i['id'], 'input_quantity')
                                                // pushDataToDetail()
                                            }
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                {
                                    index !== 0 ? (<>
                                    <a href="javascript:void(0)" onClick={() => removeAddOn(i['id'])}>
                                            <CloseCircleOutlined style={{color: 'red'}}/>
                                        </a>
                                    </>) : (<>
                                        <a href="javascript:void(0)" onClick={() => pushAddOn()}>
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
    .anticon-plus-circle {
        margin-top: 30px;
        margin-left: 10px;
    }
    .anticon-close-circle {
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