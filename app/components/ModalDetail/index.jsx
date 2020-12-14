/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber, Card  } from "antd";
import { DefineSelect } from "components";
import { Ui } from "utils/Ui";
import ServiceBase from 'utils/ServiceBase';
import { URI } from "utils/constants";
import { ARR_HTTT_ORDER } from "./constants";
import _ from "lodash"
import styled from "styled-components";
import DefineThongTinHang from './ThongTinHang'
import DefineThongTinNguoiGui from './ThongTinNguoiGui'
import DefineThongTinNguoiNhan from './ThongTinNguoiNhan'
import DefineThongTinCuocPhi from './ThongTinCuocPhi'
const { TextArea } = Input;
var fnTimeOut;

const DetailOrder = ({
    objOrder,
    setObjOrder,
    tabActive,
    form,
    className,
    _disabled,
    isShowIssues
}) => {
    const [OrderStatus, SetOrderStatus] = useState([])
    const [Source, SetSource] = useState([])
    const [address, SetAddress] = useState([])
    const [disabled, Setdisabled] = useState(_disabled || false)

    let objNguoiGui = objOrder
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

    const searchTimeOut = function (value) {
        window.clearTimeout(fnTimeOut);
        fnTimeOut = window.setTimeout(function () {
            getAddress(value);
        }, 300);
    };

    const getAddress = useCallback(async (objParam) => {
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: URI['URI_ORDER_ADDRESS'],
            data: objParam
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetAddress(result.value.data);
        }
    })
    // change data
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
    
    useEffect(() => {
        if (tabActive === 'DETAIL') {
            getlistSource()
            SetOrderStatus(ARR_HTTT_ORDER)
        }
    }, [tabActive])

    useEffect(() => {
        if(objOrder.sender.phone)
            searchTimeOut({
                'filterBy[sender_phone]' : `${objOrder.sender.phone}:like`
            })
    }, [objOrder.sender.phone])
    // console.log('objOrder', objOrder)
    // console.log('render > Detail')
    return (
        <Form form={form} className={className} style={{'backgroundColor': 'rgba(236, 236, 235, 0.45)', marginTop: '-16px'}}>
            <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{ "fontSize": "17px" , paddingBottom: '0px !important'}}>
                    <DefineThongTinNguoiGui _data={objNguoiGui} onChange={fillter} _disabled={disabled} form={form} _result={address}/>
                </Col >
                <Col span={12} style={{ "fontSize": "17px", paddingBottom: '0px !important' }}>
                    <DefineThongTinNguoiNhan _data={objOrder} onChange={fillter} _disabled={disabled} _Source={Source}/>
                </Col >
                <Col span={24} style={{ paddingBottom: '0px !important'}}>
                    <Card title="Thông tin hàng" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}}>
                        <DefineThongTinHang 
                            form={form}
                            rowKey="TC"
                            DataSet={(data) => { 
                                // console.log('data>',data)
                                fillter(_.sumBy(data, 'fee') || 0, 'order_fee.amount')
                                fillter(data, 'items')

                            }} 
                            DataBin={objOrder['items']}
                            // isDisabled={}
                            _disabled={disabled === true ? true : (objOrder.id ? true : false)}
                            _data={objOrder}
                        />
                    </Card>
                </Col>
                <Col span={24} style={{paddingBottom: '0px !important'}}>
                    <DefineThongTinCuocPhi _data={objOrder} onChange={fillter} _disabled={disabled === true ? true : (objOrder.id ? true : false)} _orderStatus={OrderStatus} form={form}/>
                </Col>
                
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