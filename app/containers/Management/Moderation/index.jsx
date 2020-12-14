import { Col, DatePicker, Row, Spin, Input } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import ListModeration from "./ListModeration";
const ManagementModeration = ({ className }) => {
    const [activeTab, setTabActive] = useState(0);
    const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
    const [dataIn, setDataIn] = useState([]);
    const [dataOut, setDataOut] = useState([]);

    const [loadding, setLoading] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        per_page: 1000000, // so ban ghi tren 1 trang,
        day: moment(),
    });
    const [paramsChieuVe, setParamsChieuVe] = useState({
        page: 1,
        per_page: 1000000, // so ban ghi tren 1 trang,
        day: moment(),
    });

    const getDataChieuDi = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/common/trips",
            data: {
                ...params,
                day: moment(params.day).format("YYYY-MM-DD"),
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            const dataInNew = result.value.data.filter((x) => x.direction === 1);
            setDataIn(dataInNew);
        }
        await setLoading(false);
    }, [params]);

    const getDataChieuVe = useCallback(async () => {
        setLoading(true);
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/common/trips",
            data: {
                ...paramsChieuVe,
                day: moment(paramsChieuVe.day).format("YYYY-MM-DD"),
            },
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            const dataOutNew = result.value.data.filter((x) => x.direction === 2);
            setDataOut(dataOutNew);
        }
        await setLoading(false);
    }, [paramsChieuVe]);

    useEffect(() => {
        getDataChieuVe();
    }, [getDataChieuVe]);

    const onRefreshList = () => {
        getDataChieuDi();
        getDataChieuVe();
    }

    useEffect(() => {
        getDataChieuDi();
    }, [getDataChieuDi]);

    return (
        <>
            <Row className={className} gutter={[16, 16]}>
                <Col span={12}>
                    <div className="d-flex flex-row" style={{ width: 200 }}>
                        {["CHIỀU ĐI", "CHIỀU VỀ"].map((item, idx) => {
                            return (
                                <div
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        padding: "10px 0",
                                        margin: 2,
                                        cursor: "pointer",
                                        borderLeft: idx === 0 ? "0px " : "1px solid #E8E8E8",
                                        color: "#333333",
                                        fontWeight: activeTab === idx ? 600 : 200,
                                        backgroundColor: activeTab === idx ? "#FFC20E" : "#E8E8E8",
                                    }}
                                    key={idx}
                                    onClick={() => setTabActive(idx)}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </Col>
                <Col xs={12}>
                    {activeTab === 0 ? (
                        <>
                            <DatePicker
                                onChange={(date) => {
                                    setParams((prevState) => {
                                        let nextState = { ...prevState };
                                        nextState.day = date;
                                        return nextState;
                                    });
                                }}
                                style={{ float: "right", height: 42 }}
                                value={params.day}
                                format={dateFormatList}
                            />
                        </>
                    ) : (
                            <DatePicker
                                onChange={(date) => {
                                    setParamsChieuVe((prevState) => {
                                        let nextState = { ...prevState };
                                        nextState.day = date;
                                        return nextState;
                                    });
                                }}
                                style={{ float: "right", height: 42 }}
                                value={paramsChieuVe.day}
                                format={dateFormatList}
                            />
                        )}
                </Col>
            </Row>
            <div className="container">
                <div className="content">
                    <Spin spinning={loadding}>
                        {activeTab === 0 ? (
                            <ListModeration
                                setParams={setParams}
                                data={dataIn}
                                params={params}
                                onRefreshList={onRefreshList}
                            />
                        ) : (
                                <ListModeration
                                    setParamsChieuVe={setParamsChieuVe}
                                    data={dataOut}
                                    paramsChieuVe={paramsChieuVe}
                                    onRefreshList={onRefreshList}
                                />
                            )}
                    </Spin>
                </div>
            </div>
            <Row />
        </>
    );
};
ManagementModeration.propTypes = {
    className: PropTypes.any,
};
export default styled(ManagementModeration)`
  
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
