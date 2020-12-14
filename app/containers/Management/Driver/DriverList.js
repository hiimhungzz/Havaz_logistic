import { Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styled from "styled-components";
import ItemCheckBox from "./ItemCheckBox";

const ModerationList = memo(({ className, data, params, total, setParams, definitions }) => {
  console.log("definitions", definitions.toJS().group_role);
  const group_role = definitions && definitions.toJS() && definitions.toJS().group_role
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: 100,
      render: (value, row, index) => {
        const stringIndex = `${params.page - 1}${index}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
        );
      },
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "adm_loginname",
      width: 150,
    },
    {
      title: "Mã NV",
      dataIndex: "code",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Văn phòng làm việc",
      dataIndex: "adm_diem_ket_noi",
    },
    {
      title: "Phân loại",
      dataIndex: "group_id",
      render: (group_id) => {
        return group_id && group_id.map((item) => (
          group_role && Object.keys(group_role).map((item_role) => (
            <div>{item_role === item ? (group_role[item_role] && group_role[item_role].text) : ''}</div>
          ))
        ))
      }
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
        // showSizeChanger
        />
      </Row>
    );
  };
  return (
    <div className={className}>
      {renderContent()}

      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
      {renderContent()}
    </div>
  );
});
ModerationList.propTypes = {
  className: PropTypes.any,
};
export default styled(ModerationList)`
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
