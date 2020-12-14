import { Col, Row, Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Filter from "./Filter";
import OfficeList from "./OfficeList";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const ManagementOffice = ({ className }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    name: "",
    type: 0, //Van phong trung chuyen 1, van phong ket noi 2, avtive :3, chua chon type 0
    active: 2,
  });

  const getListOffice = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/van-phong/list",
      data: params,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setTotal(result.value.meta.total);
      setData(result.value.data);
    }
    await setLoading(false);
  }, [params]);

  useEffect(() => {
    getListOffice();
  }, [getListOffice]);

  const onRefreshList = () => {
    getListOffice();
  }
  return (
    <>
      <Col xs={24}>
        <Filter setParams={setParams} />
      </Col>
      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <OfficeList
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
ManagementOffice.propTypes = {
  className: PropTypes.any,
};
export default styled(ManagementOffice)`
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

  }
`;
