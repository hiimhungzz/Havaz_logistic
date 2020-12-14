/**
 * Input (Styled Component)
 */
import React, { useCallback } from "react";
import { Table } from "antd";
import _ from "lodash"

const History = ({
  tabActive
}) => {
  // columns
  let columns = [
    {
      title: "Mã đơn",
      width: 130,
      dataIndex: "code",
      key: "code",
      fixed: "left",
    },
    {
      title: "VP đích",
      width: 100,
      fixed: "left",
      key: "destination",
      render: (text, record) => (
        <div>{record["destination"]["name"]}</div>
      ),
    },
    {
      title: "Địa chỉ nhận",
      width: 200,
      fixed: "left",
      key: "destination",
      render: (text, record) => (
        <div>{record["receiver"]["address"]}</div>
      ),
    },
    {
      title: "Người nhận",
      width: 120,
      fixed: "left",
      key: "destination",
      render: (text, record) => (
        <div className="d-flex" style={{ flexDirection: "column" }}>
          <h5> {record["receiver"]["name"]}</h5>
          <em> {record["receiver"]["phone"]}</em>
        </div>
      ),
    },
    {
      title: "Người gửi",
      width: 120,
      key: "destination",
      render: (text, record) => (
        <div className="d-flex" style={{ flexDirection: "column" }}>
          <h5>{record["sender"]["name"]}</h5>
          <em>{record["sender"]["phone"]}</em>
        </div>
      ),
    },
    {
      title: "Số kiện",
      width: 70,
      dataIndex: "num_of_package",
      key: "num_of_package",
    },
    {
      title: "Cước phí",
      width: 100,
      key: "order_fee",
      render: (text, record) => <div>{convert(record["order_fee"])}</div>,
    },
    {
      title: "COD",
      width: 100,
      key: "order_cod",
      render: (text, record) => <div>{convert(record["order_cod"])}</div>,
    },
    {
      title: "HTTT",
      width: 130,
      dataIndex: "payment_type",
      key: "payment_types",
      render: (text) => (
        <div>{definitions.getIn([
          "payment_types",
          `${text}`,
          "text",
        ])}</div>
      ),
    },
    {
      title: "Trạng thái",
      width: 80,
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={definitions.getIn([
            "order_statuses",
            `${text}`,
            "color",
          ])}
        >
          {definitions.getIn([
            "order_statuses",
            `${text}`,
            "text",
          ])}
        </Tag>
      ),
    },
    {
      title: "Thời gian thay đổi",
      width: 150,
      key: "created_at",
      render: (text, record) => (
        <div>
          {moment(record["created_at"]).format("DD-MM-YYYY HH:mm")}
        </div>
      ),
    },
    {
      title: "EVENT",
      width: 150,
      key: "creator",
      render: (text, record) => <div>{record["creator"]["name"]}</div>,
    }
  ];
  return (
    <Table
      bordered
      columns={columns}
      dataSource={[]}
      scroll={{ x: "100%" }}
      rowKey="code"
      pagination={true}
    />
  )
};

export default History;