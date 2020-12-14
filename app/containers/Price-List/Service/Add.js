import { Button, Col, Form, Input, Row, Select, Icon } from "antd";

import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormService from './FormService';

const AddService = ({
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
      url: "v1/common/service-type-product",
      data: { ...values },
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
    <FormService
      itemSelected={null}
      onSave={onSave}
      onHiddenModal={onHiddenModal}
    />
  );
};
AddService.propTypes = {
  className: PropTypes.any,
};
export default styled(AddService)`
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
