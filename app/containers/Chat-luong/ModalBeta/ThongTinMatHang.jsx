import React, { useCallback, useState } from "react";
import { Row, Col, Form, Select, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import DefineAddRemove from './AddRemove'
// import { render } from "react-testing-library";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";
const { TextArea } = Input;
const { Option } = Select;

const ThongTinMatHang = ({
    className,
    _issues,
    SetIssues,
    form,
    definitions
}) => {
    let { issue_compensation_method, issue_compensation_side, issue_feepaying_side } = definitions.toJS()
    const [ _issue_compensation_method ] = useState(issue_compensation_method)
    const [ _issue_compensation_side ] = useState(issue_compensation_side)
    const [ _issue_feepaying_side] = useState(issue_feepaying_side)
    const [ isDisabled] = useState({
        'TC': false,
        'DB': false
    })
    const fillter = useCallback(
        (value, name) => {
            SetIssues((props) => {
            let nextState = { ...props };
            let strName = name.split('.')
            if (strName.length === 1) {
              nextState[name] = value;
            } else {
                if(nextState[strName[0]]) {
                    nextState[strName[0]][strName[1]] = value
                } else {
                    nextState[strName[0]] = {};
                    nextState[strName[0]][strName[1]] = value
                }
              
            }
            return nextState;
          });
        },
        [SetIssues]
      );
    console.log('render > thong tin may hang', _issues)
    return (
        <Form form={form}>
            <Row justify="start" gutter={[24, 32]} className={className}>
                <Col span={24} >
                    <span>Lý do mất hàng/hỏng hàng <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'reason'}
                        initialValue={_issues?.reason}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập lý do mất hàng',
                            },
                        ]}
                    >
                        <TextArea
                            placeholder={'Nhập lý do'}
                            autoSize={{
                                minRows: 3,
                                maxRows: 6
                            }}
                            onChange={(e)=>{
                                let { value } = e.target;
                                fillter(value, 'reason')
                            }}
                            value={_issues?.reason}
                           
                        />
                    </Form.Item>
                </Col>
                <Col span={12} >
                    <span>Hình thức đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'compensation_method'}
                        initialValue={_issues?.compensation_method}
                        rules={[
                            {
                                required: true,
                                message: 'Chọn hình thức đền bù',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn hình thức đền bù"
                            showSearch
                            onChange={(e) => {
                                fillter(e, 'compensation_method')
                            }
                            }
                            filterOption={(input, option) =>
                                option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onSearch={
                                (e) => {
                                }
                            }
                            _key={'compensation_method'}
                        >
                            {
                                _.map(_issue_compensation_method, (i) => {
                                    return (<Option key={i['key'] ? i['key'] : i['id']}
                                        value={i['key'] ? i['key'] : i['id']}>{i['text']} </Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12} ></Col>
                <Col span={6}>
                    <span>Tổng số tiền đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'compensation_money'}
                        initialValue={_issues?.compensation_money}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền đền bù',
                            },
                        ]}
                    >
                        <InputNumber
                            value={_issues?.compensation_money}
                            placeholder="0"
                            _key={'compensation_money'}
                            style={{ "width": "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                fillter(e, 'compensation_money')
                            }
                        } />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>Số tiền công ty đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'business_money'}
                        initialValue={_issues?.business_money}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền công ty phải trả',
                            },
                        ]}
                    >
                        <InputNumber
                            value={_issues?.business_money}
                            placeholder="0"
                            _key={'business_money'}
                            style={{ "width": "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                fillter(e, 'business_money')
                            }
                        } />
                    </Form.Item>
                </Col>
                <Col span={12} ></Col>
                <Col span={6} >
                    <span>Bên chịu trách nhiệm đền bù</span>
                    <DefineSelect
                        placeholder="Bên đền bù"
                        dataBin={_issue_compensation_side}
                        change={(e) => {
                                fillter(e, 'compensation.side')
                                // if(e === 'NHAN_VIEN' || e === 'CONG_TY_NHAN_VIEN') {
                                //     setDisabled((props) => {
                                //         let nextState = { ...props };
                                //         nextState['DB'] = false;
                                //         return nextState;
                                //     });
                                // } else {
                                    // setDisabled((props) => {
                                    //     let nextState = { ...props };
                                    //       nextState['DB'] = false;
                                    //     return nextState;
                                    // });
                                // }
                            }
                        }
                        value={_issues?.compensation?.side}
                    />
                </Col>
                <Col span={17}>
                    <span>Nhân viên</span>
                    <DefineAddRemove 
                        form={form}
                        rowKey="DB"
                        DataSet={(data) => { fillter(data, 'compensation.amounts')}} 
                        DataBin={_issues?.compensation?.amounts || [{staff_id: "", amount: ""}]}
                        isSubmit={(data) => {console.log(data)}}
                        isDisabled={isDisabled['DB']}
                    />
                </Col>
                <Col span={6} >
                    <span>Bên thanh toán cước</span>
                    <DefineSelect
                        placeholder="Bên thanh toán"
                        dataBin={_issue_feepaying_side}
                        change={(e) => {
                                fillter(e, 'paying_fee.side')
                                // if(e === 'NHAN_VIEN') {
                                //     setDisabled((props) => {
                                //         let nextState = { ...props };
                                //           nextState['TC'] = false;
                                //         return nextState;
                                //     });
                                // } else {
                                    // setDisabled((props) => {
                                    //     let nextState = { ...props };
                                    //       nextState['TC'] = false;
                                    //     return nextState;
                                    // });
                                // }
                            }
                        }
                        value={_issues?.paying_fee?.side}
                    />
                </Col>
                <Col span={17}>
                    <span>Nhân viên</span>
                    <DefineAddRemove
                        form={form}
                        rowKey="TTC"
                        DataSet={(data) => { fillter(data, 'paying_fee.amounts') }} 
                        DataBin={_issues?.paying_fee?.amounts || [{staff_id: "", amount: ""}]}
                        isSubmit={(data) => {console.log(data)}}
                        isDisabled={isDisabled['TC']}
                    />
                </Col>
            </Row>
        </Form>
    )
}

const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});

const withConnect = connect(
    mapStateToProps,
    null
);

export default styled(withConnect(ThongTinMatHang))`
    Div.ant-row {
        margin-bottom: 0px !important;
    }
    .ant-col {
        padding-top: 5px !important;
        padding-bottom: 5px !important;
    }
    .ant-row-start {
        
    }
    .ant-form-item-control {
        display: flex;
        flex-direction: column;
        margin-top: -5px;
    }
    .ant-select-suffix {
        margin-top: 0px;
    }
`