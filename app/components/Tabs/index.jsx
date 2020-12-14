import React, { memo } from "react";
import { Tabs as AntTabs } from "antd";
import styled, { css } from "styled-components";
import * as style from "components/Variables";

const Tabs = (props) => <AntTabs {...props} />;
export default styled(memo(Tabs))`
  ${(props) =>
    props.bordered &&
    css`
      border: 1px solid #ebedf2;
    `}

  .ant-tabs-nav {
    ${(props) =>
      props.margin &&
      css`
        margin: ${props.margin} !important;
      `}
  }
  .ant-tabs-tab.ant-tabs-tab-active,
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${style.color.haiVan.default} !important;
    background: ${style.color.haiVan.bg} !important;
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    font-weight: 400;
  }
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: ${style.color.haiVan.bg};
  }
`;
