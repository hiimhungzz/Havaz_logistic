import React, { useState, useCallback, useEffect } from "react";
import { Card, DefineTable, DefinePagination } from "components";
import { Col , Row, Table, Tag } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import Filter from "./Filter";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";
import { set } from "lodash";
import moment from "moment";

/**
 * Báo cáo công nợ theo xe 
 *  
 * 
 * 
 */

const congNoTheoNhanVien = ({
    className
}) => {
    const [params, setParams] = useState({
        startAt: moment(),
        endAt: moment(),
        vehicleId: null
    });
    let columns = [
            {
                title: "Điểm kết nối nhận",
                width: 130,
                dataIndex: "code",
                fixed: "left",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Mã NV nhận",
                width: 130,
                dataIndex: "code",
                fixed: "left",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Tên NV nhận",
                width: 130,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Tổng tiên thu được",
                width: 200,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Tổng tiền đã chuyển KT",
                width: 200,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            },
            {
                title: "Tổng cước phí chưa chuyển KT",
                width: 200,
                dataIndex: "code",
                render: (text, record) => (<></>
                )
            }
        ];

return (
    <Row className={className} gutter={[16, 16]}>
        <Col xs={24}>
            <Filter params={params} setParams={setParams} />
        </Col>
        <Col xs={24}>
            <DefineTable
                bordered
                columns={columns}
                dataSource={[]}
                scroll={{ x: "100%" }}
                rowKey="code"
                pagination={false}
                />
            <DefinePagination
                total={10}
                onPagination={(page, limit) => {
                    // setParams((props) => {
                    // let nextState = { ...props };
                    // nextState['per_page'] = limit;
                    // nextState['page'] = page;
                    // return nextState;
                    // });
                }}
                margin="bottom"
            />
        </Col>
    </Row>
)}

congNoTheoNhanVien.propTypes = {
    className: PropTypes.any,
};
export default styled(congNoTheoNhanVien)``;
