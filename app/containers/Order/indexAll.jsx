/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Button, Drawer, Spin } from "antd";
import { Tabs, TabPane } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import Table from "./Table/indexAll";
import { Map } from "immutable";
import ModalBeta from "./Modal";
import Filter from "./Filter"
import { 
          TEMP_BODY,
          formatParams_khoKetNoi,
        } from "./constants";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";
import FindOrder from './FindOrder';

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 *
 */
const Order = ({ className, profile }) => {
  const [dataBin, setDataBin] = useState({})
  const [paramsAllOrder, setParamsAllOrder] = useState({});
  const [isLoading, setLoading] = useState(false)
  const [uuid, setUuid] = useState("");
  const [_visibleModal, setVisibleModal] = useState({
    isShow: false,
    dataItem: {} //khởi tạo data ban đầu
  });
  const getListOrder = useCallback(async (objParam, name) => {
    await setLoading(true)
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI["URI_ORDER_LIST"],
      data: objParam
    });
    let resultInfo = {}
      resultInfo = await ServiceBase.requestJson({
        method: "GET",
        url: URI["URI_ORDER_INFO"],
        data: objParam
      });
    
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let tongHop = result?.value || {};
      tongHop['info'] = resultInfo?.value || {}
      addDataOrder(tongHop, name)
    }
    await setLoading(false)
  }, []);
  

  
  const addDataOrder = useCallback(
    (value, name) => {
      setDataBin((props) => {
        let nextState = { ...props };
        nextState[name] = value.data;
        nextState[`${name}_total`] = value?.meta?.total || 0;
        nextState[`${name}_info`] = value?.info || {};
        return nextState;
      });
    },
    [dataBin]
  );
  
  const getAllTab = useCallback(async (visible) => {
    // 
    let tempParams = formatParams_khoKetNoi(paramsAllOrder)
    tempParams['scope'] = 'should_exported_delivered' // kho nhận
    getListOrder(tempParams, 'all')

  }, [paramsAllOrder]);

  const [modal, setModal] = useState(Map({ visible: false, isEdit: false }));

  const _handleShowModal = useCallback((visible) => {
    setModal((prev) => {
      let next = prev;
      next = next.set("visible", visible);
      return next;
    });
  }, []);

  useEffect(() => {
    // console.log('vào kho nhận')
    let tempParams = formatParams_khoKetNoi(paramsAllOrder)
    tempParams['scope'] = 'should_exported_delivered' // kho nhận
    getListOrder(tempParams, 'all')
  }, [paramsAllOrder]);
  
  const getSession = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "/v1/common/session",
      data: {}
    });
  }, [])

  useEffect(() => {
    if (uuid) {
      _handleShowModal(true)
    } else {
      if (uuid === null) {
        getListOrder(params);
      }
    }
  }, [uuid])

  let maxHeight = window.innerHeight;
  maxHeight = maxHeight * 65 / 100
  return (
    <Row className={className} gutter={[16, 16]}>
      {/* <Col xs={24}>
        <Filter params={params} setParams={setParams} />
      </Col> */}
      <Col xs={24}>
        <div className="order-content">
        <div className="filter-tab1">
                <Filter params={paramsAllOrder} setParams={setParamsAllOrder} />
              </div>
              <Spin spinning={isLoading} tip="Đang tải...">
                <Table
                  headerColumns={[]}
                  dataBin={dataBin?.all}
                  _setParams={setParamsAllOrder}
                  _params={paramsAllOrder}
                  onLoad={getAllTab}
                  uuid={uuid}
                  setUuid={setUuid}
                  pagination={{}}
                  total={dataBin?.all_total}
                  _info={dataBin?.all_info}
                  _visibleModal={_visibleModal}
                  setVisibleModal={setVisibleModal}
                  scroll_Y={maxHeight}
                />
              </Spin>
              <ModalBeta
                modal={modal}
                handleShowModal={_handleShowModal}
                dataBin={[]}
                setParams={getAllTab}
                params={{}}
                uuid={uuid}
                setUuid={setUuid}
                setVisibleModal={setVisibleModal}
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
  .filter-tab1 {
    margin-top: 20px;
  }
`;
