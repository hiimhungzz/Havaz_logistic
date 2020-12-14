import { DatePicker, Input, Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import ChieuSelect from "components/Select/ChieuSelect";
import moment from "moment";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";

const { RangePicker } = DatePicker;
let inputTimer = null;
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
const DateList = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
    const onChange = (dates, dateStrings) => { };
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
        fixed: "left",
        width: 60,
        render: (value, row, index) => {
          // const stringIndex = `${params.page - 1}${index}`;
          const stringIndex = `${((params.page - 1) * params.per_page + index)}`;
          return (
            <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
          );
        },
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Ngày</p>

              <RangePicker
                allowClear={false}
                value={[moment(params.day_from), moment(params.day_to)]}
                style={{ width: "100%" }}
                format={"DD-MM-YYYY"}
                ranges={{
                  "Hôm nay": [moment(), moment()],
                  "Tuần hiện tại": [
                    moment().startOf("week"),
                    moment().endOf("week"),
                  ],
                  "Tháng hiện tại": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "Tuần trước": [
                    moment()
                      .add(-1, "weeks")
                      .startOf("week"),
                    moment()
                      .add(-1, "weeks")
                      .endOf("week"),
                  ],
                  "Tháng trước": [
                    moment()
                      .add(-1, "months")
                      .startOf("month"),
                    moment()
                      .add(-1, "months")
                      .endOf("month"),
                  ],
                  "Tuần sau": [
                    moment()
                      .add(1, "weeks")
                      .startOf("week"),
                    moment()
                      .add(1, "weeks")
                      .endOf("week"),
                  ],
                  "Tháng sau": [
                    moment()
                      .add(1, "months")
                      .startOf("month"),
                    moment()
                      .add(1, "months")
                      .endOf("month"),
                  ],
                }}
                onChange={(dates) => {
                  setParams((prevState) => {
                    let nextState = { ...prevState };
                    nextState.day_from = dates[0];
                    nextState.day_to = dates[1];
                    return nextState;
                  });
                }}
              />
            </div>
          );
        },
        dataIndex: "day",
        width: 260,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số chuyến</p>
              <Input placeholder="Số chuyến" />
            </div>
          );
        },
        dataIndex: "count_trip",
        width: 100,
        render: (text) => <div style={{ textAlign: 'center' }}> {(text)} </div>
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header"> Số đơn hàng</p>
              <Input placeholder="Số đơn hàng" />
            </div>
          );
        },
        dataIndex: "count_orders",
        width: 150,
        render: (text) => <div style={{ textAlign: 'center' }}> {(text)} </div>
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Tổng cước phí</p>
              <Input placeholder="Tổng cước phí" />
            </div>
          );
        },
        dataIndex: "total_fee",
        width: 150,
        render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
      },
      {
        title: "Số phải thu",
        children: [
          {
            title: () => {
              return (
                <div className="header-nav-children">
                  <p className="ant_header">Tổng phải thu</p>
                  <Input placeholder="Tổng số tiền phải thu" />
                </div>
              );
            },
            dataIndex: "total_receive",
            key: "total_receive",
            width: 150,
            render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
          },
          {
            title: () => {
              return (
                <div className="header-nav-children">
                  <p className="ant_header">Số đã thu đầu nhận hàng</p>
                  <Input placeholder="Số đã thu đầu nhận hàng" />
                </div>
              );
            },
            dataIndex: "s_received",
            key: "s_received",
            width: 200,
            render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
          },
          {
            title: () => {
              return (
                <div className="header-nav-children">
                  <p className="ant_header">Số đã thu đầu phát</p>
                  <Input placeholder="Số đã thu đầu phát" />
                </div>
              );
            },
            dataIndex: "d_received",
            key: "d_received",
            width: 200,
            render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
          },
          {
            title: () => {
              return (
                <div className="header-nav-children">
                  <p className="ant_header">Số còn phải thu đầu phát</p>
                  <Input placeholder="Số còn phải thu đầu phát" />
                </div>
              );
            },
            dataIndex: "s_unreceived",
            key: "s_unreceived",
            width: 200,
            render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
          },
          {
            title: () => {
              return (
                <div className="header-nav-children">
                  <p className="ant_header">Số không thành công</p>
                  <Input placeholder="Số không thành công" />
                </div>
              );
            },
            dataIndex: "unreceived",
            key: "unreceived",
            width: 180,
            render: (text) => <div style={{ textAlign: 'right' }}> {formatNumber(text)} </div>
          },
        ],
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
          scroll={{ x: "calc(700px + 50%)" }}
        />

        {renderContent()}
      </div>
    );
  }
);
DateList.propTypes = {
  className: PropTypes.any,
};
export default styled(DateList)`
  .ant-table-wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    position: relative;
    padding: 5px 16px !important ;
    overflow-wrap: break-word;
  }
  .ant-pagination-options-size-changer.ant-select {
    margin-right: 0px !important ;
  .header-nav {
    margin-top: 40px;
  }
  .header-nav-children {
    margin-top: -15px;
  }

  .ant-table-thead > tr > th {
    text-align: center;
    background: rgb(242, 243, 248);
    padding: 16px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant_header {
    text-align: center;
    background: rgb(242, 243, 248);
    padding: 16px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    height: 40px;
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tbody
    > tr
    > td {
    border: 1px solid rgb(242, 243, 248);
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr
    > th {
    border-right: 1px solid rgba(224, 224, 224, 1);
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr:not(:last-child)
    > th {
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
    text-align: center !important;
  }
`;
