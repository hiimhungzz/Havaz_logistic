

import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { Tabs, TabPane } from "components";
import styled from "styled-components";
import PropTypes from "prop-types";
import Filter from "./Filter";
import Table from "./Table";
import TableDaPhat from "./Table/indexDaPhat";
import TableUndelivered from "./Table/indexUndelivered";
import { Map } from "immutable";
import Modal from "./Modal";
import ModalDetail from "./ModalDetail";
import { HEADER_TABLE, TEMP_BODY, formatParams, formatParams_ton_phat, formatParams_dat_phat, formatParams_khong_tc } from "./constants";
import ServiceBase from 'utils/ServiceBase';
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 *
 */

var fnTimeOut;
const Order = ({ className, profile }) => {
  const [dataBin, setDataBin] = useState({
    ton_phat: [],
    ton_phat_totla: 0,
    da_phat: [],
    da_phat_totla: 0,
    ket_thuc: [],
    ket_thuc_totla: 0,
  })
  const [params, setParams] = useState(TEMP_BODY);
  const [paramsHangPhat, setHangPhat] = useState({...TEMP_BODY, startDate: undefined, endDate: undefined });
  const [paramsDaPhat, setDaPhat] = useState(TEMP_BODY);
  const [paramsPhatKhongThanhCong, setPhatKhongThanhCong] = useState(TEMP_BODY);
  const [uuid, setUuid] = useState("");
  const [tabAct, setTabAct] = useState("HangPhat");
  const [isLoading, setLoading] = useState(false)
  const addDataOrder = useCallback(
    (value, name) => {
      setDataBin((props) => {
        let nextState = { ...props };
        nextState[name] = value.data;
        nextState[`${name}_total`] = value.meta.total;
        nextState[`${name}_info`] = value?.info || {};
        return nextState;
      });
    },
    [dataBin]
  );
  const getListOrder = useCallback(async (objParam, name) => {
    await setLoading(true)
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI['URI_ORDER_LIST'],
      data: objParam
    });
    let resultInfo = {}
    if(name === 'ton_phat' || name === 'da_phat') {
      resultInfo = await ServiceBase.requestJson({
        method: "GET",
        url: URI["URI_ORDER_INFO"],
        data: objParam
      });
    }
    await setLoading(false)
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let tongHop = result?.value || {};
      tongHop['info'] = resultInfo?.value || {}
      addDataOrder(tongHop, name)
    }
  })
  const [modalDetail, setModalDetail] = useState(Map({ visible: false, isEdit: false }));
  const _handleShowModal = useCallback((visible) => {
    setModalDetail((prev) => {
      let next = prev;
      next = next.set("visible", visible);
      return next;
    });
  }, []);
  const getAllTab = useCallback(async (visible) => {
    if(tabAct === 'HangPhat') {
      let tempParams = formatParams_ton_phat(paramsHangPhat)
      tempParams['scope'] = 'should_delivery';
      searchTimeOut(tempParams, 'ton_phat')
    }
    if(tabAct === 'DaPhat') {
      let tempParams = formatParams_dat_phat(paramsDaPhat)
      tempParams['scope'] = 'delivered';
      searchTimeOut(tempParams, 'da_phat')
    }
    if(tabAct === 'PhatKhongThanhCong') {
      let tempParams = formatParams_khong_tc(paramsPhatKhongThanhCong)
      tempParams['scope'] = 'undelivered';
      searchTimeOut(tempParams, 'ket_thuc')
    }
  }, [tabAct, paramsHangPhat, paramsDaPhat, paramsPhatKhongThanhCong]);

  const searchTimeOut = function (value, key) {
    window.clearTimeout(fnTimeOut);
    fnTimeOut = window.setTimeout(function () {
      getListOrder(value, key)
    }, 800);
  };

  useEffect(() => {
    if (uuid) {
      _handleShowModal(true)
    } else {
      if (uuid === null) {
        getListOrder(params);
      }
    }
  }, [uuid])

  useEffect(() => {
    if(tabAct === 'HangPhat') {
      let tempParams = formatParams_ton_phat(paramsHangPhat)
      tempParams['scope'] = 'should_delivery';
      searchTimeOut(tempParams, 'ton_phat')
    }
    if(tabAct === 'DaPhat') {
      let tempParams = formatParams_dat_phat(paramsDaPhat)
      tempParams['scope'] = 'delivered';
      searchTimeOut(tempParams, 'da_phat')
    }
    if(tabAct === 'PhatKhongThanhCong') {
      let tempParams = formatParams_khong_tc(paramsPhatKhongThanhCong)
      tempParams['scope'] = 'undelivered';
      searchTimeOut(tempParams, 'ket_thuc')
    }
  },[tabAct, paramsHangPhat, paramsDaPhat, paramsPhatKhongThanhCong])

  const getSession = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "/v1/common/session",
      data: {}
    });
  }, [])

  return (
    <Row className={className} gutter={[16, 16]}>
      <Col xs={24}>
        <div className="order-content">
          <Tabs 
            type="card" 
            margin="0px 0px" 
            onChange={(tab) => {
              if(tab)
                setTabAct(tab)
              
              getSession()
            }
          }>
            <TabPane tab="HÀNG PHÁT" key="HangPhat">
              <Filter params={paramsHangPhat} setParams={setHangPhat} className={"filter-phat-hang"}/>
              <Spin spinning={isLoading} tip="Đang tải...">
              <Table
                tableType={"TAB1"}
                headerColumns={[]}
                dataBin={dataBin?.ton_phat}
                params={paramsHangPhat}
                setParams={setHangPhat}
                uuid={uuid}
                setUuid={setUuid}
                pagination={{}}
                total={dataBin?.ton_phat_total}
                setTab={"setTabAct"}
                _info={dataBin?.ton_phat_info}
              /></Spin>
              <Modal setTabAct={"setTabAct"} tabAct={tabAct} modal={modalDetail} handleShowModal={_handleShowModal} dataBin={[]} setParams={getAllTab} params={{}} uuid={uuid} setUuid={setUuid} />
            </TabPane>
            <TabPane tab="ĐÃ PHÁT" key="DaPhat">
              <Filter params={paramsDaPhat} setParams={setDaPhat} className={"filter-phat-hang"}/>
              <Spin spinning={isLoading} tip="Đang tải...">
              <TableDaPhat
                tableType={"TAB2"}
                headerColumns={HEADER_TABLE}
                dataBin={dataBin?.da_phat}
                params={paramsDaPhat}
                setParams={setDaPhat}
                uuid={uuid}
                setUuid={setUuid}
                pagination={{}}
                total={dataBin?.da_phat_total}
                _info={dataBin?.da_phat_info}
              /></Spin>
            </TabPane>
            <TabPane tab="PHÁT KHÔNG THÀNH CÔNG" key="PhatKhongThanhCong">
              <Filter params={paramsPhatKhongThanhCong} setParams={setPhatKhongThanhCong} className={"filter-phat-hang"}/>
              <Spin spinning={isLoading} tip="Đang tải...">
              <TableUndelivered
                tableType={"TAB3"}
                headerColumns={HEADER_TABLE}
                dataBin={dataBin?.ket_thuc}
                params={paramsPhatKhongThanhCong}
                setParams={setPhatKhongThanhCong}
                uuid={uuid}
                setUuid={setUuid}
                pagination={{}}
                total={dataBin?.ket_thuc_total}
              /></Spin>
            </TabPane>
          </Tabs>
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
  .filter-phat-hang {
    margin-top: 15px !important;
  }
`;
