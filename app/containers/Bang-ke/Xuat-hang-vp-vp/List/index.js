/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */
import React, { useState, useCallback, memo } from "react";
import { Space, Button, Table, Popconfirm, Tag } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import { Input, Label } from "components";
import { formatNumber } from "utils/helper";
import { ORDER_EXPORT, DATE_TIME_FORMAT } from "utils/constants";
import { createStructuredSelector } from "reselect";
import {
  makeSelectDefinitions,
  makeSelectProfile,
} from "containers/App/selectors";
import { connect } from "react-redux";
import moment from "moment";
import Print from "../Print";

function vh(v) {
  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return (v * h) / 100;
}

let searchInput;
/*
 * List bảng kê
 */
const Page = memo(
  ({
    className,
    definitions,
    profile,
    dataSource,
    onCancelMTableRecord,
    onEditMTableRecord,
  }) => {
    const [search, setSearch] = useState({
      text: "",
      searchedColumn: "",
    });

    // Handlers

    /**
     * Handler sửa bản kê
     */
    const _handleEditCTableRecord = useCallback(
      (record) => {
        onEditMTableRecord(record);
      },
      [onEditMTableRecord]
    );
    /**
     * Handler hủy bản kê
     */
    const _handleCancelCTableRecord = useCallback(
      (cTableId) => {
        onCancelMTableRecord(cTableId);
      },
      [onCancelMTableRecord]
    );
    /**
     * Handler filter
     */
    const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearch((prev) => ({
        ...prev,
        text: selectedKeys[0],
        searchedColumn: dataIndex,
      }));
    }, []);

    /**
     * Handler xóa filter
     */
    const handleReset = useCallback((clearFilters) => {
      clearFilters();
      setSearch((prevState) => ({ ...prevState, text: "" }));
    }, []);
    /**
     * Hanlder Render filter của từng cột trong table
     */
    const getColumnSearchProps = useCallback(
      (dataIndex, dataName) => ({
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
              <Input
                ref={(node) => {
                  searchInput = node;
                }}
                placeholder={`Tìm ${dataName}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                  handleSearch(selectedKeys, confirm, dataIndex)
                }
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
              <Space>
                <Button
                  type="primary"
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Tìm kiếm
              </Button>
                <Button
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => handleReset(clearFilters)}
                  size="small"
                  style={{ width: 90 }}
                >
                  Xóa
              </Button>
              </Space>
            </div>
          ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : "rgba(0, 0, 0, 0.85)",
              fontWeight: "bold",
            }}
          />
        ),
        onFilter: (value, record) => {
          return (
            record.children.length > 0 &&
            _.filter(
              record.children,
              (x) =>
                x[dataIndex].toString().toLowerCase() === value.toLowerCase()
            ).length > 0
          );
        },
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.select());
          }
        },
        render: (text) =>
          search.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[search.text]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
              text
            ),
      }),
      [handleReset, handleSearch, search]
    );

    let columns = [
      {
        title: "STT",
        width: 80,
        dataIndex: "stt",
        key: "stt",
        align: "center",
        fixed: "left",
      },
      {
        title: "Mã đơn hàng",
        width: 180,
        dataIndex: "order_id",
        key: "order_id",
        ...getColumnSearchProps("order_id", "đơn hàng"),
        fixed: "left",
        render: (record) => {
          return (
            <div style={{ cursor: 'pointer' }} onClick={() => {
              window.open(`/tracking/${record}`, "_blank", "", true)
            }}>
              <p style={{ marginBottom: "0em" }}> {record}</p>
            </div>
          )
        }
      },
      {
        title: "Tuyến kết nối",
        width: 180,
        dataIndex: "depot_destination_name",
        key: "depot_destination_name",
        ...getColumnSearchProps("depot_destination_name", "văn phòng đích"),

        // fixed: "left",
      },
      {
        title: "Đ/c nhận",
        width: 180,
        dataIndex: "receiver_address",
        key: "receiver_address",
        // fixed: "left",
      },
      {
        title: "Người nhận",
        width: 180,
        dataIndex: "receiver_name",
        key: "receiver_name",
        // fixed: "left",
      },
      {
        title: "Người gửi",
        width: 180,
        dataIndex: "sender_name",
        key: "sender_name",
        // fixed: "left",
      },
      {
        title: "Số kiện",
        width: 180,
        dataIndex: "num_of_package",
        key: "num_of_package",
        align: "center",
        // fixed: "left",
      },
      {
        title: "Cước phí",
        width: 180,
        dataIndex: "order_fee",
        render: (value, row) => formatNumber(_.get(row, 'cod_fee.amount', 0) + (_.get(row, 'order_fee.amount', 0) - _.get(row, 'discount', 0))
          + _.get(row, 'd_shipping_fee.amount', 0) + _.get(row, 'r_shipping_fee.amount', 0)),
      },
      {
        title: "COD",
        width: 180,
        dataIndex: "order_cod",
        key: "order_cod",
        render: (text) => formatNumber(text),
      },
      {
        title: "Ngày nhận hàng",
        width: 150,
        align: "center",
        dataIndex: "create_time",
        key: "create_time",

        // fixed: "left",
      },
      {
        title: "Mô tả hàng",
        width: 200,
        align: "center",
        dataIndex: "description",
        key: "description",

        // fixed: "left",
      },
      {
        title: "Trạng thái",
        width: 180,
        dataIndex: "status",
        key: "status",
        render: (text) => {
          return (
            <Tag
              color={definitions.getIn(["order_statuses", text + "", "color"])}
            >
              {definitions.getIn(["order_statuses", text + "", "text"])}
            </Tag>
          );
        },
        // fixed: "left",
      },
    ];
    return (
      <Table
        rowKey="mTableId"
        expandable={{
          indentSize: 0,
        }}
        components={{
          body: {
            row: ({ children, ...restProps }) => {
              if (restProps["data-row-key"]) {
                let values = children[0].props.record;
                return (
                  <tr key={values.mTableId} {...restProps}>
                    <td style={{ paddingLeft: "0" }} colSpan={12}>
                      <div
                        style={{
                          paddingLeft: "15px",
                          left: 0,
                          width: "min-content",
                          position: "sticky",
                          display: "grid",
                          gridTemplateColumns:
                            "0px 30px 160px 60px 150px 150px 180px 200px 160px 40px 40px 40px",
                        }}
                      >
                        {children[0].props.appendNode}
                        <Label>
                          Bảng kê:&nbsp;
                          <i>{children[0].props.record.mTableId}</i>
                        </Label>
                        <Label>
                          <i>{children[0].props.record.seats}</i>
                        </Label>
                        <Label>
                          Tổng tiền:&nbsp;
                          <i>{formatNumber(children[0].props.record.amount)}</i>
                        </Label>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Label>
                            Tổng kiện:&nbsp;
                            <i>{children[0].props.record.numberPackage} kiện</i>
                          </Label>
                          <Label>
                            Số đơn:&nbsp;
                            <i>{children[0].props.record.children.length}</i>
                          </Label>
                        </div>

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Label>
                            Lái xe:&nbsp;
                            <i>{children[0].props.record.driver}</i>
                          </Label>
                          <Label>
                            SĐT:&nbsp;
                            <i>{children[0].props.record.driver_phone}</i>
                          </Label>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Label>
                            Ngày tạo:&nbsp;
                          <i>
                              {children[0].props.record.create_time}
                            </i>
                          </Label>
                          <Label>
                            Người lập:&nbsp;
                          <i> {children[0].props.record.staff_create || null}</i>
                          </Label>
                        </div>

                        <Label>
                          <Tag
                            color={definitions.getIn([
                              "export_statuses",
                              children[0].props.record.status.toString(),
                              "color",
                            ])}
                          >
                            {definitions.getIn([
                              "export_statuses",
                              children[0].props.record.status.toString(),
                              "text",
                            ])}
                          </Tag>
                        </Label>
                        <Popconfirm
                          title="Bạn có muốn hủy bản kê này?"
                          onConfirm={() =>
                            _handleCancelCTableRecord(
                              children[0].props.record.mTableId
                            )
                          }
                          onCancel={() => { }}
                          okText="Xác nhận"
                          cancelText="Quay lại"
                        >
                          {children[0].props.record.status === 1 && (
                            <Button
                              className="d-flex justify-content-center align-items-center my-auto"
                              title="Hủy bảng kê"
                              danger
                              type="link"
                            >
                              <DeleteTwoTone />
                            </Button>
                          )}
                        </Popconfirm>
                        <Button
                          onClick={() =>
                            _handleEditCTableRecord(children[0].props.record)
                          }
                          title="Sửa bảng kê"
                          className="d-flex justify-content-center align-items-center my-auto"
                          type="link"
                        >
                          <EditTwoTone />
                        </Button>
                        <Print
                          onPrint={(handlePrint) => {
                            setTimeout(() => handlePrint(), 200);
                          }}
                          dataBin={{
                            code: values.mTableId,
                            ...values,
                            current_hub: profile.current_hub.name,
                            // destination_name: _.get(
                            //   values,
                            //   "depot_destination.label",
                            //   ""
                            // ),
                            // create_time: moment().format(
                            //   DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM
                            // ),
                            // staff_create: _.get(profile, "name", ""),
                            create_time: values.create_time,
                            destination_name: values.destination_name || "Chưa có",
                            staff_create: values.staff_create || "Chưa có",
                            orders: _.map(values.children, (order, orderId) => {
                              return {
                                ...order,
                                daTra: 0,
                                conLai: 0,
                              };
                            }),
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              }
              return <tr children={children} {...restProps} />;
            },
          },
        }}
        scroll={{ y: vh(100) - 395 }}
        className={className}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ["topRight", "bottomRight"],
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    );
  }
);
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(Page))`
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
