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
import List from "./List";
const TrungChuyen = ({ className, definitions }) => {

    const [data, setData] = useState([]);
    const [dataFilter, setDataFilter] = useState([])
    const [loadding, setLoading] = useState(false);
    const [params, setParams] = useState({
        day_from: moment(),
        day_to: moment(),
        id: ""
    });

    const getList = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: `v1/transshipments?scope=import&filterBy[create_date]=${moment(params.day_from).format("YYYY-MM-DD")},${moment(params.day_to).format("YYYY-MM-DD")}:btw`,
            data: {},
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setData(result.value.data);
            setDataFilter(result.value.data);
        }
        await setLoading(false);
    }, [params]);


    const onRefreshList = () => {
        getList();
    }


    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <div className={className}>
            <Col xs={24}>
                <Filter setParams={setParams} params={params} dataFilter={dataFilter} setData={setData} />
            </Col>
            <Col xs={24}>
                <div className="container" >
                    <div className="page-content">
                        <div className="title">Danh sách bảng kê xuất hàng trung chuyển tới văn phòng </div>
                    </div>
                    <div className="content">
                        <Spin spinning={loadding}>
                            <List
                                setParams={setParams}
                                data={data}
                                params={params}
                                definitions={definitions}
                                onRefreshList={onRefreshList}
                            />
                        </Spin>
                    </div>
                </div>
            </Col>
        </div>
    );
};
TrungChuyen.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(TrungChuyen))`
.title {
    padding: 8px;
    font-weight: bold;
    font-size: 18px;
}
`;
