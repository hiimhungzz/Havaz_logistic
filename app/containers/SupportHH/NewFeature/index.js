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
 * Hiển thị danh sách đơn hàng, at the '/NewFeature' route
 *
 */
const NewFeature = ({ className, profile }) => {

  return (
    <div className={className}>
      <iframe src="https://docs.google.com/document/d/1CCW9cl1zmIBbRfHyH2eQ9BKN4LaGr6Js5OQdial_8vo/edit"
        title="Tính năng mới" style={{ minHeight: 'calc(100vh - 130px)', width: '100%' }}></iframe>
    </div>
  );
};

NewFeature.propTypes = {
  className: PropTypes.any,
};
export default styled(NewFeature)`
  width: '100%'
`;
