// /**
//  * Input (Styled Component)
//  */
// import { PrinterTwoTone } from '@ant-design/icons';
// import { useBarcode } from "@createnextapp/react-barcode";
// import _ from "lodash";
// import moment from "moment";
// import React, { useRef, memo } from 'react';
// import ReactToPrint, { PrintContextConsumer, useReactToPrint } from 'react-to-print';
// import styled from "styled-components";
// import { ARR_HTTT_ORDER } from "./constants";
// import './style.css';
// import { Button } from 'antd';
// import { DefineSelect } from "components";
// import { makeSelectDefinitions } from "containers/App/selectors";
// import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";
// /*
//  * In hóa đơn "Phiếu Gửi"
//  */
// var inputRef = "";

// const ComponentToPrint = React.forwardRef((props, ref) => {
//     console.log("sssssssss", props);
//     const convert = function (str) {
//         if (str)
//             return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//         else
//             return ""
//     }

//     // case Đọc giá tiền
//     const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
//     function dochangchuc(so, daydu) {
//         var chuoi = "";
//         const chuc = Math.floor(so / 10);
//         const donvi = so % 10;
//         if (chuc > 1) {
//             chuoi = " " + mangso[chuc] + " mươi";
//             if (donvi === 1) {
//                 chuoi += " mốt";
//             }
//         } else if (chuc === 1) {
//             chuoi = " mười";
//             if (donvi === 1) {
//                 chuoi += " một";
//             }
//         } else if (daydu && donvi > 0) {
//             chuoi = " lẻ";
//         }
//         if (donvi === 5 && chuc > 1) {
//             chuoi += " lăm";
//         } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
//             chuoi += " " + mangso[donvi];
//         }
//         return chuoi;
//     }
//     function docblock(so, daydu) {
//         var chuoi = "";
//         const tram = Math.floor(so / 100);
//         so = so % 100;
//         if (daydu || tram > 0) {
//             chuoi = " " + mangso[tram] + " trăm";
//             chuoi += dochangchuc(so, true);
//         } else {
//             chuoi = dochangchuc(so, false);
//         }
//         return chuoi;
//     }
//     function dochangtrieu(so, daydu) {
//         var chuoi = "";
//         const trieu = Math.floor(so / 1000000);
//         so = so % 1000000;
//         if (trieu > 0) {
//             chuoi = docblock(trieu, daydu) + " triệu";
//             daydu = true;
//         }
//         const nghin = Math.floor(so / 1000);
//         so = so % 1000;
//         if (nghin > 0) {
//             chuoi += docblock(nghin, daydu) + " nghìn";
//             daydu = true;
//         }
//         if (so > 0) {
//             chuoi += docblock(so, daydu);
//         }
//         return `${chuoi} đồng`;
//     }
//     function convertso(so) {
//         if (so === 0) return 0;
//         var chuoi = "", hauto = "";
//         do {
//             const ty = so % 1000000000;
//             so = Math.floor(so / 1000000000);
//             if (so > 0) {
//                 chuoi = dochangtrieu(ty, true) + hauto + chuoi;
//             } else {
//                 chuoi = dochangtrieu(ty, false) + hauto + chuoi;
//             }
//             hauto = " tỷ";
//         } while (so > 0);
//         return chuoi;
//     }
//     const { dataBin } = props
//     const { service_type } = props
//     // cho nay bi loi nhe
//     // const { inputRef } = useBarcode({
//     //     value: dataBin['code'],
//     //     options: {
//     //         format: "CODE128",
//     //         width: 1.2,
//     //         height: 20,
//     //         fontSize: 16
//     //     }
//     // })
//     const items = dataBin['items']




//     const check_service = (checkid) => {
//         const item = service_type.find(element => element.id === checkid)
//         return item && item.name
//     }


//     const objPayment = {};
//     _.forEach(ARR_HTTT_ORDER, function (i) {
//         objPayment[i['key']] = i['name']
//     })

