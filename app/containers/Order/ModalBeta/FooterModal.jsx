import React, { memo, useCallback, useState, useEffect } from "react";
import { Row, Col, Button, Space, Modal, Form } from "antd";
import _ from "lodash"
import { DefineTextArea } from "components";
import styled from "styled-components";

const FooterModal = ({
    uuid,
    objOrder,
    onHandleClose,
    onUpdateOrder,
    onHuyDonHang,
    onSaveAndPrint,
    onUpdateOrderByDelivery,
    objPrin,
    onCreateOrder,
    className,
    ActiveTab,
    _setVisibleModal,
    _setVisibleModalTonPhat
}) => {
    const [form] = Form.useForm();
    const [lyDoXoa, SetLyDoXoa] = useState("")
    const [visibleModalDelete, SetVisibleModalDelete] = useState(false)
    let footerContent = "";
    const changeLydo = useCallback((value) => {
        form.setFieldsValue({
            'lyDoXoaDonHang': value
        })
    })

    const onSubmit = async () => {
        let values = await form.validateFields()
        if (values.errorFields) {
            return
        }
        onHuyDonHang(lyDoXoa)
        SetVisibleModalDelete(false)
    }

    useEffect(() => {
        SetLyDoXoa("")
        form.setFieldsValue({
            'lyDoXoaDonHang': null
        })
    }, [visibleModalDelete])
    console.log('ActiveTab', ActiveTab)
    if (uuid === "") {
        footerContent = (
            <Row justify="end" gutter={[8, 8]}>
                <Space size={10} align="center" style={{ marginRight: '7px' }}>
                    <Button type="primary" onClick={onCreateOrder}>Tạo đơn</Button>
                    <Button type="primary" onClick={onSaveAndPrint}>Tạo & in đơn</Button>
                    {/* <Print dataBin={objPrin} isIcon={false} onPrint={autoPrint} onShow={true}/> */}
                </Space>
            </Row>
        )
    } else {
        let ButtonAction = (
            <>
                <div style={{ width: '79px', height: '38px' }} className="div-load"></div>
                <div style={{ width: '79px', height: '38px' }} className="div-load"></div>
            </>
        );
        if (objOrder && objOrder.id) {
            if (objOrder['status'] === 5 || objOrder['status'] === 3 || objOrder['status'] === 4) {
                ButtonAction = ""
            } else {
                if(ActiveTab === 'KhoNhan') {
                    ButtonAction = (
                        <>
                            <Button onClick={() => SetVisibleModalDelete(true)}>Hủy</Button>
                            <Button type="primary" onClick={onUpdateOrder}>Lưu</Button>
                            
                        </>
                    )
                } else if(ActiveTab === 'KhoKetNoi'){
                    ButtonAction = (
                        <>
                            <Button onClick={() => _setVisibleModal(true)}>Phát Hàng</Button>
                            <Button onClick={() => _setVisibleModalTonPhat(true)}>Cập nhật tồn</Button>
                        </>
                    )
                } else {
                    ButtonAction = ("")
                }
            }
        }

        footerContent = (
            <Row justify="end" gutter={[8, 8]}>
                <Space size={10} align="center">
                    {ButtonAction}
                </Space>
                <Form form={form}>
                    <Modal
                        title="Xác nhận hủy đơn hàng"
                        visible={visibleModalDelete}
                        onOk={onSubmit}
                        confirmLoading={''}
                        onCancel={() => SetVisibleModalDelete(false)}
                    >
                        <Form.Item
                            name="lyDoXoaDonHang"
                            initialValue={lyDoXoa}
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập lý do',
                                },
                            ]}
                        >
                            <DefineTextArea
                                placeholder={"Nhập lý do"}
                                value={lyDoXoa}
                                change={(e) => {
                                    let { value } = e.target;
                                    changeLydo(value)
                                    SetLyDoXoa(value);
                                }}
                            />
                        </Form.Item>
                    </Modal>
                </Form>
            </Row>
        )
    }

    return (
        <Row justify="start" gutter={[8, 8]} className={className}>
            <Col span={5}>
                <Button type="danger" onClick={onHandleClose}>Thoát</Button>
            </Col>
            <Col span={19}>
                {footerContent}
            </Col>
        </Row>
    )
}
export default styled(memo(FooterModal))`
    .div-load {
        position: relative;
        animation: myLoad 2s infinite alternate;
    }
    @keyframes myLoad {
        0% { background-color : rgb(245 245 245)}
        25% { background-color : rgb(232 232 232)}
        50% { background-color : rgb(245 245 245)}
        100% { background-color : rgb(232 232 232)}
    }
`;