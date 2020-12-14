import { Button, Col, Drawer, Row, Space, Spin } from "antd";
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
import CollectModal from './CollectModal';
import Filter from "./Filter";
import TableContent from "./TableContent";


const AccountantCollect = ({ className, definitions, create, setCreate }) => {
    const [data, setData] = useState([]);
    const [isShowModal, setShowModal] = useState(false);
    const [loadding, setLoading] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);
    const [SourceOption, SetObjOption] = useState([]);
    const [aggregate, setAggregate] = useState(null)
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

    const [params, setParams] = useState({
        type: undefined,
        status: undefined,
        staff_id: "",
        order_id: undefined,
        day_from: moment().startOf('month'),
        day_to: moment(),
    });

    const getListBill = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/bills",
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
            setAggregate(result.value.aggregate)
        }
        await setLoading(false);
    }, [params, create]);

    const onCheckBill = useCallback(async () => {
        if (itemSelected.length > 0) {
            for (const item of itemSelected) {
                let result = await ServiceBase.requestJson({
                    url: `v1/bills/${item}/check`,
                    data: {
                        note: ' fsd'
                    },
                    method: "POST",
                });
                if (result.value) {

                } else {
                    Ui.showError({ message: `Mã đơn ${item} không kiểm tra được` });
                }
            }
            await getListBill();
            Ui.showSuccess({
                message: "Hoàn tất quá trình kiểm tra",
            });
        } else {
            Ui.showWarning({ message: "Vui lòng chọn 1 đơn hàng" })
        }

    }, [itemSelected]);


    useEffect(() => {
        if (params.staff_id !== "") {
            getListBill()
        }
    }, [getListBill]);

    useEffect(() => {
        getListStaff()
    }, [])
    return (
        <>
            <Row gutter={16} style={{ padding: 8 }}>
                <Col span={24} >
                    <Space style={{ float: "right" }}>
                        <Button type="primary" onClick={onCheckBill}>Kiểm tra</Button>
                        {
                            params.staff_id !== '' ? (
                                <Button type="primary" onClick={() => {
                                    if (params.staff_id !== '' && itemSelected.length > 0) {
                                        setShowModal(true)
                                    }
                                    else {
                                        Ui.showWarning({ message: "Vui lòng chọn nhân viên và đơn hàng" })
                                    }
                                }}>Thu tiền</Button>
                            ) : null
                        }
                    </Space>
                </Col>
            </Row>
            <Col xs={24}>
                <Filter setParams={setParams} params={params} SourceOption={SourceOption} definitions={definitions} setItemSelected={setItemSelected} />
            </Col>
            <div className="container" style={{ padding: 8 }}>
                <div className="content">
                    {
                        params.staff_id === '' ? (
                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, paddingTop: 30, paddingBottom: 30 }}>Vui lòng chọn nhân viên</div>
                        ) : (
                                <>
                                    <Spin spinning={loadding}>
                                        <TableContent
                                            aggregate={aggregate}
                                            setParams={setParams}
                                            data={data}
                                            params={params}
                                            itemSelected={itemSelected}
                                            definitions={definitions}
                                            setItemSelected={setItemSelected}
                                        />
                                    </Spin>
                                </>
                            )
                    }
                </div>
            </div>
            <Drawer
                width={"80%"}
                title="Bảng kê thu tiền"
                placement="right"
                closable={true}
                onClose={() => {
                    setShowModal(false)
                }}
                visible={isShowModal}
            >
                <CollectModal
                    create={create}
                    setCreate={setCreate}
                    onRefreshList={getListBill}
                    params={params} data={data} definitions={definitions}
                    itemSelected={itemSelected} SourceOption={SourceOption} setItemSelected={setItemSelected} setShowModal={setShowModal} />
            </Drawer>
        </>
    );
};
AccountantCollect.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(AccountantCollect))`

`;
