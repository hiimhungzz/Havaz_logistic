/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback, useEffect } from "react";
import { Table } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { formatNumber } from "utils/helper";
/*
 * Right Table
 *
 */

const STATUS_NHAP_LAI = 4;
const Right = memo(
  ({
    filters,
    moveLoading,
    payment_types,
    className,
    dataSource,
    selectedRowKeys,
    setSelectedRowKeys,
    onClickItem,
    listRouter,
    exporting_item_statuses,
    definitions,
    cTableId,
    _handleRead,
  }) => {
    const [dataTable, setDataTable] = useState(dataSource)
    const [listRouterNew, setListRouterNew] = useState(listRouter)
    const onHandOver = useCallback(
      async (id, index) => {
        let result = await ServiceBase.requestJson({
          url: `/v1/exportings/${cTableId}/items/${id}/reimport-order`,
          method: "POST",
          data: {
            accepted: true
          }
        });
        if (result && result.hasErrors) {
          Ui.showError({ message: "Có lỗi khi thao tác" });
        } else {
          Ui.showSuccess({ message: "Nhập lại thành công" })
          _handleRead(cTableId)
        }


      },
      [cTableId, dataTable]
    );


    const columns = [
      {
        title: "Mã đơn hàng",
        className: "testc",
        width: 120,
        dataIndex: "id",
        key: "id",
        fixed: "left",
        render: (text, record) => {
          const idVp = listRouterNew.filter(trip => trip.id === record.destinationId) /// neu mang lon 0 thi nam trong
          return {
            props: {
              style: { background: listRouterNew && listRouterNew.length > 0 && idVp && idVp.length === 0 ? "gold" : "" }
            },
            children: <div>{text}</div>
          }
        }
      },
      {
        title: "Số kiện",
        width: 100,
        dataIndex: "num_of_package",
        key: "num_of_package",
        fixed: "left",
        align: "center",
      },
      {
        title: "VP đích",
        width: 150,
        dataIndex: "destination",
        key: "destination",
        fixed: "left",
        onFilter: (value, record) => record.destination.indexOf(value) === 0,
        sorter: (a, b) =>
          a.destination ? a.destination.localeCompare(b.destination) : true,
        sortDirections: ["descend", "ascend"],
      },
      {
        // 1 hoac 3 hienj thị cai nut nhạp lại văn phong
        title: "Trạng thái vận hành",
        width: 180,
        dataIndex: "item_status",
        key: "item_status",
        fixed: "left",
        render: (value) => definitions.getIn(["exporting_item_statuses", `${value}` + "", "text"])
      },
      {
        title: "Mô tả hàng",
        width: 250,
        dataIndex: "description",
        key: "description",
      },
      {
        title: "SĐT người nhận",
        width: 150,
        dataIndex: "receiver_phone",
        key: "receiver_phone",
      },
      {
        title: "Cước phí",
        width: 100,
        dataIndex: "order_fee",
        key: "order_fee",
        align: "right",
        render: (value) => formatNumber(value.amount),
      },
      {
        title: "Ngày nhận hàng",
        width: 150,
        dataIndex: "create_time",
        key: "create_time",
      },
      {
        title: "Đ/C nhận",
        width: 150,
        dataIndex: "receiver_address",
        key: "receiver_address",
      },
      {
        title: "Người nhận",
        width: 150,
        dataIndex: "receiver_name",
        key: "receiver_name",
      },
      {
        title: "Người gửi",
        width: 100,
        dataIndex: "sender_name",
        key: "sender_name",
      },
      {
        title: "COD",
        width: 100,
        dataIndex: "order_cod",
        key: "order_cod",
        render: (text) => formatNumber(text),
      },
      {
        title: "Hình thức TT",
        width: 150,
        dataIndex: "order_fee",
        key: "order_fee",
        render: (text) => <div>{text.paying_side ? payment_types.getIn([text.paying_side + "", "text"]) : ""}</div>,
      },
      {
        title: "Thao tác",
        width: 150,
        dataIndex: "item_status",
        key: "item_status",
        fixed: "right",

        render: (value, row, index) => {
          if (value && value === 1 || value && value === 3) {
            return <div onClick={() => {
              onHandOver(row.id, index)
            }}>
              <a>Nhập lại</a>
            </div>
          }
          else {
            return null;
          }
        }
      },
    ]
    const _handleSelectRow = useCallback(
      (rows) => {
        setSelectedRowKeys(rows);
      },
      [setSelectedRowKeys]
    );
    const _handleGetColumn = useCallback(() => {
      let next = [...columns];
      return next;
    }, [columns, dataTable]);
    // Events
    // ---------------


    useEffect(() => {
      setListRouterNew(listRouter)
    }, [listRouter]);

    useEffect(() => {
      setDataTable(dataSource)
    }, [dataSource]);

    return (
      <div className={className}>
        <Table
          rowClassName={(record, index) => ("warning")}
          loading={moveLoading}
          style={{ heigh: 500 }}
          className="table"
          rowKey="id"
          rowSelection={{ selectedRowKeys, onChange: _handleSelectRow }}
          bordered
          columns={_handleGetColumn()}
          dataSource={dataTable}
          pagination={false}
          scroll={{ x: "100%", y: 480 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell>SL</Table.Summary.Cell>
              <Table.Summary.Cell>{`${dataSource.length} đơn`}</Table.Summary.Cell>
              <Table.Summary.Cell>{`${dataSource.reduce((accum, b) => accum + b.num_of_package, 0)} kiện`}</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={11}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    );
  }
);
Right.propTypes = {
  className: PropTypes.any,
};
export default styled(Right)`
  flex: 1;
  .ant-table-wrapper {
    min-height: 536px;
    max-height: 536px;
    .ant-table-container {
      height: 536px;
      .ant-table-body {
        height: 481px;
      }
    }
    .ant-table-content {
      height: 536px;
      table {
        height: 100%;
      }
    }
  }
  .ant-table-ping-right:not(.ant-table-has-fix-right)
    .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-tbody > tr > td {
    padding: 8px 8px !important;
  }
  .ant-table-column-sorter-full {
    display: flex;
    align-items: center;
    margin-top: 0px;
  }
  .ant-table-row {
    cursor: pointer;
  }
  .ant-table-summary {
    font-weight: bold;
    text-align: right;
    .ant-table-cell {
        background-color: rgb(242,243,248);
        position: sticky;
        z-index: 10000;
        bottom: 0;
    }
  }
}
`;
