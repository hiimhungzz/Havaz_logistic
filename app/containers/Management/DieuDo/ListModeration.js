import { Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";
import ItemAction from "./ItemAction";
import { formatNumber } from "utils/helper";

const ListModeration = memo(
    ({ className, data, onRefreshList }) => {
        const columns = [
            {
                title: "STT",
                dataIndex: "id",
                render: (value, row, index) => {
                    return (
                        <h5>{index + 1}</h5>
                    );
                },
                width: 60,
                fixed: "left",
            },
            {
                title: "Chuyến",
                dataIndex: "trip_id",
                width: 100,
                fixed: "left",
            },
            {
                title: "BKS",
                dataIndex: "trip_bus",
                render: (value) => {
                    return (
                        <div>{value && value.license_plate || ""}</div>
                    );
                },
                width: 150,
            },
            {
                title: "NỐT",
                dataIndex: "not_code",
                align: 'center',
                render: (value, row) => {
                    return (
                        <div style={{ background: row.trip_service.color || '', }}>{value}</div>
                    );
                },
                width: 150,
            },
            {
                title: "Giờ sở",
                dataIndex: "time_root",
                width: 100,
            },
            {
                title: "Giờ xuất bến",
                dataIndex: "time_run",
                width: 120,
            },
            {
                title: "Giờ điều hành",
                dataIndex: "time_executive",
                width: 130,
            },
            {
                title: "Lái xe 1",
                dataIndex: "drivers",
                render: (value) => {
                    if (value.length > 0) {
                        return (
                            <div>{value[0].name || ""}</div>
                        );
                    }
                },
                width: 200,
            },
            {
                title: "Lái xe 2",
                dataIndex: "drivers",
                render: (value) => {
                    if (value.length > 1) {
                        return (
                            <div>{value[1].name || ""}</div>
                        );
                    }
                },
                width: 200,
            },
            {
                title: "Tiếp viên",
                dataIndex: "attendants",
                render: (value) => {
                    if (value.length > 0) {
                        return (
                            <div>{value[0].name || ""}</div>
                        );
                    }
                },
                width: 200,
            },
            {
                title: "Số lượng bill",
                dataIndex: "aggregate",
                render: (value) => <div style={{ textAlign: 'right' }}>{value?.count_order}</div>,
                width: 120,
            },
            {
                title: "Số lượng kiện",
                dataIndex: "aggregate",
                render: (value) => <div style={{ textAlign: 'right' }}>{value?.sum_number_package}</div>,
                width: 130,
            },
            {
                title: "Tổng cước VC",
                dataIndex: "aggregate",
                render: (value) => <div style={{ textAlign: 'right' }}>{formatNumber(value?.sum_order_fee)}</div>,
                width: 130,
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                align: 'center',
                fixed: 'right',
                width: 100,
                render: (value, row) => (
                    <div>
                        <ItemAction row={row} data={data} onRefreshList={onRefreshList} />
                    </div>
                )
            },
        ];
        return (
            <div className={className}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="trip_id"
                    scroll={{ x: "calc(700px + 50%)" }}
                    pagination={false}
                />
            </div>
        );
    }
);
ListModeration.propTypes = {
    className: PropTypes.any,
};
export default styled(ListModeration)`
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
