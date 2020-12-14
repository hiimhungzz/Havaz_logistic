/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Drawer } from "antd";
import { compose } from "recompose";
import styled from "styled-components";

const DrawerTitle = styled(({ className, title }) => {
  return <div className={className}>{title}</div>;
})``;
const DrawerFooter = styled(({ className, footer }) => {
  return <div className={className}>{footer}</div>;
})``;

const DrawerBase = ({ className, title, footer, children, ...restProps }) => {
  return (
    <Drawer
      title={<DrawerTitle title={title} />}
      footer={<DrawerFooter footer={footer} />}
      className={className}
      {...restProps}
    >
      {children}
    </Drawer>
  );
};
export default styled(compose(memo)(DrawerBase))``;
