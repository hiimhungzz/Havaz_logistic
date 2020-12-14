/**
 * Input (Styled Component)
 */
import React, { useRef, useState, useCallback } from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { useBarcode } from "@createnextapp/react-barcode";
import _ from "lodash";
import styled from "styled-components";
import moment from 'moment';
import { Row, Col, Button } from "antd";
import { PrinterTwoTone } from "@ant-design/icons";
import { formatNumber } from "utils/helper";
import { createStructuredSelector } from "reselect";
import { makeSelectTrip } from "containers/App/selectors";
import { connect } from "react-redux";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { API_BASE_URL, DATE_TIME_FORMAT } from "utils/constants";

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
    // const { inputRef } = useBarcode({
    //   value: dataBin.code,
    //   options: {
    //     format: "CODE128",
    //     width: 3.5,
    //     height: 50,
    //   },
    // });
    let tongCuocKhac = 0;
    let tongPhaiThu = 0;
    let tongCuocVC = 0;
    let tongDaThu = 0;
    let tongTra = 0;
    let currentTrip = trip.getIn([
      _.get(dataBin, "trip_route.direction") === 1 ? "A" : "B",
      _.get(dataBin, "trip_route.trip_id"),
    ]);
    return (
      <div ref={ref} className="print-source">
        <div className={`${className}`}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className="brand">
              <div className="brand-title">
                <h4>
                  CHUYỂN PHÁT NHANH {TypeDomain[process.env.REACT_APP_API_BASE_URL]}
                </h4>
                <strong>Hotline: {TypeHotLine[process.env.REACT_APP_API_BASE_URL]}</strong>
              </div>
            </div>
            <div className="barcode">
              {/* <svg ref={inputRef} /> */}
            </div>
          </div>
          <div className="cTable-name">
            <h2>BẢNG KÊ XUẤT HÀNG ĐI XE TUYẾN {dataBin && dataBin.status === 1 ? ` (BẢNG KÊ CHƯA CHỐT)` : null}</h2>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3>Mã bảng kê:&nbsp;{dataBin.code} </h3>
          </div>
          <div className="info">
            <div className="left">
              <>Văn phòng lập&nbsp;&nbsp;<b>{dataBin.current_hub || ""}</b></>
              <div>Thời gian lập&nbsp;&nbsp;&nbsp;&nbsp;<b>{dataBin.create_time || ""}</b></div>
              <div>Người lập&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>{dataBin.creator_name || ""}</b></div>
            </div>
            <div className="middle">
              <div>Ngày&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>{dataBin?.trip_route?.day}</b></div>
              <div>Biển số xe&nbsp;&nbsp;
                  <b>{dataBin.trip_bus?.license_plate || ""}</b></div>
              <div>Tuyến&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>{dataBin.trip_route?.route_name || ""}</b></div>
            </div>
            <div className="right">
              <div>Tên lái xe 1&nbsp;{<b>{dataBin.driver1 || ""}</b>}</div>
              <div>Tên lái xe 2&nbsp;{<b>{dataBin.driver2 || ""}</b>}</div>
              <div>Tên phụ xe&nbsp;&nbsp;{<b>{dataBin.attendants_name || ""}</b>}</div>
            </div>
          </div>
          {/* Editttt by hung */}

          <div className="table">
            <table
              className="tg"
              style={{ tableLayout: "fixed", width: "100%", maxWidth: "100%" }}
            >
              <colgroup>
                <col style={{ width: "30px" }} />
                <col style={{ width: "95px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "30px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "90px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "70px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "100px" }} />
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
                  {/* <th className="tg-nrix" rowSpan={2}>
                    COD
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Còn lại
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Tổng cước phí
                  </th> */}
                  <th className="tg-nrix" rowSpan={2}>
                    Cước VC
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Khoản cước khác
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    COD
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Đã thu NG hàng
                  </th>
                  <th className="tg-nrix" rowSpan={2}>
                    Phải thu NN hàng
                  </th>
                  <th className="tg-w2dt" rowSpan={3}>
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {_.map(dataBin.orders, (order) => {
                  const cuocVC = (order.order_fee.amount) - (order.discount)
                  tongCuocVC += cuocVC;

                  const cuocKhac = (order.d_shipping_fee.amount)
                    + (order.r_shipping_fee.amount)
                    + (order.cod_fee.amount)
                  tongCuocKhac += cuocKhac;

                  const daThu = (order.order_fee.paying_side === 1 ? order.order_fee.amount - order.discount : 0)
                    + (order.d_shipping_fee.paying_side === 1 ? order.d_shipping_fee.amount : 0)
                    + (order.r_shipping_fee.paying_side === 1 ? order.r_shipping_fee.amount : 0)
                  tongDaThu += daThu;




                  const phaiThu = (order.order_fee.paying_side === 2 ? order.order_fee.amount - order.discount : 0)
                    + (order.d_shipping_fee.paying_side === 2 ? order.d_shipping_fee.amount : 0)
                    + (order.r_shipping_fee.paying_side === 2 ? order.r_shipping_fee.amount : 0)
                    + (order.cod_fee.paying_side === 2 ? order.cod_fee.amount : 0)
                    + (order.order_cod)
                  tongPhaiThu += phaiThu;

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


                      {/* Cuoc VC */}
                      <td className="tg-mwxe">{formatNumber(cuocVC)}</td>

                      {/* cuocKhac */}
                      <td className="tg-mwxe">{formatNumber(cuocKhac)}</td>

                      {/* Cod */}
                      <td className="tg-mwxe">
                        {formatNumber((_.get(order, 'order_cod', 0)))}
                      </td>

                      {/* Đã thu NG*/}
                      <td className="tg-mwxe">{formatNumber(daThu)}</td>

                      {/* Phải thu NN */}
                      <td className="tg-mwxe">{formatNumber(phaiThu)}</td>
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
                    {_.sumBy(dataBin.orders, (x) => x.num_of_package)}
                  </td>
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-buh4" />
                  <td className="tg-57iy">

                    {/* Tổng cuoc vận chuyển */}
                    Tổng:
                    <br /> {formatNumber(tongCuocVC)}
                  </td>

                  {/* Tong cuoc khac */}
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongCuocKhac)}
                  </td>

                  {/* Tong COD */}
                  <td className="tg-57iy">
                    Tổng: <br />
                    {formatNumber(_.sumBy(dataBin.orders, (x) => x.order_cod))}
                  </td>
                  {/* Tong đã thu NG */}
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongDaThu)}
                  </td>

                  {/* Tong phai thu NN*/}
                  <td className="tg-57iy">
                    Tổng:
                    <br /> {formatNumber(tongPhaiThu)}
                  </td>
                  <td className="tg-yjjc" />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="info">
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
  // display: grid;
  // width: 100%;
  // grid-template-areas:
  //   "brand barcode"
  //   "cTableName  cTableName"
  //   "info  info"
  // grid-template-rows: 115px min-content max-content max-content;
  // grid-template-columns: 50% 50%;
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

