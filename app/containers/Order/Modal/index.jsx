/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, {useCallback, useState, useEffect} from "react";
import {Row, Col, Button, Form, Input, Space, Select, Modal, Steps, InputNumber, Divider, Timeline, Spin  } from "antd";
import {DrawerBase, ModalDetail, Tabs, TabPane, ModalEditDetail} from "components";
import ServiceBase from 'utils/ServiceBase';
import {Ui} from "utils/Ui";
import {URI} from "utils/constants";
import moment from "moment";
import _ from "lodash"
import {createStructuredSelector} from "reselect";
import {makeSelectProfile} from "containers/App/selectors";
import {connect} from "react-redux";
import {ARR_HTTT_ORDER, JSON_BASE, formatDataSubmit} from "../constants";
// import PhatHang from './phatHang'
import Tracking from './Tracking'
import TitleModal from "./TitleModal"
import FooterModal from "./FooterModal"
import PropTypes from "prop-types";
import styled from "styled-components";
import Print from '../PrintBeta'
const { Step } = Steps;
const { TextArea } = Input;

/*
 * Modal tạo mới / chi tiết đơn hàng
 *
 * Tạo mới/ Sửa đơn hàng
 *
 */
const OrderModal = ({profile, modal, handleShowModal, uuid, setUuid, isAddToCTable, onAddToCTable, setParams, className,setVisibleModal}) => {
  const _handleOnClose = useCallback(() => {
    handleShowModal(false);
  }, [handleShowModal]);
  const [activeKey , SetActiveKey] = useState('DETAIL')
  const [Source, SetSource] = useState([])
  const [objOrder, setObjOrder] = useState({});
  const [objPrin, setObjPrin] = useState(JSON_BASE)
  const [ autoPrint, setAutoPrin] = useState(false)
  const [ isLoad, setLoad] = useState(false)
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
        'order_fee': objData['order_fee']['amount'],
        'num_of_package': objData['num_of_package'],
        'discount': objData['discount'],
        'payment_type' : objData['order_fee']['paying_side'],
        'cod_fee' : objData['cod_fee']['paying_side'],
        'r_shipping_fee' : objData['r_shipping_fee']['paying_side'],
        'd_shipping_fee' : objData['d_shipping_fee']['paying_side'],
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
    if(uuid){
      setParams()
    }
    setUuid('')
    form.setFieldsValue({
      'destination_id': null,
      'receiverphone': null,
      'senderphone': null,
      'order_fee': null,
      'discount': null,
      'payment_type': null,
      'cod_fee': null,
      'r_shipping_fee': null,
      'd_shipping_fee': null,
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
      "items" : [{
        "description": null,
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
      "cod_fee":  {
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
  const getOrderAndPrint = async (uuidPrint)=> {
    const result = await ServiceBase.requestJson({
      method: 'GET',
      url: `${URI['URI_ORDER_READ']}${uuidPrint}`,
      data: {},
    });
    if (!result.hasErrors) {
      setVisibleModal((preState) => {
        let nextState = { ...preState };
        nextState.isShow = true;
        nextState.dataItem = result.value.data;
        return nextState
      });
    }
  }
  // update phát hàng
  const UpdateOrderByDelivery = useCallback(async () => {
    const result = await ServiceBase.requestJson({
        method: "POST",
        url: `/v1/orders/${uuid}/delivery`,
        data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật trạng thái phát thành công'});
      handleShowModal(false);
    }
  }, [ uuid])
  //  Thêm mới đơn hàng
  const CreateOrder = useCallback(async (isPrint) => {
    const values = await form.validateFields()
    if (values.errorFields) {
      return
    }
    if(isLoad){
      return
    }
    await setLoad(true)
    let tempData = formatDataSubmit(objOrder); 
    console.log(objOrder)
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: URI['URI_ORDER_CREATE'],
      data: tempData,
    });
    
    if (result.hasErrors) {
      await setLoad(false)
      Ui.showErrors(result.errors);
    } else {
      await setLoad(false)
      if(isPrint === true){
        getOrderAndPrint(result.value.order_id)
      }
      // SetSource(result.value.data);
      defaultParams()
      if (isAddToCTable) {

        let order = {
          index: modal.get('cTableIndex'),
          cTableId: modal.get('cTableId'),
          order_id: result.value.order_id,
          num_of_package: objOrder.num_of_package,
          receiver_address: objOrder.receiver_address,
          order_fee: objOrder.order_fee,
        }
        onAddToCTable(order)
      }
      if(handleShowModal) {
        handleShowModal(false)
      }
      Ui.showSuccess({ message: 'Tạo mới đơn hàng thành công.' });
      setParams()
      handleShowModal(false)
    }
  }, [objOrder, isLoad]);

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
  
  // Hủy đơn hàng 
  const CancelOrder = useCallback(async (lyDoXoa) => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${uuid}/cancel`,
      data: {
        "reason": lyDoXoa
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Hủy đơn hàng thành công.' });
      handleShowModal(false)
      setParams()
    }
  }, [uuid])
  // update đơn hàng
  const UpdateOrder = useCallback(async () => {
    const values = await form.validateFields()
    if (values.errorFields) {
      return
    }
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${uuid}/update`,
      data: objOrder,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      SetSource(result.value.data);
      defaultParams()
      Ui.showSuccess({ message: 'Update đơn hàng thành công.' });
      handleShowModal(false)
    }
  }, [objOrder])

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
  const huyDonHang = (lyDoXoa) => {
    CancelOrder(lyDoXoa)
  }
  const saveAndPrint = () =>{
    CreateOrder(true)
  }
  const showModal = (isShow) => {
    Set_visibleOrder(isShow);
  };

  let { tracking } = objOrder
  let _Detail = "";
  if(uuid !== ""){
    if(objOrder && objOrder.id){
      _Detail = (<ModalEditDetail objOrder={objOrder} form={form} setObjOrder={setObjOrder}/>)
      // _Detail = (<ModalDetail objOrder={objOrder} setObjOrder={setObjOrder} form={form} tabActive={activeKey}/>)
    } else {
      // _Detail = (<div className="load-spin">
      //             <Spin />
      //           </div>)
      _Detail = (
        <Row justify="start" gutter={[24, 32]}>
             <Col span={12}>
                <div style={{width: '100%', height: '41px', marginLeft: '12px'}} className="div-load-hd"></div>
                <div style={{width: '100%', height: '165px' , marginLeft: '12px'}} className="div-load"></div>
             </Col>
             <Col span={12}>
                <div style={{width: '98%', height: '41px', paddingRight: '12px'}} className="div-load-hd"></div>
                <div style={{width: '98%', height: '165px', paddingRight: '12px'}} className="div-load"></div>
             </Col>
             <Col span={24}>
                <div style={{width: '98%', height: '41px', marginLeft: '12px',paddingRight: '12px'}} className="div-load-hd"></div>
                <div style={{width: '98%', height: '165px' , marginLeft: '12px', paddingRight: '12px'}} className="div-load"></div>
             </Col>
             <Col span={24}>
                <div style={{width: '98%', height: '41px', marginLeft: '12px', paddingRight: '12px'}} className="div-load-hd"></div>
                <div style={{width: '98%', height: '165px' , marginLeft: '12px', paddingRight: '12px'}} className="div-load"></div>
             </Col>
        </Row>
      )
    }
  } else {
    _Detail = (<ModalDetail objOrder={objOrder} setObjOrder={setObjOrder} form={form} tabActive={activeKey}/>)
  }
  // console.log('render > index modal', objOrder)
  return (
    <>
      <DrawerBase
        destroyOnClose
        onClose={_handleOnClose}
        closable={false}
        placement="right"
        visible={modal.get("visible")}
        bodyStyle={{"padding" : "0px"}}
        title={<TitleModal objOrder={objOrder} uuid={uuid}/>}
        width="80%"
        footer={<FooterModal  
                  uuid={uuid}
                  objOrder={objOrder}
                  onUpdateOrder={UpdateOrder} 
                  onHandleClose={_handleOnClose}
                  onCreateOrder={CreateOrder}
                  onSaveAndPrint={saveAndPrint}
                  onHuyDonHang={(lyDoXoa)=> huyDonHang(lyDoXoa)}
                  onUpdateOrderByDelivery={UpdateOrderByDelivery}
                  onUpdateOrderByIssue={UpdateOrderByIssue}
                  objPrin={objPrin}
                  autoPrint={autoPrint}
                />}
        className={className}
      >
        <div>
          <Tabs
              type="card"
              onChange={(activeKey) => {
                SetActiveKey(activeKey)
              }}
          >
            {/* <TabPane tab="Phát hàng" key="phat-hang">
              <PhatHang objOrder={objOrder}></PhatHang>
            </TabPane> */}
            <TabPane tab="Chi tiết đơn hàng" key="DETAIL">
              {
                _Detail
              }
            </TabPane>
            <TabPane tab="Tra cứu lộ trình" key="TRACKING"  tabActive={activeKey}>
              <Tracking rowList={tracking ? tracking : [] }/>
            </TabPane>
          </Tabs>
        </div>
    </DrawerBase>
    <Print dataBin={objPrin} isIcon={false} onPrint={autoPrint} onShow={true}/>
    </>
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
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
