import { Checkbox, Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

const type = {
  nhan_tra_hang: 1,
  ket_noi_xe_tuyen: 2,
  hang_hoa: 3,
};

const ItemCheckBox = memo(({ className, nameColumn, value, row }) => {
  const [valueCheckBox, setValueCheckBox] = useState(value);
  const [loadding, setLoadding] = useState(false);
  const onChange = async () => {
    setLoadding(true);
    const result = await ServiceBase.requestJson({
      method: "POST",
      url: "v1/van-phong/save-data",
      data: {
        id: row.id,
        type: type[nameColumn],
        value: !value,
      },
    });
    if (result.hasErrors) {
      Ui.showErrors(result.errors);
    } else {
      setLoadding(false);
      setValueCheckBox(!valueCheckBox);
    }

    // if(result)
  };
  return (
    <Spin spinning={loadding}>
      <Checkbox onChange={onChange} checked={valueCheckBox} />
    </Spin>
  );
});
ItemCheckBox.propTypes = {
  className: PropTypes.any,
};
export default styled(ItemCheckBox)``;
