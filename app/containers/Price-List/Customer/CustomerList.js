import "antd/dist/antd.css";
import { EditTwoTone, LeftOutlined } from "@ant-design/icons";
import { Row, Table, Button, Pagination, Space } from "antd";
import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
const CustomerList = memo(({ className, data, params, total, setParams, onEdit, definitions }) => {
  let { cities } = definitions.toJS()
  let city = _.map(cities, (value, k) => {
    return value
  })
  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "code",
      width: 150,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: "customer_group",
      width: 150,
      render: (value, row, id) => value && value.code
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Tỉnh",
      dataIndex: "city",
      width: 150,
      render: (value, row, id) => value && value.name
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 200,
    },
    {
      title: "Nhân viên KD",
      dataIndex: "name_test",
      width: 150,
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
        scroll={{ x: "calc(700px + 50%)" }}
      />

      {renderContent()}
    </div>
  );
});
CustomerList.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(CustomerList))`
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
