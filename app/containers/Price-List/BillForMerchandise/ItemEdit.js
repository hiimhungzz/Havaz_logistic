import { Checkbox, InputNumber, Input } from "antd";
import PropTypes from "prop-types";
import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

let timer1 = null;
const ItemEdit = memo(({ className, value, item }) => {
  const [valueInput, setValueInput] = useState(value);
  return (
    <InputNumber
      style={{ width: "100%" }}
      size={"large"}
      parser={value => value.replace(/\$\s?|(,*)/g, '')}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      onChange={(e) => {
        let value = e
        setValueInput(value)
        clearTimeout(timer1);
        timer1 = setTimeout(async () => {
          const result = await ServiceBase.requestJson({
            method: "PUT",
            url: `v1/price-matrix/price/${item.id}`,
            data: {
              price: value
            },
          });
          if (result.hasErrors) {
            Ui.showErrors(result.errors);
          } else {

          }
        }, 300);
      }}
      value={valueInput}
    />
  );
});
ItemEdit.propTypes = {
  className: PropTypes.any,
};
export default styled(ItemEdit)``;
