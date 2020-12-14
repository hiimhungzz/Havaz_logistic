import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Divider, Spin } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import StaffList from "./StaffList";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const ManagementStafff = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    name: "",
    type: 0, //Van phong trung chuyen 1, van phong ket noi 2, avtive :3, chua chon type 0
    phone: "",
    office_id: 0,
    code: "",
    active: 2,
  });

  const getListStaff = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/nhan-vien/list",
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.pagination.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  const onRefreshList = useCallback(() => {
    getListStaff();
  });

  useEffect(() => {
    getListStaff();
  }, [getListStaff]);
  return (
    <>
      <Col xs={24}>
        <Filter setParams={setParams} />
      </Col>
      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <StaffList
              setParams={setParams}
              data={data}
              params={params}
              total={total}
              onRefreshList={onRefreshList}
            />
          </Spin>
        </div>
      </div>
    </>
  );
};
ManagementStafff.propTypes = {
  className: PropTypes.any,
};
export default styled(ManagementStafff)`  
.export-content {
  padding: 1rem 1rem;
  display: grid;
  grid-template-columns: calc(50% - 25px) 50px calc(50% - 25px);
  .middle {
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-btn {
      width: 100%;
      display: flex;
      background-color: red
      align-items: center;
      justify-content: flex-end;

    }
  }
  .btn {
    background-color: #fd397a;
    border-color: #fd397a;
    color: #fff;
  }

}`;
