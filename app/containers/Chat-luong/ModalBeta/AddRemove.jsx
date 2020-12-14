import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {URI} from "utils/constants";
import ServiceBase from 'utils/ServiceBase';

const AddOn = ({
    className,
    DataSet,
    DataBin,
    isDisabled,
    rowKey
}) => {
    let tempAddOn = [],
        tempOption = {},
        tempDataAddOn = {};

    const getListStaff = useCallback(async (data, key) => {
        const result = await ServiceBase.requestJson({
            method: 'GET',
            url: URI['URI_STAFF_LIST'],
            data: {
                page: 1,
                per_page: 10,
                active: 1,
                // id: 62
            },
        });
        // console.log('URI_STAFF_LIST', result)
        if (result.hasErrors) {
            
        } else {
            SetObjOption((props) => {
                let nextState = { ...props };
                nextState[key] = result.value.data
                return nextState;
            })
        }
    })

    let index = 1;
    _.forEach(DataBin, (i) => {
        tempAddOn.push({ id: index, select: `${rowKey}_select${index}`, input: `${rowKey}_input${index}` })
        tempDataAddOn[index] = i
        index++
    })

    // const [form] = Form.useForm();
    const [addOn, SetAddOn] = useState(tempAddOn)
    const [dataAddOn, SetDataAddOn] = useState(tempDataAddOn) // [{userId: "", amount: ""}]
    const [objOption, SetObjOption] = useState({})
    const pushAddOn = useCallback(async () => {
        if(isDisabled)
            return

        let key = new Date().getTime()
        SetDataAddOn((props) => {
            let nextState = { ...props };
            nextState[key] = {
                amount: '',
                staff_id: ""
            }
            return nextState;
        })
        SetAddOn([...addOn, { id: key, select: `${rowKey}_select_${key}`, input: `${rowKey}_input_${key}` }])
    }, [addOn, isDisabled])

    

    const removeAddOn = useCallback(async (id) => {
        if(isDisabled)
            return
        
        SetDataAddOn(_.omit(dataAddOn, id))
        SetAddOn(addOn.filter((e) => (e['id'] !== id)))
    }, [addOn, dataAddOn,isDisabled])

    const fillter = useCallback(
        (value, key, name) => {
            SetDataAddOn((props) => {
                let nextState = { ...props };
                if (nextState[key]) {
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

    useEffect(() => {
        _.forEach(addOn, (i)=>{
            getListStaff({} ,i['select'])
        })
    },[addOn])
    let body = _.map(addOn, (i) => {
        console.log(dataAddOn[i['id']])
        return (
            <Row className={className}>
                <Col span={9} >
                    <DefineSelect
                        placeholder="Chọn nhận viên"
                        dataBin={objOption[i['select']]}
                        disabled={isDisabled}
                        change={(e) => {
                            fillter(e, i['id'], 'staff_id')
                        }
                        }
                        value={dataAddOn[i['id']]?.staff_id}
                    />
                </Col>
                <Col span={1} ></Col>
                <Col span={13} >
                    {/* <Form.Item
                        name={i['input']}
                        initialValue={dataAddOn[i['id']]?.amount}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền phải trả',
                            },
                        ]}
                    > */}
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
                    {/* </Form.Item> */}
                </Col>
                <Col span={1}>
                    {
                        i['id'] !== 1 ? (<>
                            <a href="javascript:void(0)" onClick={() => removeAddOn(i['id'])}>
                                <CloseCircleOutlined style={{ color: 'red' }} />
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


    console.log('render > AddOn')
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