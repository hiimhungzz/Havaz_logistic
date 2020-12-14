/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback, useEffect } from "react";
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
    payment_types,
    className,
    dataSource,
    selectedRowKeys,
    setSelectedRowKeys,
    onClickItem,
    listRouter
  }) => {
    const [listRouterNew, setListRouterNew] = useState(listRouter)
    const columns = [
      {
        title: "Mã đơn hàng",
        className: "testc",
        width: 120,
        dataIndex: "id",
        key: "id",
        fixed: "left",
        render: (text, record) => {
          // comment tai lai phan warning
          // const idVp = listRouterNew.filter(trip => trip.id === record.destinationId) /// neu mang lon 0 thi nam trong
          return {
            // props: {
            //   style: { background: listRouterNew && listRouterNew.length > 0 && idVp && idVp.length === 0 ? "gold" : "" }
            // },
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
        dataIndex: "Cước phí",
        // key: "order_fee",
        align: "right",
        // render: (value) => formatNumber(value.amount),
        render: (text, record) =>
          // console.log("recordrecordrecord", record),
          <div style={{ marginBottom: "0em", textAlign: 'right' }}>{convert(record["order_fee"].amount - record["discount"]) || 0}</div>
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
        title: "Thu người nhận hàng",
        width: 180,
        dataIndex: "nn",
        key: "nn",
        render: (text, record) =>
          <div div style={{ marginBottom: "0em", textAlign: 'right' }}>
            {convert((record["order_fee"].paying_side && record["order_fee"].paying_side === 2 ? record["order_fee"].amount - record["discount"] : 0)
              + (record["d_shipping_fee"].paying_side && record["d_shipping_fee"].paying_side === 2 ? record["d_shipping_fee"].amount : 0)
              + (record["r_shipping_fee"].paying_side && record["r_shipping_fee"].paying_side === 2 ? record["r_shipping_fee"].amount : 0)
              + (record["cod_fee"].paying_side && record["cod_fee"].paying_side === 2 ? record["cod_fee"].amount : 0)
              + (record["order_cod"])
            )}
          </div >
      },
      {
        title: "Hình thức TT",
        width: 150,
        dataIndex: "order_fee",
        key: "order_fee",
        render: (text) => <div>{text.paying_side ? payment_types.getIn([text.paying_side + "", "text"]) : ""}</div>,
      },

      // {
      //   title: "Hình thức TT",
      //   width: 150,
      //   dataIndex: "payment_type",
      //   key: "payment_type",
      //   render: (text) => <div>{payment_types[text] ? payment_types[text].text : ""}</div>
      // },
    ]

    // const [columns] = useState();

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
    }, [filters, columns, listRouter]);
    // Events
    // ---------------


    useEffect(() => {
      setListRouterNew(listRouter)
    }, [listRouter]);

    return (
      <div className={className}>
        <Table
          rowClassName={(record, index) => ("warning")}
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
          columns={columns}
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
}
`;
