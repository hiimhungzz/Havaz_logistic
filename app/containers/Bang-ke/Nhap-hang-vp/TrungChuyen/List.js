
import { EyeOutlined } from '@ant-design/icons';
import { Button, Drawer, Table } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import ModalTC from "./ModalTC";
const List = memo(
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
                title: "Mã bảng kê xuất TC",
                dataIndex: "id",
                width: 180,
                fixed: "left",
                render: (record) => {
                    return (
                        <p style={{ marginBottom: "0em" }}> {record}</p>
                        // <div style={{ cursor: 'pointer' }} onClick={() => {
                        //     window.open(`tracking/${record}`, "_blank")
                        // }}>

                        // </div>
                    )
                }
            },
            {
                title: "Ngày tạo bảng kê",
                dataIndex: "creator",
                key: "creator",
                width: 150,
                render: (text, record) => (
                    <div>{moment(record["create_time"]).format("DD-MM-YYYY   HH:mm")}</div>
                ),
            },
            {
                title: "Lái xe",
                dataIndex: "driver",
                width: 150,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.driver && record.driver.name ? record["driver"]["name"] : ""}</div>
                ),
            },
            {
                title: "SĐT Lái xe",
                dataIndex: "driver",
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.driver && record.driver.phone ? record["driver"]["phone"] : ""}</div>
                ),
                width: 120,
            },
            {
                title: "BKS",
                dataIndex: "driver",
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.car?.license_plate}</div>
                ),
                width: 110,
            },
            {
                title: "NV tạo bảng kê",
                dataIndex: "actor",
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record.actor && record.actor.name ? record["actor"]["name"] : ""}</div>
                ),
                width: 160,
            },
            {
                title: "VP tạo bảng kê",
                dataIndex: "source",
                width: 300,
                render: (text, record) => (
                    <div style={{ marginBottom: "0em" }}> {record?.source?.name}</div>
                ),
            },
            {
                title: "Tổng kiện",
                dataIndex: "sum_number_package",
                width: 120,
            },
            {
                title: "Số đơn",
                dataIndex: "count_order",
                width: 100,
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                align: 'center',
                fixed: "right",
                width: 90,
                render: (value, row) => (
                    <Button
                        size="small"
                        type="link"
                        onClick={() => {
                            setItemSelected(row)
                            setVisible(true)
                        }}
                    >
                        <EyeOutlined title="Xem chi tiết bảng kê" />
                    </Button>
                )
            },
        ];
        return (
            <div className={className}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    scroll={{ x: "calc(700px + 50%)", y: 400 }}
                    pagination={false}
                />
                <Drawer
                    destroyOnClose
                    title={`Thông tin chi tiết: ${itemSelected?.id}`}
                    width="95%"
                    closable={true}
                    onClose={() => setVisible(false)}
                    visible={visible}
                >
                    <ModalTC
                        itemSelected={itemSelected} setItemSelected={setItemSelected}
                        onRefreshList={onRefreshList}
                    />
                </Drawer>
            </div>

        );
    }
);
List.propTypes = {
    className: PropTypes.any,
};
export default styled(List)`
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-btn {
    border-color: none;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  

  .ant-table-thead > tr > th {
    padding: 8px;
  }
  .ant-table-tbody > tr > td {
    padding: 0.5rem;
  }
  .ant-table-pagination.ant-pagination {
    margin: 8px 0;
  }
  .ant-table-filter-trigger-container {
  }
  .ant-table-row-indent + .ant-table-row-expand-icon {
    margin: auto;
  }
  label {
    color: cornflowerblue;
  }

`;
