import { Form } from "antd";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormGroupCustomer from './FormGroupCustomer';


const AddGroupCustomer = ({
  className,
  onHiddenModal,
  onRefreshList,
  itemSelected,
}) => {
  const [form] = Form.useForm();
  const onFinishFailed = () => {
    // console.log('Failed:', errorInfo);
  };
  const onSave = async (values) => {
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: "v1/common/customer-group",
      data: {
        name: values.name,
        code: values.code,
        price_title_id: values.price_title.key
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
    <FormGroupCustomer
      itemSelected={null}
      onSave={onSave}
      onHiddenModal={onHiddenModal}
    />
  );
};
AddGroupCustomer.propTypes = {
  className: PropTypes.any,
};
export default styled(AddGroupCustomer)`
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
