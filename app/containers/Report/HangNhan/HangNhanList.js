import { Pagination, Row, Table, Modal, Drawer, Button } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import moment from 'moment';
import React, { memo, useState } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import { EyeOutlined, } from '@ant-design/icons'
import ReportAHoa from "../ReportAHoa";
const StaffList = memo(({ className, data, params, total, setParams, aggregate }) => {
  const [visible, setVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [btnloadding, setBtnLoadding] = useState(false);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: 70,
      fixed: "left",
      render: (value, row, index) => {
        const stringIndex = `${params.page - 1}${index}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
        );
      },
    },
    {
      title: "Ngày nhận hàng",
      dataIndex: "date",
      width: 150,
      render: (value) => moment(value).format("DD-MM-YYYY")

    },
    {
      title: "Mã NV nhận",
      dataIndex: "actor_code",
      width: 120,
    },
    {
      title: "Tên NV nhận",
      dataIndex: "actor_name",
      width: 150,
    },
    {
      title: "VP nhận hàng",
      dataIndex: "hub_name",
      width: 150,
    },
    {
      title: "SL đơn nhận",
      dataIndex: "order_count",
      width: 120,
      render: (value) => <div style={{ textAlign: 'right' }}> {value} </div>
    },
    {
      title: "Tổng cước VC",
      dataIndex: "order_fee",
      width: 140,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Đã thu NG",
      dataIndex: "sender_payment_fee",
      width: 120,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Còn phải thu",
      dataIndex: "receiver_payment_fee",
      width: 120,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Cước ship nhận",
      dataIndex: "r_ship_fee",
      width: 140,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Cước ship trả",
      dataIndex: "d_ship_fee",
      width: 120,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Tiền thu hộ COD",
      dataIndex: "order_cod",
      width: 140,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "Cước thu hộ COD",
      dataIndex: "cod_fee",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },

    // {
    //   title: "Doanh thu hàng cước VC (bến- bến)",
    //   dataIndex: "order_fee",
    //   width: 150,
    //   render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    // },
    //
    // {
    //   title: "Tổng cước",
    // dataIndex: "total_received",
    // width: 150,
    // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    // },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: 'center',
      width: 100,
      fixed: "right",
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

  const renderContent = () => {
    return (
      <Row justify="end" style={{ marginBottom: 5, marginTop: 5 }}>
        <Pagination
          onShowSizeChange={(current, size) => {
            setParams((prevState) => {
              let nextState = { ...prevState };
              nextState.page = 1;
              nextState.per_page = size;
              return nextState;
            });
          }}
          onChange={(page, pageSize) => {
            setParams((prevState) => {
              let nextState = { ...prevState };
              nextState.page = page;
              return nextState;
            });
          }}
          total={total}
          current={params.page}
          pageSize={params.per_page}
          showSizeChanger
        />
      </Row>
    );
  };

  return (
    <div className={className}>
      {renderContent()}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        scroll={{ x: "calc(700px + 50%)", y: 400 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
            <Table.Summary.Cell colSpan={4}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_count)}</div></Table.Summary.Cell>

            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.sender_payment_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.receiver_payment_fee)}</div></Table.Summary.Cell>

            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.r_ship_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.d_ship_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_cod)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.cod_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell colSpan={2}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      {renderContent()}
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
        {/* /api/v1/report/get-orders?scope={scope}&hub_id={hub_id}&actor_id={actor_id}&date={Y-m-d}scope: received|delivered| */}
        <ReportAHoa
          type="received"
          params={params}
          itemSelected={itemSelected}
        />
      </Drawer>

    </div >
  );
});
StaffList.propTypes = {
  className: PropTypes.any,
};
export default styled(StaffList)`
// .ant-table-thead > tr > th {
//   background-color: rgba(233,195,43);
//   padding-top: 5px !important;
//   padding-bottom: 5px !important;
//   padding-left: 5px !important;
//   padding-right: 5px !important;
// }
  .ant-table-thead > tr > th {
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
    text-align: right;
    .ant-table-cell {
        background-color: rgb(242,243,248);
        position: sticky;
        z-index: 10000;
        bottom: 0;
    }
  }
  
  
`;
