import { Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";
import { formatNumber } from "utils/helper";
const BillCodList = memo(({ className, data, params, total, setParams, onEdit, onRefreshList, setShowModal }) => {
  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "id",
    //   fixed: "left",
    //   width: 80,
    //   render: (value, row, index) => {
    //     const stringIndex = `${params.page - 1}${index}`;
    //     return (
    //       <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
    //     );
    //   },
    // },
    {
      title: "Từ giá trị",
      dataIndex: "min",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // render: (value) => <div style={{ textAlign: 'right' }}> {formatNumber(value)} </div>

    },
    {
      title: "Đến giá trị",
      dataIndex: "max",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 300,
      render: (value, row, id) => (
        <div>{value === 0 ? "Tiền mặt" : "%"}</div>
      )
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      title: "Giá tính đầu",
      dataIndex: "value_first",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      title: "Mức tăng",
      dataIndex: "increase",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      title: "Cước tăng",
      dataIndex: "price_increase",
      width: 300,
      render: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // {
    //   title: "EDIT",
    //   dataIndex: "edit",
    //   render: (value, row, id) => {
    //     const ids = row.id
    //     return (
    //       <div >
    //         <Button
    //           type="link"
    //           onClick={() => onEdit(ids)}
    //         >
    //           <EditTwoTone />
    //         </Button>
    //       </div>
    //     );
    //   },
    // }

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
      />

      {renderContent()}

    </div>
  );
});
BillCodList.propTypes = {
  className: PropTypes.any,
};
export default styled(BillCodList)`
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
