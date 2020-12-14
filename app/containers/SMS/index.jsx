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
import { HEADER_TABLE, TEMP_BODY, formatParams } from "./constants";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 * /api/v1/app/sms?filterBy[sent_date]=2020-11-17&filterBy[phone]=0988733166:like
 */
const Order = ({ className, profile }) => {
  const [dataBin, setDataBin] = useState({
    sms : [],
    sms_total: 0
  })
  const [params, setParams] = useState(TEMP_BODY);
  const [uuid, setUuid] = useState("");

  const getListSms = useCallback(async (objParam) => {
    let _param = formatParams(objParam)
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI["URI_SMS"],
      data: _param
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      addDataOrder(result.value)
    }
  });
  const addDataOrder = useCallback(
    (value) => {
      setDataBin((props) => {
        let nextState = {...props};
          nextState['sms'] = value.data;
          nextState[`sms_total`] = value.meta.total;
        return nextState;
      });
    },
    [dataBin]
  );

  useEffect(() => {
    console.log('params', params)
    getListSms(params)
  }, [params]);
  

  return (
    <Row className={className} gutter={[16, 16]}>
      <Col xs={24}>
        <Filter params={params} setParams={setParams} />
      </Col>
      <Col xs={24}>
        <div className="order-content">
          <Table
            headerColumns={[]}
            dataBin={dataBin?.sms}
            params={params}
            setParams={setParams}
            uuid={uuid}
            setUuid={setUuid}
            pagination={{}}
            total={dataBin?.sms_total}
          />
        </div>
      </Col>
    </Row>
  );
};

Order.propTypes = {
  className: PropTypes.any,
};
export default styled(Order)`
  .order-content {
  }
`;
