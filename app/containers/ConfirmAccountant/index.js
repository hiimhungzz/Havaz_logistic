/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Button, Pagination, Badge } from "antd";
import { Card, Tabs, TabPane } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import Filter from "./Filter";
import moment from "moment";
import Table from "./Table";
import { Map } from "immutable";
import Modal from "./Modal";
import ModalBeta from "./ModalBeta";
import { HEADER_TABLE, TEMP_BODY, formatParams } from "./constants";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";
import { createStructuredSelector } from "reselect";
import { makeSelectDefinitions } from "containers/App/selectors";
import { connect } from "react-redux";

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 *
 */
const ConfirmAccountant = ({ className, profile }) => {
  return (
    <Row className={className} gutter={[16, 16]}>
      
    </Row>
  );
};

ConfirmAccountant.propTypes = {
  className: PropTypes.any,
};
export default styled(ConfirmAccountant)`
  .order-content {
  }
`;
