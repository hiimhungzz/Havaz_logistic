import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber } from "antd";
import { DefineSelect } from "components";
import _ from "lodash"
import styled from "styled-components";
import DefineAddRemove from './AddRemove'
import { render } from "react-testing-library";
const { TextArea } = Input;

// to do delete
const _hinhThucDenBu = [
        {
            key: 'MOT_PHAN',
            name: "Tiền mặt"
        },
        {
            key: 'TAT_CA',
            name: "Chuyển khoản"
        },
        {
            key: 'CDLS',
            name: "Quy đổi cước vận chuyển lần sau"
        }
    ]
const _denBu = [
        {
            key: 'CTY',
            name: "Công ty"
        },
        {
            key: 'NHAN_VIEN',
            name: "Nhân viên"
        },
        {
            key: 'CONG_TY_NHAN_VIEN',
            name: "Nhân viên & công ty"
        }
    ]
const _thanhToanCuoc = [
        {
        key: 'NHAN_VIEN',
        name: "Nhân viên"
        },
        {
        key: 'CONG_TY',
        name: "Công Ty"
        },
        {
            key: "KHAC",
            name: "Khác"
        }
    ]
///

const ThongTinMatHang = ({
    className
}) => {
    console.log('render > Thong tin may hang')
    const [form] = Form.useForm();
    const [ objThongTinMatHang, setThongTinMatHang] = useState({})
    const [ HinhThucDenBu, setHinhThucDenBu] = useState(_hinhThucDenBu)
    const [ DenBu, setDenBu] = useState(_denBu)
    const [ ThanhToanCuoc, setThanhToanCuoc] = useState(_thanhToanCuoc)
    const [ isDisabled, setDisabled] = useState({
        'TC': true,
        'DB': true
    })
    const fillter = useCallback(
        (value, name) => {
            setThongTinMatHang((props) => {
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
        [setThongTinMatHang]
      );
    console.log('render > thong tin may hang')
    return (
        <Form form={form}>
            <Row justify="start" gutter={[24, 32]} className={className}>
                <Col span={24} >
                    <span>Lý do mất hàng/hỏng hàng <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'note'}
                        initialValue={objThongTinMatHang['note']}
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
                                fillter(value, 'note')
                            }}
                            value={objThongTinMatHang['note']}
                           
                        />
                    </Form.Item>
                </Col>
                 <Col span={12} >
                    <span>Hình thức đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'hinhThucDenBu'}
                        initialValue={objThongTinMatHang['hinhThucDenBu']}
                        rules={[
                            {
                                required: true,
                                message: 'Chọn hình thức đền bù',
                            },
                        ]}
                    >
                        <DefineSelect
                            placeholder=""
                            dataBin={HinhThucDenBu}
                            change={(e) => {
                                fillter(e, 'hinhThucDenBu')
                            }
                            }
                            value={objThongTinMatHang['hinhThucDenBu']}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} ></Col>
                <Col span={6}>
                    <span>Tổng số tiền đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'tongSoTien'}
                        initialValue={objThongTinMatHang['tongSoTien']}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền đền bù',
                            },
                        ]}
                    >
                        <InputNumber
                            value={objThongTinMatHang['tongSoTien']}
                            placeholder="0"
                            _key={'tongSoTien'}
                            style={{ "width": "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                fillter(e, 'tongSoTien')
                            }
                        } />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <span>Sô tiền công ty đền bù <span style={{ color: '#dc2d2d' }}>(*)</span></span>
                    <Form.Item
                        name={'soTienCongTyDenBu'}
                        initialValue={objThongTinMatHang['soTienCongTyDenBu']}
                        rules={[
                            {
                                required: true,
                                message: 'Nhập số tiền công ty phải trả',
                            },
                        ]}
                    >
                        <InputNumber
                            value={objThongTinMatHang['soTienCongTyDenBu']}
                            placeholder="0"
                            _key={'soTienCongTyDenBu'}
                            style={{ "width": "100%" }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(e) => {
                                fillter(e, 'soTienCongTyDenBu')
                            }
                        } />
                    </Form.Item>
                </Col>
                <Col span={12} ></Col>
                <Col span={6} >
                    <span>Bên chịu trách nhiệm đền bù</span>
                    <DefineSelect
                        placeholder="Bên đền bù"
                        dataBin={DenBu}
                        change={(e) => {
                                fillter(e, 'benChiuTrachNhiem')
                                if(e === 'NHAN_VIEN' || e === 'CONG_TY_NHAN_VIEN') {
                                    setDisabled((props) => {
                                        let nextState = { ...props };
                                        nextState['DB'] = false;
                                        return nextState;
                                    });
                                } else {
                                    setDisabled((props) => {
                                        let nextState = { ...props };
                                          nextState['DB'] = true;
                                        return nextState;
                                    });
                                }
                            }
                        }
                        value={objThongTinMatHang['benChiuTrachNhiem']}
                    />
                </Col>
                <Col span={17}>
                    <span>Nhân viên</span>
                    <DefineAddRemove 
                        form={form}
                        rowKey="DB"
                        DataSet={(data) => { fillter(data, 'mangBenChiuTrachNhiem')}} 
                        DataBin={[{userId: "", amount: ""}]}
                        isSubmit={(data) => {console.log(data)}}
                        isDisabled={isDisabled['DB']}
                    />
                </Col>
                <Col span={6} >
                    <span>Bên thanh toán cước</span>
                    <DefineSelect
                        placeholder="Bên thanh toán"
                        dataBin={ThanhToanCuoc}
                        change={(e) => {
                                fillter(e, 'benThanhToan')
                                if(e === 'NHAN_VIEN') {
                                    setDisabled((props) => {
                                        let nextState = { ...props };
                                          nextState['TC'] = false;
                                        return nextState;
                                    });
                                } else {
                                    setDisabled((props) => {
                                        let nextState = { ...props };
                                          nextState['TC'] = true;
                                        return nextState;
                                    });
                                }
                            }
                        }
                        value={objThongTinMatHang['benThanhToan']}
                    />
                </Col>
                <Col span={17}>
                    <span>Nhân viên</span>
                    <DefineAddRemove
                        form={form}
                        rowKey="TC"
                        DataSet={(data) => { fillter(data, 'mangBenThanhToan') }} 
                        DataBin={[{userId: "12", amount: 45000},{userId: "12", amount: 60000}]}
                        isSubmit={(data) => {console.log(data)}}
                        isDisabled={isDisabled['TC']}
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default styled(ThongTinMatHang)`
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