import React from "react";
import { Menu } from "antd";
import styled from "styled-components";
import * as style from "components/Variables";

const MenuItem = (props) => <Menu.Item {...props} />;
export default styled(MenuItem)`
  ${"" /* padding: 0px 0px !important; */}
  :hover {
    background: ${style.color.haiVan.bg};
    a {
      color: ${style.color.haiVan.primary};
      font-weight:600;
    }
  }
  margin: 0 0 !important;
  a {
    margin: 0 0 !important;
  }
`;
