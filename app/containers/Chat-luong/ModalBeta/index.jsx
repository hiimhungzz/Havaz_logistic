/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, {useCallback, useState, useEffect} from "react";
import {Row, Col, Form, Card  } from "antd";
import {DrawerBase, Tabs, TabPane, ModalDetail} from "components";
import ServiceBase from 'utils/ServiceBase';
import {Ui} from "utils/Ui";
// import _ from "lodash";
import {createStructuredSelector} from "reselect";
import {makeSelectProfile} from "containers/App/selectors";
import {connect} from "react-redux";
import Tracking from './Tracking';
import TitleModal from "./TitleModal";
import FooterModal from "./FooterModal";
import PropTypes from "prop-types";
import styled from "styled-components";
import DefineThongTinMatHang from "./ThongTinMatHang"

/*
 * Modal tạo mới / chi tiết đơn hàng
 *
 * Tạo mới/ Sửa đơn hàng
 *
 */
const OrderModal = ({modal, handleShowModal, uuid, setUuid, setParams, className}) => {
  
  const [activeKey , SetActiveKey] = useState('DETAIL')
  const [objIssues, setObjIssues] = useState({});
  const [form] = Form.useForm();

  const _handleOnClose = useCallback(() => {
    form.resetFields()
    handleShowModal(false);
    setUuid("")
    setParams()
  }, [handleShowModal, form, setUuid, setParams]);

  const getOneIssues = useCallback(async (objParam) => {
    const result = await ServiceBase.requestJson({
      method: 'GET',
      url: `/v1/issues/${uuid}`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setObjIssues(result.value.data);
    }
  },[uuid])

  // update COD
  const onUpdateIssues = useCallback(async (reason) => {
    const values = await form.validateFields()
    if (values.errorFields) {
      return
    }

    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/issues/${uuid}/update`,
      data: objIssues,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật thành công'});
      _handleOnClose(false);
    }
  }, [objIssues, uuid, _handleOnClose, form])

  const onResolveIssues = useCallback(async () => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/issues/${uuid}/resolve`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật thành công'});
      _handleOnClose(false);
    }
  },[uuid,_handleOnClose])
  useEffect(() => {
    if (modal.get('visible')) {
      if (uuid) {
        getOneIssues(uuid)
      }
    }
  }, [modal.get('visible')])
  /**
   * Hiển thị title
   */
  let { tracking, order } = objIssues
  let _Detail = "";
  // console.log(objOrder)
  if(uuid !== ""){
    if(order && order.id){
      _Detail = (
        <>
          <ModalDetail objOrder={order} setObjOrder={setObjIssues} form={form} tabActive={activeKey} _disabled="true" isShowIssues="true"/>
          <Form className={className} style={{'backgroundColor': 'rgba(236, 236, 235, 0.45)'}}>
            <Row justify="start" gutter={[24, 32]}>
              <Col span={24} style={{padding :'38px 24px !important'}}>
                <Card title="Lý do mất hàng/hỏng hàng" bordered={true} headStyle={{backgroundColor: 'rgba(233, 195, 43, 0.7)'}} bodyStyle={{paddingLeft: '12px', paddingRight: '12px'}}>
                    <DefineThongTinMatHang _issues={objIssues} SetIssues={setObjIssues} form={form}/>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      )
    } else {
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
  }
  // console.log('render > index modal')
  return (
    <>
      <DrawerBase
        destroyOnClose
        onClose={_handleOnClose}
        closable={false}
        placement="right"
        visible={modal.get("visible")}
        bodyStyle={{"padding" : "0px"}}
        title={<TitleModal objOrder={objIssues} uuid={uuid}/>}
        width="80%"
        footer={<FooterModal  
                  uuid={uuid}
                  objOrder={objIssues}
                  onUpdateIssues={onUpdateIssues}
                  onResolveIssues={onResolveIssues}
                  onHandleClose={_handleOnClose}
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
    {/* <Print dataBin={objPrin} isIcon={false} onPrint={autoPrint} onShow={true}/> */}
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
  .ant-row-start {
    margin: 0px !important;
  }
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
