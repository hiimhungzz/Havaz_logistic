import { Col, DatePicker, Input, Row } from "antd";
import { makeSelectDefinitions } from "containers/App/selectors";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
let inputTimer = null;
const { RangePicker } = DatePicker;
var fnTimeOut;
const FilterModal = ({ className, setParams, setData, dataServer }) => {
    const [valueScanner, setScanner] = useState("");
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
                <Col xs={12}></Col>
                <Col xs={8}>
                    <Input
                        onChange={(e) => {
                            let value = e.target.value;
                            if (value === '') {
                                setData(dataServer)
                            } else {
                                const dataNew = dataServer.filter((x) => x.id.slice(x.id.length - 4) === value)
                                setData(dataNew)
                            }
                        }}
                        allowClear style={{ marginRight: 10 }}
                        placeholder="Tìm mã đơn hàng (search 4 số cuối)"
                    />
                </Col>
                <Col xs={4}>
                    <Input
                        allowClear
                        value={valueScanner}
                        placeholder="Bắn mã vạch ||||||"
                        onChange={async (e) => {
                            let value = e.target.value
                            await setScanner(value)
                            if (value === "") {
                                setData(dataServer)
                            } else {
                                const dataNew = dataServer.filter(x => x.id === value)
                                setData(dataNew)
                            }

                        }}
                    />
                </Col>
            </Row>
        </div >
    );
};
FilterModal.propTypes = {
    className: PropTypes.any,
};
const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
export default styled(withConnect(FilterModal))`
    padding-top:10px;
`;
