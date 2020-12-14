/**
 * Input (Styled Component)
 */
import React, { useRef } from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { useBarcode } from "@createnextapp/react-barcode";
import './style.css'
import Filter from "./Filter"
import moment from "moment";
import { ARR_HTTT_ORDER } from "./constants";
import _ from "lodash"

const ComponentToPrint = React.forwardRef((props, ref) => {
  const convert = function (str) {
    if (str)
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    else
      return ""
  }
  const { dataBin } = props
  const { inputRef } = useBarcode({
    value: dataBin['code'],
    options: {
      format: "CODE128",
      width: 2.4,
    }
  })
  const objPayment = {};
  _.forEach(ARR_HTTT_ORDER, function (i) {
    objPayment[i['key']] = i['name']
  })

  let totalNumber = 0;
  if (dataBin['payment_type'] == 1) {
    totalNumber = dataBin['order_cod']
  } else if (dataBin['payment_type'] == 2) {
    totalNumber = dataBin['order_cod'] + dataBin['order_fee']
  }
  // print-source
  return (
    <div ref={ref} className="main_content print-source" >
      <div className="col_12 line_1">
        <div className="col_4_">
          <img style={{ "marginTop": '16px' }} src="data:image/png;base64,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" alt="" />
        </div>
        <div className="col_4_">
          <span className="t_900">WWW.haivan.com
              <br />1900-6763
            </span>
        </div>
        <div className="col_4_">
          <span className="t_900">Ngày giờ tạo đơn:</span>
          <br />
          <span className="normal_t">
            {moment(dataBin['created_at']).format('DD/MM/YYYY hh:mm')}
          </span>
        </div>
      </div>
      <div className="line_2">
        <div className="col_6">
          <span className="t_900">Người gửi</span>
          <br />
          <span className="t_900 name_size">{dataBin['sender']['name']}</span>
          <br />
          <span className="t_900 nun_size_1">{dataBin['sender']['phone']}</span>
        </div>
        <div className="col_6">
          <span className="t_900">Người nhận</span><br />
          <span className="t_900 name_size">{dataBin['receiver']['name']}</span><br />
          <span className="t_900 nun_size_1">{dataBin['receiver']['phone']}</span><br />
          <span className="normal_t">{dataBin['receiver']['address']}</span>
        </div>
      </div>
      <div className="line_3">
        <div className="col_4">
          <span className="big_text">{dataBin['destination']['id']}</span>
          <br />
          <span className="t_900">{dataBin['destination']['name']}</span>
        </div>
        <div className="col_4">
          <span className="big_text">{dataBin['source']['id']}</span>
          <br />
          <span className="t_900">{dataBin['source']['name']}</span>
        </div>
        <div className="col_4">
          <span className="big_text">{dataBin['num_of_package']}</span>
          <br />
          <span className="t_900">Kiện</span>
        </div>
      </div>
      <div className="line_4">
        <div className="col_4_1">
          <span className>
            <span className="t_900 fl_start">Cước phí: </span>
            <span className="fl_end">VNĐ</span>
          </span>
          <span className="t_900 nun_size ">{convert(dataBin['order_fee'])}</span>
          <span className="mg_16">{objPayment[dataBin['payment_type']]}</span>
        </div>
        <div className="col_4_2">
          <span className>
            <span className="t_900 fl_start">Thu hộ: </span>
            <span className="fl_end">VNĐ</span>
          </span>
          <span className="t_900 nun_size ">{convert(dataBin['order_cod'])}</span>
        </div>
        <div className="col_4_2">
          <span className>
            <span className="t_900">Còn phải thu: </span>
            <span className="fl_end">VNĐ</span>
          </span>
          <span className="t_900 nun_size ">{convert(totalNumber)}</span>
        </div>
      </div>
      <div className="line_5">
        <div className="col_8">
          <div className="svg">
            <svg ref={inputRef} />
          </div>
        </div>
        <div className="col_6_">
          <span className="t_900 ">Ghi chú đơn hàng:</span>
          <br /><span className="normal_t">{dataBin['note']}</span>
        </div>
      </div>
    </div>
  )
})
const Print = ({ className, dataBin }) => {
  const componentRef = useRef()
  return (
    <div>
      <ReactToPrint content={() => componentRef.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <a href="#" onClick={handlePrint}>In hóa đơn
            </a>
          )}
        </PrintContextConsumer>
        <ComponentToPrint ref={componentRef} dataBin={dataBin} />
      </ReactToPrint>

    </div>
  )
};

export default Print;