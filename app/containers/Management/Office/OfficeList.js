import { Pagination, Row, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React, { memo, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import ItemCheckBox from "./ItemCheckBox";
import ItemRegionSelect from "./ItemRegionSelect";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
let inputTimer = null;
const OfficeList = memo(({ className, data, params, total, setParams, }) => {
  const [dataRegion, setDataRegion] = useState([]);
  const getRegion = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/common/area",
      data: {
        per_page: 100,
        active: 1
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setDataRegion(result.value.data);
    }
  }, []);

  useEffect(() => {
    getRegion();
  }, [getRegion]);




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
      render: (value, row, index) => {
        const stringIndex = `${((params.page - 1) * params.per_page + index)}`;
        return (
          <h5>{params.page === 1 ? index + 1 : parseInt(stringIndex) + 1}</h5>

        );
      },
      width: 60,
      fixed: "left",
    },
    {
      title: "Tên VP",
      dataIndex: "name",
      width: 180,
      fixed: "left",
    },
    {
      title: "Mã VP",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 400,
    },
    {
      title: "Vùng",
      dataIndex: "area",
      width: 150,
      render: (value, row, id) => (
        <ItemRegionSelect nameColumn={"area"} value={value} row={row} data={dataRegion} />
      )
    },
    {
      title: "Tỉnh",
      dataIndex: "city",
      width: 120,
      render: (value, row, id) => value && value.name
    },
    {
      title: "VP Trung chuyển",
      dataIndex: "nhan_tra_hang",
      render: (value, row) => {
        return (
          <div
            style={{ textAlign: "center" }}
          >
            <ItemCheckBox
              nameColumn={"nhan_tra_hang"}
              value={value}
              row={row}
            />
          </div>
        );
      },
      fixed: "right",
      width: 160,
    },
    {
      title: "VP Kết nối",
      dataIndex: "ket_noi_xe_tuyen",
      fixed: "right",
      width: 100,
      render: (value, row) => {
        return (
          <div>
            <ItemCheckBox
              nameColumn={"ket_noi_xe_tuyen"}
              value={value}
              row={row}
            />
          </div>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "hang_hoa",
      render: (value, row) => {
        return (
          <div>
            {" "}
            <ItemCheckBox nameColumn={"hang_hoa"} value={value} row={row} />
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
        scroll={{ x: "calc(100%)" }}
        pagination={false}
      />
      {renderContent()}
    </div>
  );
});
OfficeList.propTypes = {
  className: PropTypes.any,
};
export default styled(OfficeList)`
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
  .ant-table-thead > tr > th {
    background: rgb(242, 243, 248);
    padding: 16px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1.43;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    letter-spacing: 0.01071em;
  }
  .ant-pagination-options-size-changer.ant-select {
    margin-right: 0px !important ;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
`;
