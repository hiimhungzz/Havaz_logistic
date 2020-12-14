/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { } from "react";
import { Row } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { DrawerBase, Card, Tabs, TabPane } from "components";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";
import ChieuDi from './ChieuDi';
import ChieuVe from './ChieuVe';
/**
 *
 * Hiển thị bảng kê nhập hàng vn, at the '/bang-ke/nhap-hang/vp' route
 *
 */
const DieuDo = ({ className }) => {
    return (
        <Row className={className} gutter={[16, 0]}>
            <Tabs
                type="card"
                margin="0px 0px"
            >
                <TabPane tab={"Chiều đi"} key="1">
                    <ChieuDi />
                </TabPane>
                <TabPane tab={"Chiều về"} key="2" >
                    <ChieuVe />
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
DieuDo.propTypes = {
    className: PropTypes.any,
};
export default styled(withConnect(DieuDo))`
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
