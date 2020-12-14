/**
 * Input (Styled Component)
 */
import React, {useCallback} from "react";
import { Table } from "antd";
import _ from "lodash"
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import moment from "moment";
import styled from "styled-components";

const Tracking = ({ 
    tabActive,
    definitions,
    rowList,
    className
}) => {
    let columns = [
        {
            title: "NV cập nhật tồn",
            width: 120,
            key: "date",
            render: (text, record) => (
                <>
                    <span>{record["actor_code"]}</span><br/>
                    <span>{record["actor_name"]}</span>
                </>
            )
        },
        {
            title: "Thời gian cập nhật tồn",
            width: 100,
            key: "hous",
            render: (text, record) => (
                <div>{moment(record["created_at"]).format("DD/MM/YYYY HH:mm")}</div>
            )
        },
        {
            title: "Lý do tồn",
            width: 150,
            key: "event",
            render: (text, record) => (
                <div>{definitions.getIn([
                    "order_note",
                    `${record.reason_id}`,
                    "text",
                  ])}</div>
            )
        },
        {
            title: "Ghi chú tồn",
            width: 100,
            key: "hub",
            render: (text, record) => (
                <div>{record['note']}</div>
                
            )
        }
    ]
    
    return (
        <div className={className}>
            <Table
            bordered
            columns={columns}
            dataSource={rowList}
            scroll={{ x: "100%" }}
            rowKey="code"
            pagination={false}
            />
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    definitions: makeSelectDefinitions(),
});
const withConnect = connect(
mapStateToProps,
null
);
 
export default styled(withConnect(Tracking))`
  padding: 5px 5px;
  .ant-table-ping-right:not(.ant-table-has-fix-right)
    .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
  padding-top:0px !important;
  padding-bottom:0px !important;
  }
`;