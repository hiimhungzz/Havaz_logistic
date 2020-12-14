/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import { Row } from "antd";
import { TabPane, Tabs } from "components";
import { makeSelectDefinitions } from "containers/App/selectors";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import TrungChuyen from './TrungChuyen';
import XeTuyen from './XeTuyen';
import XeTrungChuyen from './XeTrungChuyen';
/**
 *
 * Hiển thị bảng kê nhập hàng vn, at the '/bang-ke/nhap-hang/vp' route
 *
 */
const Page = ({ className, definitions }) => {
  return (
    <Row className={className} gutter={[16, 0]}>
      <Tabs
        type="card"
        defaultActiveKey="1"
        margin="0px 0px"
        tabBarExtraContent={
          <>
            {/* <Button style={{marginRight: 10}} type="primary" >
              Tra cứu cước
            </Button> */}
          </>
        }
        onChange={() => {

        }}
      >
        <TabPane tab={"Xe tuyến"} key="1">
          <XeTuyen />
        </TabPane>
        <TabPane tab={"Xe trung chuyển"} key="2" >
          <TrungChuyen />
          {/* <XeTrungChuyen/> */}
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
Page.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(Page))`
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
