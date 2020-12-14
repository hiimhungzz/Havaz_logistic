
/**
 * In vesion 2.
 *F748.
 *D488 .
 *HIIMHUNG
 */


import { PrinterTwoTone } from '@ant-design/icons';
import { useBarcode } from "@createnextapp/react-barcode";
import { Table, Button, Row, Col, Input, Card } from "antd";
import { makeSelectDefinitions } from "containers/App/selectors";
import _ from "lodash";
import moment from "moment";
import React, { useRef } from 'react';
import { connect } from "react-redux";
import { useSelector } from 'react-redux';
import ReactToPrint, { PrintContextConsumer, useReactToPrint } from 'react-to-print';
import { createStructuredSelector } from "reselect";
import { Label } from "components";
import styled from "styled-components";
/*
 * In hóa đơn "Phiếu Gửi"
 */
var inputRef = "";

const ComponentToPrint = styled(
    React.forwardRef(({ className, definitions, itemSelected, data }, ref) => {
        const convert = function (str) {
            if (str)
                return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            else
                return 0
        }
        const App = useSelector(state => state.App.toJS());
        // print-source
        return (
            <div ref={ref} className="print-source" style={{ marginLeft: 30 }} >
                <div className={`${className}`}>
                    <div style={{ height: 20 }}>
                    </div>
                    <div style={{ height: 40 }}>
                        <h3 style={{ textAlign: "center" }}>THÔNG TIN CHI TIẾT BẢNG KÊ</h3>
                    </div>
                    <div className="d-flex">
                        <div style={{ width: "60%" }}>
                            <div className="d-flex" >
                                <div>Người tạo bảng kê: </div>
                                <div><h4> &nbsp;&nbsp;{App && App.profile && App.profile.name}</h4></div>
                            </div>
                            <div className="d-flex">
                                <div xs={8}> Thời gian lập:</div>
                                <div xs={12}><h4>&nbsp;&nbsp;{moment(itemSelected.created_at).format("DD-MM-YYYY HH:mm")}</h4></div>
                            </div>
                            <div className="d-flex">
                                <div xs={8}>Số tiền </div>
                                <div xs={12}><h4>&nbsp;&nbsp;{convert(itemSelected && itemSelected.sum_price)} &nbsp;VNĐ</h4></div>
                            </div>
                        </div>
                        <div className="d-flex" style={{ width: "40%" }}>
                            <div><h4>Ghi chú:</h4></div>
                            <div>&nbsp;&nbsp;{itemSelected && itemSelected.note}</div>
                        </div>
                    </div>
                    <div className="table">
                        <table
                            className="tg"
                            style={{ tableLayout: "fixed", width: "100%", maxWidth: "100%" }}
                        >
                            <colgroup>
                                <col style={{ width: "30px" }} />
                                <col style={{ width: "150px" }} />
                                <col style={{ width: "150px" }} />
                                <col style={{ width: "200px" }} />
                                <col style={{ width: "200px" }} />
                                <col style={{ width: "200px" }} />
                            </colgroup>
                            <thead>
                                <tr>

                                    <th className="tg-nrix" rowSpan={2}>
                                        Stt
                                    </th>
                                    <th className="tg-nrix" rowSpan={2}>
                                        Tên nhân viên
                                    </th>
                                    <th className="tg-nrix" rowSpan={2}>
                                        Mã nhân viên
                                    </th>
                                    <th className="tg-nrix" rowSpan={2}>
                                        Mã đơn hàng
                                    </th>
                                    <th className="tg-nrix" rowSpan={2}>
                                        Loại khoản thu
                                    </th>
                                    <th className="tg-nrix" rowSpan={2}>
                                        Số tiền nhân viên thu
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {_.map(data, (item, index) => {
                                    return (
                                        <tr key={item.index}>
                                            <td className="tg-nrix">{index + 1}</td>
                                            <td className="tg-cly1">{item.created_by_name}</td>
                                            <td className="tg-nrix">{_.get(item, "submitter.code")}</td>
                                            <td className="tg-0lax">{item.order_id}</td>
                                            <td className="tg-0lax">{definitions.getIn(["bill_payment_type", item.type + "", "text"])}</td>
                                            <td className="tg-0lax">{convert(item["order_fee"] + item["r_shipping_fee"] + item["d_shipping_fee"] + item["cod_fee"] + item["order_cod"]) || 0}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }))`
font-size: 16px;
  padding: 1rem 1rem;
//   display: grid;
  width: 100%;
  grid-template-areas:
//   "cTableName  cTableName"
//   "info  info"
    "table table";
  grid-template-rows: 115px min-content max-content max-content;
  grid-template-columns: 50% 50%;

.table {
    grid-area: table;
    padding: 10px 10px;
    .tg {
      border-collapse: collapse;
      border-color: #ccc;
      border-spacing: 0;
    }
    .tg td {
      background-color: #fff;
      border-color: #ccc;
      border-style: solid;
      border-width: 1px;
      color: #333;
      font-family: Arial, sans-serif;
      font-size: 12px;
      overflow: hidden;
      padding: 5px 5px;
      word-break: normal;
    }
    .tg th {
      background-color: #f0f0f0;
      border-color: #ccc;
      border-style: solid;
      border-width: 1px;
      color: #333;
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: normal;
      overflow: hidden;
      padding: 5px 5px;
      word-break: normal;
    }
    .tg .tg-cly1 {
      text-align: left;
      vertical-align: middle;
    }
    .tg .tg-mwxe {
      text-align: right;
      vertical-align: middle;
    }
    .tg .tg-w2dt {
      font-size: 12px;
      text-align: center;
      vertical-align: middle;
    }
    .tg .tg-buh4 {
      background-color: #f9f9f9;
      text-align: left;
      vertical-align: top;
    }
    .tg .tg-z9od {
      font-size: 12px;
      text-align: left;
      vertical-align: top;
    }
    .tg .tg-nrix {
      text-align: center;
      vertical-align: middle;
    }
    .tg .tg-57iy {
      background-color: #f9f9f9;
      text-align: center;
      vertical-align: middle;
    }
    .tg .tg-ltad {
      font-size: 12px;
      text-align: left;
      vertical-align: top;
    }
    .tg .tg-0lax {
      text-align: left;
      vertical-align: top;
    }
    .tg .tg-yjjc {
      background-color: #f9f9f9;
      text-align: left;
      vertical-align: middle;
    }
    
  }
`
const PrintOrder = ({ className, data, onPrint, onShow, definitions, itemSelected }) => {
    console.log("Print", data);
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
                        <div style={{ cursor: 'pointer' }} onClick={(e) => {
                            e.preventDefault();
                            handlePrint();

                        }}>
                            <Button type="primary" title="In A4" danger >
                                <PrinterTwoTone />
                                In A4
                        </Button>
                        </div>
                    )}
                </PrintContextConsumer>
                <ComponentToPrint className={className} ref={componentRef} data={data} definitions={definitions} itemSelected={itemSelected} />
            </ReactToPrint>
        </div>
    )
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(PrintOrder))`
    .css_text {
        font-size: 16px;
    },
`;
