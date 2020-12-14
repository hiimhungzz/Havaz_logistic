import { Table, Tag, Tooltip } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState, useSelector } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import { DefinePagination, DefineTable } from "components"
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import {
    QuestionCircleOutlined,
  } from '@ant-design/icons';

const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const TableContent = memo(
    ({ className, data, setParams, definitions }) => {


        // const CuocVanChuyenThuNguoiGui = (data) => {
        //     let final_fee = 0,
        //         order_discount = 0;
        //     if (data['order_discount'])
        //         order_discount = data['order_discount'] || 0

        //     if (data['order_fee'] && data['order_fee']['amount'] && data['order_fee']['paying_side'] && data['order_fee']['paying_side'] === 1 && data['order_fee']['amount'] > 0)
        //         final_fee += (data['order_fee']['amount'] - order_discount)


        //     return final_fee
        // }





        const columns = [
            {
                title: "Mã đơn hàng",
                width: 130,
                dataIndex: "id",
                fixed: "left",
                render: (record) => {
                    return (
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            window.open(`/tracking/${record}`, "_blank")
                        }}>
                            <p style={{ marginBottom: "0em" }}> {record}</p>
                        </div>
                    )
                }
            },
            {
                title: "Trạng thái đơn hàng",
                width: 150,
                dataIndex: "status",
                render: (text, record) => (<Tag
                    color={definitions.getIn([
                        "order_statuses",
                        `${text}`,
                        "color",
                    ])}
                >
                    {definitions.getIn([
                        "order_statuses",
                        `${text}`,
                        "text",
                    ])}
                </Tag>)
            },
            {
                title: "Trạng thái vận hành",
                width: 150,
                dataIndex: "order_shipment_staus",
                render: (text, record) => (<Tag

                >
                    {text && definitions.getIn([
                        "shipment_order_statuses",
                        `${text}`,
                        "text",
                    ])}
                </Tag>)
            },
            {
                title: "BKS",
                width: 130,
                dataIndex: "shipment_plate",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Thời gian xe chạy",
                width: 130,
                dataIndex: "shipment_date",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Số kiện",
                width: 130,
                dataIndex: "total_package",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{text}</div>)
            },
            {
                title: "VP Nhận hàng",
                width: 130,
                dataIndex: "received_hub_name",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Nhân viên nhận hàng",
                width: 150,
                dataIndex: "received_actor_name",
                render: (text, record) => (<>{text}</>)

            },
            {
                title: "Thời gian nhận hàng",
                width: 150,
                dataIndex: "received_at",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Người gửi",
                width: 130,
                dataIndex: "sender_name",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "SĐT người gửi",
                width: 130,
                dataIndex: "sender_phone",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Người nhận",
                width: 130,
                dataIndex: "receiver_name",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "SĐT người nhận",
                width: 130,
                dataIndex: "receiver_phone",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "VP phát hàng thực tế",
                width: 150,
                dataIndex: "delivered_hub_name",
                render: (text, record) => (<>{text}</>)
            },
            {
                title: "Tiền thu hộ COD",
                width: 130,
                textAlign: 'right',
                dataIndex: "order_cod",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Tổng cước",
                width: 130,
                dataIndex: "total_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: () => {
                    return <div>Cước vận chuyển  <span>
                        <Tooltip placement="bottom"
                            title={
                                <div>Sau giảm giá </div>
                            }>
                        <QuestionCircleOutlined />
                        </Tooltip>
                    </span></div>
                },
                width: 155,
                dataIndex: "order_fee_final",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Cước VC - thu NG",
                width: 130,
                dataIndex: "sender_order_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Cước VC - thu NN",
                width: 130,
                dataIndex: "receiver_order_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Cước COD",
                width: 130,
                dataIndex: "cod_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Cước ship nhận",
                width: 130,
                dataIndex: "r_shipping_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Cước ship trả",
                width: 130,
                dataIndex: "d_shipping_fee",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Đã thu NG hàng",
                width: 130,
                dataIndex: "r_money",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Phải thu NN",
                width: 130,
                dataIndex: "d_money",
                render: (text, record) => (<div style={{ textAlign: 'right' }}>{convert(text)}</div>)
            },
            {
                title: "Ghi chú nhận đơn",
                width: 130,
                dataIndex: "note",
                render: (text, record) => (<>{text}</>)
            },
        ];
        let summary = data?.aggregate ? (
            <Table.Summary.Row>
                <Table.Summary.Cell colSpan={5}>Tổng </Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.sum_number_package)}</div></Table.Summary.Cell>
                <Table.Summary.Cell colSpan={8}></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.order_cod)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.total_fee)}</div></Table.Summary.Cell>

                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.order_fee_final)}</div></Table.Summary.Cell>

                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.sender_order_fee)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.receiver_order_fee)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.cod_fee)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.r_shipping_fee)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.d_shipping_fee)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.sender_payment_price)}</div></Table.Summary.Cell>
                <Table.Summary.Cell ><div style={{ textAlign: 'right' }}>{convert(data?.aggregate?.receiver_payment_price)}</div></Table.Summary.Cell>
            </Table.Summary.Row>
        ) : ""
        console.log(111)
        return (
            <div className={className}>
                <DefineTable
                    bordered
                    columns={columns}
                    dataSource={data?.data}
                    scroll={{ x: "100%" }}
                    rowKey="code"
                    pagination={false}
                    summary={summary}
                />
                <DefinePagination
                    total={data?.total}
                    onPagination={(page, limit) => {
                        setParams((props) => {
                            let nextState = { ...props };
                            nextState['per_page'] = limit;
                            nextState['page'] = page;
                            return nextState;
                        });
                    }}
                    margin="bottom"
                />
            </div>
        );
    }
);
TableContent.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(TableContent))`
  div-fomat-tien {
    text-align: right;
  } 
`;