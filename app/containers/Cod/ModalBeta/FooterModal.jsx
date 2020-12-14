import React, { memo, useCallback, useState, useEffect } from "react";
import { Row, Col, Button, Space, Modal , Form } from "antd";
import _ from "lodash"
import { DefineSelect } from "components";
import styled from "styled-components";
import {createStructuredSelector} from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import {connect} from "react-redux";

const FooterModal = ({
    uuid,
    objOrder,
    onHandleClose,
    onUpdateOrderByCOD,
    className,
    definitions
}) => {
    let footerContent = "";

    if (uuid === "") {
        footerContent = ""
    } else {
        let ButtonAction = (
            <>
                <div style={{width: '79px',height: '38px'}} className="div-load"></div>
            </>
        );
        if(objOrder && objOrder.id && !objOrder.cod_transferred){
            ButtonAction = (<Button type="primary" onClick={onUpdateOrderByCOD}>Trả COD</Button>)
        } else {
            ButtonAction=""
        }
        footerContent = (
            <Row justify="end" gutter={[8, 8]}>
                <Space size={10} align="center">
                    {ButtonAction}
                </Space>  
            </Row>
        )
    }

    return (
        <Row justify="start" gutter={[8, 8]} className={className}>
            <Col span={5}>
              <Button type="danger" onClick={onHandleClose}>Thoát</Button>
            </Col>
            <Col span={19}>
              {footerContent}
            </Col>
        </Row>
    )
}

const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions()
  });
  const withConnect = connect(
    mapStateToProps,
    null
  );
export default styled(memo(withConnect(FooterModal)))`
    .div-load {
        position: relative;
        animation: myLoad 2s infinite alternate;
    }
    @keyframes myLoad {
        0% { background-color : rgb(245 245 245)}
        25% { background-color : rgb(232 232 232)}
        50% { background-color : rgb(245 245 245)}
        100% { background-color : rgb(232 232 232)}
    }
`;