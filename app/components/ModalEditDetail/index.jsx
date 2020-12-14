/**
 * Input (Styled Component)
 */
import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Select, Input, InputNumber, Card  } from "antd";
import _ from "lodash"
import styled from "styled-components";
import EditModal from "./Edit"


const DetailOrder = ({
    objOrder,
    setObjOrder,
    tabActive,
    form,
    className,
    _disabled,
    isShowIssues
}) => {
    
    const onChange = useCallback(
    (value, name) => {
        setObjOrder((props) => {
            let nextState = { ...props };
            let strName = name.split('.')
            if (strName.length === 1) {
                nextState[name] = value;
            } else {
                nextState[strName[0]][strName[1]] = value
            }
            return nextState;
            });
        },[setObjOrder]
    );
    return (
        <Form form={form} >
            <EditModal 
                objOrder={objOrder}
                setLyDoPhatHang={""} 
                lyDoPhatHang={""}
                onChange={onChange}
                _disabled={_disabled}
            ></EditModal>
        </Form>
    )
};

export default styled(DetailOrder)`
    .ant-row.ant-row-start {
        margin: 0px 0px !important;
    }
    .ant-card-head-title {
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .ant-card-body {
        15px
    }
    .ant-row {
        margin-bottom: 0px !important;
    }
    .ant-card-head {
        min-height: 35px;
        padding-left: 15px
    }
`;