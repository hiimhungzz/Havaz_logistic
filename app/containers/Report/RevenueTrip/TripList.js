import { EyeOutlined } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
import ReportAHoa from "../ReportAHoa";
const { RangePicker } = DatePicker;
let inputTimer = null;

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const TripList = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
    const [driver_1_selected, set_driver_1] = useState(undefined);
    const [driver_2_selected, set_driver_2] = useState(undefined);
    const [visible, setVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);
    const format = "YYYY-MM-DD";
    const _changeQuery = useCallback(
      (payload) => {
        if (inputTimer) {
          clearTimeout(inputTimer);
        }
        inputTimer = setTimeout(() => {
          setParams((prevState) => {
            let nextState = { ...prevState };
            nextState[payload.name] = payload.value;
            return nextState;
          });
        }, 500);
      },
      [setParams]
    );
    const columns = [
      {
        title: "STT",
        dataIndex: "id",
        width: 60,
        fixed: "left",
        render: (value, row, index) => {
          const stringIndex = `${params.page - 1}${index}`;
          return (
            <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
          );
        },
      },
      {
        title: "Ngày thu",
        dataIndex: "did_time_nghiem_thu",
        fixed: "left",
        width: 120,
        render: (value) => value ? moment(value * 1000).format("DD-MM-YYYY") : ''
      },
      {
        title: "Ngày xe chạy",
        dataIndex: "time_run",
        width: 120,
        fixed: "left",
        render: (value) => value ? moment(value * 1000).format("DD-MM-YYYY") : ''
      },
      {
        title: "BKS",
        dataIndex: "car_code",
        width: 150,
      },
      {
        title: "Mã tuyến",
        dataIndex: "route_code",
        width: 180,
      },
      {
        title: "Tuyến",
        dataIndex: "route",
        width: 180,
      },
      {
        title: "Giờ xuất bến",
        dataIndex: "hour_run",
        width: 120,
      },
      {
        title: "Tổng bill",
        dataIndex: "count_bill",
        width: 100,
        render: (value) => <div style={{ textAlign: 'right' }}> {(value)} </div>
      },
      {
        title: "Chiều đi + về",
        dataIndex: "direction",
        render: (value) => <div style={{ textAlign: 'center' }}> {(value)} </div>,
        width: 120,
      },
      // {
      //   title: "VP nhận hàng",
      //   dataIndex: "source_name",
      //   width: 180,
      // },
      {
        title: "Tổng doanh thu hàng",
        dataIndex: "tong_dt",
        width: 180,
        render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
      },
      {
        title: "Hàng VP nhận",
        dataIndex: "vp_nhan",
        width: 150,
        render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>

      },

      {
        title: "Hàng xe nhận dọc đường",
        dataIndex: "nhan_doc_duong",
        width: 220,
        render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
      },

      {
        title: "Hàng xe trả dọc đường",
        dataIndex: "phat_doc_duong",
        width: 180,
        render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
      },
      {
        title: "Hàng VP treo nợ",
        dataIndex: "vp_treo",
        width: 150,
        render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>
      },
      {
        title: "THAO TÁC",
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
        {/* {renderContent()} */}
        <Table
          columns={columns}
          dataSource={data.filter(x => x.trip_id !== null)}
          rowKey="id"
          pagination={false}
          bordered
          scroll={{ x: "calc(700px + 50%)", y: 400 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell>Tổng</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={5}> </Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.count_bill, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.tong_dt, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.vp_nhan, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.nhan_doc_duong, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.phat_doc_duong, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell><div>{formatNumber(data.reduce((accum, b) => accum + b.vp_treo, 0))}</div></Table.Summary.Cell>
              <Table.Summary.Cell></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        <Drawer
          title="Thông tin chi tiết"
          width="95%"
          height="100%"
          closable={true}
          onClose={() => setVisible(false)}
          visible={visible}
          bodyStyle={{ height: "100%" }}
          footer={null}
        >
          <ReportAHoa
            excel="is_excel"
            type="trip"
            params={params}
            itemSelected={itemSelected}
          />
        </Drawer>
        {/* {renderContent()} */}
      </div>
    );
  }
);
TripList.propTypes = {
  className: PropTypes.any,
};
export default styled(TripList)`

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
