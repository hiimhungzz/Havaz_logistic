/* eslint-disable react/prop-types */
import React, { memo, useEffect, useState } from "react";
import { DatePicker } from "antd";
import { compose } from "recompose";
import styled, { css } from "styled-components";
import * as style from "components/Variables";
import locale from "antd/es/date-picker/locale/vi_VN";

const RangePicker = (props) => {
  return (
    <DatePicker.RangePicker
      placeholder={["Từ ngày", "Đến ngày"]}
      style={{ width: "100%" }}
      {...props}
      locale={locale}
    />
  );
};
export default styled(compose(memo)(RangePicker))``;
