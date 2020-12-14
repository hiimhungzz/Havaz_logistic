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
    onUpdateOrderByDelivery,
    onUpdateOrderByIssue,
    onUpdateOrderByUndelivery,
    className,
    definitions
}) => {
    const [lyDoXoa, SetLyDoXoa] = useState(1)
    const [type_err, Set_Type_err] = useState(1)
    const [visibleModalDelete, SetVisibleModalDelete] = useState(false)
    let footerContent = "";
    let { undelivered_reasons, issue_types } = definitions.toJS()
    const [_issue_types ] = useState(issue_types)
    const [_undelivered_reasons ] = useState(undelivered_reasons)

    const onSubmit = useCallback(async () => {
        if(type_err === 1) {
            onUpdateOrderByIssue(lyDoXoa)
        } else {
            onUpdateOrderByUndelivery(lyDoXoa)
        }
        SetVisibleModalDelete(false)
    }, [lyDoXoa, type_err])

    useEffect(() => {
        SetLyDoXoa(1)
    }, [visibleModalDelete])

    if (uuid === "") {
        footerContent = ""
    } else {
        let ButtonAction = (
            <>
                <div style={{width: '79px',height: '38px'}} className="div-load"></div>
                <div style={{width: '79px',height: '38px'}} className="div-load"></div>
                <div style={{width: '79px',height: '38px'}} className="div-load"></div>
            </>
        );
        if(objOrder && objOrder.id){
            if(objOrder['status'] === 5 || objOrder['status'] === 3){
                ButtonAction = ""
            } else {
                ButtonAction = (
                    <>
                        <Button onClick={()=> {
                            SetVisibleModalDelete(true)
                            Set_Type_err(1)
                        }}>Xử lý</Button>
                        <Button type="primary" onClick={onUpdateOrderByDelivery}>Phát Hàng</Button>
                    </>
                )
            }
        }
        footerContent = (
            <Row justify="end" gutter={[8, 8]}>
                <Space size={10} align="center">
                    {ButtonAction}
                </Space>
                    <Modal
                        title="Xác nhận hủy đơn hàng"
                        visible={visibleModalDelete}
                        onOk={onSubmit}
                        confirmLoading={''}
                        onCancel={()=> SetVisibleModalDelete(false)}
                    >
                        <DefineSelect
                            placeholder="Chọn lý do"
                            search={
                                (e) => {
                                    // searchTimeOut(e)
                                }
                            }
                            change={(e) => {
                                SetLyDoXoa(e)
                            }}
                            dataBin={type_err !== 1 ? _undelivered_reasons : _issue_types}
                            value={lyDoXoa}
                        />
                    </Modal>    
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