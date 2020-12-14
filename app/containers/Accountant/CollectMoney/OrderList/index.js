import { Col, Spin } from "antd";
import { makeSelectDefinitions } from "containers/App/selectors";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { URI } from "utils/constants";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import Filter from "./Filter";
import TableContent from "./TableContent";
const OrderList = ({ className, definitions, create, setCreate }) => {
    const [data, setData] = useState([]);
    const [SourceOption, SetObjOption] = useState([]);
    const [itemSelected, setItemSelected] = useState([]);
    const [loadding, setLoading] = useState(false);
    const [params, setParams] = useState({
        staff_id: "",
        creator_id: "",
        day_from: moment().add(-1, 'weeks').endOf('week'),
        day_to: moment(),
    });

    const getListStaff = useCallback(async (data) => {
        const result = await ServiceBase.requestJson({
            method: 'GET',
            url: URI['URI_STAFF_LIST'],
            data: {
                page: 1,
                per_page: 10000,
                active: 1,
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetObjOption(result.value.data)
        }
    })


    const getListOrder = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/bill-exportings",
            data: {
                ...params,
                day_from: moment(params.day_from).format("YYYY-MM-DD"),
                day_to: moment(params.day_to).format("YYYY-MM-DD")
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setData(result.value.data);
        }
        await setLoading(false);
    }, [params, create]);

    useEffect(() => {
        getListOrder();
    }, [getListOrder]);

    useEffect(() => {
        getListStaff()
    }, [])
    return (
        <>
            <Col xs={24}>
                <Filter setParams={setParams} params={params} SourceOption={SourceOption} definitions={definitions} setItemSelected={setItemSelected} />
            </Col>
            <div className="container" style={{ padding: 8 }}>
                <div className="content">
                    <Spin spinning={loadding}>
                        <TableContent
                            setParams={setParams}
                            data={data}
                            params={params}
                            definitions={definitions}
                        />
                    </Spin>
                </div>
            </div>
        </>
    );
};
OrderList.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(OrderList))`
  
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
