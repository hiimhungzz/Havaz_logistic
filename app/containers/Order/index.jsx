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
import Table from "./Table";
import TableTuChoi from "./Table/tuChoi";
import TableDaXuatVaHuy from "./Table/daXuatVaHuy";
import TableHuy from "./Table/Huy";
import { Map } from "immutable";
import ModalBeta from "./ModalBeta";
import moment from 'moment'
import Filter from "./Filter"
import {
  HEADER_TABLE,
  TEMP_BODY,
  formatParams_khoKetNoi,
  formatParams_khoNhan,
  formatParams_daXuat,
  formatParams_huy,
  formatParams_tuChoi
} from "./constants";
import ServiceBase from "utils/ServiceBase";
import { URI } from "utils/constants";
import { Ui } from "utils/Ui";
import FindOrder from './FindOrder';
import { DownloadOutlined } from "@ant-design/icons";
import downloadFile from "components/Utility/downloadFile";

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 *
 */
const Order = ({ className, profile }) => {
  const [btnloadding, setBtnLoadding] = useState(false);
  const [dataBin, setDataBin] = useState({
    should_exported: [],
    should_exported_total: 0,
    should_exported_info: 0,
    exported: [],
    exported_total: 0,
    exported_info: 0,
    undelivered: [],
    undelivered_total: 0,
    undelivered_info: 0,
    canceled: [],
    canceled_total: 0,
    canceled_info: 0,
    rejected: [],
    rejected_total: 0,
    khoNhan_total: 0,
    khoNhan_info: 0,
    khoNhan: []
  })
  const [paramsKhoNhan, setParamsKhoNhan] = useState(TEMP_BODY);
  const [paramsKhoKetNoi, setParamsKhoKetNoi] = useState({});
  const [paramsDaXuat, setParamsDaXuat] = useState(TEMP_BODY);
  const [paramsHuy, setParamsHuy] = useState(TEMP_BODY);
  const [paramsTuChoi, setParamsTuChoi] = useState(TEMP_BODY);
  const [params, setParams] = useState(TEMP_BODY);
  const [isShowFindOrder, setShowFindOrder] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [uuid, setUuid] = useState("");
  const [ActiveTab, setActiveTab] = useState('KhoNhan');

  const [paramss, setParamss] = useState({
    page: 1,
    per_page: 10000, // so ban ghi tren 1 trang,
    day: moment(), //ngày hiện tại
  });



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
    if (name === 'khoNhan' || name === 'should_exported') {
      resultInfo = await ServiceBase.requestJson({
        method: "GET",
        url: URI["URI_ORDER_INFO"],
        data: objParam
      });
    }

    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let tongHop = result?.value || {};
      tongHop['info'] = resultInfo?.value || {}
      addDataOrder(tongHop, name)
    }
    await setLoading(false)
  }, []);

  const getListOrderRejected = useCallback(async (objParam, name) => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI["URI_ORDER_REJECT"],
      data: objParam
    });

    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      addDataOrder(result.value, name)
    }
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
    let tempParams_khoNhan = formatParams_khoNhan(paramsKhoNhan)
    tempParams_khoNhan['scope'] = 'received' // kho nhận
    getListOrder(tempParams_khoNhan, 'khoNhan')
    // 
    let tempParams_khoKetNoi = formatParams_khoKetNoi(paramsKhoKetNoi)
    tempParams_khoKetNoi['scope'] = 'should_exported' // kho kết nối
    getListOrder(tempParams_khoKetNoi, 'should_exported')
    // 
    let tempParams_daXuat = formatParams_daXuat(paramsDaXuat)
    tempParams_daXuat['scope'] = 'exported' // đã xuất
    getListOrder(tempParams_daXuat, 'exported')
    // 
    let tempParams_huy = formatParams_huy(paramsHuy)
    tempParams_huy['scope'] = 'canceled' // hủy
    getListOrder(tempParams_huy, 'canceled')
    // 
    getListOrderRejected({}, 'rejected')

  }, [paramsKhoNhan, paramsKhoKetNoi, paramsDaXuat, paramsHuy]);

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
    let tempParams = formatParams_khoNhan(paramsKhoNhan)
    tempParams['scope'] = 'received' // kho nhận
    getListOrder(tempParams, 'khoNhan')
  }, [paramsKhoNhan]);

  useEffect(() => {
    // console.log('vào kho kết nối')
    let tempParams = formatParams_khoKetNoi(paramsKhoKetNoi)
    tempParams['scope'] = 'should_exported' // kho kết nối
    getListOrder(tempParams, 'should_exported')
  }, [paramsKhoKetNoi]);

  useEffect(() => {
    // console.log('vào đã xuất')
    let tempParams = formatParams_daXuat(paramsDaXuat)
    tempParams['scope'] = 'exported' // đã xuất
    getListOrder(tempParams, 'exported')
  }, [paramsDaXuat]);

  useEffect(() => {
    // console.log('vào hủy')
    let tempParams = formatParams_huy(paramsHuy)
    tempParams['scope'] = 'canceled' // hủy
    getListOrder(tempParams, 'canceled')
  }, [paramsHuy]);


  useEffect(() => {
    // console.log('vào từ chối')
    // let tempParams = formatParams_huy(paramsHuy)
    // tempParams['scope'] = 'rejected' // từ chối đơn hàng
    getListOrderRejected({}, 'rejected')
  }, [paramsTuChoi]);


  let {
    should_exported,
    should_exported_total,
    should_exported_info,
    exported,
    exported_total,
    exported_info,
    canceled,
    canceled_total,
    canceled_info,
    rejected,
    rejected_total,
    khoNhan,
    khoNhan_total,
    khoNhan_info
  } = dataBin;


  const getSession = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: "/v1/common/session",
      data: {}
    });
  }, [])

  const getOrderByTab = useCallback((tab) => {
    if (tab === 'KhoNhan') {
      setParamsKhoNhan((props) => {
        let nextState = { ...props };
        nextState['per_page'] = 10;
        nextState['page'] = 1;
        return nextState;
      });
    }
    if (tab === 'KhoKetNoi') {
      setParamsKhoKetNoi((props) => {
        let nextState = { ...props };
        nextState['per_page'] = 10;
        nextState['page'] = 1;
        return nextState;
      });
    }
    if (tab === 'DaXuat') {
      setParamsDaXuat((props) => {
        let nextState = { ...props };
        nextState['per_page'] = 10;
        nextState['page'] = 1;
        return nextState;
      });
    }
    if (tab === 'Huy') {
      setParamsHuy((props) => {
        let nextState = { ...props };
        nextState['per_page'] = 10;
        nextState['page'] = 1;
        return nextState;
      });
    }
    if (tab === 'TuChoi') {
      setParamsTuChoi((props) => {
        let nextState = { ...props };
        nextState['per_page'] = 10;
        nextState['page'] = 1;
        return nextState;
      });
    }
    setActiveTab(tab)
    getSession()
  }, []);
  useEffect(() => {
    if (uuid) {
      _handleShowModal(true)
    } else {
      if (uuid === null) {
        getListOrder(params);
      }
    }
  }, [uuid])





  // Xuất Excel
  const exportExcel = useCallback(async () => {
    setBtnLoadding(false);
    setTimeout(() => {
      setBtnLoadding(false);
    }, 3000);
    const result = await ServiceBase.requestJson({
      method: "EXPORT",
      url: "v1/report/general",
      data: {
        // ...paramsKhoNhan,
        day_from: moment(paramsKhoNhan.startDate).format("YYYY-MM-DD"),
        day_to: moment(paramsKhoNhan.endDate).format("YYYY-MM-DD"),
        scope: 'excel',
      }
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      const url = window.URL.createObjectURL(new Blob([result.value]));
      downloadFile(url, `Kho nhận.xlsx`)
    }
    await setLoading(false);
  }, [paramsKhoNhan]);





  let maxHeight = window.innerHeight;
  maxHeight = maxHeight * 65 / 100
  return (
    <Row className={className} gutter={[16, 16]}>
      {/* <Col xs={24}>
        <Filter params={params} setParams={setParams} />
      </Col> */}
      <Col xs={24}>
        <div className="order-content">
          <Tabs
            type="card"
            margin="0px 0px"
            tabBarExtraContent={
              <>
                <Button style={{ marginRight: 10 }} type="primary" onClick={() => setShowFindOrder(true)}>
                  Tra cứu cước
                </Button>
                <Button type="primary" onClick={() => _handleShowModal(true)}>
                  Thêm mới
                </Button>
              </>
            }
            onChange={getOrderByTab}
          >

            <TabPane tab="KHO NHẬN" key="KhoNhan">
              <div className="filter-tab1">
                <Filter params={paramsKhoNhan} setParams={setParamsKhoNhan} />
                <Col style={{ marginLeft: "auto", padding: 0 }}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={btnloadding}
                    onClick={e => {
                      exportExcel()
                    }}
                    style={{
                      height: 35,
                    }}
                  >
                    <span >Xuất Excel</span>
                  </Button>
                </Col>
              </div>

              <Spin spinning={isLoading} tip="Đang tải...">
                <Table
                  headerColumns={[]}
                  dataBin={khoNhan}
                  _setParams={setParamsKhoNhan}
                  _params={paramsKhoNhan}
                  onLoad={getAllTab}
                  uuid={uuid}
                  setUuid={setUuid}
                  pagination={{}}
                  total={khoNhan_total}
                  _info={khoNhan_info}
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
                ActiveTab={ActiveTab}
              />
            </TabPane>
            <TabPane tab="KHO KẾT NỐI" key="KhoKetNoi">
              <div className="filter-tab1">
                <Filter params={paramsKhoKetNoi} setParams={setParamsKhoKetNoi} />
              </div>
              <Table
                headerColumns={[]}
                dataBin={should_exported}
                _setParams={setParamsKhoKetNoi}
                _params={paramsKhoKetNoi}
                onLoad={getAllTab}
                uuid={uuid}
                setUuid={setUuid}
                pagination={{}}
                total={should_exported_total}
                _info={should_exported_info}
                _visibleModal={_visibleModal}
                setVisibleModal={setVisibleModal}
                scroll_Y={maxHeight}
              />

            </TabPane>
            <TabPane tab="ĐÃ XUẤT" key="DaXuat" >
              <div className="filter-tab1">
                <Filter params={paramsDaXuat} setParams={setParamsDaXuat} />
              </div>
              <Spin spinning={isLoading} tip="Đang tải...">
                <TableDaXuatVaHuy
                  headerColumns={HEADER_TABLE}
                  dataBin={exported}
                  params={paramsDaXuat}
                  setParams={setParamsDaXuat}
                  onLoad={getAllTab}
                  uuid={uuid}
                  setUuid={setUuid}
                  pagination={{}}
                  total={exported_total}
                  _visibleModal={_visibleModal}
                  setVisibleModal={setVisibleModal}
                />
              </Spin>
            </TabPane>
            <TabPane tab="HỦY" key="Huy" >
              <div className="filter-tab1">
                <Filter params={paramsHuy} setParams={setParamsHuy} />
              </div>
              <Spin spinning={isLoading} tip="Đang tải...">
                <TableHuy
                  headerColumns={[]}
                  dataBin={canceled}
                  params={paramsHuy}
                  setParams={setParamsHuy}
                  onLoad={getAllTab}
                  uuid={uuid}
                  setUuid={setUuid}
                  pagination={{}}
                  total={canceled_total}
                  _visibleModal={_visibleModal}
                  setVisibleModal={setVisibleModal}
                /></Spin>
            </TabPane>
            <TabPane tab="ĐƠN HÀNG TỪ CHỐI" key="TuChoi" >
              <Spin spinning={isLoading} tip="Đang tải...">
                <TableTuChoi
                  headerColumns={[]}
                  dataBin={rejected}
                  params={params}
                  setParams={setParams}
                  onLoad={getAllTab}
                  uuid={uuid}
                  setUuid={setUuid}
                  pagination={{}}
                  total={rejected.length}
                  _visibleModal={_visibleModal}
                  setVisibleModal={setVisibleModal}
                /></Spin>
            </TabPane>

          </Tabs>
        </div>
      </Col>
      <Drawer
        width={"40%"}
        title="Tra cứu đơn hàng"
        placement="right"
        closable={true}
        onClose={() => { setShowFindOrder(false) }}
        visible={isShowFindOrder}
      >
        <FindOrder />
      </Drawer>
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
