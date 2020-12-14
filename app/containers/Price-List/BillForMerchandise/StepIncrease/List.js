import { EditTwoTone, LeftOutlined } from "@ant-design/icons";
import { Button, Pagination, Row, Table, Space } from "antd";
import "antd/dist/antd.css";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
const List = memo(({ className, data, params, total, setParams, onEdit }) => {
  const columns = [
    {
      title: "Giá trị nhỏ nhất",
      dataIndex: "min",
      width: 400,
    },
    {
      title: "Giá trị lớn nhất",
      dataIndex: "max",
      width: 400,
    },
    {
      title: "Lũy kế",
      dataIndex: "type",
      width: 400,
      render: (value, row, id) => (
        <div>{value === 0 ? "" : "X"}</div>
      )
    },
  ];

  return (
    <div className={className}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
});
List.propTypes = {
  className: PropTypes.any,
};
export default styled(List)`
.ant-table-wrapper {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td {
  position: relative;
  padding: 5px 16px !important ;
  overflow-wrap: break-word;
}
.ant-pagination-options-size-changer.ant-select {
  margin-right: 0px !important ;
.ant-table-thead > tr > th {
  background: rgb(242, 243, 248);
  padding: 16px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 0;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  letter-spacing: 0.01071em;
}
.ant-table-tbody > tr > td {
  border-bottom: 1px solid #f0f0f0;
}
`;
