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
const Order = ({ className, profile }) => {
  const [dataBin, setDataBin] = useState({
    cod : [],
    cod_total: 0
  })
  const [params, setParams] = useState(TEMP_BODY);
  const [uuid, setUuid] = useState("");

  const getListOrder = useCallback(async (objParam, name) => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI["URI_ORDER_LIST"],
      data: objParam
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      addDataOrder(result.value, name)
    }
  });
  const addDataOrder = useCallback(
    (value, name) => {
      setDataBin((props) => {
        let nextState = {...props};
          nextState[name] = value.data;
          nextState[`${name}_total`] = value.meta.total;
        return nextState;
      });
    },
    [dataBin]
  );
  const getAllTab = useCallback( async (visible) => {
    let teamParam = formatParams(params)
    let COD = {...teamParam}
    COD['scope'] = "has_cod"
    getListOrder(COD, 'cod'); // should_cod_transfer
  }, [params]);

  const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));
  const _handleShowModal = useCallback((visible) => {
    setModal((prev) => {
      let next = prev;
      next = next.set("visible", visible);
      return next;
    });
  }, []);
  useEffect(() => {
    getAllTab()
  }, [getAllTab]);
  useEffect(() => {
    if (uuid) {
      _handleShowModal(true);
    }
  }, [uuid]);
  let {
    cod,
    cod_total
  } = dataBin;
  
  const getOrderByTab = useCallback((tab) => {
    // console.log(tab)
  }, []);
  return (
    <Row className={className} gutter={[16, 16]}>
      <Col xs={24}>
        <Filter params={params} setParams={setParams} />
      </Col>
      <Col xs={24}>
        <div className="order-content">
          <Table
            headerColumns={[]}
            dataBin={cod}
            params={params}
            setParams={setParams}
            uuid={uuid}
            setUuid={setUuid}
            pagination={{}}
            total={cod_total}
          />
          <ModalBeta
            modal={modal}
            handleShowModal={_handleShowModal}
            dataBin={[]}
            setParams={getAllTab}
            params={{}}
            uuid={uuid}
            setUuid={setUuid}
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
