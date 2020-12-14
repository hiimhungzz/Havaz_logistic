import { Col, Spin } from "antd";
import { makeSelectDefinitions } from "containers/App/selectors";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import Filter from "./Filter";
import DebtVehicleList from "./DebtVehicleList";


const DebtVehicle = ({ className, definitions }) => {
  const [data, setData] = useState([]);
  const [loadding, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({

  });

  // const DebtVehicleList = useCallback(async () => {
  //   setLoading(true);
  //   const result = await ServiceBase.requestJson({
  //     method: "GET",
  //     url: "",
  //     data: params,
  //   });
  //   if (result.hasErrors) {
  //     Ui.showErrors(result.errors);
  //   } else {
  //     setData(result.value.data);
  //   }
  //   await setLoading(false);
  // }, [params]);

  // useEffect(() => {
  //   DebtVehicleList();
  // }, [DebtVehicleList]);

  return (
    <>
      <Col xs={24}>
        <Filter setParams={setParams} />
      </Col>
      <div className="container">
        <div className="content">
          <Spin spinning={loadding}>
            <DebtVehicleList
              definitions={definitions}
              setParams={setParams}
              // data={data}
              params={params}
            />
          </Spin>
        </div>
      </div>
    </>
  );
};
DebtVehicle.propTypes = {
  className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(DebtVehicle))`
  
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
