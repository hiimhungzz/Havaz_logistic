/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Button, Form, Input, Space, Select, Modal, Steps, InputNumber, Divider, Timeline, Spin } from "antd";
import { DrawerBase, DefineInput, DefineSelect, ModalDetail, Tabs, TabPane, ModalEditDetail } from "components";
import ServiceBase from 'utils/ServiceBase';
import { Ui } from "utils/Ui";
import { URI } from "utils/constants";
import moment from "moment";
import _ from "lodash"
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { connect } from "react-redux";
import { ARR_HTTT_ORDER, JSON_BASE } from "../constants";
import History from './History'
import Tracking from './Tracking'
import LichSuTon from './LichSuTon'
import Detail from './Detail'
import TitleModal from "./TitleModal"
import FooterModal from "./FooterModal"
import PropTypes from "prop-types";
import styled from "styled-components";
import Print from '../Print'
import { makeSelectDefinitions } from "containers/App/selectors";
// import TrackingTimeline from './TrackingTimeline'
const { Step } = Steps;
const { TextArea } = Input;
import PhatHang from './phatHang'
/*
 * Modal tạo mới / chi tiết đơn hàng
 *
 * Tạo mới/ Sửa đơn hàng
 *
 */

const showLyDo = (items) => {
  let item = {}
  if(items && items.length >= 0){
    item = items[0]
  }
  return item
}
const OrderModal = ({ profile, definitions, modal, handleShowModal, uuid, setUuid, setTabAct, tabAct, setParams, className }) => {
  const _handleOnClose = useCallback(() => {
    handleShowModal(false);
  }, [handleShowModal]);
  let { order_note } = definitions.toJS()
  const [activeKey, SetActiveKey] = useState('DETAIL')
  const [Source, SetSource] = useState([])
  const [objOrder, setObjOrder] = useState({});
  const [objPrin, setObjPrin] = useState(JSON_BASE)
  const [autoPrint, setAutoPrin] = useState(false)
  const [lyDoPhatHang, setLyDoPhatHang] = useState('')
  const [form] = Form.useForm();
  const [lyDoton, setLyDoTon] = useState('')
  const [idLyDo, setIdLyDo] = useState('')
  const [_visibleModalTonPhat, _setVisibleModalTonPhat] = useState(false);
  const getOneOrder = useCallback(async (objParam) => {
    const result = await ServiceBase.requestJson({
      method: 'GET',
      url: `${URI['URI_ORDER_READ']}${uuid}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      let objData = result.value.data;
      let id = objData['destination']['id']
      form.setFieldsValue({
        'destination_id': id,
        'receiverphone': objData['receiver']['phone'],
        'senderphone': objData['sender']['phone'],
        'order_fee': objData['order_fee'],
        'num_of_package': objData['num_of_package'],
      })
      if (_.findLastIndex(Source, ['id', id]) == 0) {
        let addItemSource = Source.push(objData['destination'])
        SetSource(addItemSource);
      }
      result.value.data['destination_id'] = result.value.data['destination']['id']
      // result.value.data[]
      setObjOrder(result.value.data);
    }
  })
  // set defual data
  const defaultParams = useCallback(async (objParam) => {
    if (uuid) {
      setParams()
    }
    setUuid('')
    // setTabAct("")
    setLyDoPhatHang("")
    form.setFieldsValue({
      'destination_id': null,
      'receiverphone': null,
      'senderphone': null,
      'order_fee': null
    })
    setObjOrder({
      "source": {
        "id": undefined,
        "name": undefined
      },
      "destination": {
        "id": undefined,
        "name": undefined
      },
      "status": 1,
      "sender": {
        "phone": undefined,
        "name": undefined,
        "address": null
      },
      "receiver": {
        "phone": undefined,
        "name": undefined,
        "address": null
      },
      "items": [{
        "description": "Kiện 1",
        "type_of": null,
        "fee": null,
        num_of_package: null,
        quantity: null
      }],
      "payment_type": null,
      "order_fee": {
        "paying_side": null,
        "amount": null
      },
      "cod_fee": {
        "paying_side": null,
        "amount": null
      },
      "order_cod": 0,
      discount: 0,
      "note": undefined,
      "r_shipping_fee": {
        "paying_side": null,
        "amount": null
      },
      "d_shipping_fee": {
        "paying_side": null,
        "amount": null
      }
    })
  })

  // update xử lý hàng
  const UpdateOrderByIssue = useCallback(async (reason) => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${uuid}/mark-issue`,
      data: {
        type: reason
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật trạng thái phát thành công' });
      _handleOnClose(false);
    }
  }, [objOrder, uuid])

  // update phát hàng không thành công
  const onUpdateOrderByUndelivery = useCallback(async (reason) => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${uuid}/undelivery`,
      data: {
        reason: reason
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật trạng thái phát thành công' });
      _handleOnClose(false);
    }
  }, [objOrder])

  // update phát hàng
  const UpdateOrderByDelivery = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${uuid}/delivery`,
      data: {
        note: lyDoPhatHang
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật trạng thái phát thành công' });
      _handleOnClose(false);
    }
  }, [lyDoPhatHang, uuid])

  useEffect(() => {
    if (modal.get('visible')) {
      if (uuid) {
        getOneOrder(uuid)
      }
    } else {
      defaultParams()
    }
  }, [modal.get('visible')])
  /**
   * Hiển thị title
   */
  const onUpdateLydo = useCallback(async () => {
    
    const result = await ServiceBase.requestJson({
        method: "POST",
        url: `/v1/orders/${uuid}/receive-note`,
        data: {
          note : lyDoton,
          reason_id : idLyDo,
        },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật lý do tồn thành công'});
      handleShowModal(false);
      setLyDoTon("")
      setIdLyDo(null)
      _setVisibleModalTonPhat(false)
    }
  }, [ uuid, lyDoton, idLyDo])
  
  let { tracking } = objOrder
  let _Detail = "",
    _TabPhatHang = "",
    _tabLichSuTon = "",
    _Tracking= "";
  if (uuid !== "") {
    if (objOrder && objOrder.id) {
      // _Detail = (<ModalDetail objOrder={objOrder} setObjOrder={setObjOrder} form={form} tabActive={activeKey} />)
      _Detail = (<ModalEditDetail objOrder={objOrder} form={form} setObjOrder={setObjOrder}/>)
      // _Tracking = (<TrackingTimeline tracking={tracking ? tracking : []}/>)
    } else {
      // _Detail = (<div className="load-spin">
      //             <Spin />
      //           </div>)
      _Detail = (
        <Row justify="start" gutter={[24, 32]}>
          <Col span={12}>
            <div style={{ width: '100%', height: '41px', marginLeft: '12px' }} className="div-load-hd"></div>
            <div style={{ width: '100%', height: '165px', marginLeft: '12px' }} className="div-load"></div>
          </Col>
          <Col span={12}>
            <div style={{ width: '98%', height: '41px', paddingRight: '12px' }} className="div-load-hd"></div>
            <div style={{ width: '98%', height: '165px', paddingRight: '12px' }} className="div-load"></div>
          </Col>
          <Col span={24}>
            <div style={{ width: '98%', height: '41px', marginLeft: '12px', paddingRight: '12px' }} className="div-load-hd"></div>
            <div style={{ width: '98%', height: '165px', marginLeft: '12px', paddingRight: '12px' }} className="div-load"></div>
          </Col>
          <Col span={24}>
            <div style={{ width: '98%', height: '41px', marginLeft: '12px', paddingRight: '12px' }} className="div-load-hd"></div>
            <div style={{ width: '98%', height: '165px', marginLeft: '12px', paddingRight: '12px' }} className="div-load"></div>
          </Col>
        </Row>
      )
      _Tracking = ("")
    }
  } else {
    _Detail = (<TabPane tab="Phát hàng" key="phat-hang">
      <PhatHang setObjOrder={setObjOrder} form={form}  objOrder={objOrder} setLyDoPhatHang={setLyDoPhatHang} lyDoPhatHang={lyDoPhatHang}></PhatHang>
    </TabPane>)
  }
  if (tabAct === "HangPhat") {
    _TabPhatHang = (<TabPane tab="Phát hàng" key="phat-hang">
      <PhatHang setObjOrder={setObjOrder} form={form} objOrder={objOrder} setLyDoPhatHang={setLyDoPhatHang} lyDoPhatHang={lyDoPhatHang}></PhatHang>
    </TabPane>)

    _tabLichSuTon = (<TabPane tab="Lịch sử tồn" key="LIH_SU">
        <LichSuTon rowList={objOrder?.order_note }/>
    </TabPane>)
  }
  // console.log('render > index modal')
  // console.log('tabAct', tabAct)
  return (
    <>
      <DrawerBase
        destroyOnClose
        onClose={_handleOnClose}
        closable={false}
        placement="right"
        visible={modal.get("visible")}
        bodyStyle={{ "padding": "0px" }}
        title={<TitleModal objOrder={objOrder} uuid={uuid} />}
        width="80%"
        footer={<FooterModal
          uuid={uuid}
          objOrder={objOrder}
          onUpdateOrderByDelivery={UpdateOrderByDelivery}
          onHandleClose={_handleOnClose}
          onUpdateOrderByIssue={(reason) => UpdateOrderByIssue(reason)}
          onUpdateOrderByUndelivery={(reason) => onUpdateOrderByUndelivery(reason)}
          _setVisibleModalTonPhat={_setVisibleModalTonPhat}
        />}
        className={className}
      >
        <div>
          <Modal
            title="Lý do tồn"
            visible={_visibleModalTonPhat}
            onOk={() => onUpdateLydo()}
            onCancel={() => {_setVisibleModalTonPhat(false)}}
          >
            <Col span={24} className="col-23-fix">
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Lý do tồn"
                optionFilterProp="children"
                onChange={(i) => setIdLyDo(i)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  _.map(order_note, (i) => {
                    return(<Option value={i.key}>{i.text}</Option>)
                  })
                }
              </Select>
            </Col>
            <Col span={24} className="col-23-fix">
              <TextArea
                  disabled={false}
                  placeholder={'Nhập lý do tồn'}
                  autoSize={{
                      minRows: 3,
                      maxRows: 3
                  }}
                  value={lyDoton}
                  onChange={(e) => {
                      let { value } = e.target;
                      setLyDoTon(value)
                  }
                  }
              />
            </Col>
          </Modal>
          <Tabs
            type="card"
            onChange={(activeKey) => {
              SetActiveKey(activeKey)
            }}
          >
            {/* <TabPane tab="Chi tiết" key="DETAIL">
              {
                _Tracking
              }
            </TabPane> */}
            {
              _TabPhatHang
            }
            
            <TabPane tab="Chi tiết đơn hàng" key="DETAIL">
              {
                _Detail
              }
            </TabPane>
            <TabPane tab="Tra cứu lộ trình" key="TRACKING" tabActive={activeKey}>
              <Tracking rowList={tracking ? tracking : []} />
            </TabPane>
            {
              _tabLichSuTon
            }
          </Tabs>
        </div>
      </DrawerBase>
      {/* <Print dataBin={objPrin} isIcon={false} onPrint={autoPrint} onShow={true}/> */}
    </>
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  definitions: makeSelectDefinitions(),
});
OrderModal.propTypes = {
  className: PropTypes.any
};
const withConnect = connect(
  mapStateToProps,
  null
);
export default styled(withConnect(OrderModal))`
  .ant-drawer-header {
    padding-top: 4px !important;
    padding-bottom: 0px !important;
  }
  .load-spin {
    text-align: center;
    background: rgba(0, 0, 0, 0.05);
    height: 100%
  }
  .div-load-hd {
    position: relative;
    animation: myLoadHD 2.5s infinite alternate;
  }
  .div-load {
    position: relative;
    animation: myLoad 2.5s infinite alternate;
  }

  @keyframes myLoad {
      0% { background-color : rgb(245 245 245)}
      25% { background-color : rgb(232 232 232)}
      50% { background-color : rgb(245 245 245)}
      100% { background-color : rgb(232 232 232)}
  }
  
  @keyframes myLoadHD {
    0% { background-color : rgb(232 232 232)}
    25% { background-color : rgb(156 156 156)}
    50% { background-color : rgb(232 232 232)}
    100% { background-color : rgb(156 156 156)}
}
`;
