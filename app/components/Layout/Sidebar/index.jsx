import PropTypes from "prop-types";
import React, { memo, useState, useLayoutEffect, useMemo } from "react";
import { useSelector } from 'react-redux'
import styled from "styled-components";
import _ from "lodash";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ className, collapsed }) => {
  const leftMenu = useSelector(state => (state.App && state.App.toJS()) ? state.App.toJS().appConfig.leftMenu : []) || []
  //state thay doi, check dk 
  const [logo, setLogo] = useState("HÀNG HÓA");
  const location = useLocation();
  useLayoutEffect(() => {
    let timer = setTimeout(
      () => {
        setLogo(collapsed ? "HH" : "HÀNG HÓA");
      },
      collapsed ? 0 : 100
    );
    return () => {
      clearTimeout(timer);
    };
  }, [collapsed]);
  const openKeys = useMemo(
    () => [
      leftMenu.find((item) =>
      item.children && item.children.find((x) => `/${x.mod_id}` === location.pathname)
      )?.mod_id,
    ],
    [leftMenu, location.pathname]
  );

  return (
    <Sider
      className={className}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <Link to="/" className="logo">
        {logo}
      </Link>
      <div style={{color: '#fff', fontSize: 12, textAlign: 'center'}}>Version 1.5.1</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[`${location.pathname}`]}
        defaultOpenKeys={openKeys}
      >
        {_.map(leftMenu, (item) => {
          if (_.size(item.children) === 0) {
            return (
              <Menu.Item
                key={`/${_.get(item, "mod_id")}`}
                icon={<i className={`fa ${item.icon} pr-2`} />}
              >
                <Link to={`/${_.get(item, "path")}`}>
                  {_.get(item, "name")}
                </Link>
              </Menu.Item>
            );
          } else {
            return (
              <Menu.SubMenu
                key={item.mod_id}
                icon={<i className={`fa ${item.icon} pr-2`} />}
                title={_.get(item, "name")}
              >
                {_.map(_.get(item, "children", []), (child) => {
                  return (
                    <Menu.Item
                      icon={<i className={`fa ${child.icon} pr-2`} />}
                      key={`/${_.get(child, "mod_id")}`}
                    >
                      <Link to={`/${_.get(child, "path")}`}>
                        {_.get(child, "name")}
                      </Link>
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};

Sidebar.propTypes = {
  className: PropTypes.any,
};

export default memo(styled(Sidebar)`
  .logo {
    height: 32px;
    font-size: 26px;
    color: #fff;
    background: #001529;
    margin: 16px 16px 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ant-menu-inline-collapsed .ant-menu-submenu-title span {
    visibility: hidden;
    transition: all 0.45s ease;
  }
  .ant-menu {
    .ant-menu-item,
    .ant-menu-submenu-title {
      display: flex;
      align-items: center;
    }
    .ant-menu-submenu-title {
      font-size: 1.1rem;
    }
    .ant-menu-item.ant-menu-item-selected {
      background-color: #ffc20e !important;
      opacity: 0.9;
      color: #58595b !important;
      a {
        color: #58595b !important;
      }
      ${"" /* border-left: 3px solid #1890ff; */}
      .anticon,
      .anticon + span {
        font-size: 1.1rem;
        color: #58595b;
        font-weight: bold;
      }
    }
    .ant-menu-item:not(.ant-menu-item-selected):hover > a {
      color: #ffc20e !important;
    }
    .ant-menu-item:hover > a {
      color: #58595b !important;
    }
    .ant-menu-item-selected > a {
      color: #58595b;
      font-weight: bold;
    }
  }
`);
