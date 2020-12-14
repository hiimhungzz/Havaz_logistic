import React, { useCallback, memo } from "react";
import { Row, Col, Button, Form, Select, Divider, DatePicker } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input, Label } from "components";
import _ from "lodash";

let timer1 = null;

const Filter = memo(({ className, setParams, params }) => {
    const _changeQuery = useCallback(
        (payload) => {
            if (timer1) {
                clearTimeout(timer1);
            }
            timer1 = setTimeout(() => {
                setParams((prevState) => {
                    let nextState = { ...prevState };
                    nextState[payload.name] = payload.value;
                    return nextState;
                });
            }, 500);
        },
        [setParams]
    );
    return (
        <div div className={className} >
            <Row gutter={[8, 16]}>
                <Col xs={5}>
                    <DatePicker
                        allowClear={false}
                        onChange={(date) => {
                            setParams((prevState) => {
                                let nextState = { ...prevState };
                                nextState.day = date;
                                return nextState;
                            });
                        }}
                        style={{ width: '100%' }}
                        value={params.day}
                        format={'DD-MM-YYYY'}
                    />
                </Col>
                {/* <Col xs={5}>
                    <Input
                        allowClear
                        onChange={(e) => {
                            _changeQuery({ name: "bks", value: e.target.value });
                        }}
                        placeholder={"Search BKS"}
                    />
                </Col> */}
                <Col xs={5}>
                    <Input
                        allowClear
                        onChange={(e) => {
                            _changeQuery({ name: "trip_id", value: e.target.value });
                        }}
                        placeholder={"Search ID chuyến"}
                    />
                </Col>
            </Row>
        </div>
    );
}
);
Filter.propTypes = {
    className: PropTypes.any,
};
export default styled(Filter)`
    padding-top:10px;
`;
