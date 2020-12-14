/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */
import React, { useState, useCallback } from "react";
import { Space, Button, Table, Popconfirm, Tag } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import { Input } from "components";
import { Label } from "components";
import { formatNumber } from "utils/helper";
import { createStructuredSelector } from "reselect";
import Print from '../Print';
import {
  makeSelectDefinitions,
  makeSelectProfile,
} from "containers/App/selectors";
import { connect, useSelector } from "react-redux";
import { DATE_TIME_FORMAT } from "utils/constants";
import moment from "moment";

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
const Page = ({
  className,
  definitions,
  profile,
  dataSource,
  onCancelCTableRecord,
  onEditCTableRecord,
}) => {
  const [dataBin, setDataBin] = useState({});
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
      // onEditCTableRecord(record);
    },
    [onEditCTableRecord]
  );
  /**
   * Handler hủy bản kê
   */
  const _handleCancelCTableRecord = useCallback(
    (cTableId) => {
      // onCancelCTableRecord(cTableId);
    },
    [onCancelCTableRecord]
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
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
            (x) => x[dataIndex].toString().toLowerCase() === value.toLowerCase()
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
    },
    {
      title: "VP đích",
      width: 180,
      dataIndex: "depot_destination_name",
      key: "depot_destination_name",
      ...getColumnSearchProps("depot_destination_name", "văn phòng đích"),
      // fixed: "left",
    },
    {
      title: "Đ/c người nhận",
      dataIndex: "receiver_address",
      key: "receiver_address",
      width: 220,
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
      width: 80,
      dataIndex: "num_of_package",
      key: "num_of_package",
      align: "center",
      // fixed: "left",
    },
    {
      title: "Cước phí",
      width: 90,
      dataIndex: "order_fee",
      key: "order_fee",
      render: (text) => formatNumber(text),
      // fixed: "left",
    },
    {
      title: "COD",
      width: 90,
      dataIndex: "order_cod",
      key: "order_cod",
      render: (text) => formatNumber(text),
    },
    {
      title: "HTTT",
      width: 90,
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text) => formatNumber(text),
    },
    {
      title: "Thời gian tạo",
      width: 110,
      align: "center",
      dataIndex: "create_time",
      key: "create_time",

      // fixed: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 90,
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
      rowKey="cTableId"
      expandable={{
        indentSize: 0,
      }}
      components={{
        body: {
          row: ({ children, ...restProps }) => {
            if (restProps["data-row-key"]) {
              let values = children[0].props.record;
              return (
                <tr key={values.cTableId} {...restProps}>
                  <td style={{ paddingLeft: 0 }} colSpan={12}>
                    <div
                      style={{
                        paddingLeft: 15,
                        left: 0,
                        width: 1065,
                        position: "sticky",
                        display: "grid",
                        gridTemplateColumns:
                          "0px 30px 200px 300px 100px 40px 40px 40px 40px 40px 40px",
                      }}
                    >
                      {children[0].props.appendNode}
                      <Label color="cornflowerblue">
                        Bảng kê:&nbsp;
                        <i>{children[0].props.record.cTableId}</i>
                      </Label>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Label>
                          Tổng cuớc phí:&nbsp;
                          <i>{formatNumber(children[0].props.record.amount)}</i>
                        </Label>
                        <Label>
                          Phải thu:&nbsp;
                          <i>{formatNumber(3600000)}</i> &nbsp; Tổng kiện: <span>NHÁP</span>
                        </Label>
                      </div>
                     
                      <Label>
                        <Tag
                          color={definitions
                            .getIn([
                              "export_statuses",
                              children[0].props.record.status.toString(),
                            ])
                            ?.get("color")}
                        >
                          {definitions
                            .getIn([
                              "export_statuses",
                              children[0].props.record.status.toString(),
                            ])
                            ?.get("text")}
                        </Tag>
                      </Label>
                      <Popconfirm
                        title="Bạn có muốn hủy bản kê này?"
                        onConfirm={() =>
                          _handleCancelCTableRecord(
                            children[0].props.record.cTableId
                          )
                        }
                        onCancel={() => {}}
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
                        disabled={children[0].props.record.status === 3}
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
                          code: values.cTableId,
                          ...values,
                          current_hub: profile.current_hub.name,
                          destination_name: _.get(
                            values,
                            "depot_destination.label",
                            ""
                          ),
                          create_time: moment().format(
                            DATE_TIME_FORMAT.DD_MM_YYYY__HH_MM
                          ),
                          staff_create: _.get(profile, "name", ""),
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
      scroll={{ y: vh(100) - 355 }}
      className={className}
      columns={columns}
      dataSource={dataSource}
      size="small"
      pagination={{
        position: ["topRight", "bottomRight"],
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
    />
  );
};
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
  }
`;
