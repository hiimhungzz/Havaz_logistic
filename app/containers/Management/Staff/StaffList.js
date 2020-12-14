import { EditTwoTone, LeftOutlined } from "@ant-design/icons";
import { Button, Pagination, Row, Table, Space } from "antd";
import "antd/dist/antd.css";
import { DrawerBase } from "components";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import ItemStaff from "./ItemStaff";
import Modal from "./Modal";

const StaffList = memo(
  ({ className, data, params, total, setParams, onRefreshList }) => {
    const [isShowModal, setShowModal] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);

    const onHiddenModal = useCallback(() => {
      setItemSelected(null);
      setShowModal(false);
    });

    const title = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
          <LeftOutlined
            title="Quay lại"
            onClick={onHiddenModal}
            style={{ fontWeight: "bold", fontSize: "1.5rem", marginRight: 5 }}
          />
          Chỉnh sửa thông tin nhân viên
        </h3>
      </div>
    );

    const columns = [
      {
        title: "STT",
        dataIndex: "id",
        render: (value, row, index) => {
          // const stringIndex = `${params.page - 1}${index}`;
          const stringIndex = `${((params.page - 1) * params.per_page + index)}`;
          return (
            <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>
          );
        },
        fixed: "left",
        width: 80,
      },
      {
        title: "Tên nhân viên",
        dataIndex: "name",
        width: 200,
      },
      {
        title: "Mã NV",
        dataIndex: "code",
        width: 150,
      },
      {
        title: "SĐT",
        dataIndex: "phone",
        width: 200,
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "adm_loginname",
        width: 200,
      },
      {
        title: "Văn phòng trực thuộc",
        dataIndex: "adm_diem_ket_noi",
        width: 200,
      },
      {
        title: "Văn phòng kiêm nghiệm",
        dataIndex: "adm_list_depot",
        render: (value) => {
          return (
            value && value.map((item, index) => <span> {index !== 0 ? '-' : ''}&nbsp;{item.label} </span>)
          );
        },
        width: 300,
      },
      {
        title: "EDIT",
        dataIndex: "edit",
        render: (value, row) => {
          return (
            <div style={{ textAlign: "center" }}>
              {/* className="fa fa-edit pr-2" */}
              <Button
                type="link"
                onClick={() => {
                  setItemSelected(row);
                  setShowModal(true);
                }}
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
            <div style={{ textAlign: "center" }}>
              <ItemStaff nameColumn={"active"} value={value} row={row} />
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
          />
        </Row>
      );
    };
    return (
      <div className={className}>
        {renderContent()}

        <Table
          bordered
          selections={false}
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          scroll={{ x: "100%" }}
        />

        {renderContent()}
        <DrawerBase
          destroyOnClose
          onClose={onHiddenModal}
          closable={false}
          placement="right"
          visible={isShowModal}
          title={title}
          width="50%"
        >
          <Modal
            onRefreshList={onRefreshList}
            onHiddenModal={onHiddenModal}
            itemSelected={itemSelected}
          />
        </DrawerBase>
      </div>
    );
  }
);
StaffList.propTypes = {
  className: PropTypes.any,
};
export default styled(StaffList)`
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
