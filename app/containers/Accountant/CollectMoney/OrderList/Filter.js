import { Col, DatePicker, Row } from "antd";
import { DefineSelect } from "components";
import { makeSelectDefinitions } from "containers/App/selectors";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
let inputTimer = null;
const { RangePicker } = DatePicker;
var fnTimeOut;
const Filter = ({ className, setParams, definitions, params, SourceOption, setItemSelected }) => {
    const _changeQuery = useCallback(
        (payload) => {
            if (inputTimer) {
                clearTimeout(inputTimer);
            }
            inputTimer = setTimeout(() => {
                setParams((prevState) => {
                    let nextState = { ...prevState };
                    nextState[payload.name] = payload.value;
                    return nextState;
                });
            }, 500);
        },
        [setParams]
    )
    return (

        < div className={className} >
            <Row gutter={[8, 16]}>
                <Col xs={6}>
                    <RangePicker
                        value={[moment(params.day_from), moment(params.day_to)]}
                        onChange={(dates) => {
                            let startDate = dates && dates.length > 0 ? moment(dates[0].startOf("day")) : undefined;
                            let endDate = dates && dates.length > 0 ? moment(dates[1].endOf("day")) : undefined;
                            setParams((prevState) => {
                                let nextState = { ...prevState };
                                nextState.day_from = startDate;
                                nextState.day_to = endDate;
                                return nextState;
                            });
                        }}
                        style={{ width: "100%" }}
                        format={"DD-MM-YYYY"}
                        ranges={{
                            "Hôm nay": [moment(), moment()],
                            "Tuần hiện tại": [
                                moment().startOf("week"),
                                moment().endOf("week"),
                            ],
                            "Tháng hiện tại": [
                                moment().startOf("month"),
                                moment().endOf("month"),
                            ],
                            "Tuần trước": [
                                moment()
                                    .add(-1, "weeks")
                                    .startOf("week"),
                                moment()
                                    .add(-1, "weeks")
                                    .endOf("week"),
                            ],
                            "Tháng trước": [
                                moment()
                                    .add(-1, "months")
                                    .startOf("month"),
                                moment()
                                    .add(-1, "months")
                                    .endOf("month"),
                            ],
                            "Tuần sau": [
                                moment()
                                    .add(1, "weeks")
                                    .startOf("week"),
                                moment()
                                    .add(1, "weeks")
                                    .endOf("week"),
                            ],
                            "Tháng sau": [
                                moment()
                                    .add(1, "months")
                                    .startOf("month"),
                                moment()
                                    .add(1, "months")
                                    .endOf("month"),
                            ],
                        }}
                    />
                </Col>
                <Col xs={5}>
                    <DefineSelect
                        allowClear
                        placeholder="Chọn người thao tác"
                        change={(id) => {
                            setItemSelected([])
                            setParams((prevState) => {
                                let nextState = { ...prevState };
                                nextState.creator_id = id;
                                return nextState;
                            });
                        }
                        }
                        dataBin={SourceOption}
                        value={params.creator_id}
                    />
                </Col>
                <Col xs={5}>
                    <DefineSelect
                        allowClear
                        placeholder="Chọn người nộp"
                        change={(id) => {
                            setItemSelected([])
                            setParams((prevState) => {
                                let nextState = { ...prevState };
                                nextState.staff_id = id;
                                return nextState;
                            });
                        }
                        }
                        dataBin={SourceOption}
                        value={params.staff_id}
                    />
                </Col>
            </Row>
        </div >
    );
};
Filter.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(Filter))`
    padding-top:10px;
`;
