/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, {useCallback, useState, useEffect} from "react";
import {Row, Col, Button, Form, Input, Space, Select, Modal, Steps, InputNumber, Divider, Timeline } from "antd";
import {DrawerBase, DefineInput, DefineSelect, DefineTextArea, Tabs, TabPane} from "components";
import ServiceBase from 'utils/ServiceBase';
import {Ui} from "utils/Ui";
import {URI} from "utils/constants";
import moment from "moment";
import _ from "lodash"
import {createStructuredSelector} from "reselect";
import {makeSelectProfile} from "containers/App/selectors";
import {connect} from "react-redux";
import {ARR_HTTT_ORDER, JSON_BASE} from "../constants";
import History from './History'
import Tracking from './Tracking'
import Detail from './Detail'
const { Step } = Steps;
const { TextArea } = Input;

/*
 * Modal tạo mới / chi tiết đơn hàng
 *
 * Tạo mới/ Sửa đơn hàng
 *
 */
const OrderModal = ({profile, modal, handleShowModal, uuid, setUuid, isAddToCTable, onAddToCTable, setParams}) => {
  const _handleOnClose = useCallback(() => {
    handleShowModal(false);
  }, [handleShowModal]);
  const [activeKey , SetActiveKey] = useState('DETAIL')
  const [Source, SetSource] = useState([])
  const [objOrder, setObjOrder] = useState(JSON_BASE);
  const [form] = Form.useForm();
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

  const defaultParams = useCallback(async (objParam) => {
    if(uuid){
      setParams()
    }
    setUuid('')
    form.setFieldsValue({
      'destination_id': null,
      'receiverphone': null,
      'senderphone': null,
      'num_of_package': 1,
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
      "num_of_package": 1,
      "payment_type": 1,
      "order_fee": undefined,
      "order_cod": 0,
      "note": undefined
    })
  })
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
  let title = '';
  if (uuid !== "") {
    // Nếu là chỉnh sửa đơn hàng
    title = (
      <Row justify="start" gutter={[8, 8]}>
        <Col span={12}>
          <Space style={{"fontSize": '12px'}}>Tracking lộ trình bill</Space> : {objOrder['code']} <Space
          style={{"fontSize": "20px", "color": "rgba(212, 114, 28, 0.85)"}}>{""}</Space>
        </Col>
      </Row>
    )
  } else {
    // title = "THÊM MỚI ĐƠN HÀNG"
    title = (
      <Row justify="start" gutter={[8, 8]}>
        <Col span={8}>
          THÊM MỚI ĐƠN HÀNG
        </Col>
        <Col span={5} offset={10}>
          <span style={{"fontSize": "13px"}}> NV nhận : {profile.name} </span>
        </Col>
      </Row>
    )
    // Nếu là thêm mới đơn hàng
  }

  const footerConten = function () {
    return (
      <Row justify="end" gutter={[8, 8]}>
        <Space size={10} align="center">
          <Button onClick={""}>Hủy Đơn</Button>
          <Button type="primary" onClick={""}>Lưu</Button>
        </Space>
      </Row>
    )
  }
  let { tracking } = objOrder
  return (
      <DrawerBase
        onClose={_handleOnClose}
        closable={false}
        placement="right"
        visible={modal.get("visible")}
        bodyStyle={{"padding" : "0px"}}
        title={title}
        width="80%"
        footer={
          <Row justify="start" gutter={[8, 8]}>
            <Col span={5}>
              <Button type="danger" onClick={_handleOnClose}>Thoát</Button>
            </Col>
            <Col span={19}>
              
            </Col>
          </Row>
        }
      >
        <div>
          <Tabs
              type="card"
              margin="0px 0px"
              padding="0px"
              onChange={(activeKey) => {
                SetActiveKey(activeKey)
              }}
          >
            <TabPane tab="Chi tiết đơn hàng" key="DETAIL" style={{marginLeft: "20px"}}>
              <Detail objOrder={objOrder} form={form} tabActive={activeKey}/>
            </TabPane>
            <TabPane tab="Tra cứu lộ trình" key="TRACKING"  tabActive={activeKey}>
              <Tracking rowList={tracking ? tracking : [] }/>
            </TabPane>
            {/* <TabPane tab="Lịch sử thay đổi" key="HISTORY" tabActive={activeKey}>
              <History />
            </TabPane> */}
          </Tabs>
        </div>
    </DrawerBase>
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default withConnect(OrderModal);
