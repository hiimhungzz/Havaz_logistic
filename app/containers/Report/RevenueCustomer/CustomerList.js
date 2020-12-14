import { Pagination, Row, Table, Modal, Drawer, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import { EyeOutlined, } from '@ant-design/icons'
import ReportItem from "../ReportItem";
const CustomerList = memo(({ className, data, params, total, setParams }) => {
  const [visible, setVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [btnloadding, setBtnLoadding] = useState(false);

  const columns = [
    {
      title: "Văn phòng nhận",
      dataIndex: "source_name",
      width: 250,
    },
    {
      title: "Mã khách hàng",
      dataIndex: "sender_name",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "sender_name",
    },
    {
      title: "Cước vận chuyển",
      dataIndex: "price",
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>,
    },
    {
      title: "Tiền thu hộ",
      dataIndex: "cod",
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Phí thu hộ",
      dataIndex: "cod_fee",
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: 'center',
      width: 100,
      render: (value, row) => (
        <Button
          size="small"
          type="link"
          onClick={() => {
            setItemSelected(row)
            setVisible(true)
          }}
        >
          <EyeOutlined />
        </Button>
      )

    },
  ];

  return (
    <div className={className}>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="id"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Tổng </Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.price, 0))}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.cod, 0))}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.cod_fee, 0))}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <Drawer
        title="THÔNG TIN CHI TIẾT"
        width="95%"
        height="100%"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        bodyStyle={{ height: "100%" }}
        footer={null}
      >
        <ReportItem
          type="customer"
          params={params}
          itemSelected={itemSelected}
        />
      </Drawer>

    </div >
  );
});
CustomerList.propTypes = {
  className: PropTypes.any,
};
export default styled(CustomerList)`
  ..ant-table-thead > tr > th {
    border-top: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .ant-table-cell {
  border-left: 1px solid rgb(130 126 126 / 12%) !important;
  }
  .fix_drawer{
    padding-left : 100px
  }
  .ant-table-summary {
    font-weight: bold;
  }
//   .ant-table-thead > tr > th {
//     background-color: rgba(233,195,43);
//     padding-top: 5px !important;
//     padding-bottom: 5px !important;
//     padding-left: 5px !important;
//     padding-right: 5px !important;
// }ss
  
`;
