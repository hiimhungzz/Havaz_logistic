import React, { memo, useState, useCallback, useEffect } from "react";
import { CheckOutlined , CloseOutlined  } from "@ant-design/icons";
import { Table, Row, Pagination, Col, Space, Button, Modal, Tag, Checkbox } from "antd";
import { ARR_STATUS_ORDER, ARR_HTTT_ORDER } from "../constants";
import { DefineTextArea, DefinePagination, DefineTable } from "components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";

/*
 * table đơn hàng
 *
 */
const showIcon = (key) => {
  let icon = "";
  if(key === 'success') {
    icon = <CheckOutlined style={{color: '#02ff35'}}/>
  } else {
    icon = <CloseOutlined style={{color: 'red'}}/>
  }
  return icon
}
const tableOrder = memo(
  ({
    className,
    headerColumns,
    dataBin,
    params,
    setParams,
    uuid,
    setUuid,
    pagination,
    definitions,
    total
  }) => {
    
    let columns = [
      {
        title: "Mã đơn hàng",
        width: 130,
        dataIndex: "order_id",
        fixed: "left",
        render: (text) => (
            <div>{text}</div>
        ),
      },
      {
        title: "Mã nhân viên",
        width: 70,
        dataIndex: "actor_id"
      },
      {
        title: "Mã nhân viên",
        width: 130,
        dataIndex: "actor_name"
      },
      {
        title: "SĐT người nhận hàng",
        width: 130,
        dataIndex: "phone"
      },
      {
        title: "Thời gia gửi SMS",
        width: 100,
        // fixed: "left",
        render: (text, record) => (
          <div>{`${record["sent_date"]} ${record["sent_time"]}`}</div>
        ),
      },
      {
        title: "Nội dung",
        dataIndex: "content"
      },
      {
        title: "...",
        width: 30,
        dataIndex: "status",
        render: (text) => (
          showIcon(text)
        )
      }
    ];

    
    return (
      <div className={className}>
        <DefineTable
          bordered
          columns={columns}
          dataSource={dataBin}
          pagination={false}
        />
        <DefinePagination
          total={total}
          onPagination={(page, limit) => {
            setParams((props) => {
              let nextState = { ...props };
              nextState['per_page'] = limit;
              nextState['page'] = page;
              return nextState;
            });
          }}
          margin="bottom"
        />
        <Row justify="end" gutter={[8, 8]}>
          <Col style={{ marginTop: "10px" }} />
        </Row>
      </div>
    );
  }
);
tableOrder.propTypes = {
  className: PropTypes.any,
  dataBin: PropTypes.array,
};
const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(tableOrder))`
`;
