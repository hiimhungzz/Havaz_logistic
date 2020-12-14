import { Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";

const DebtVehicleList = memo(({ className, data, params, total, setParams, definitions }) => {
  const columns = [
    {
      title: "Ngày nhận hàng",
      width: 130,
      dataIndex: "code",
      fixed: "left",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Ngày xe chạy",
      width: 130,
      dataIndex: "code",
      fixed: "left",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Số phiếu gửi",
      width: 130,
      dataIndex: "code",
      fixed: "left",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Tổng cước phí",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "VP nhận hàng",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "VP nhận thu",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "VP trả hàng",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "VP trả hàng treo",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Đã thu theo xe",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "TT cuối tháng",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Số tiền thu hộ",
      width: 130,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Dư cuối",
      width: 130,
      dataIndex: "code",
      fixed: "right",
      render: (text, record) => (<></>
      )
    }
  ];


  // const renderContent = () => {
  //   return (
  //     <Row justify="end" style={{ marginBottom: 5, marginTop: 5 }}>
  //       <Pagination
  //         onShowSizeChange={(current, size) => {
  //           setParams((prevState) => {
  //             let nextState = { ...prevState };
  //             nextState.page = 1;
  //             nextState.per_page = size;
  //             return nextState;
  //           });
  //         }}
  //         onChange={(page, pageSize) => {
  //           setParams((prevState) => {
  //             let nextState = { ...prevState };
  //             nextState.page = page;
  //             return nextState;
  //           });
  //         }}
  //         total={total}
  //         current={params.page}
  //         pageSize={params.per_page}
  //       // showSizeChanger
  //       />
  //     </Row>
  //   );
  // };
  return (
    <div className={className}>
      {/* {renderContent()} */}

      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
      {/* {renderContent()} */}
    </div>
  );
});
DebtVehicleList.propTypes = {
  className: PropTypes.any,
};
export default styled(DebtVehicleList)`
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
