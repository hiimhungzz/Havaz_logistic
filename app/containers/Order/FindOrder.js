import React, { useState, useCallback, useEffect, memo } from "react";
import { Row, Col, Button, Form, InputNumber } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import OfficeStaffSelect from "components/Select/OfficeStaffSelect/Loadable";
import ServiceTypeSelect from "components/Select/ServiceTypeSelect/Loadable";
import CustomerSelect from "components/Select/CustomerSelect/Loadable";
import {createStructuredSelector} from "reselect";
import { makeSelectProfile } from "containers/App/selectors";
import {connect} from "react-redux";
import { formatNumber } from "utils/helper";

/*
 * Danh sách đơn hàng
 *
 * Hiển thị danh sách đơn hàng, at the '/orders' route
 *
 */
const FindOrder = memo(({ className, definitions, profile }) => {
    const [amount, setAmount] = useState(null);
    const [loaddingBtn, setLoaddingBtn] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoaddingBtn(true)
        const params = {
            source_id: values.source.key,
            destination_hub: values.destination_hub.value,
            service_type_id: values.service_type_product.value,
            quantity: values.quantity,
            customer_id: values.customer ? parseInt(values.customer.value) : 0,
            scope: 'tracking',
        }
        console.log("values", values)
        const result = await ServiceBase.requestJson({
            method: "GET",
            url: "v1/price-matrix/get-price",
            data: params,
        });
        if (result.hasErrors) {
            Ui.showErrors(result.errors);
        } else {
            setLoaddingBtn(false)
            setAmount(result.value.amount)
        }
        setLoaddingBtn(false)
    };
    const onFinishFailed = () => {
        // console.log('Failed:', errorInfo);
    };


    useEffect(() => {
    }, []);

    return (
    <div className={className}>
        <Form
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            name="control-hooks"
            initialValues={{
               source: {
                key: profile && profile.current_hub.id,
                label: profile && profile.current_hub.name,
               },
               destination_hub: undefined,
               quantity: undefined,
               customer: undefined,
               service_type_product: undefined,
            }}
            form={form}
            >
            <Row gutter={[16, 16]}>
                <Col xs={6}>
                    <div className="label">Gửi từ</div>
                    <div className="label">Gửi đến</div>
                    <div className="label">Loại hàng</div>
                    <div className="label">Số lượng (đơn vị)</div>
                    <div className="label">Mã khách hàng</div>
                </Col>
                <Col span={18}>
                <Form.Item
                    rules={[ { required: true, message: 'Hãy chọn văn phòng', }, ]}
                    name="source"
                >
                   <OfficeStaffSelect
                        placeholder="Gửi từ văn phòng"
                        allowClear
                        loadOnMount
                    />
                </Form.Item>
                <Form.Item name="destination_hub"
                    rules={[ { required: true, message: 'Hãy chọn văn phòng', }, ]}
                >
                   <OfficeStaffSelect
                        placeholder="Gửi đến văn phòng"
                        allowClear
                        loadOnMount
                    />
                </Form.Item>
                <Form.Item name="service_type_product"
                    rules={[
                        { required: true, message: 'Hãy nhập loại hàng', },
                    ]}
                >
                    <ServiceTypeSelect
                        placeholder="Loại hàng"
                        allowClear
                        loadOnMount
                    />
                </Form.Item>
                <Form.Item name="quantity"
                    rules={[
                        { required: true, message: 'Hãy nhập số lượng', },
                    ]}
                >
                    <InputNumber style={{width: '100%'}} placeholder={"Số lượng (đơn vị)"} />
                </Form.Item>
                <Form.Item name="customer">
                    <CustomerSelect
                        placeholder="Mã khách hàng"
                        allowClear
                        loadOnMount
                    />
                </Form.Item>
                </Col>
            </Row>
            <Row align="center" gutter={[16, 16]}>
                <Button loading={loaddingBtn} style={{width: '80%'}} htmlType="submit"
                    type="primary">Tra cứu</Button>
            </Row>
            {
                amount && <div style={{fontWeight: 'bold', fontSize: 20}}>{`Giá cước:       ${formatNumber(amount)}`}</div>
            }
        </Form>
    </div>
    );
});

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
});

const withConnect = connect(
    mapStateToProps,
    null
);

FindOrder.propTypes = {
  className: PropTypes.any,
};
export default styled(withConnect(FindOrder))`
  .label {
    font-weight: bold;
    min-height: 32px;
    margin-bottom: 24px;
  }
`;



