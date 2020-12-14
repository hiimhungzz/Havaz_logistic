import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined  } from "@ant-design/icons";


const AddOn = ({
    className,
    DataSet,
    DataBin,
    isDisabled,
    rowKey
}) => {
    let tempAddOn = [],
        tempDataAddOn = {};
    let index = 1;
    _.forEach(DataBin, (i) => {
        tempAddOn.push({id: index ,select: `${rowKey}_select${index}`, input: `${rowKey}_input${index}`})
        tempDataAddOn[index] = i
        index++
    })

    // const [form] = Form.useForm();
    const [addOn, SetAddOn] = useState(tempAddOn)
    const [dataAddOn, SetDataAddOn] = useState(tempDataAddOn) // [{userId: "", amount: ""}]
    const pushAddOn = useCallback(async () => {
        let key = new Date().getTime()
        SetDataAddOn((props) => {
            let nextState = { ...props };
            nextState[key] = {
                amount: '',
                userId: ""
            }
            return nextState;
        })
        SetAddOn([...addOn, {id: key ,select: `${rowKey}_select_${key}`, input: `${rowKey}_input_${key}`}])
    },[addOn])

    const removeAddOn = useCallback(async (id) => {
        SetDataAddOn(_.omit(dataAddOn, id) )
        SetAddOn(addOn.filter((e)=>(e['id'] !== id)))
    },[addOn, dataAddOn])
    
    const fillter = useCallback(
        (value, key ,name) => {
            SetDataAddOn((props) => {
                let nextState = { ...props };
                if(nextState[key]){
                    nextState[key][name] = value
                } else {
                    nextState[key] = {
                        amount: 0,
                        userId: ""
                    }
                    nextState[key][name] = value
                }
                return nextState;
            });
        }, [SetDataAddOn]
    );

    useEffect(() => {
        let arrTeam = []
        _.forEach(dataAddOn, (value, key) => {
            arrTeam.push(value)
        })
        DataSet(arrTeam)
    }, [dataAddOn])

    let body = _.map(addOn, (i)=>{
        return (
            <Row className={className}>
                <Col span={9} >
                    <Form.Item
                        name={i['select']}
                        initialValue={dataAddOn[i['id']]?.select}
                        rules={[
                            {
                                required: true,
                                message: 'Chọn nhân viên',
                            },
                        ]}
                    >
                        <DefineSelect
                            placeholder=""
                            dataBin={[]}
                            disabled={isDisabled}
                            change={(e) => {
                                // fillter(e, 'payment_type')
                                }
                            }
                            // value={objOrder['payment_type']}
                        />
                    </Form.Item>
                </Col>
                <Col span={1} ></Col>
                <Col span={13} >
                    <Form.Item
                        name={i['input']}
                        initialValue={dataAddOn[i['id']]?.amount}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền phải trả',
                            },
                        ]}
                    >
                        <InputNumber
                            value={dataAddOn[i['id']]?.amount}
                            placeholder="Số tiền phải trả"
                            _key={i['inputId']}
                            style={{ "width": "100%" }}
                            disabled={isDisabled}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(e) => {
                                    fillter(e, i['id'], 'amount')
                                }
                            }
                        />
                    </Form.Item>
                </Col>
                <Col span={1}>
                    {
                        i['id'] !== 1 ? (<>
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

    
    // console.log('render > AddOn')
    return (
        <>
            {body}
        </>
    )
}

export default styled(AddOn)`
    .anticon-plus-circle {
        margin-top: 10px;
        margin-left: 10px;
    }
    .anticon-close-circle {
        margin-left: 10px;
    }
    .ant-row  {
        margin-top: -5px;
    }
`