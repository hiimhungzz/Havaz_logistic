import { Checkbox, Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";
import BillSelect from "components/Select/BillSelect";


const ItemCheckBox = memo(({ className, nameColumn, value, row, onRefreshList }) => {
  const [valueCheckBox, setValueCheckBox] = useState(value);
  const [loadding, setLoadding] = useState(false);
  const onChange = async (value) => {
    const params = {
      id: row.id,
      active: valueCheckBox ? 0 : 1,
    };
    setLoadding(true);
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: `v1/common/customer-group/active/${row.id}`,
      value: !value,
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setLoadding(false);
      setValueCheckBox(!valueCheckBox);
    }
  };
  if (nameColumn === "active") {
    return (
      <Spin spinning={loadding}>
        <Checkbox onChange={onChange} checked={valueCheckBox} />
      </Spin>
    );
  }

});
ItemCheckBox.propTypes = {
  className: PropTypes.any,
};
export default styled(ItemCheckBox)``;
