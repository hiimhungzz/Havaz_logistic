/**
 * Input (Styled Component)
 */
import React from "react";
import { Table } from "antd";
// import _ from "lodash"
import moment from "moment";
import styled from "styled-components";

const Tracking = ({
    rowList,
    className
}) => {
    let { points } = rowList
    let columns = [
        {
            title: "Ngày",
            width: 130,
            key: "date",
            render: (text, record) => (
                <div>{moment(record["time"]).format("DD/MM/YYYY")}</div>
            )
        },
        {
            title: "Giờ",
            width: 70,
            key: "hous",
            render: (text, record) => (
                <div>{moment(record["time"]).format("HH:mm")}</div>
            )
        },
        {
            title: "Mô tả",
            width: 150,
            key: "event",
            render: (text, record) => (
                <div>{record['description']}</div>
            )
        },
        {
            title: "Văn phòng",
            width: 100,
            key: "hub",
            render: (text, record) => (
                <div>{record?.hub?.name}</div>
            )
        },
        {
            title: "NV thao tác",
            width: 100,
            key: "actor",
            render: (text, record) => (
                <div>{record?.actor?.name}</div>
            )
        },
        // {
        //     title: "Bảng kê",
        //     width: 100,
        //     key: "bangke",
        //     render: (text, record) => (
        //         <a href="/bang-ke/xuat-hang/vp-vp" target="_blank">#Demo</a>
        //     )
        // },
        // {
        //     title: "Tuyến",
        //     width: 100,
        //     key: "actor",
        //     render: (text, record) => (
        //         <div></div>
        //     )
        // },
        // {
        //     title: "Chuyến",
        //     width: 100,
        //     key: "actor",
        //     render: (text, record) => (
        //         <div></div>
        //     )
        // },
        // {
        //     title: "Tên lái xe",
        //     width: 100,
        //     key: "actor",
        //     render: (text, record) => (
        //         <div></div>
        //     )
        // },
        // {
        //     title: "BKS",
        //     width: 100,
        //     key: "actor",
        //     render: (text, record) => (
        //         <div></div>
        //     )
        // }
    ]
    
    return (
        <div className={className}>
            <Table
            bordered
            columns={columns}
            dataSource={points}
            scroll={{ x: "100%" }}
            rowKey="code"
            pagination={true}
            />
        </div>
    )
};
  
export default styled(Tracking)`
  padding: 5px 5px;
  .ant-table-ping-right:not(.ant-table-has-fix-right)
    .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
  padding-top:0px !important;
  padding-bottom:0px !important;
  }
`;