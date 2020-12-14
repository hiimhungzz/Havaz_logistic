import { Input, Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect";
let inputTimer = null;

const OperaExport = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
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
        width: 70,
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
        width: 140,
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
        width: 200,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số đơn hàng nhập tuyến</p>
              <Input
                placeholder="Số đơn hàng nhập tuyến"
                // style={{ width: 200 }}
                onChange={(e) => {
                  _changeQuery({
                    name: "nhaptuyen",
                    value: e.target.value,
                  });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_don_nhap_tuyen",
        width: 250,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Số đã phát</p>
              <Input
                placeholder="Số đã phát"
                onChange={(e) => {
                  _changeQuery({ name: "daphat", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_don_phat",
        width: 150,
      },
      {
        title: () => {
          return (
            <div className="header-nav">
              <p className="ant_header">Tồn phát</p>
              <Input
                placeholder="Tồn phát"
                onChange={(e) => {
                  _changeQuery({ name: "tonphat", value: e.target.value });
                }}
              />
            </div>
          );
        },
        dataIndex: "so_ton_phat",
        width: 150,
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
        // scroll={{ x: "calc(700px + 50%)" }}
        />
        {renderContent()}
      </div>
    );
  }
);
OperaExport.propTypes = {
  className: PropTypes.any,
};
export default styled(OperaExport)`
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
  .ant-divider-horizontal {
    display: flex;
    clear: both;
    width: 100%;
    min-width: 100%;
    margin: 0px 0 !important;
  }
  .ant-table-thead > tr > th {
    background: rgb(242, 243, 248);
    padding: 16px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    // border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > tbody
    > tr
    > td {
    // border: 1px solid rgb(242, 243, 248);
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr
    > th {
    // border-right: 1px solid rgba(224, 224, 224, 1);
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr:not(:last-child)
    > th {
    // border-bottom: 1px solid rgba(224, 224, 224, 1);
  }
  .ant-table-tbody > tr > td {
    // border-bottom: 1px solid #f0f0f0;
  }
`;
