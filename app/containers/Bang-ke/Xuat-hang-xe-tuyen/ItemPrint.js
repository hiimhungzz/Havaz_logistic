import React, { memo } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";

let tongCuocKhac = 0;
let tongPhaiThu = 0;
let tongCuocVC = 0;
let tongDaThu = 0;
let tongTra = 0;
export const ItemPrint = styled(
  memo(({ className, style, order }) => {
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
  })
)`
    font-size: 13px;
    padding: 14px 14px;
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

export default ItemPrint;
