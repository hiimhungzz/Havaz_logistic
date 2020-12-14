import { Pagination, Row, Table, Tooltip, Drawer, Button } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import { EyeOutlined, } from '@ant-design/icons'
import ReportAHoa from "../ReportAHoa";
import moment from 'moment';
import {
  QuestionCircleOutlined,
} from '@ant-design/icons';

const StaffList = memo(({ className, data, params, total, setParams, aggregate }) => {
  const [visible, setVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: 75,
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
      title: "VP nhận hàng",
      dataIndex: "bex_ten",
      width: 180,
    },
    {
      title: () => <div>Số lượng đơn nhận &nbsp;
        <Tooltip placement="bottom" title="Tính cả đơn hủy">
          <QuestionCircleOutlined style={{ display: "inline-flex" }} />
        </Tooltip>
      </div>,
      dataIndex: "order_count",
      width: 100,
      render: (value) => <div style={{ textAlign: 'right' }}> {value} </div>
    },
    {
      title: () => <div >Doanh thu hàng cước VC (bến- bến) &nbsp;
        <Tooltip placement="bottom" title="Doanh thu hàng, không tính đơn hủy">
          < QuestionCircleOutlined style={{ display: "inline-flex" }} />
        </Tooltip>
      </div>,
      dataIndex: "order_fee",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: 'Tiền thu hộ COD',
      dataIndex: "order_cod",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: 'Cước thu hộ',
      dataIndex: "cod_fee",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: 'Cước ship nhận',
      dataIndex: "r_ship_fee",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: 'Cước ship trả',
      dataIndex: "d_ship_fee",
      width: 120,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: 'Tổng cước',
      dataIndex: "total_received",
      width: 150,
      render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
    },
    {
      title: "THAO TÁC",
      dataIndex: "action",
      align: 'center',
      fixed: "right",
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
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ x: "calc(700px + 50%)", y: 400 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_count)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.order_cod)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.cod_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.r_ship_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.d_ship_fee)}</div></Table.Summary.Cell>
            <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(aggregate?.total_received)}</div></Table.Summary.Cell>
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
        <ReportAHoa
          excel
          type="received"
          itemSelected={itemSelected}
          params={params}
          setParams={setParams}
        />
      </Drawer>
      {renderContent()}
    </div >
  );
});
StaffList.propTypes = {
  className: PropTypes.any,
};
export default styled(StaffList)`
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
