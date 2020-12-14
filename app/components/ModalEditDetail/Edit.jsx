/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber, Card  } from "antd";
import ServiceBase from 'utils/ServiceBase';
import { makeSelectDefinitions } from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import styled from "styled-components";
import { BorderAllRounded } from "@material-ui/icons";
import _ from "lodash";
import {
  finalFee,
  tongCuocNguoiNhanTra,
  TongCuoc,
  validatePhone,
  _disabled
} from "./constants"
const { TextArea } = Input;
const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return str;
};
const _NGH = 1,
      _NNH = 2;
const showOrHide = (data, value) => {
  let result = 0
  if(data?.paying_side && data?.paying_side == value) {
    result = data?.amount || 0
  }
  return result
} 

const PhatHang = ({ 
    tabActive,
    className,
    objOrder,
    setLyDoPhatHang,
    lyDoPhatHang,
    onChange,
    definitions,
    _disabled
}) => {
    // columns
    const [ showInput, SetShowInput ] = useState({
      SDT_NGUOI_NHAN: false,
      HO_TEN_NGUOI_NHAN: false,
      DIA_CHI_NGUOI_NHAN: false,
      SDT_NGUOI_GUI: false,
      HO_TEN_NGUOI_GUI: false,
      NOTE: false,
    })

    const fillter = useCallback(
      (value, name) => {
        SetShowInput((props) => {
          let nextState = { ...props };
          nextState[name] = value;
          return nextState;
        });
      },
      [SetShowInput]
  );
    function checkColor(data){
      let col = "";
      if(data === 1){
        col = 'nguoi-gui-mau'
      }
      if(data === 2){
        col = 'nguoi-nhan-mau'
      }
      return col
    }
    return (
      <Row justify="start" className={className}>
        <Col span={13} className="ant-col-16-fix" style={{}}>
          <Row justify="start" gutter={[24, 32]} style={{marginRight: '3px'}}>
            <Col span={12} style={{'borderStyle': 'ridge',  marginBottom: '10px', marginRight: '-5px'}}>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}><span className="titel-block">Người gửi</span></Col>
                <Col span={12} style={{padding: '2px 0px 2px 5px'}}></Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Loại khách hàng</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px' , 'textAlign': 'right', color: '#1890ff'}}></Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Họ tên</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>
                  {
                    showInput.SDT_NGUOI_GUI ? (
                  <Input
                    _key={'sendername'}
                    value={objOrder?.sender?.name}
                    placeholder="Họ tên"
                    disabled={false}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'sender.name')
                  }}
                    />) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'SDT_NGUOI_GUI')
                      }} className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.sender?.name}
                    </>)
                  }
                </Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>SĐT</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>
                  {
                    showInput.HO_TEN_NGUOI_GUI ? (<Form.Item
                      name="senderphone"
                      initialValue={objOrder?.sender?.phone}
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
                      style={{marginBottom: '0px'}}
                  >
                  <Input
                    _key={'senderphone'}
                    value={objOrder?.sender?.phone}
                    placeholder="SĐT"
                    disabled={false}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'sender.phone')
                  }}
                    /></Form.Item>) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'HO_TEN_NGUOI_GUI')
                      }}  className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.sender?.phone}
                    </>)
                  }
                </Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>VP nhận hàng</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>{objOrder?.source?.name}</Col>
              </Row>
            </Col>
            <Col span={12} style={{'borderStyle': 'ridge',  marginBottom: '10px', marginLeft: '5px'}}>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}><span className="titel-block">Người nhận</span></Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px'}}></Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Họ tên</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px' , 'textAlign': 'right'}}>
                  {
                    showInput.HO_TEN_NGUOI_NHAN ? (
                  <Input
                    _key={'receivername'}
                    value={objOrder?.receiver?.name}
                    placeholder="Họ tên"
                    disabled={false}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'receiver.name')
                  }}
                    />) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'HO_TEN_NGUOI_NHAN')
                      }}  className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.receiver?.name}
                    </>)
                  }
                </Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>SĐT</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>
                  
                  {
                    showInput.SDT_NGUOI_NHAN ? (<Form.Item
                      name="receiverphone"
                      initialValue={objOrder?.receiver?.phone}
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
                      style={{marginBottom: '0px'}}
                  >
                  <Input
                    _key={'receiverphone'}
                    value={objOrder?.receiver?.phone}
                    placeholder="SĐT"
                    disabled={false}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'receiver.phone')
                  }}
                    /></Form.Item>) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'SDT_NGUOI_NHAN')
                      }}  className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.receiver?.phone}
                    </>)
                  }
                  
                  
                </Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>VP Đích</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>{objOrder?.destination?.name}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Địa chỉ phát hàng</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right'}}>
                  {
                    showInput.DIA_CHI_NGUOI_NHAN ? (
                  <Input
                    _key={'receiveraddress'}
                    value={objOrder?.receiver?.address}
                    placeholder="Địa chỉ"
                    disabled={false}
                    onChange={(e) => {
                        let { value } = e.target;
                        onChange(value, 'receiver.address')
                  }}
                    />) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'DIA_CHI_NGUOI_NHAN')
                      }}  className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.receiver?.address}
                    </>)
                  }
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{'borderStyle': 'ridge',  marginRight: '0px'}}>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} className="nguoi-nhan-gui-hang" style={{textAlign : 'left', marginTop: '5px'}}><span  className="titel-block">  Thông tin hàng</span></Col>
              </Row>
              {
                _.map(objOrder.items, (i, index) => {
                  return (
                    <>
                      <Row justify="start" gutter={[24, 32]}>
                        <Col span={1} style={{padding: '2px 0px 2px 15px'}}>{index+1}</Col>
                        <Col span={8} style={{padding: '2px 0px 2px 5px'}}>{
                            definitions.getIn([
                              "service_type_product",
                              `${i.type_of}`,
                              "name",
                            ])
                          }</Col>
                        <Col span={3} style={{padding: '2px 0px 2px 5px'}}>X {i.quantity} ({
                            definitions.getIn([
                              "units",
                              `${definitions.getIn([
                                "service_type_product",
                                `${i.type_of}`,
                                "unit_id",
                              ])}`,
                              "text",
                            ])
                            
                          })</Col>
                        <Col span={3} style={{padding: '2px 0px 2px 5px'}}>= {convert(i.fee)}</Col>
                        <Col span={3} style={{padding: '2px 0px 2px 5px', color: '#1890ff'}}>{i.num_of_package} kiện</Col>
                        <Col span={6} style={{padding: '2px 0px 2px 5px'}}>{i.description}</Col>
                      </Row>
                    </>
                  )
                })
              }
              <Row justify="start" gutter={[24, 32]}>
                <Col span={15} className="nguoi-nhan-gui-hang" style={{textAlign: 'right'}}><span>  Tổng kiện</span></Col>
                <Col span={9} className="nguoi-nhan-gui-hang" style={{color: 'rgba(255, 24, 24, 0.93)', marginLeft: '-7px', textAlign: 'left'}}><span  className="titel-block">  {_.sumBy(objOrder.items, 'num_of_package')} kiện</span></Col>
              </Row>
            </Col>
            <Col span={24} style={{'borderStyle': 'ridge',  marginRight: '0px', marginTop: '10px'}}>
              <Row gutter={[24, 32]}>
                <Col span={24} className="nguoi-nhan-gui-hang" style={{textAlign: 'left'}}>
                  <span  className="titel-block">Ghi chú nhận hàng</span>
                  
                </Col>
                <Col span={24}>
                  {
                    showInput.NOTE ? (
                      <TextArea
                        disabled={false}
                        placeholder={""}
                        autoSize={{
                            minRows: 3,
                            maxRows: 6
                        }}
                        value={objOrder['note']}
                        onChange={(e) => {
                            let { value } = e.target;
                            onChange(value, 'note')
                          }
                        }
                      />) : (<>
                      <a href="javascript:void(0)" onClick={() => {
                        fillter(true, 'NOTE')
                      }}  className={_disabled ? 'hidel-edit' : ""}> 
                        <i className="fa fa-pencil" style={{color: '#1890ff', marginRight: '5px'}}/>
                      </a>
                      {objOrder?.note}
                    </>)
                  }
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col span={10} className="ant-col-8-fix" style={{'borderStyle': 'ridge' }}>
          <Row justify="start" gutter={[24, 32]} style={{marginBottom: '0px'}}>
            <Col span={24} className="nguoi-nhan-gui-hang" style={{textAlign : 'left', marginTop: '17px'}}>Tổng cước (sau giảm giá)</Col>
            <Col span={12} className="nguoi-nhan-gui-hang" style={{textAlign : 'left', marginBottom: '10px'}}><span style={{fontSize: '30px'}} >{convert(finalFee(objOrder))}</span></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={24} className="nguoi-nhan-gui-hang" style={{textAlign : 'left'}}><span  className="titel-block">Thông tin cước phí & thanh toán</span></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}></Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'rgb(90, 243, 58)'}}>Người gửi hàng TT</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>Người nhận hàng TT</Col>
          </Row>

          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước vận chuyên</Col>
            <Col span={8} className="nguoi-nhan-gui-hang"><span>{convert(showOrHide(objOrder['order_fee'], _NGH))}</span></Col>
            <Col span={8} className="nguoi-nhan-gui-hang"><span style={{ color: 'red'}}>{convert(showOrHide(objOrder['order_fee'], _NNH))}</span></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Giảm giá</Col>
            <Col span={8} className="nguoi-nhan-gui-hang">{convert(showOrHide({
              paying_side : objOrder['order_fee'].paying_side,
              amount: objOrder['discount']
            }, _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>{convert(showOrHide({
              paying_side : objOrder['order_fee'].paying_side,
              amount: objOrder['discount']
            }, _NNH))}</Col>
          </Row>
          
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước thu hộ(COD)</Col>
            <Col span={8} className="nguoi-nhan-gui-hang">{convert(showOrHide(objOrder['cod_fee'], _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>{convert(showOrHide(objOrder['cod_fee'], _NNH))}</Col>
          </Row>

          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước ship nhận</Col>
            <Col span={8} className="nguoi-nhan-gui-hang">{convert(showOrHide(objOrder['r_shipping_fee'], _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>{convert(showOrHide(objOrder['r_shipping_fee'], _NNH))}</Col>
          </Row>

          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước ship trả</Col>
            <Col span={8} className="nguoi-nhan-gui-hang">{convert(showOrHide(objOrder['d_shipping_fee'], _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>{convert(showOrHide(objOrder['d_shipping_fee'], _NNH))}</Col>
          </Row>
          <hr className="dong-ke"/>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Tiền thu hộ COD</Col>
            <Col span={8} className="nguoi-nhan-gui-hang"></Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{color: 'rgba(255, 24, 24, 0.93)'}}>{convert(objOrder["order_cod"])}</Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Đã thu NG hàng</Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{color: 'rgb(90, 243, 58)'}}>{convert(TongCuoc(objOrder, _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang"></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Còn phải thu NG hàng</Col>
            <Col span={8} className="nguoi-nhan-gui-hang">{convert(showOrHide(objOrder['cod_fee'], _NGH))}</Col>
            <Col span={8} className="nguoi-nhan-gui-hang"></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Còn phải thu NN hàng</Col>
            <Col span={8} className="nguoi-nhan-gui-hang"></Col>
            <Col span={8} className="nguoi-nhan-gui-hang" style={{ color: 'red'}}>{convert(tongCuocNguoiNhanTra(objOrder, _NNH))}</Col>
          </Row>
        </Col>
        
      </Row>
    )
};

const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(PhatHang))`
  .ant-col-16-fix {
    margin-left: 25px !important;
    margin-top: 10px !important;
    margin-right: 10px !important;
    margin-bottom: -15px !important;
  }
  .ant-col-8-fix {
    padding-left: 15px !important;
    margin-top: -6px !important;
  }
  .col-23-fix {
    margin-left: 13px !important;
    margin-top: 10px !important;
    margin-right: 0px !important;
    padding-left: 15px !important;
  }
  .titel-block {
    font-weight: bold;
  }
  .tien-cuoc {
    font-size: 125%;
    font-weight: bold;
  }
  .nguoi-gui-mau {
    color: #55d40e;
  }
  .nguoi-nhan-mau {
    color: #870fd9;
  }
  .nguoi-nhan-gui-hang {
    text-align : right;
    padding: 2px 0px 2px 5px;
    padding-right: 20px !important;
    font-weight: bold;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
  .dong-ke {
    margin-top: -10px;
    margin-bottom: 25px;
    margin-right: 10px;
  }
  .hidel-edit {
    display: none
  }
`;