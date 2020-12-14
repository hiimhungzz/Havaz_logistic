import { EditTwoTone } from "@ant-design/icons";
import { Button, Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";
import _ from "lodash";
import ItemService from "./ItemService";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
const ServiceList = memo(({ className, data, params, total, setParams, onEdit, definitions }) => {
  let { units } = definitions.toJS()
  let unit = _.map(units, (value, k) => {
    return value
  })
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      fixed: "left",
      width: 80,
      render: (value, row, index) => {
        const stringIndex = `${params.page - 1}${index}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
        );
      },
    },
    {
      title: "Mã loại hàng",
      dataIndex: "code",
      width: 200,
    },
    {
      title: "Tên loại hàng",
      dataIndex: "name",
      width: 400,
    },
    {
      title: "Loại giá trị",
      dataIndex: "unit_id",
      width: 200,
      render: (text) => (
        <div>{definitions.getIn(["units", `${text}`, "text"])}</div>
      ),
    },
    {
      title: "EDIT",
      dataIndex: "edit",
      render: (value, row, id) => {
        const ids = row.id
        return (
          <div >
            <Button
              type="link"
              onClick={() => onEdit(ids)}
            >
              <EditTwoTone />
            </Button>
          </div>
        );
      },
      width: 80,
      fixed: "right",
    },
    {
      title: "ACTIVE",
      dataIndex: "active",
      render: (value, row) => {
        return (
          <div>
            <ItemService nameColumn={"active"} value={value} row={row} />
          </div>
        );
      },
      width: 100,
      fixed: "right",
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
ServiceList.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(ServiceList))`
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