//     let totalNumber = dataBin['final_fee']
//     // print-source
//     return (
//         <div ref={ref} className="print-source" >
//             <div style={{ height: 167 }}></div>
//             <div style={{ height: 200 }}>
//                 <span style={{ width: 250, paddingLeft: 100, fontSize: 16 }}>{dataBin['source']['name']}</span>
//                 <span style={{ width: 250, paddingLeft: 280, fontSize: 16 }}>{dataBin['destination']['name']}</span><br />
//                 <span style={{ width: 250, paddingLeft: 120, fontSize: 16 }}>{dataBin['sender']['name']}</span>
//                 <span style={{ width: 250, paddingLeft: 315, fontSize: 16 }}>{dataBin['receiver']['name']}</span><br />
//                 <span style={{ width: 250, paddingLeft: 50, fontSize: 16 }}>{dataBin['sender']['address']}</span>
//                 <span style={{ width: 250, paddingLeft: 250, fontSize: 16 }}>{dataBin['receiver']['address']}</span><br />
//                 <span style={{ width: 250, paddingLeft: 100, fontSize: 16 }}>{dataBin['sender']['phone']}</span>
//                 <span style={{ width: 250, paddingLeft: 250, fontSize: 16 }}>{dataBin['receiver']['phone']}</span><br />
//                 <div >
//                     {
//                         dataBin['payment_type'] === 2 ? (   //người nhận trả

//                             <div style={{ lineHeight: 1.0 }}>

//                                 <p style={{ lineHeight: 0.3, }}>

//                                     <div style={{ height: 25 }} />
//                                     <span style={{ width: 250, paddingLeft: 195, fontSize: 16 }}>X</span><br />
//                                     <span style={{ width: 250, paddingLeft: 364, fontSize: 14 }}>{convert(dataBin['order_fee'] - dataBin['discount'])}</span>
//                                     <br />
//                                     <span style={{ width: 250, paddingLeft: 400, fontSize: 14 }}>{convert(dataBin['cod_fee']) || 0}</span>
//                                     <br />
//                                     <span style={{ width: 250, paddingLeft: 180, fontSize: 14 }}>{convert(dataBin['order_cod'])}</span>
//                                     <br />
//                                     {/*convet số sang chữ */}

//                                     <p style={{ lineHeight: 0.8 }}>
//                                         <span style={{ width: 300, paddingLeft: 160, fontSize: 12, position: "absolute", }}>{convertso(dataBin['order_cod'])}</span><br />
//                                         <span style={{ width: 250, paddingLeft: 360, fontSize: 14 }}>{convert(totalNumber)}</span>
//                                         <span style={{ width: 250, paddingLeft: 100 }}>{dataBin['creator']['name']}</span>
//                                     </p>
//                                 </p>
//                                 <p style={{ paddingLeft: 10, }}>
//                                     <span className="svg" style={{ paddingLeft: 80, }}>
//                                         {/* <svg ref={inputRef} /> */}
//                                     </span>
//                                     <span style={{ width: 250, paddingLeft: 66, fontSize: 13 }}>
//                                         {moment(dataBin['created_at']).format('hh')}&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('mm')}&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('DD')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('MM')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('YYYY').substring(2, 4)}
//                                     </span>
//                                     <div style={{ position: "absolute", top: 450 }}>
//                                         <p style={{ width: 300, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", paddingLeft: 70, }} >{(dataBin['note'])}</p>
//                                         <p style={{ width: 250, marginLeft: 20 }}>Tổng kiện = {(dataBin['num_of_package'])} (Chi tiết hàng hóa =
//                                             {
//                                                 items.map((item, index) => (
//                                                     <span style={{ width: 100, marginLeft: 10, wordWrap: "break-word", }}> {`${index !== 0 ? '+' : ''} ${item.num_of_package}_${check_service(item.type_of)}`}</span>
//                                                 ))
//                                             })
//                                         </p>
//                                     </div>
//                                 </p>
//                             </div>
//                         ) : null
//                     }
//                 </div>
//                 {
//                     dataBin['payment_type'] === 1 ? (    //người gủi trả
//                         <div >
//                             <div style={{ height: 62 }} />
//                             <p style={{ lineHeight: 0.9 }}>
//                                 <span style={{ width: 250, paddingLeft: 100, fontSize: 16 }}>X</span>
//                                 {/* 
//                                     cước phí 
//                                 */}
//                                 <span style={{ width: 250, paddingLeft: 264, fontSize: 13 }}>{convert(dataBin['order_fee'] - dataBin['discount'])}</span>
//                                 <br />
//                                 {/* 
//                                     Cước phí đặc biệt
//                                 */}
//                                 <span style={{ width: 250, paddingLeft: 410, fontSize: 13 }}>{convert(dataBin['cod_fee'])}</span>
//                                 <br />
//                                 {/*