const Print = ({ trip, profile, idBangKe }) => {
  const componentRef = useRef();
  const [data, setData] = useState([])

  const getData = useCallback(async (handlePrint) => {
    let result = await ServiceBase.requestJson({
      baseUrl: API_BASE_URL,
      url: `/v1/exportings/${idBangKe}?scope=should_exported`,
      method: "GET",
    });
    if (result && result.hasErrors) {
      Ui.showError({ message: "Có lỗi khi đọc bảng kê." });
    } else {
      const data = result.value.data;
      setData({
        ...data,
        current_hub: profile.current_hub.name,
        creator_name: data.creator?.name || '',
        destination_name: _.get(data, "depot_destination.label", ""),
        create_time: moment(data.create_time).format(DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM),
        driver1: data.drivers ? (data.drivers[0] && data.drivers[0]?.name) : '',
        driver2: data.drivers ? (data.drivers[1] && data.drivers[1]?.name) : '',
        attendants_name: data.attendants?.name || '',
        orders: _.map(data.orders, (order, orderId) => {
          return {
            stt: orderId + 1,
            order_id: order.code,
            destination: order.destination?.name,
            destination_id: order.destination?.id,
            receiver_address: order.receiver?.address,
            note: order.note,
            description: order.description,
            receiver_name: order.receiver?.name,
            receiver_phone: order.receiver?.phone,
            sender_name: order.sender?.name,
            source_name: order.source?.name,
            sender_address: order.sender?.address,
            sender_phone: order.sender?.phone,
            num_of_package: order.num_of_package,
            order_fee: order.order_fee,
            order_cod: order.order_cod,
            d_shipping_fee: order.d_shipping_fee,
            r_shipping_fee: order.r_shipping_fee,
            cod_fee: order.cod_fee,
            discount: order.discount,
            create_time: moment(order.created_at).format(
              DATE_TIME_FORMAT.DD_MM_YYYY
            ),
            status: order.status,
            payment_type: order.payment_type,
            daTra: 0,
            conLai: 0,
          };
        }),
      });
    }
    handlePrint()
  }, [idBangKe]);

  console.log("data", data)

  return (
    <ReactToPrint content={() => componentRef.current}>
      <PrintContextConsumer>
        {({ handlePrint }) => (
          <Button
            className="my-auto"
            style={{ display: "flex", alignItems: "center", marginLeft: 5 }}
            onClick={(e) => {
              getData(handlePrint)
            }}
            type="link"
            icon={<PrinterTwoTone />}
          />
        )}
      </PrintContextConsumer>
      <ComponentToPrint ref={componentRef} trip={trip} dataBin={data} />
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
