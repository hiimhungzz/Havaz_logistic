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


/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/SupportHHs' route
 *
 */
const SupportHH = ({ className, profile }) => {

  return (
    <div className={className}>
      <iframe src="https://docs.google.com/spreadsheets/d/1JKozHlWw_r_qzXPgxHPwnCm179Zz2j4jmxv8HP7avv4/edit#gid=0"
        title="Hàng hóa- Lỗi thường gặp" style={{ minHeight: 'calc(100vh - 130px)', width: '100%' }}></iframe>
    </div>
  );
};

SupportHH.propTypes = {
  className: PropTypes.any,
};
export default styled(SupportHH)`
  width: '100%'
`;
