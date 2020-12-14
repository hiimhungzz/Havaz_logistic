import { Divider, Input, Table, Row, Pagination } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import moment from "moment";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
let inputTimer = null;
const convert = function (str) {
  if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else return "";
};
const OfficeList = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
    const format = "YYYY-MM-DD";
    const columns = [
      {
        title: "Ngày nhận hàng",
        dataIndex: "day",
        width: 200,
        render: (text, record) => (
          <div className="d-flex" style={{ flexDirection: "column" }}>
            <p style={{ marginBottom: "0em" }}>{moment(text).format("DD-MM-YYYY")}</p>
          </div>
        ),
      },
      {
        title: "Văn phòng",
        dataIndex: "source_name",
      },
      {
        title: "Doanh thu hàng",
        dataIndex: "price",
        render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>

      },
      {
        title: "Tổng tiền thu hộ",
        dataIndex: "cod",
        render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>

      },
      {
        title: "Tổng cước thu hộ",
        dataIndex: "cod_fee",
        render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>

      },
      {
        title: "Tổng cước phí",
        dataIndex: "cod_fee_price",
        render: (text, record) =>
          <div style={{ marginBottom: "0em", textAlign: 'right' }}>{convert(record["price"] + record["cod_fee"]) || 0}</div>
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
          bordered
          scroll={{ x: "100%" }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Tổng </Table.Summary.Cell>
              <Table.Summary.Cell index={1}> </Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.price, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.cod, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.cod_fee, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell index={1}><div style={{ textAlign: 'right' }}>{formatNumber(data.reduce((accum, b) => accum + b.cod_fee + b.price, 0))}</div></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />

        {renderContent()}
      </div>
    );
  }
);
OfficeList.propTypes = {
  className: PropTypes.any,
};
export default styled(OfficeList)`
  .ant-table-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
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
// }
`;
