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
    let currentTrip = trip.getIn([
      _.get(dataBin, "trip_route.direction") === 1 ? "A" : "B",
      _.get(dataBin, "trip_route.trip_id"),
    ]);
    return (
      <div ref={ref} className="print-source">
        <div className={`${className}`}>
          <div className="brand">
            <div className="brand-title">
              <h4>
                HAIVAN EXPRESS <br /> CHUYỂN PHÁT NHANH {TypeDomain[process.env.REACT_APP_API_BASE_URL]}
              </h4>
              <strong>Hotline: 1900-6763</strong>
            </div>
          </div>
          <div className="barcode">
            <svg ref={inputRef} />
          </div>
          <div className="cTable-name">
            <h2>BẢNG KÊ CHI TIẾT XUẤT HÀNG ĐI XE TUYẾN</h2>
          </div>
          <div className="info">
            <div className="left">
              <Row>
                <Col span={8}>
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
                <Col span={16}>
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
            <div className="middle">
              <Row>
                <Col span={6}>
                  <Row>
                    <Col span={24}>
                      <Label>Ngày</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Biển số xe</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Tuyến</Label>
                    </Col>
                  </Row>
                </Col>
                <Col span={18}>
                  <Row>
                    <Col span={24}>
                      <Label>
                        <b>{_.get(currentTrip, "time_run", "Chưa có")}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{_.get(currentTrip, "license_plate", "Chưa có")}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{dataBin.trip_route?.route_name || "Chưa có"}</b>
                      </Label>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="right">
              <Row>
                <Col span={6}>
                  <Row>
                    <Col span={24}>
                      <Label>Tên lái xe 1</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Tên lái xe 2</Label>
                    </Col>
                    <Col span={24}>
                      <Label>Tên phụ xe</Label>
                    </Col>
                  </Row>
                </Col>
                <Col span={18}>
                  <Row>
                    <Col span={24}>
                      <Label>
                        <b>{dataBin.driver || "Chưa có"}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{"Chưa có"}</b>
                      </Label>
                    </Col>
                    <Col span={24}>
                      <Label>
                        <b>{"Chưa có"}</b>
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
                <col style={{ width: "20px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "82px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "62px" }} />
                <col style={{ width: "71px" }} />
                <col style={{ width: "71px" }} />
                <col style={{ width: "71px" }} />
                <col style={{ width: "76px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "70px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="tg-cly1" rowSpan={2}>
                    Stt
                  </th>
                  <th className="tg-nrix" colSpan={2}>
                    Người gửi
                  </th>
                  <th className="tg-nrix" colSpan={4}>
                    Người nhận
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Số kiện
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    COD
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Còn lại
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Đã trả
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Tổng cước phí
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Mã đơn hàng
                  </th>
                  <th className="tg-w2dt" rowSpan={2}>
                    Ghi chú
                  </th>
                </tr>
                <tr>
                  <td className="tg-57iy">Tên</td>
                  <td className="tg-57iy">SĐT</td>
                  <td className="tg-57iy">Tên</td>
                  <td className="tg-57iy">SĐT</td>
                  <td className="tg-57iy">Vp đích</td>
                  <td className="tg-57iy">Địa chỉ</td>
                </tr>
              </thead>
              <tbody>
                {_.map(dataBin.orders, (order) => {
                  let daTra = 0;
                  let conLai = 0;
                  if (order.payment_type === 1) {
                    // Đã trả
                    daTra = order.order_fee || 0;
                  } else {
                    // Còn lại
                    conLai = order.order_fee || 0;
                  }
                  tongConLai += conLai;
                  tongTra += daTra;
                  return (
                    <tr key={order.id}>
                      <td className="tg-nrix">{order.stt}</td>
                      <td className="tg-z9od">{order.sender_name}</td>
                      <td className="tg-ltad">{order.sender_phone}</td>
                      <td className="tg-0lax">{order.receiver_name}</td>
                      <td className="tg-0lax">{order.receiver_phone}</td>
                      <td className="tg-0lax">
                        {order.destination || order.depot_destination_name}
                      </td>
                      <td className="tg-0lax">{order.receiver_address}</td>
                      <td className="tg-nrix">{order.num_of_package}</td>
                      <td className="tg-mwxe">
                        {formatNumber(order.order_cod)}
                      </td>
                      <td className="tg-mwxe">{formatNumber(conLai)}</td>
                      <td className="tg-mwxe">{formatNumber(daTra)}</td>
                      <td className="tg-mwxe">
                        {formatNumber(order.order_fee)}
                      </td>
                      <td className="tg-cly1">
                        <span style={{ fontWeight: 400, fontStyle: "normal" }}>
                          {order.id}
                        </span>
                      </td>
                      <td className="tg-cly1">{order.note}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-57iy">
                    Tổng: <br />
                    {_.sumBy(dataBin.orders, (x) => x.num_of_package)} kiện
                  </td>
                  <td className="tg-57iy">
                    Tổng: <br />
                    {formatNumber(_.sumBy(dataBin.orders, (x) => x.order_cod))}
                  </td>
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongConLai)}
                  </td>
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongTra)}
                  </td>
                  <td className="tg-57iy">
                    Tổng:
                    <br />
                    {formatNumber(_.sumBy(dataBin.orders, (x) => x.order_fee))}
                  </td>
                  <td className="tg-yjjc" />
                  <td className="tg-yjjc" />
                </tr>
              </tbody>
            </table>
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
    "table table";
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
      flex: 8;
    }
    .middle {
      flex: 8;
    }
    .right {
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
