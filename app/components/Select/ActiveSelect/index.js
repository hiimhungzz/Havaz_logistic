/* eslint-disable react/prop-types */
import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import * as style from "components/Variables";
import { Select, Spin } from "antd";
import ServiceBase from "utils/ServiceBase";
import _ from "lodash";
import { Ui } from "utils/Ui";
const { Option } = Select;
const ActiveSelect = memo((props) => {
  return (
    <Select
      defaultValue="2"
      allowClear
      {...props}
      size="default"
      style={{ width: "100%" }}
    >
      <Option value="1">Hoạt động</Option>
      <Option value="0">Không hoạt động</Option>
      <Option value="2">Tất cả</Option>
    </Select>
  );
});
export default styled(ActiveSelect)``;
