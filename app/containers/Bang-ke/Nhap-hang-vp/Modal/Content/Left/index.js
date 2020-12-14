/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, memo, useCallback } from "react";
import { Table, Select, Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { formatNumber } from "utils/helper";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Map } from "immutable";
import ServiceBase from "utils/ServiceBase";
import { API_BASE_URL } from "utils/constants";
import { Ui } from "utils/Ui";

/*
 * Left Table
 *
 */
const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};
const Left = memo(
  ({
    cTableId,
    filters,
    moveLoading,
    className,
    dataSource,
    setLeftDataSource,
    selectedRowKeys,
    setSelectedRowKeys,
    onClickItem
  }) => {
    const definitions = useSelector((state) =>
      state.App.get("definitions").toJS()
    );
    const [modal, setModal] = useState(
      Map({
        show: false,
        action: 0,
        recordId: null,
      })
    );
    let columns = [
      {
        title: "Mã đơn hàng",
        width: 120,
        dataIndex: "id",
        key: "id",
        fixed: "left",
      },
      {
        title: "Mô tả hàng",
        width: 150,
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Số kiện",
        width: 100,
        dataIndex: "num_of_package",
        key: "num_of_package",
        align: "center",
      },
      {
        title: "VP đích",
        width: 100,
        dataIndex: "destination",
        key: "destination",
        onFilter: (value, record) => record.destination.indexOf(value) === 0,
        sorter: (a, b) =>
          a.destination ? a.destination.localeCompare(b.destination) : true,
        sortDirections: ["descend", "ascend"],
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
        title: "Thu người nhận hàng",
        width: 180,
        dataIndex: "",
        key: "nn",
        render: (text, record) =>
          // console.log("recordrecordrecord", record),
          <div style={{ marginBottom: "0em", textAlign: 'right' }}>
            {convert((record["order_fee"].paying_side && record["order_fee"].paying_side === 2 ? record["order_fee"].amount - record["discount"] : 0)
              + (record["d_shipping_fee"].paying_side && record["d_shipping_fee"].paying_side === 2 ? record["d_shipping_fee"].amount : 0)
              + (record["r_shipping_fee"].paying_side && record["r_shipping_fee"].paying_side === 2 ? record["r_shipping_fee"].amount : 0)
              + (record["cod_fee"].paying_side && record["cod_fee"].paying_side === 2 ? record["cod_fee"].amount : 0)
              + (record["order_cod"])
            )}
          </div>
      },
      {
        title: "Trạng thái",
        width: 100,
        dataIndex: "driver_status",
        key: "driver_status",
        render: (text) => text ? <div>{definitions.driver_statuses[text] && definitions.driver_statuses[text].text}</div> : '',
      },
    ];
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
          loading={moveLoading}
          rowKey="id"
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => {

                onClickItem(record)
              },
            };
          }}
          rowSelection={{
            selectedRowKeys,

            onChange: _handleSelectRow,

          }}
          bordered
          columns={_handleGetColumn()}
          dataSource={dataSource.filter(x => x.status_export_order !== 2)} //  a Diep bao
          pagination={false}
          scroll={{ x: "100%", y: 536 }}
        />
        <Modal
          title="Lý do"
          visible={modal.get("show")}
          onOk={async () => {
            setLeftDataSource((prev) => {
              let next = prev;
              next = next.update("raw", (raw) => {
                let rawNext = [...raw];
                return rawNext.map((ra) => {
                  if (ra.id === modal.get("recordId")) {
                    ra.leftAction = modal.get("action");
                    ra.leftNote = modal.get("note");
                  }
                  return ra;
                });
              });
              return next;
            });
            let result = await ServiceBase.requestJson({
              baseUrl: API_BASE_URL,
              url: `/v1/orders/${modal.get("recordId")}/undelivery`,
              data: {
                reason: modal.get("note"),
              },
              method: "POST",
            });
            if (result.hasErrors) {
              Ui.showError({
                message: "Có lỗi xảy ra khi kết thúc đơn hàng.",
              });
            } else {
              Ui.showSuccess({
                message: "Kết thúc đơn hàng thành công.",
              });
            }
            setModal((prev) => prev.set("show", false));
          }}
          onCancel={() => {
            setModal((prev) => prev.set("show", false));
          }}
        >
          <Select
            value={modal.get("note")}
            onChange={(value) => {
              setModal((prev) => prev.set("note", value));
            }}
            placeholder="Chọn lý do"
            style={{ width: 200 }}
          >
            {_.map(
              _.pick(definitions.undelivered_reasons, [2, 3]),
              (reason) => (
                <Select.Option key={reason.key} value={reason.key}>
                  {reason.text}
                </Select.Option>
              )
            )}
          </Select>
        </Modal>
      </div>
    );
  }
);
Left.propTypes = {
  className: PropTypes.any,
};
export default styled(Left)`
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
`;
