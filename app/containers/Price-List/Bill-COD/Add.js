import { Button, Col, Form, Input, Row, Select, Icon } from "antd";

import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import FormBillCod from './FormBillCod';

const AddService = ({
  className,
  onHiddenModal,
  onRefreshList,
  itemSelected,
  data,
}) => {
  const [form] = Form.useForm();
  const onFinishFailed = () => {
  };
  const onSave = async (values) => {
    console.log("valuesxsxsxsx", values);

    const value_cod = parseInt(values.value);

    const type = values.type ? 0 : 1
    console.log("value_cod", value_cod);
    console.log("type", type);
    if ((type === 0 && value_cod <= 100) || type === 1) {
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: "v1/cod/cods",
        data: {
          ...values,
          type: values.type ? 1 : 0
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
    else {
      Ui.showWarning({ message: "Giá trị % nhập vào không được quá 100" });
    }

  }
  return (
    <FormBillCod
      data={data}
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
