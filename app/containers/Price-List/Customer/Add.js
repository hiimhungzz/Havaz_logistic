import { Form } from "antd";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormCustomer from './FormCustomer';


const AddCustomer = ({
  className,
  onHiddenModal,
  onRefreshList,
  itemSelected,
}) => {
  const [form] = Form.useForm();
  const onFinishFailed = () => {
  };
  const onSave = async (values) => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: "v1/common/users",
      data: {
        name: values.name,
        customer_id: values.customer_group && values.customer_group.key,
        phone: values.phone,
        city_id: values.city,
        address: values.address
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      Ui.showSuccess({ message: "Tạo mới thành công" });
      onRefreshList()
      onHiddenModal()
    }
  }
  return (
    <FormCustomer
      itemSelected={null}
      onSave={onSave}
      onHiddenModal={onHiddenModal}
    />
  );
};
AddCustomer.propTypes = {
  className: PropTypes.any,
};
export default styled(AddCustomer)`
  .action {
    position: absolute,
    left: 0,
    width: "100%",
    bottom: 0,
    borderTop: 1px solid #e9e9e9,
    padding: 10px 38px,
    background: #fff,
    textAlign: left,
  }
}`;
