/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState } from "react";
import { Row } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { DrawerBase, Card, Tabs, TabPane } from "components";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import AccountantCollect from './AccountantCollect';
import OrderList from './OrderList';
/**
 *
 * Hiển thị bảng kê nhập hàng vn, at the '/bang-ke/nhap-hang/vp' route
 *
 */
const CollectMoney = ({ className }) => {
  const [create, setCreate] = useState(new Date());
  return (
    <Row className={className} gutter={[16, 0]}>
      <Tabs
        type="card"
        margin="0px 0px"
      >
        <TabPane tab={"Kế toán - thu tiền"} key="1">
          <AccountantCollect create={create} setCreate={setCreate} />
        </TabPane>
        <TabPane tab={"Bảng kê - thu tiền"} key="2">
          <OrderList create={create} setCreate={setCreate} />
        </TabPane>
      </Tabs>
    </Row>
  );
};

const mapStateToProps = createStructuredSelector({
  definitions: makeSelectDefinitions(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
CollectMoney.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(CollectMoney))`
  margin-bottom: 0px !important;
  .ant-tabs {
    width: 100%;
  }
  .page-content {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-content__action {
      display: flex;
      flex-wrap: wrap;
      .ant-btn {
        margin-left: 5px;
      }
    }
  }
`;
