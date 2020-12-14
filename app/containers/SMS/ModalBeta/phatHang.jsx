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
import _ from "lodash"
import { BorderAllRounded } from "@material-ui/icons";
const { TextArea } = Input;
const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};
const calCuocPhi = function(objOder) {
  let final_fee = objOder?.order_cod;
  if (objOder.cod_fee && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0 && objOder?.cod_fee?.paying_side === 1)
    final_fee -= objOder?.cod_fee?.amount

  return  final_fee
}
const finalFee = function (objOder) {
  let final_fee = 0;
  if (objOder['order_fee']['amount'] && objOder['order_fee']['amount'] > 0)
    final_fee += objOder['order_fee']['amount']

  if (objOder.cod_fee && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']

  if (objOder['discount'])
    final_fee = final_fee - objOder['discount']

  return final_fee
}

const tongCuocNguoiNhanTra = function (objOder) {
  let final_fee = 0,
      discount = 0;
  if (objOder['discount'])
    discount = objOder['discount'] || 0

  if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 2 && objOder['order_fee']['amount'] > 0)
    final_fee += (objOder['order_fee']['amount'] - discount)

  if (objOder.cod_fee  && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 2 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    final_fee += objOder?.cod_fee?.amount

  if (objOder['r_shipping_fee']  && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 2 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
    final_fee += objOder['r_shipping_fee']['amount']

  if (objOder['d_shipping_fee']  && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 2 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
    final_fee += objOder['d_shipping_fee']['amount']


  return final_fee
}

const PhatHang = ({ 
    tabActive,
    className,
    objOrder,
    setLyDoPhatHang,
    lyDoPhatHang,
    definitions
}) => {
    // columns
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
    console.log(objOrder)
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
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.sender?.name}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>SĐT</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.sender?.phone}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>VP nhận hàng</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.source?.name}</Col>
              </Row>
            </Col>
            <Col span={12} style={{'borderStyle': 'ridge',  marginBottom: '10px', marginLeft: '5px'}}>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}><span className="titel-block">Người nhận</span></Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px'}}></Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Họ tên</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px' , 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.receiver?.name}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>SĐT</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.receiver?.phone}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>VP Đích</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.destination?.name}</Col>
              </Row>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{padding: '2px 0px 2px 15px'}}>Địa chỉ phát hàng</Col>
                <Col span={11} style={{padding: '2px 0px 2px 5px', 'textAlign': 'right', color: '#1890ff'}}>{objOrder?.receiver?.address}</Col>
              </Row>
            </Col>
            <Col span={24} style={{'borderStyle': 'ridge',  marginRight: '0px'}}>
              <Row justify="start" gutter={[24, 32]}>
                <Col span={12} style={{}}><span  className="titel-block">  Thông tin hàng</span></Col>
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
                        <Col span={3} style={{padding: '2px 0px 2px 5px', color: '#1890ff'}}>{i.num_of_package} kiện</Col>
                        <Col span={9} style={{padding: '2px 0px 2px 5px'}}>{i.description}</Col>
                      </Row>
                    </>
                  )
              })
            }
            </Col>
          </Row>
        </Col>
        <Col span={10} className="ant-col-8-fix" style={{'borderStyle': 'ridge' }}>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={24} ><span  className="titel-block">Thông tin cước phí & thanh toán</span></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Tiền thu hộ COD</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', color: '#1890ff', fontWeight: 'bold'}}>{convert(objOrder["order_cod"])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}>
            
            </Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước vận chuyên</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', fontWeight: 'bold'}}>{convert(objOrder['order_fee']['amount'])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}>
              <span className={
                checkColor(objOrder['order_fee']['paying_side'])
              }>
                {
                  definitions.getIn([
                    "payment_types",
                    `${objOrder['order_fee']['paying_side']}`,
                    "text",
                  ])
                }
              </span>
            </Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước thu hộ(COD)</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', fontWeight: 'bold'}}>{convert(objOrder['cod_fee']['amount'])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}>
            <span className={
                checkColor(objOrder['cod_fee']['paying_side'])
              }>
                {
                  definitions.getIn([
                    "payment_types",
                    `${objOrder['cod_fee']['paying_side']}`,
                    "text",
                  ])
                }
              </span>
            </Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước ship trả</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', fontWeight: 'bold'}}>{convert(objOrder['d_shipping_fee']['amount'])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}>
            <span className={
                checkColor(objOrder['d_shipping_fee']['paying_side'])
              }>
                {
                  definitions.getIn([
                    "payment_types",
                    `${objOrder['d_shipping_fee']['paying_side']}`,
                    "text",
                  ])
                }
              </span>
            </Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Cước ship nhận</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', fontWeight: 'bold'}}>{convert(objOrder['r_shipping_fee']['amount'])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}>
            <span className={
                checkColor(objOrder['r_shipping_fee']['paying_side'])
              }>
                {
                  definitions.getIn([
                    "payment_types",
                    `${objOrder['r_shipping_fee']['paying_side']}`,
                    "text",
                  ])
                }
              </span>
            </Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>giảm giá</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', fontWeight: 'bold'}}>{convert(objOrder['discount'])}</Col>
            <Col span={10} style={{ padding: '2px 0px 2px 5px'}}></Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Tổng cước(sau giảm giá)</Col>
            <Col span={6} style={{ padding: '2px 0px 2px 5px', color: '#1890ff', fontWeight: 'bold'}}>{convert(finalFee(objOrder))}</Col>
          </Row>
          <Row justify="start" gutter={[24, 32]}>
            <Col span={8} style={{ padding: '2px 0px 2px 15px'}}>Ghi chú nhận hàng</Col>
            <Col span={16} style={{ padding: '2px 0px 2px 5px'}}>{objOrder?.note}</Col>
          </Row>
        </Col>
        <Col span={23} className="col-23-fix">
          <Row gutter={[24, 32]}>
            
            <Col span={7} >Tiền COD phải thu được <span className={'tien-cuoc'} style={{color: '#1890ff'}}>{convert(objOrder["order_cod"])  || 0}</span></Col>
            <Col span={7}  >Tiền cước COD <span className={'tien-cuoc'} style={{color: '#1890ff'}}>{convert(objOrder?.cod_fee?.amount)  || 0}</span></Col>
            <Col span={10} ><span style={{color: 'rgba(255, 24, 24, 0.93)'}}>Số tiền thu hộ trả cho NG (sau khấu trừ) <span className={'tien-cuoc'}>{convert((calCuocPhi(objOrder)))  || 0}</span></span></Col>
            <Col span={24} >
              {/* <span>Ghi chú phát hàng</span>
              <TextArea
                  disabled={false}
                  placeholder={'Ghi chú phát hàng'}
                  autoSize={{
                      minRows: 3,
                      maxRows: 3
                  }}
                  value={lyDoPhatHang}
                  onChange={(e) => {
                      let { value } = e.target;
                      setLyDoPhatHang(value)
                  }
                  }
              /> */}
            </Col>
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
`;