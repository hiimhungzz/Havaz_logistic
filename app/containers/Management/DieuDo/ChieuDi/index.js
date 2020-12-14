import { Col, DatePicker, Row, Spin, Input } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import Filter from "./Filter";
import ListModeration from "../ListModeration";
const ManagementModeration = ({ className }) => {
    const [data, setData] = useState([]);
    const [loadding, setLoading] = useState(false);
    const [params, setParams] = useState({
        day: moment(),
        trip_id: null,
    });
    const getDataChieuDi = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: `v1/common/trips?trip_id=${params.trip_id}&scope=one_row`,
            data: {
                day: moment(params.day).format("YYYY-MM-DD"),
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            const data = result.value.data.filter((x) => x.direction === 1);
            setData(data);
        }
        await setLoading(false);
    }, [params]);

    const onRefreshList = () => {
        getDataChieuDi();
    }
    useEffect(() => {
        getDataChieuDi();
    }, [getDataChieuDi]);

    return (
        <>
            <Col xs={24}>
                <Filter params={params} setParams={setParams} />
            </Col>
            <div className="container" style={{ padding: 8 }}>
                <div className="content">
                    <Spin spinning={loadding}>
                        <ListModeration
                            setParams={setParams}
                            data={data}
                            params={params}
                            onRefreshList={onRefreshList}
                        />
                    </Spin>
                </div>
            </div>
        </>
    );
};
ManagementModeration.propTypes = {
    className: PropTypes.any,
};
export default styled(ManagementModeration)`
`;