//                                      Thu tiền hộ

//                                 */}
//                                 <span style={{ width: 250, paddingLeft: 180, fontSize: 13 }}>{convert(dataBin['order_cod'])}</span>
//                                 <br />
//                                 <p style={{ lineHeight: 0.1 }}>
//                                     <span style={{ width: 300, paddingLeft: 160, fontSize: 13, position: "absolute", }}>{convertso(dataBin['order_cod'])}</span><br />
//                                     <span style={{ width: 250, paddingLeft: 360, fontSize: 13 }}>{convert(totalNumber)}</span>
//                                     <span style={{ width: 250, paddingLeft: 100 }}>{dataBin['creator']['name']}</span>
//                                 </p>
//                             </p>
//                             <p style={{ paddingLeft: 10, }}>
//                                 <span className="svg" style={{ paddingLeft: 80, }}>
//                                     <svg ref={inputRef} />
//                                 </span>

//                                 <span style={{ width: 250, paddingLeft: 66, fontSize: 13 }}>
//                                     {moment(dataBin['created_at']).format('hh')}&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('mm')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('DD')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('MM')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                                         {moment(dataBin['created_at']).format('YYYY').substring(2, 4)}
//                                 </span>
//                                 <div style={{ position: "absolute", top: 455, lineHeight: 1.2 }}>
//                                     <p style={{ width: 300, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", paddingLeft: 70, }} >{(dataBin['note'])}</p>
//                                     <p style={{ width: 300, marginLeft: 10 }}>Tổng kiện = {(dataBin['num_of_package'])} (Chi tiết hàng hóa =
//                                             {
//                                             items.map((item, index) => (
//                                                 <span style={{ width: 100, marginLeft: 10, wordWrap: "break-word", }}> {`${index !== 0 ? '+' : ''} ${item.num_of_package}_${check_service(item.type_of)}`}</span>
//                                             ))
//                                         })
//                                     </p>
//                                 </div>
//                             </p>
//                         </div>
//                     ) : null
//                 }
//             </div>
//         </div >
//     )
// })
// const PrintBill = ({ className, dataBin, onPrint, onShow, definitions }) => {
//     let { service_type_product } = definitions.toJS()
//     let service_type = _.map(service_type_product, (value, key) => {
//         return value
//     })
//     const componentRef = useRef()
//     const autoHandlePrint = useReactToPrint({
//         content: () => componentRef.current,
//     });
//     if (onPrint === true) {
//         setTimeout(function () {
//             autoHandlePrint()
//         }, 100)
//     }
//     return (
//         <div className={className}>
//             <ReactToPrint content={() => componentRef.current}>
//                 <PrintContextConsumer>
//                     {({ handlePrint }) => (
//                         <div style={{ cursor: 'pointer' }} className={onShow ? 'print-source' : ""} onClick={(e) => {
//                             e.preventDefault();
//                             handlePrint();
//                         }}>
//                             <Button type="primary" title="In kim" ghost >
//                                 In kim
//                                 <PrinterTwoTone />
//                             </Button>
//                         </div>
//                     )}
//                 </PrintContextConsumer>
//                 <ComponentToPrint ref={componentRef} dataBin={dataBin} service_type={service_type} />
//             </ReactToPrint>
//         </div>
//     )
// };
// const mapStateToProps = createStructuredSelector({
//     definitions: makeSelectDefinitions(),
// });
// const withConnect = connect(
//     mapStateToProps,
//     null
// );
// export default styled(withConnect(PrintBill))`
// `;







