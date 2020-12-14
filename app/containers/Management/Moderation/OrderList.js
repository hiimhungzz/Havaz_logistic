import { Table, Tag } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
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

    if (objOder.cod_fee && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 2 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
        final_fee += objOder?.cod_fee?.amount

    if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 2 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
        final_fee += objOder['r_shipping_fee']['amount']

    if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 2 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
        final_fee += objOder['d_shipping_fee']['amount']

    if (objOder['order_cod'])
        final_fee += objOder['order_cod'] || 0

    return final_fee
}

const tongCuocNguoiGuiTra = function (objOder) {
    let final_fee = 0,
        discount = 0;
    if (objOder['discount'])
        discount = objOder['discount'] || 0

    if (objOder['order_fee']['amount'] && objOder['order_fee']['paying_side'] && objOder['order_fee']['paying_side'] === 1 && objOder['order_fee']['amount'] > 0)
        final_fee += (objOder['order_fee']['amount'] - discount)

    // if (objOder.cod_fee  && objOder['cod_fee']['paying_side'] && objOder['cod_fee']['paying_side'] === 1 && objOder?.cod_fee?.amount && objOder?.cod_fee?.amount > 0)
    //   final_fee += objOder?.cod_fee?.amount

    if (objOder['r_shipping_fee'] && objOder['r_shipping_fee']['paying_side'] && objOder['r_shipping_fee']['paying_side'] === 1 && objOder['r_shipping_fee']['amount'] && objOder['r_shipping_fee']['amount'] > 0)
        final_fee += objOder['r_shipping_fee']['amount']

    if (objOder['d_shipping_fee'] && objOder['d_shipping_fee']['paying_side'] && objOder['d_shipping_fee']['paying_side'] === 1 && objOder['d_shipping_fee']['amount'] && objOder['d_shipping_fee']['amount'] > 0)
        final_fee += objOder['d_shipping_fee']['amount']

    return final_fee
}
const OrderList = memo(
    ({ className, data, params, setParams, onRefreshList, itemSelected, definitions }) => {
        const [loaddingItem, setLoading] = useState(false);
        const [dataItem, setDataItem] = useState([]);
        const OrderList = useCallback(async () => {
            setLoading(true);
            const result = await ServiceBase.requestJson({
                method: "GET",
                url: `v1/shipments/${itemSelected.shipment_id}`,
                data: {

                },
            });
            if (result.hasErrors) {
                Ui.showErrors(result.errors);
            } else {
                setDataItem(result.value.data.orders)
            }
            await setLoading(false);

        }, [itemSelected]);

        useEffect(() => {
            OrderList();
        }, [OrderList]);
        let columns = [
            {
                title: "Mã đơn",
                width: 130,
                dataIndex: "code",
                fixed: "left",
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            window.open(`tracking/${record.code}`, "_blank")
                        }}>
                            <p style={{ marginBottom: "0em" }}> {record["code"]}</p>
                        </div>
                        <Tag
                            color={definitions.getIn([
                                "order_statuses",
                                `${record['status']}`,
                                "color",
                            ])}
                        >
                            {definitions.getIn([
                                "order_statuses",
                                `${record['status']}`,
                                "text",
                            ])}
                        </Tag>
                    </div>
                )
            },
            {
                title: "Số kiện",
                width: 70,
                dataIndex: "num_of_package",
                key: "num_of_package",
            },
            {
                title: "VP nhận hàng",
                width: 150,
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <h5 style={{ marginBottom: "0em" }}> {record["source"]["name"]}</h5>
                        <p style={{ marginBottom: "0em" }}> {record["sender"]["address"]}</p>
                    </div>
                ),
            },
            {
                title: "NV Nhận hàng",
                width: 150,
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <p style={{ marginBottom: "0em" }}>{record["creator"]["name"]}</p>
                        <p style={{ marginBottom: "0em" }}>{moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}</p>
                    </div>
                ),
            },
            {
                title: "Người gửi",
                width: 120,
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <h5>{record["sender"]["name"] === record["sender"]["phone"] ? "" : record["sender"]["name"]}</h5>
                        <p style={{ marginBottom: "0em" }}>{record["sender"]["phone"]}</p>
                    </div>
                ),
            },
            {
                title: "Người nhận",
                width: 120,
                // fixed: "left",
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <h5 style={{ marginBottom: "0em" }}> {record["receiver"]["name"] === record["receiver"]["phone"] ? "" : record["receiver"]["name"]}</h5>
                        <em style={{ marginBottom: "0em" }}> {record["receiver"]["phone"]}</em>
                    </div>
                ),
            },
            {
                title: "VP phát hàng",
                width: 150,
                // fixed: "left",
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <h5 style={{ marginBottom: "0em" }}> {record["destination"]["name"]}</h5>
                        <p style={{ marginBottom: "0em" }}> {record["receiver"]["address"]}</p>
                    </div>
                ),
            },
            {
                title: "Tiền thu hộ COD",
                width: 150,
                render: (text, record) => <div>{convert(record["order_cod"])}</div>,
            },
            {
                title: "Tổng cước",
                width: 190,
                render: (text, record) => (
                    <div className="d-flex" style={{ flexDirection: "column" }}>
                        <h5 style={{ marginBottom: "0em" }}>{convert(finalFee(record))}</h5>
                        {/* <em style={{ marginBottom: "0em" }}>{definitions.getIn([
                    "payment_types",
                    `${record['order_fee']['paying_side']}`,
                    "text",
                  ])}</em> */}
                    </div>
                )
            },
            {
                title: "Cước vận chuyển (bến - bến)",
                width: 130,
                render: (text, record) => <div style={{ color: record['order_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                    {convert(record['order_fee']['amount'] - record?.discount * 1)}
                </div>,
            },
            {
                title: "Cước COD",
                width: 100,
                render: (text, record) => <div style={{ color: record['cod_fee']['paying_side'] === 2 ? "red" : "black" }}>
                    {convert(record['cod_fee']['amount'])}
                </div>,
            },
            {
                title: "Cước ship nhận",
                width: 130,
                render: (text, record) => <div style={{ color: record['r_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                    {convert(record['r_shipping_fee']['amount'])}
                </div>,
            },
            {
                title: "Cước ship trả",
                width: 130,
                render: (text, record) => <div style={{ color: record['d_shipping_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                    {convert(record['d_shipping_fee']['amount'])}
                </div>,
            },
            {
                title: "Đã thu NG hàng",
                width: 150,
                render: (text, record) => <div style={{ color: "#1cb75b" }}>
                    {convert(tongCuocNguoiGuiTra(record))}
                </div>,
            },
            {
                title: "Phải thu NN",
                width: 100,
                render: (text, record) => <div style={{ color: "red" }}>
                    {convert(tongCuocNguoiNhanTra(record))}
                </div>,
            },
            {
                title: "Mô tả hàng",
                width: 200,
                render: (text, record) => <div>
                    {record["description"]}
                </div>,
            },
            {
                title: "Ghi chú nhận đơn",
                width: 200,
                render: (text, record) => <div>
                    {record["note"]}
                </div>,
            },
            {
                title: "Người sửa cuối",
                width: 140,
                render: (text, record) => <div style={{ color: record['cod_fee']['paying_side'] === 2 ? "red" : "#1cb75b" }}>
                    {moment(record["updated_at"]).format("DD-MM-YYYY HH:mm")}
                </div>,
            },
        ];
        return (
            <div className={className}>
                <Table
                    columns={columns}
                    dataSource={dataItem}
                    rowKey="id"
                    pagination={false}
                    bordered
                    scroll={{ x: "100%" }}
                />
            </div>
        );
    }
);
OrderList.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(OrderList))`
  .ant-table-thead > tr > th {
    background-color: rgba(233,195,43);
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
}
`;
