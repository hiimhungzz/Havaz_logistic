/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber, Card  } from "antd";
import { ModalEditDetail} from "components";
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
    definitions,
    form,
    setObjOrder
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
    return (
      <Row justify="start" className={className}>
        <ModalEditDetail objOrder={objOrder} form={form} setObjOrder={setObjOrder} _disabled={true}/>
        <Col span={23} className="col-23-fix">
              <span>Ghi chú phát hàng</span>
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
              />
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