import PropTypes from "prop-types";
import React, { memo, useState, useEffect, useCallback } from "react";
import { Button, Col, Row, Spin } from "antd";
import styled from "styled-components";
import Filter from "./Filter";
import DriverList from "./DriverList";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";


const ManagementDriver = ({ className, definitions }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    per_page: 10, // so ban ghi tren 1 trang,
    phone: "",
    name: "",
    // office_id: 0,
    code: "",
    active: 2,
  });

  const getListDriver = useCallback(async () => {
    setLoading(true);
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "v1/nhan-vien/list-driver-tc",
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

  useEffect(() => {
    getListDriver();
  }, [getListDriver]);

  return (
    <>
      <Col xs={24}>
        <Filter setParams={setParams} />
      </Col>
      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <DriverList
              definitions={definitions}
              setParams={setParams}
              data={data}
              params={params}
              total={total}
            />
          </Spin>
        </div>
      </div>
    </>
  );
};
ManagementDriver.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(ManagementDriver))`
  
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
