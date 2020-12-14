
import { Table, Button, Drawer } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from "moment";
import React, { memo, useState } from "react";
import { formatNumber } from "utils/helper";
import styled from "styled-components";
import { EyeOutlined, } from '@ant-design/icons'
import OrderModal from "./OrderModal";
const TableContent = memo(
    ({ className, data, onRefreshList, params, paramsList, activeTab, definitions }) => {
        const [visible, setVisible] = useState(false);
        const [itemSelected, setItemSelected] = useState(null);
        const columns = [
            {
                title: "STT",
                dataIndex: "id",
                render: (value, row, index) => {
                    return (
                        <h5>{index + 1}</h5>
                    )

                },
                width: 60,
                fixed: "left",
            },
            {
                title: "Người thao tác",
                dataIndex: "creator",
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record["creator"]["name"]}</div>
                ),
                width: 150,
            },
            {
                title: "Mã nhân viên",
                dataIndex: "creator",
                key: "creator",
                width: 120,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record["creator"]["code"]}</div>
                ),
            },
            {
                title: "Người nộp",
                dataIndex: "submitter",
                width: 140,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record["submitter"]["name"]}</div>
                ),
            },
            {
                title: "Mã người nộp",
                dataIndex: "submitter",
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record["submitter"]["code"]}</div>
                ),
                width: 140,
            },
            {
                title: "Ngày thực hiện",
                dataIndex: "created_at",
                render: (text, record) => (
                    <div>{moment(record["create_at"]).format("DD-MM-YYYY")}</div>
                ),
                width: 140,
            },
            {
                title: "Giờ thực hiện",
                dataIndex: "created_at",
                render: (value, record) => (
                    <div>{moment(value).format("HH:mm")}</div>
                ),
                width: 120,
            },

            // Cần dữ liệu           

            {
                title: "Cước VC thu NN",
                dataIndex: "receiver_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Cước VC thu NG",
                dataIndex: "sender_order_fee",
                width: 150,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Tiền COD",
                dataIndex: "sum_order_cod",
                width: 100,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
                dataIndex: "sum_order_cod"
            },


            {
                title: "Tổng số tiền",
                dataIndex: "sum_price",
                width: 140,
                render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
            },
            {
                title: "Ghi chú",
                dataIndex: "note",
                width: 200,
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                align: 'center',
                fixed: "right",
                width: 100,
                render: (value, row) => (
                    <Button
                        size="small"
                        type="link"
                        onClick={() => {
                            setItemSelected(row)
                            setVisible(true)
                        }}
                    >
                        <EyeOutlined />
                    </Button>
                )

            },
        ];
        return (
            <div className={className}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="order_id"
                    scroll={{ x: "calc(700px + 50%)", y: 400 }}
                    pagination={false}
                />
                <Drawer
                    title="Thông tin chi tiết"
                    width="80%"
                    height="100%"
                    closable={true}
                    onClose={() => setVisible(false)}
                    visible={visible}
                    bodyStyle={{ height: "100%" }}
                    footer={null}
                >
                    <OrderModal
                        params={params} data={data} definitions={definitions}
                        itemSelected={itemSelected} setItemSelected={setItemSelected}
                    />
                </Drawer>
            </div>

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
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-btn {
    border-color: none;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .fix_drawer{
    padding-left : 100px
  }

`;
