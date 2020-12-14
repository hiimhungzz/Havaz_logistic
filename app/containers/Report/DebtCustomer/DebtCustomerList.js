import { Pagination, Row, Table, Button, Drawer } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import { EyeOutlined, } from '@ant-design/icons'
import TableContent from "./TableContent";
const DebtCustomerList = memo(({ className, data, params, total, setParams, definitions }) => {
  const [visible, setVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const columns = [
    {
      title: "Khách hàng",
      width: 130,
      dataIndex: "code",
      fixed: "left",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Điểm kết nối nhận",
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
      title: "Tổng cước đã thu",
      width: 200,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
    },
    {
      title: "Tổng tiền cước phí chưa thu",
      width: 200,
      dataIndex: "code",
      render: (text, record) => (<></>
      )
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

      <Drawer
        title="Thông tin chi tiết"
        width="90%"
        height="100%"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        bodyStyle={{ height: "100%" }}
        footer={null}
      >
        <TableContent
          params={params}
          itemSelected={itemSelected}
        />
      </Drawer>
      {/* {renderContent()} */}
    </div>
  );
});
DebtCustomerList.propTypes = {
  className: PropTypes.any,
};
export default styled(DebtCustomerList)`
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
