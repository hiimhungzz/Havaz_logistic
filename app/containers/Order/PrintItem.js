/**
 * Input (Styled Component)
 */
import React, { useRef } from 'react';
import ReactToPrint, { PrintContextConsumer, useReactToPrint } from 'react-to-print';
import { useBarcode } from "@createnextapp/react-barcode";
import moment from "moment";
import { PrinterTwoTone } from '@ant-design/icons';
import { ARR_HTTT_ORDER } from "./constants";
import styled from "styled-components";
import _ from "lodash";
import { Button } from 'antd';
import Barcode from 'react-barcode'


const ComponentToPrint = React.forwardRef((props, ref) => {
  const convert = function (str) {
    if (str)
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    else
      return ""
  }
  const { dataBin } = props

  const objPayment = {};
  _.forEach(ARR_HTTT_ORDER, function (i) {
    objPayment[i['key']] = i['name']
  })

  let totalNumber = 0;
  if (dataBin['payment_type'] === 1) {
    totalNumber = dataBin['order_cod']
  } else if (dataBin['payment_type'] === 2) {
    totalNumber = dataBin['order_cod'] + dataBin['order_fee']
  }
  const sum_num_of_package = _.sumBy(dataBin.items, 'num_of_package')
  let arrNumber = [];
  for (let index = 0; index < sum_num_of_package; index++) {
    arrNumber.push(index)
  }
  // print-source
  return (
    <div ref={ref} >
      {
        _.map(arrNumber, (v, k) => {
          // const { inputRef } = useBarcode({
          //   value: dataBin['code'] || '#8888 9999',
          //   options: {
          // format: "CODE128", 
          // width: 2.8,
          //   }
          // })
          return (
            <div className="main_content_item print-source" >
              <div className="svg_item">
                {/* <svg ref={inputRef} /> */}
                <Barcode value={dataBin['code'] || '#8888 9999'} format={"CODE128"} width={2.8} />
              </div>
              <div className="line_2_item">
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '30px' }}>{k + 1}/{sum_num_of_package}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '30px' }}>{dataBin['receiver']['phone']}</span>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
})
const Print = ({ className, dataBin, onPrint, onShow }) => {
  const componentRef = useRef()
  const autoHandlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  if (onPrint === true) {
    setTimeout(function () {
      autoHandlePrint()
    }, 100)
  }
  return (
    <div className={className}>
      <ReactToPrint content={() => componentRef.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <div style={{ cursor: 'pointer' }} className={onShow ? 'print-source' : ""} onClick={(e) => {
              e.preventDefault();
              handlePrint();
            }}>
              <Button type="primary" title="In nhiệt" danger >
                In tem phụ
                <PrinterTwoTone />
              </Button>
            </div>
          )}
        </PrintContextConsumer>
        <ComponentToPrint ref={componentRef} dataBin={dataBin} />
      </ReactToPrint>
    </div>
  )
};

export default styled(Print)`
  *{
    font-family: 'Roboto', sans-serif;
  }
  .main_content_item {
    border:0.5px solid black;
    /* width: 780px;
    height: 1000px; */
    width: 335px;
    height: 262px;
    display:grid;
    grid-template-rows: 1fr 2fr 2fr 1.8fr 3fr;

  }
  .col_12_item{
    border:0.5px solid black;
  }
  .svg_item {
    text-align: center;
    padding: 8px;
    height: 174px;
  }
  .print-source {
    display: none;
  }
  body > .print-source {
    display: block;
  }

  @media print {
    .print-source {
      display: block;
    }
  }

`;