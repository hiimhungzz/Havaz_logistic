import { DatePicker, Input, Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
const { RangePicker } = DatePicker;
let inputTimer = null;
const monthFormat = "YYYY/MM";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
const ImportList = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
    const [itemSelected, setItemSelected] = useState(null);
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
          const stringIndex = `${params.page - 1}${index}`;
          return (
            <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
          );
        },
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Mã VP</p>
              <Input
                placeholder="Mã vp"
                onChange={(e) => {
                  _changeQuery({ name: "mavp", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "code",
        width: 120,
        fixed: "left",
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Tên văn phòng</p>
              <OfficeStaffSelect
                allowClear
                loadOnMount
                onChange={(data) => {
                  _changeQuery({
                    name: "vp",
                    value: data ? data.value : 0,
                  });
                }}
              />
            </div>
          );
        },
        dataIndex: "name",
        fixed: "left",
        width: 150,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số đơn hàng nhận</p>
              <Input
                placeholder="Số đơn hàng nhận"
                onChange={(e) => {
                  _changeQuery({ name: "hangnhan", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_don_nhan",
        width: 180,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số đơn hàng nhập TC</p>
              <Input
                placeholder="Số đơn hàng nhập tc"
                onChange={(e) => {
                  _changeQuery({
                    name: "nhaptc",
                    value: e.target.value,
                  });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_don_nhap_tc",
        width: 200,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số đã xuất</p>
              <Input
                placeholder="Số đã xuất"
                onChange={(e) => {
                  _changeQuery({ name: "hangxuat", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_don_xuat",
        width: 150,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Tồn xuất</p>
              <Input
                placeholder="Tồn xuất"
                onChange={(e) => {
                  _changeQuery({ name: "tonxuat", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_ton_xuat",
        width: 120,
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
            // pageSize={params.per_page}
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
          scroll={{ x: "calc(700px + 50%)" }}
        />

        {renderContent()}
      </div>
    );
  }
);
ImportList.propTypes = {
  className: PropTypes.any,
};
export default styled(ImportList)`
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
  .ant-table-thead > tr > th {
    background: rgb(242, 243, 248);
    padding: 16px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant_header {
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
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
`;
