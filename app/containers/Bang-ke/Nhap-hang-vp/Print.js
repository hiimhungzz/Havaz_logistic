/**
 * Input (Styled Component)
 */
import React, { useRef } from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { useBarcode } from "@createnextapp/react-barcode";
import _ from "lodash";
import styled from "styled-components";
import { Label } from "components";
import { Row, Col, Button } from "antd";
import { PrinterTwoTone } from "@ant-design/icons";
import { formatNumber } from "utils/helper";
import { createStructuredSelector } from "reselect";
import { makeSelectTrip } from "containers/App/selectors";
import { connect } from "react-redux";

const TypeDomain = {
  'https://devhh.haivan.com/api': 'HẢI VÂN',
  'https://api.cpn.haivanexpress.vn/api': 'HẢI VÂN',
  'https://api.cpn.hasonhaivan.vn/api': 'HÀ SƠN HẢI VÂN',
  'https://api.cpn.vungtau.havaz.vn/api': 'VŨNG TÀU'
}
const TypeHotLine = {
  'https://devhh.haivan.com/api': '1900-6763',
  'https://api.cpn.haivanexpress.vn/api': '1900-6763',
  'https://api.cpn.hasonhaivan.vn/api': '1900-6776',
  'https://api.cpn.vungtau.havaz.vn/api': '1900-6763'
}
const ComponentToPrint = styled(
  React.forwardRef(({ className, dataBin, trip }, ref) => {
    const { inputRef } = useBarcode({
      value: dataBin.code,
      options: {
        format: "CODE128",
        width: 3.5,
        height: 50,
      },
    });

    let tongConLai = 0;
    let tongTra = 0;
    return (
      <div ref={ref} className="print-source">
        <div className={`${className}`}>
          <div className="brand">
            <div className="brand-title">
              <h4>
                CHUYỂN PHÁT NHANH {TypeDomain[process.env.REACT_APP_API_BASE_URL]}
              </h4>
              <strong>Hotline: {TypeHotLine[process.env.REACT_APP_API_BASE_URL]}</strong>
            </div>
          </div>
          <div className="barcode">
            <svg ref={inputRef} />
          </div>
          <div className="cTable-name">
            <h2>BẢNG KÊ NHẬP HÀNG VÀO VĂN PHÒNG</h2>
          </div>
          <div className="info">
            <div className="left">
              <Row>
                <Col span={4}>
                  <Row>
                    <Col span={24}>
                      <Label>Văn phòng lập</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Thời gian lập</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Người lập</Label>
                    </Col>
                  </Row>
                </Col>
                <Col span={20}>
                  <Row>
                    <Col span={24}>
                      <Label>
                        <b>{dataBin.current_hub || "Chưa có"}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{dataBin.create_time || "Chưa có"}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{dataBin.staff_create || "Chưa có"}</b>
                      </Label>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          <div className="table">
            <table
              className="tg"
              style={{ tableLayout: "fixed", width: "100%", maxWidth: "100%" }}
            >
              <colgroup>
                <col style={{ width: "30px" }} />
                <col style={{ width: "95px" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <thead>
                <tr>

                  <th className="tg-nrix" rowSpan={2}>
                    Stt
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Mã đơn hàng
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Mô tả hàng
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Số kiện
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    SĐT
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Vp nhận hàng
                  </th>

                  <th className="tg-nrix" rowSpan={2}>
                    Điểm trả đích
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    COD
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Còn lại
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Tổng cước phí
                  </th>
                  <th className="tg-w2dt" rowSpan={3}>
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {_.map(dataBin.orders, (order) => {
                  let daTra = 0;
                  let conLai = 0;
                  if (order.payment_type === 1) {
                    // Đã trả
                    daTra = order.order_fee.amount || 0;
                  } else {
                    // Còn lại
                    conLai = (order.order_fee?.amount + (order.cod_fee ? order.cod_fee.amount : 0) - order.discount) || 0;
                  }
                  tongConLai += conLai;
                  tongTra += daTra;
                  return (
                    <tr key={order.id}>
                      <td className="tg-nrix">{order.stt}</td>
                      <td className="tg-cly1">
                        <span style={{ fontWeight: 400, fontStyle: "normal" }}>
                          {order.order_id}
                        </span>
                      </td>
                      <td className="tg-cly1">{order.description}</td>
                      <td className="tg-nrix">{order.num_of_package}</td>
                      <td className="tg-0lax">{order.receiver_phone}</td>
                      <td className="tg-0lax">
                        {order.source_name || ''}
                      </td>
                      <td className="tg-0lax">
                        {order.destination || order.depot_destination_name}
                      </td>

                      <td className="tg-mwxe">
                        {formatNumber(order.order_cod)}
                      </td>
                      <td className="tg-mwxe">{formatNumber(conLai)}</td>
                      {/* <td className="tg-mwxe">{formatNumber(daTra)}</td> */}
                      <td className="tg-mwxe">
                        {formatNumber(order.order_fee.amount)}
                      </td>
                      <td className="tg-cly1">{order.note}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-57iy">
                    Tổng: <br />
                    {_.sumBy(dataBin.orders, (x) => x.num_of_package)} kiện
                  </td>
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-57iy">
                    Tổng: <br />
                    {formatNumber(_.sumBy(dataBin.orders, (x) => x.order_cod))}
                  </td>
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongConLai)}
                  </td>
                  {/* <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongTra)}
                  </td> */}
                  <td className="tg-57iy">
                    Tổng:{" "}
                    {formatNumber(_.sumBy(dataBin.orders, (x) => x.order_fee.amount))}
                  </td>
                  <td className="tg-yjjc" />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="info_sign">
            <div className="left_sign">
              <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thanh tra</b>
              <div>(Ký, ghi rõ họ tên)</div>
            </div>
            <div className="middle_sign">
              <b>Người nhận hàng</b>
              <div>(Ký, ghi rõ họ tên)</div>
            </div>
            <div className="right_sign">
              <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Người lập</b>
              <div>(Ký, ghi rõ họ tên)</div>
            </div>
          </div>
        </div>
      </div>
    );
  })
)`
  font-size: 13px;
  padding: 14px 14px;
  display: grid;
  width: 100%;
  grid-template-areas:
    "brand barcode"
    "cTableName  cTableName"
    "info  info"
    "table table"
    "info_sign info_sign";
  grid-template-rows: 115px min-content max-content max-content;
  grid-template-columns: 50% 50%;
  .brand {
    grid-area: brand;
    .brand-title {
      padding: 5px 5px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      h4 {
        margin-bottom: 0px;
      }
    }
  }
  .barcode {
    max-height: 115px;
    grid-area: barcode;
    padding: 0px 5px;
    display: flex;
    justify-content: flex-end;
    svg {
      transform: translate(0, 0);
    }
  }
  .cTable-name {
    grid-area: cTableName;
    padding: 5px 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table {
    grid-area: table;
    padding: 5px 5px;
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
      font-size: 11px;
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
      padding: 2px 2px;
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
      font-size: 11px;
      text-align: center;
      vertical-align: middle;
    }
    .tg .tg-buh4 {
      background-color: #f9f9f9;
      text-align: left;
      vertical-align: top;
    }
    .tg .tg-z9od {
      font-size: 11px;
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
      font-size: 11px;
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
  .info {
    grid-area: info;
    padding: 5px 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .left {
      flex: 1;
    }
    .left_sign {
      // margin-left: 20px;
      flex: 8;
    }
    .middle_sign {
      margin-left: 200px;
      flex: 8;
    }
    .right_sign {
      margin-left: 170px;
      flex: 8;
    }
  }
  .info_sign {
    grid-area: info_sign;
    padding: 5px 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .left_sign {
      // margin-left: 20px;
      flex: 8;
    }
    .middle_sign {
      margin-left: 200px;
      flex: 8;
    }
    .right_sign {
      margin-left: 170px;
      flex: 8;
    }
  }
`;
const Print = ({ trip, dataBin, onPrint }) => {
  const componentRef = useRef();
  return (
    <ReactToPrint content={() => componentRef.current}>
      <PrintContextConsumer>
        {({ handlePrint }) => (
          <Button
            className="my-auto"
            style={{ display: "flex", alignItems: "center", marginLeft: 5 }}
            onClick={(e) => onPrint(handlePrint)}
            type="link"
            icon={<PrinterTwoTone />}
          />
        )}
      </PrintContextConsumer>
      <ComponentToPrint ref={componentRef} trip={trip} dataBin={dataBin} />
    </ReactToPrint>
  );
};
const mapStateToProps = createStructuredSelector({
  trip: makeSelectTrip(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default withConnect(Print);