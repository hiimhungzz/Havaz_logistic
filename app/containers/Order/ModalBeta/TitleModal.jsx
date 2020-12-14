import React, { } from "react";
import { Row, Col, Space, Tag, } from "antd";
import _ from "lodash"
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { makeSelectDefinitions } from "containers/App/selectors";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Print from '../PrintBeta'
import PrintA6 from '../PrintA6Beta'
import PrintItem from "../PrintItem";
import PrintBill from "../PrintBill";
const TitleModal = ({
    profile,
    definitions,
    uuid,
    objOrder,
    className
}) => {
    let title = ""
    if (uuid !== "") {
        let { creator, created_at } = objOrder
        // Nếu là chỉnh sửa đơn hàng
        if (objOrder && objOrder.id) {
            title = (
                <Row justify="start" gutter={[8, 8]}>
                    <Col span={12}>
                        <row>
                            <Col span={14}>
                                <Space style={{ "fontSize": '12px' }}> Chi tiết đơn hàng</Space> : <Space
                                    style={{ "fontSize": "20px", "color": "rgba(212, 114, 28, 0.85)" }}>
                                    {objOrder['code']}
                                    <Tag
                                        color={definitions.getIn([
                                            "order_statuses",
                                            `${objOrder['status']}`,
                                            "color",
                                        ])}
                                    >
                                        {definitions.getIn([
                                            "order_statuses",
                                            `${objOrder['status']}`,
                                            "text",
                                        ])}
                                    </Tag>
                                </Space>
                            </Col>
                            {/* <Col span={4}>
                                <Print dataBin={objOrder} isIcon={false} />
                            </Col>
                            <Col span={4} style={{ marginTop: '-40px', marginLeft: '105px' }}>
                                <PrintItem dataBin={objOrder} isIcon={false} />
                            </Col>
                            <Col span={4} style={{ marginTop: '-40px', marginLeft: '208px' }}>
                                <PrintA6 dataBin={objOrder} isIcon={false} />
                            </Col>
                            <Col span={4} style={{ marginTop: '-40px', marginLeft: '300px' }}>
                                <PrintBill dataBin={objOrder} isIcon={false} />
                            </Col> */}

                            <Space>
                                <Print dataBin={objOrder} isIcon={false} />
                                <PrintItem dataBin={objOrder} isIcon={false} />
                                <PrintA6 dataBin={objOrder} isIcon={false} />
                                <PrintBill dataBin={objOrder} isIcon={false} />
                            </Space>
                        </row>
                        {/* <span style={{ marginTop: '-6px' }}>
                            <Print dataBin={objOrder} isIcon={false}/>
                        </span>
                        <span style={{ marginTop: '-6px' }}>
                            <PrintItem dataBin={objOrder} isIcon={false}/>
                        </span> */}
                    </Col>
                    <Col span={8} offset={3}>
                        <p style={{ "fontSize": "13px", marginBottom: '-4px' }}>NV nhận : <em>{creator?.name}</em></p>
                        <p style={{ "fontSize": "13px", marginBottom: '-4px' }}> Thời gian tạo đơn : <em>{moment(created_at).format('DD-MM-YYYY HH:mm')}</em> </p>
                    </Col>
                </Row>
            )
        } else {
            title = (<Row justify="start" gutter={[8, 8]}>
                <Col span={12}>
                    <div style={{ width: '300px', height: '22px' }} className="div-load"></div>
                    <div style={{ width: '65px', height: '22px', marginTop: '3px' }} className="div-load"></div>
                    <div style={{ width: '65px', height: '22px', marginTop: '-23px', marginLeft: '70px' }} className="div-load"></div>
                    <div style={{ width: '65px', height: '22px', marginTop: '-23px', marginLeft: '137px' }} className="div-load"></div>
                </Col>
                <Col span={8} offset={3}>
                    <div style={{ width: '200px', height: '22px' }} className="div-load"></div>
                    <div style={{ width: '250px', height: '22px', marginTop: '3px' }} className="div-load"></div>
                </Col>
            </Row>)
        }
    } else {
        // title = "THÊM MỚI ĐƠN HÀNG"
        title = (
            <Row justify="start" gutter={[8, 8]}>
                <Col span={8}>
                    THÊM MỚI ĐƠN HÀNG
            </Col>
                <Col span={5} offset={10}>
                    <span style={{ "fontSize": "13px" }}> NV nhận : {profile.name} </span>
                </Col>
                {/* <Print dataBin={objOrder} isIcon={false}/> */}
            </Row>
        )
    }
    return (
        <div className={className}>
            {title}
        </div>
    )
}
// TitleModal.propTypes = {
//     className: PropTypes.any,
// };
const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
    mapStateToProps,
    null
);
// padding-top: 2px;padding-bottom: 2px;padding-left: 24px;padding-right: 2px;
export default styled(withConnect(TitleModal))`
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