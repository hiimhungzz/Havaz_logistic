/* eslint-disable react/prop-types */
import React, { memo } from "react";
import styled from "styled-components";
import { Select } from "antd";
import _ from "lodash";

let hours = [];
for (var i = 0; i < Array(24).length; i++) {
  for (var j = 0; j < Array(4).length; j++) {
    let hour = i;
    let minute = 15 * j;
    if (hour < 10) {
      hour = `0${hour}`;
    }
    if (minute === 0) {
      minute = `0${minute}`;
    }
    hours.push(`${hour}:${minute}`);
  }
}
const HourSelect = memo(
  ({ className, value, onChange, placeholder = "Chọn giờ" }) => {
    return (
      <Select
        allowClear
        value={value}
        onChange={onChange}
        style={{ width: "100%" }}
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        className={className}
      >
        {_.map(hours, (hour, hourId) => (
          <Select.Option key={hourId} value={hour}>
            {hour}
          </Select.Option>
        ))}
      </Select>
    );
  }
);
export default styled(HourSelect)``;
