/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback } from "react";
import { Table } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { formatNumber } from "utils/helper";
/*
 * Right Table
 *
 */
const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};
const Right = memo(
  ({
    filters,
    moveLoading,
    className,
    dataSource,
    selectedRowKeys,
    setSelectedRowKeys,
    payment_types,
    onClickItem
  }) => {
    const [columns] = useState([
      {
        title: "Mã đơn hàng",
        width: 120,
        dataIndex: "id",
        key: "id",
        fixed: "left",
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
        title: "Mô tả hàng",
        width: 250,
        dataIndex: "description",
        key: "description",
        render: (text) => formatNumber(text)
      },
      {
        title: "SĐT người nhận",
        width: 140,
        dataIndex: "receiver_phone",
        key: "receiver_phone",
      },
      {
        title: "Ngày nhận hàng",
        width: 140,
        dataIndex: "create_time",
        key: "create_time",
      },
      {
        title: "Cước phí",
        width: 100,
        dataIndex: "Cước phí",
        align: "right",
        render: (text, record) =>
          <div style={{ marginBottom: "0em", textAlign: 'right' }}>{convert(record["order_fee"].amount - record["discount"]) || 0}</div>
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
        render: (text) => formatNumber(text)
      },
      {
        title: "Thu người nhận hàng",
        width: 180,
        dataIndex: "",
        key: "nn",
        render: (text, record) =>
          // console.log("recordrecordrecord", record),
          <div div style={{ marginBottom: "0em", textAlign: 'right' }}>
            {convert((record["order_fee"].paying_side && record["order_fee"].paying_side === 2 ? record["order_fee"].amount - record["discount"] : 0)
              + (record["d_shipping_fee"].paying_side && record["d_shipping_fee"].paying_side === 2 ? record["d_shipping_fee"].amount : 0)
              + (record["r_shipping_fee"].paying_side && record["r_shipping_fee"].paying_side === 2 ? record["r_shipping_fee"].amount : 0)
              + (record["cod_fee"].paying_side && record["cod_fee"].paying_side === 2 ? record["cod_fee"].amount : 0)
              + (record["order_cod"])
            )}
          </div >
      },
      // hungedit
      {
        title: "Hình thức TT",
        width: 150,
        dataIndex: "order_fee",
        key: "order_fee",
        render: (text) => <div>{text.paying_side ? payment_types[text.paying_side].text : ""}</div>,
      },

    ]);

    // Handlers

    /*
     * Handler chọn row trong table
     */
    const _handleSelectRow = useCallback(
      (rows) => {
        setSelectedRowKeys(rows);
      },
      [setSelectedRowKeys]
    );

    const _handleGetColumn = useCallback(() => {
      let next = [...columns];
      next[2].filters = filters;
      return next;
    }, [filters, columns]);
    // Events
    // ---------------
    return (
      <div className={className}>
        <Table
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => {
                onClickItem(record)
              },
            };
          }}
          loading={moveLoading}
          style={{ heigh: 500 }}
          className="table"
          rowKey="id"
          rowSelection={{ selectedRowKeys, onChange: _handleSelectRow }}
          bordered
          columns={_handleGetColumn()}
          dataSource={dataSource}
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
`;
