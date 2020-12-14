import { Button, Col, Drawer, Row, Space, Spin } from "antd";
import { makeSelectDefinitions } from "containers/App/selectors";
import downloadFile from "components/Utility/downloadFile";
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

const congNoTheoXe = ({ className, definitions }) => {
    const [data, setData] = useState([]);
    const [isShowModal, setShowModal] = useState(false);
    const [loadding, setLoading] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);
    const [SourceOption, SetObjOption] = useState([]);
    const getListStaff = useCallback(async (data) => {
        const result = await ServiceBase.requestJson({
            method: 'GET',
            url: URI['URI_STAFF_LIST'],
            data: {
                page: 1,
                per_page: 40,
                active: 1,
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            SetObjOption(result.value.data)
        }
    })

    const [params, setParams] = useState({
        per_page: 10,
        page: 1,
        from_date: moment().add(-1, 'weeks').endOf('week'),
        to_date: moment(),
        delivered_hub_id: undefined,
    });
    const formatParams = (params) => {
        return {
            per_page: params?.per_page,
            page: params?.page,
            from_date: params.from_date ? moment(params.from_date).format("YYYY-MM-DD") : undefined,
            to_date: params.from_date ? moment(params.to_date).format("YYYY-MM-DD") : undefined,
            delivered_hub_id: params?.delivered_hub_id
        }
    }
    const formatExportParams = (params) => {
        return {
            per_page: params?.per_page,
            page: params?.page,
            download:1,
            from_date: params.from_date ? moment(params.from_date).format("YYYY-MM-DD") : undefined,
            to_date: params.from_date ? moment(params.to_date).format("YYYY-MM-DD") : undefined ,
            delivered_hub_id: params?.delivered_hub_id
        }
    }
    const getListBill = useCallback(async () => {
        setLoading(true);
        let temp = formatParams(params)
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: URI["URI_REPORT_GET_DELIVERED_ORDER"],
            data: {
                ...temp
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setData(result.value);
        }
        await setLoading(false);
    }, [params]);

    const exportFile = useCallback(async () => {
        let temp = formatExportParams(params)
        const result = await ServiceBase.requestJson({
            method: "EXPORT",
            url: URI["URI_REPORT_GET_DELIVERED_ORDER"],
            data: {
                ...temp
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            const url = window.URL.createObjectURL(new Blob([result.value]));
            downloadFile(url, `Danh sách hàng phát.xlsx`)
        }
    }, [params]);
    

    useEffect(() => {
        getListBill();
    }, [getListBill]);

    return (
        <>
            <Col xs={24}>
                <Filter setParams={setParams} params={params} exportData={exportFile}/>
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
congNoTheoXe.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(congNoTheoXe))`

`;
