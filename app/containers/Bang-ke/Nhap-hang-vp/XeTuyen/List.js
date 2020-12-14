/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback } from "react";
import { Table, Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { formatNumber } from "utils/helper";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Map } from "immutable";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";
import ItemAction from './ItemAction';
/*
 * Left Table
 *
 */
const List = memo(
  ({
    filters,
    loadding,
    className,
    dataSource,
    selectedRowKeys,
    setSelectedRowKeys,
    tripA,
    tripB,
    getList,
  }) => {
    const definitions = useSelector((state) =>
      state.App.get("definitions").toJS()
    );
    const [modal, setModal] = useState(false);
    let columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: "id",
        key: "id",
        width: 140,
      },
      {
        title: "Số kiện",
        dataIndex: "num_of_package",
        key: "num_of_package",
        width: 120,
        render: (value) => <div style={{ textAlign: "right" }}> {value}</div>
      },
      {
        title: "VP đích",
        dataIndex: "destination",
        key: "destination",
        render: (value) => <div>{value.name}</div>,
        filters: filters,
        onFilter: (value, record) => record.destination.name.indexOf(value) === 0,
      },
      {
        title: "Cước phí",
        dataIndex: "order_fee",
        key: "order_fee",
        render: (value, row) => <div style={{ textAlign: "right" }}>{
          formatNumber(_.get(row, 'cod_fee.amount', 0) + _.get(row, 'order_fee.amount', 0)
            + _.get(row, 'd_shipping_fee.amount', 0) + _.get(row, 'r_shipping_fee.amount', 0))}</div>,
      },
      {
        title: "Trạng thái đơn",
        dataIndex: "shipment_order_status",
        key: "shipment_order_status",
        render: (text) => <div>{definitions.shipment_order_statuses[text] && definitions.shipment_order_statuses[text].text}</div>,
      },
      {
        title: "Mô tả hàng",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "SĐT người nhận",
        dataIndex: "receiver",
        key: "receiver",
        width: 150,
        render: (value) => value?.phone
      },
      {
        title: "Thao tác",
        width: 170,
        fixed: "right",
        dataIndex: "shipment_order_status",
        key: "shipment_order_status",
        fixed: 'right',
        render: (value, record) => {
          if (value !== 2) {
            return <div >{definitions.shipment_order_statuses[value] && definitions.shipment_order_statuses[value].text}</div>;
          } else {
            return <ItemAction getList={getList} definitions={definitions} value={value} record={record} tripA={tripA} tripB={tripB} />
          }
        }
      },
    ];

    const _handleSelectAll = useCallback(async (selected, selectedRows, changeRows) => {
      if (!selected) {
        setSelectedRowKeys([])
      } else {
        const arrayAction = dataSource.filter(x => x.shipment_order_status === 2)
        if (arrayAction.length === selectedRowKeys.length) { // Trường hợp click vào xóa tất cả khi chưa full item
          setSelectedRowKeys([])
        } else {
          let selectKeyNew = [];
          await selectedRows.map((item) => {
            if (item.shipment_order_status === 2) {
              selectKeyNew.push(item.id)
            }
          })
          await setSelectedRowKeys(selectKeyNew);
        }
      }
    }, [selectedRowKeys, dataSource])

    const _handleSelect = useCallback((record, status) => {
      if (status && record.shipment_order_status === 2 && !selectedRowKeys.includes(record.id)) {
        const selectKeyNew = [...selectedRowKeys]
        selectKeyNew.push(record.id)
        setSelectedRowKeys(selectKeyNew)
      } else if (!status) {
        const selectKeyNew = [...selectedRowKeys]
        const index = selectKeyNew.indexOf(record.id);
        selectKeyNew.splice(index, 1);
        setSelectedRowKeys(selectKeyNew)
      }
    }, [selectedRowKeys]);

    return (
      <div className={className}>
        <Table
          loading={loadding}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onSelect: _handleSelect,
            onSelectAll: _handleSelectAll,
          }}
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: "calc(700px + 50%)" }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{`Tổng đơn: ${dataSource.length}`}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>Tổng kiện: {formatNumber(dataSource.reduce((accum, b) => accum + b.num_of_package, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={3} ><div style={{ textAlign: 'right' }} >Tổng tiền: {formatNumber(dataSource.reduce((accum, record) => accum +
                (record["cod_fee"].amount)
                + (record["order_fee"].amount)
                + (record["r_shipping_fee"].amount)
                + (record["d_shipping_fee"].amount)
                , 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    );
  }
);
List.propTypes = {
  className: PropTypes.any,
};
export default styled(List)`
`;
