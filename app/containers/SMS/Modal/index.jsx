/**
 * Copyright 2020-present, TIENDUC.
 * All rights reserved.
 * @author ductt.it.hust@gmail.com on 27/06/2020.
 */

import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Button, Form, Input, Space, Select, Modal, InputNumber } from "antd";
import { DrawerBase, DefineInput, DefineSelect, DefineTextArea } from "components";
import { ARR_HTTT_ORDER, JSON_BASE } from "../constants";
import ServiceBase from 'utils/ServiceBase';
import { Ui } from "utils/Ui";
import { URI } from "utils/constants";
import moment from "moment";
import _ from "lodash"
import { createStructuredSelector } from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import { connect } from "react-redux";
const { TextArea } = Input;

const { Option } = Select;

/*
 * Modal tạo mới / chi tiết đơn hàng
 *
 * Tạo mới/ Sửa đơn hàng
 *
 */
const OrderModal = ({ profile, modal, handleShowModal, uuid, setUuid, isAddToCTable, onAddToCTable, setParams }) => {
  let _temObj = JSON_BASE;
  const [form] = Form.useForm();
  const _handleOnClose = useCallback(() => {
    handleShowModal(false);
  }, [handleShowModal]);

  const [OrderStatus, SetOrderStatus] = useState([])
  const [Source, SetSource] = useState([])
  const [lyDoHuyDon, set_lyDoHuyDon] = useState([
    {
      name: "Mất hàng",
      key: "mat-hang"
    },
    {
      name: "Hỏng hàng",
      key: "hong-hang"
    },
    {
      name: "Khách không đến lấy",
      key: "khong-lay"
    }
  ])
  const [objOrder, setObjOrder] = useState(_temObj);
  const [strSelectVP, setStrSelectVP] = useState("");
  // change form data 
  const fillter = useCallback(
    (value, name) => {
      setObjOrder((props) => {
        let nextState = { ...props };
        let strName = name.split('.')
        if (strName.length === 1) {
          nextState[name] = value;
        } else {
          nextState[strName[0]][strName[1]] = value
        }
        return nextState;
      });
    },
    [setObjOrder]
  );
  // get data trạng thái đơn hàng
  const getListOrder = useCallback(async (objParam) => {
    SetOrderStatus(ARR_HTTT_ORDER)
  })
  // get data danh sách văn phòng
  const getlistSource = useCallback(async (objParam) => {
    const result = await ServiceBase.requestJson({
      method: "GET",
      url: URI['URI_VP'],
      data: {
        q: strSelectVP,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      SetSource(result.value.data);
    }
  })
  // set defual form data
  const defaultParams = useCallback(async (objParam) => {
    if (uuid) {
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
  // get data for api list vp
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
  // search vp timeout 800 ms
  let fnTimeOut;
  const searchTimeOut = function (value) {
    window.clearTimeout(fnTimeOut);
    fnTimeOut = window.setTimeout(function () {
      setStrSelectVP(value)
    }, 800);
  }

  const CreateOrder = useCallback(async () => {
    const values = await form.validateFields()
    if (values.errorFields) {
      return
    }
  }, [form, objOrder, defaultParams, isAddToCTable, handleShowModal, modal, onAddToCTable]);

  const transferCOD = useCallback(async () => {
    console.log(objOrder)
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `/v1/orders/${objOrder['code']}/transfer-cod`,
      data: {},
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: 'Cập nhật trạng COD thành công' });
      _handleOnClose(false);
    }
  }, [objOrder])


  useEffect(() => {
    if (modal.get('visible')) {
      getListOrder()
      getlistSource()
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
    let { creator, created_at } = objOrder
    if (creator) {
      let { name } = creator
    }
    // Nếu là chỉnh sửa đơn hàng
    title = (
      <Row justify="start" gutter={[8, 8]}>
        <Col span={12}>
          <Space style={{ "fontSize": '12px' }}>CHI TIẾT ĐƠN HÀNG</Space> : <Space
            style={{ "fontSize": "20px", "color": "rgba(212, 114, 28, 0.85)" }}>{objOrder['code']}</Space>
        </Col>
        <Col span={8} offset={3}>
          <span style={{ "fontSize": "13px" }}> NV nhận : {profile.name}</span>
        </Col>
        <Col span={12}>
        </Col>
        <Col span={8} offset={3}>
          <span
            style={{ "fontSize": "13px" }}> Thời gian tạo đơn : {moment(created_at).format('DD-MM-YYYY HH:mm')} </span>
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
          <span style={{ "fontSize": "13px" }}> NV nhận : {profile.name} </span>
        </Col>
      </Row>
    )
    // Nếu là thêm mới đơn hàng
  }

  const footerConten = function () {
    if (uuid === '') {
      return (
        <Row justify="end" gutter={[8, 8]}>
          <Space size={10} align="center">
            <Button type="primary" onClick={CreateOrder}>Tạo đơn</Button>
            <Button type="primary">Tạo & In đơn</Button>
          </Space>
        </Row>
      )
    } else {
      return (
        <Row justify="end" gutter={[8, 8]}>
          <Space size={10} align="center">
            <Button type="primary" onClick={transferCOD}>Trả COD</Button>
          </Space>
        </Row>
      )
    }
  }
  return (
    <Form form={form}>
      <DrawerBase
        onClose={_handleOnClose}
        closable={false}
        placement="right"
        visible={modal.get("visible")}
        title={title}
        width="70%"
        footer={
          <Row justify="start" gutter={[8, 8]}>
            <Col span={5}>
              <Button type="danger" onClick={_handleOnClose}>Thoát</Button>
            </Col>
            <Col span={19}>
              {
                footerConten()
              }
            </Col>
          </Row>
        }
      >
        <Row justify="start" gutter={[24, 32]}>
          <Col span={9} style={{ "fontSize": "17px" }}>Thông tin khách</Col>
        </Row>
        <Row justify="start" gutter={[24, 24]}>
          <Col span={6}>
            <span>VP đích <span style={{ color: '#dc2d2d' }}>(*)</span></span>
            <Form.Item
              name="destination_id"
              initialValue={objOrder['destination']['id']}
              rules={[
                {
                  required: true,
                  message: 'Hãy chọn VP đích',
                },
              ]}
            >
              <Select
                placeholder="Chọn VP đích"
                showSearch
                disabled={true}
                onChange={(e) => {
                  fillter(e, 'destination_id')
                }
                }
                filterOption={(input, option) =>
                  option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSearch={
                  (e) => {
                  }
                }
                value={objOrder['destination']['id']}
                _key={'destination_id'}
              >
                {
                  _.map(Source, (i) => {
                    return (<Option key={i['key'] ? i['key'] : i['id']}
                      value={i['key'] ? i['key'] : i['id']}>{i['name']} </Option>)
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <span>
              Địa chỉ nhận
            </span>
            <Input
              value={objOrder['receiver']['address']}
              placeholder="Địa chỉ nhận hàng"
              disabled={true}
              _key={'receiver_address'}
            />
          </Col>
        </Row>
        <Row justify="start" gutter={[24, 24]}>
          <Col span={6}>
            <span>SĐT người nhận <span style={{ color: '#dc2d2d' }}>(*)</span></span>
            <Form.Item
              name="receiverphone"
              initialValue={objOrder['receiver']['phone']}
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập SĐT',
                },
              ]}
            >
              <Input
                _key={'receiverphone'}
                value={objOrder['receiver']['phone']}
                placeholder="SĐT"
                disabled={true}
                onChange={(e) => {
                  let { value } = e.target;
                  fillter(value, 'receiver.phone')
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <span>Họ tên người nhận</span>
            <Input
              value={objOrder['receiver']['name']}
              placeholder="Họ tên"
              _key={'receiver.name'}
              disabled={true} />
          </Col>
          <Col span={6}>
            <span>SĐT người gửi <span style={{ color: '#dc2d2d' }}>(*)</span></span>
            <Form.Item
              name="senderphone"
              initialValue={objOrder['sender']['phone']}
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập SĐT',
                },
              ]}
            >
              <Input
                _key={'sender.phone'}
                value={objOrder['sender']['phone']}
                placeholder="SĐT"
                disabled={true}
                onChange={(e) => {
                  let { value } = e.target;
                  fillter(value, 'sender.phone')
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <span>Họ tên người gửi</span>
            <Input
              value={objOrder['sender']['name']}
              placeholder="Họ tên"
              _key={'sender.name'}
              disabled={true} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ "borderTop": "2px dotted" }}></Col>
        </Row>
        <Row justify="start" gutter={[24, 24]} style={{ "marginTop": "20px" }}>
          <Col span={9} style={{ "fontSize": "17px" }}>Thông tin hàng & thanh toán</Col>
        </Row>
        <Row justify="start" gutter={[24, 24]}>
          <Col span={6}>
            <span>Số kiện <span style={{ color: '#dc2d2d' }}>(*)</span></span>
            <Form.Item
              name="num_of_package"
              initialValue={objOrder['num_of_package']}
              value={objOrder['num_of_package']}
              rules={[
                {
                  required: true,
                  message: "Nhập số kiện",
                },
              ]}
            >
              <Input
                _key={'num_of_package'}
                value={objOrder['num_of_package']}
                placeholder="Nhập số kiện"
                disabled={true}
                onChange={(e) => {
                  let { value } = e.target;
                  fillter(value, 'num_of_package')
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <span>Cước phí(VNĐ) <span style={{ color: '#dc2d2d' }}>(*)</span></span>
            <Form.Item
              name="order_fee"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: 'Nhập Cước phí',
                },
              ]}
            >
              <InputNumber
                _key={'order_fee'}
                value={objOrder['order_fee']}
                placeholder="0"
                disabled={true}
                style={{ "width": "100%" }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(e) => {
                  fillter(e, 'order_fee')
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <span>COD</span>
            <InputNumber
              value={objOrder['order_cod']}
              placeholder="0"
              _key={'order_cod'}
              style={{ "width": "100%" }}
              disabled={true}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(e) => {
                fillter(e, 'order_cod')
              }
              } />
          </Col>
          <Col span={6}>
            <span>HTTT</span>
            <DefineSelect
              placeholder=""
              dataBin={OrderStatus}
              disabled={true}
              change={(e) => {
                fillter(e, 'payment_type')
              }
              }
              value={objOrder['payment_type']}
            />
          </Col>
        </Row>
        <Row justify="start" gutter={[24, 8]}>
        </Row>
        <Row justify="start" gutter={[24, 8]}>
          <Col span={24}>
            <span>Ghi chú</span>
            <TextArea
              disabled={true}
              placeholder={""}
              value={objOrder['note']}
            />
          </Col>
        </Row>
      </DrawerBase>
    </Form>
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