/**
 * In vesion 2.
 *F748.
 *D488 .
 *HIIMHUNG
 */


import { PrinterTwoTone } from '@ant-design/icons';
import { useBarcode } from "@createnextapp/react-barcode";
import _ from "lodash";
import moment from "moment";
import React, { useRef, memo } from 'react';
import ReactToPrint, { PrintContextConsumer, useReactToPrint } from 'react-to-print';
import styled from "styled-components";
import { ARR_HTTT_ORDER } from "./constants";
import './style.css';
import { Button, Row, Col } from 'antd';
import { DefineSelect } from "components";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
/*
 * In hóa đơn "Phiếu Gửi"
 */
var inputRef = "";

const ComponentToPrint = React.forwardRef((props, ref, className) => {
    const convert = function (str) {
        if (str)
            return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        else
            return 0
    }
    // case Đọc giá tiền
    const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    function dochangchuc(so, daydu) {
        var chuoi = "";
        const chuc = Math.floor(so / 10);
        const donvi = so % 10;
        if (chuc > 1) {
            chuoi = " " + mangso[chuc] + " mươi";
            if (donvi === 1) {
                chuoi += " mốt";
            }
        } else if (chuc === 1) {
            chuoi = " mười";
            if (donvi === 1) {
                chuoi += " một";
            }
        } else if (daydu && donvi > 0) {
            chuoi = " lẻ";
        }
        if (donvi === 5 && chuc > 1) {
            chuoi += " lăm";
        } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
            chuoi += " " + mangso[donvi];
        }
        return chuoi;
    }
    function docblock(so, daydu) {
        var chuoi = "";
        const tram = Math.floor(so / 100);
        so = so % 100;
        if (daydu || tram > 0) {
            chuoi = " " + mangso[tram] + " trăm";
            chuoi += dochangchuc(so, true);
        } else {
            chuoi = dochangchuc(so, false);
        }
        return chuoi;
    }
    function dochangtrieu(so, daydu) {
        var chuoi = "";
        const trieu = Math.floor(so / 1000000);
        so = so % 1000000;
        if (trieu > 0) {
            chuoi = docblock(trieu, daydu) + " triệu";
            daydu = true;
        }
        const nghin = Math.floor(so / 1000);
        so = so % 1000;
        if (nghin > 0) {
            chuoi += docblock(nghin, daydu) + " nghìn";
            daydu = true;
        }
        if (so > 0) {
            chuoi += docblock(so, daydu);
        }
        return `${chuoi} đồng`;
    }
    function convertso(so) {
        if (so === 0) return 0;
        var chuoi = "", hauto = "";
        do {
            const ty = so % 1000000000;
            so = Math.floor(so / 1000000000);
            if (so > 0) {
                chuoi = dochangtrieu(ty, true) + hauto + chuoi;
            } else {
                chuoi = dochangtrieu(ty, false) + hauto + chuoi;
            }
            hauto = " tỷ";
        } while (so > 0);
        return chuoi;
    }
    const { dataBin } = props
    console.log("dataBin", dataBin);
    const { service_type } = props
    const { inputRef } = useBarcode({
        value: dataBin['code'],
        options: {
            format: "CODE128",
            width: 1.2,
            height: 20,
            fontSize: 16
        }
    })

    const renderTick = (paying_side) => {
        if (paying_side === 1) {
            return 'X'
        }
        if (paying_side === 2) {
            return <div style={{ width: 80, textAlign: 'right' }}>X</div>
        } else {
            return <div style={{ color: 'transparent' }}>.</div>
        }

    }
    // print-source
    return (
        <div className={className}>
            <div ref={ref} className="print-source" >
                <div style={{ height: 169 }}>
                    <div className="d-flex">
                        <div style={{ width: "50%" }}>
                        </div>
                        <div style={{ width: "50%" }}>
                            <div className="svg" style={{ paddingLeft: 80, marginTop: 15 }}>
                                <svg ref={inputRef} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <div style={{ width: "50%", position: "relative" }} >
                        <h3 style={{ paddingLeft: 120, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['source']['name'] || "."}</h3>
                        <h3 style={{ paddingLeft: 120, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['sender']['name'] || "."}</h3>
                        <h3 style={{ paddingLeft: 70, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['sender']['address'] || "."}</h3>
                        <h3 style={{ paddingLeft: 100, fontSize: 23, margin: 0, position: "absolute", bottom: -25, color: "#000" }}>{dataBin['sender']['phone'] || "."}</h3>
                    </div>
                    <div style={{ width: "50%", position: "relative" }}>
                        <h3 style={{ paddingLeft: 65, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['destination']['name'] || "."}</h3>
                        <h3 style={{ paddingLeft: 100, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['receiver']['name'] || "."}</h3>
                        <h3 style={{ paddingLeft: 10, fontSize: 16, margin: 0, color: "#000" }}>{dataBin['receiver']['address'] || "."}</h3>
                        <h3 style={{ paddingLeft: 80, fontSize: 23, margin: 0, position: "absolute", bottom: -25, color: "#000" }}>{dataBin['receiver']['phone'] || "."}</h3>
                    </div>
                </div>
                {/* Dong thu 2 */}
                <div style={{ marginTop: 50 }}>
                    <div className="d-flex">
                        <div style={{ width: 102 }}></div>
                        <div>
                            <div className="d-flex">
                                <div style={{ width: 85 }}>
                                    {/* Cước vận chuyển: */}
                                    <h3 style={{ paddingLeft: 24, fontSize: 11, margin: 0, color: "#000" }}>{convert(_.get(dataBin, 'order_fee.amount', 0) - _.get(dataBin, 'discount', 0))} </h3>
                                    {/* Cước COD:   */}
                                    <h3 style={{ paddingLeft: 24, fontSize: 11, margin: 0, color: "#000" }}>{convert(_.get(dataBin, 'cod_fee.amount', 0))} </h3>
                                    {/* Cước ship nhận: */}
                                    <h3 style={{ paddingLeft: 24, fontSize: 11, margin: 0, color: "#000" }}>{convert(_.get(dataBin, 'r_shipping_fee.amount', 0))} </h3>
                                    {/* Cước ship trả: */}
                                    <h3 style={{ paddingLeft: 24, fontSize: 11, margin: 0, color: "#000" }}>{convert(_.get(dataBin, 'd_shipping_fee.amount', 0))} </h3>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 11, margin: 0, color: "#000" }}>{renderTick(_.get(dataBin, 'order_fee.paying_side', null))}</h3>
                                    <h3 style={{ fontSize: 11, margin: 0, color: "#000" }}>{renderTick(_.get(dataBin, 'cod_fee.paying_side', null))}</h3>
                                    <h3 style={{ fontSize: 11, margin: 0, color: "#000" }}>{renderTick(_.get(dataBin, 'r_shipping_fee.paying_side', null))}</h3>
                                    <h3 style={{ fontSize: 11, margin: 0, color: "#000" }}>{renderTick(_.get(dataBin, 'd_shipping_fee.paying_side', null))}</h3>
                                </div>
                            </div>
                            {/* Thu tiền hộ: */}
                            <h3 style={{ paddingLeft: 25, fontSize: 11, margin: 0, color: "#000" }}> {convert(_.get(dataBin, 'order_cod', 0))} </h3>
                            {/* Bằng chữ: */}
                            <h3 style={{ paddingLeft: 25, fontSize: 11, margin: 0, wordWrap: "break-word", width: 200, color: "#000" }}>{convertso(_.get(dataBin, 'order_cod', 0))} </h3>
                        </div>



                        <div style={{ marginLeft: 75, width: 160 }}  >
                            <h3 style={{ margin: 0, color: "#000" }}> {/* // Tong cước */}
                                {convert((_.get(dataBin, 'order_fee.amount', 0) - _.get(dataBin, 'discount', 0)) + _.get(dataBin, 'cod_fee.amount', 0)
                                    + _.get(dataBin, 'r_shipping_fee.amount', 0) + _.get(dataBin, 'd_shipping_fee.amount', 0))}
                            </h3>
                            <h3 style={{ marginBottom: 0, color: "#000" }} > {/* Đã thanh toán */}
                                {
                                    convert((_.get(dataBin, 'order_fee.paying_side') === 1 ? _.get(dataBin, 'order_fee.amount', 0) - _.get(dataBin, 'discount', 0) : 0) +
                                        (_.get(dataBin, 'r_shipping_fee.paying_side') === 1 ? _.get(dataBin, 'r_shipping_fee.amount', 0) : 0) +
                                        (_.get(dataBin, 'd_shipping_fee.paying_side') === 1 ? _.get(dataBin, 'd_shipping_fee.amount', 0) : 0))
                                }
                            </h3>

                            <h3 style={{ margin: 0, color: "#000" }}>  {/* Còn phải thu NG  */}
                                {convert((_.get(dataBin, 'cod_fee.paying_side') === 1 ? _.get(dataBin, 'cod_fee.amount', 0) : 0))}
                            </h3>
                            {/* Còn phải thu NN */}
                            <h3 style={{ margin: 0, color: "#000" }}>
                                {convert((_.get(dataBin, 'order_fee.paying_side') === 2 ? _.get(dataBin, 'order_fee.amount', 0) - _.get(dataBin, 'discount', 0) : 0) +
                                    (_.get(dataBin, 'r_shipping_fee.paying_side') === 2 ? _.get(dataBin, 'r_shipping_fee.amount', 0) : 0) +
                                    (_.get(dataBin, 'd_shipping_fee.paying_side') === 2 ? _.get(dataBin, 'd_shipping_fee.amount', 0) : 0) +
                                    (_.get(dataBin, 'cod_fee.paying_side') === 2 ? _.get(dataBin, 'cod_fee.amount', 0) : 0) +
                                    (_.get(dataBin, 'order_cod', 0)))
                                }
                            </h3>
                        </div>
                        <div style={{ marginTop: 70, }}>
                            <h3 style={{ textAlign: "center", margin: 0, color: "#000" }}>{dataBin['creator']['name'] || ""}</h3>
                        </div>

                    </div>
                </div>
                {/* Dong cuoi cung */}
                <div style={{ height: 200, marginTop: 10 }}>
                    <div className="d-flex">
                        <h3 style={{ width: 140, wordWrap: "break-word", marginTop: 17, marginLeft: 10, color: "#000" }}>
                            {_.get(dataBin, 'description', '')}
                        </h3>
                        <h3 style={{ width: 175, wordWrap: "break-word", marginTop: 12, color: "#000" }}>
                            {_.get(dataBin, 'note', '')}
                        </h3>
                        <h3 style={{ marginTop: 5, marginLeft: 6, color: "#000" }}>
                            {moment(dataBin['created_at']).format('HH')}&nbsp;
                                {moment(dataBin['created_at']).format('mm')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {moment(dataBin['created_at']).format('DD')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {moment(dataBin['created_at']).format('MM')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {moment(dataBin['created_at']).format('YYYY').substring(2, 4)}
                        </h3>
                    </div>
                </div>
            </div >
        </div>
    )
})
const PrintBill = ({ className, dataBin, onPrint, onShow, definitions }) => {
    let { service_type_product } = definitions.toJS()
    let service_type = _.map(service_type_product, (value, key) => {
        return value
    })
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
                            <Button type="primary" title="In kim" ghost >
                                In kim
                                <PrinterTwoTone />
                            </Button>
                        </div>
                    )}
                </PrintContextConsumer>
                <ComponentToPrint className={className} ref={componentRef} dataBin={dataBin} service_type={service_type} />
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
export default styled(withConnect(PrintBill))`
    .css_text {
        font-size: 12px;
    },
    h3 {
        // background: #000;
        margin: 0px;
    }
`;
