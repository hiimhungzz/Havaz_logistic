import { Row, Table, Pagination } from "antd";
import "antd/dist/antd.css";
import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ItemCheckBox from "./ItemCheckBox";
import {
  makeSelectDefinitions,
} from "containers/App/selectors";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

const VehicleList = memo(({ className, data, params, total, setParams, definitions }) => {
  console.log("definitions", definitions.getIn(["car_type"]).toJS());
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: 100,
      render: (value, row, index) => {
        // const stringIndex = `${params.page - 1}${index}`;
        const stringIndex = `${((params.page - 1) * params.per_page + index)}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
        );
      },
    },
    {
      title: "Biển kiểm soát",
      dataIndex: "bks",
      width: 400,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 400,
    },
    {
      title: "Phân loại xe",
      dataIndex: "xe_trung_tam",
      width: 400,
      render: (value) => definitions.getIn(["car_type"]).toJS()[value].text
    },
    {
      title: "Active",
      dataIndex: "active",
      width: 100,
      render: (value, row) => {
        return (
          <div>
            <ItemCheckBox nameColumn={"active"} value={value} row={row} />
          </div>
        );
      },
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
      />

      {renderContent()}
    </div>
  );
});
VehicleList.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(VehicleList))`
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
