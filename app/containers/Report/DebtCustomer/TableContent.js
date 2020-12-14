import { Table, Button, Row, Col, Input, Card } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState, useCallback, useEffect } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
const { TextArea } = Input;
const convert = function (str) {
    if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else return "";
};
const TableContent = memo(
    ({ className, data, itemSelected, params }) => {
        const columns = [
            {
                title: "Số phiếu gửi",
                dataIndex: "creator",
                // render: (text, record) => (
                //     <div style={{ marginBottom: "0em" }}> {record["creator"]["name"]}</div>
                // ),
                width: 120,
                fixed: "left"
            },
            {
                title: "Tổng cước phí",
                dataIndex: "creator",
                key: "creator",
                width: 150,
                // render: (text, record) => (
                //     <div style={{ marginBottom: "0em" }}> {record["creator"]["code"]}</div>
                // ),
            },
            {
                title: "Tổng cước đã thu",
                dataIndex: "submitter",
                width: 150,
                // render: (text, record) => (
                //     <div style={{ marginBottom: "0em" }}> {record["submitter"]["name"]}</div>
                // ),
            },
            {
                title: "Tổng cước phí chưa thu",
                dataIndex: "submitter",
                // render: (text, record) => (
                //     <div style={{ marginBottom: "0em" }}> {record["submitter"]["code"]}</div>
                // ),
                width: 200,
            },
            {
                title: "HTTT",
                dataIndex: "created_at",
                // render: (text, record) => (
                //     <div>{moment(record["create_at"]).format("DD-MM-YYYY")}</div>
                // ),
                width: 110,
            },
            {
                title: "Điểm kết nối nhận",
                dataIndex: "created_at",
                // render: (text, record) => (
                //     <div>{moment(record["create_at"]).format("HH:   MM")}</div>
                // ),
                width: 150,
            },
            {
                title: "Mã NV nhận",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Tên NV nhận",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Tên tuyến xe",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Ngày gửi hàng",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Khách hàng",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Họ tên người gửi",
                dataIndex: "sum_price",
                width: 180,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "SĐT người gửi",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Đã phát",
                dataIndex: "sum_price",
                width: 150,
                // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
        ];
        return (
            <div div className={className} >
                <Table
                    columns={columns}
                    dataSource={[itemSelected]}
                    rowKey="id"
                    scroll={{ x: "calc(700px + 50%)" }}
                    pagination={false}

                ></Table>
            </div >
        );
    }
);
TableContent.propTypes = {
    className: PropTypes.any,
};
export default styled(TableContent)`
  .ant-table-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    position: relative;
    padding: 5px 16px !important ;
    overflow-wrap: break-word;
  }
  .ant-table-thead > tr > th {
    background: rgb(242, 243, 248);
    padding: 16px;

    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-btn {
    border-color: none;
  }
  .ant-table-thead > tr > th {
    border-top: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .fix_drawer{
    padding-left : 100px
  }
  .ant-row.ant-row-start {
    margin: 0px 0px !important;
}
.ant-card-head-title {
    padding-top: 8px;
    padding-bottom: 8px;
}
.ant-card-body {
    15px
}
.ant-row {
    margin-bottom: 0px !important;
}
.ant-card-head {
    min-height: 35px;
    padding-left: 15px
}
`;