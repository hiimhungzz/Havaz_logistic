/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-underscore-dangle */
import React, { memo, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Globals from "utils/globals";
import * as style from "components/Variables";
import hash from "object-hash";
import { Dropdown, Menu, Row, Col, Spin, Modal } from "antd";
import MenuItem from "components/MenuItem/Loadable";
import _ from "lodash";
import { NavLink } from "react-router-dom";
import SelectChangeOffice from "components/Select/SelectChangeOffice";
import ServiceBase from "utils/ServiceBase";
import { Ui } from "utils/Ui";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
// components
const MenuAccount = styled((props) => (
  <Menu className={props.className}>
    <MenuItem>
      <NavLink to="/me">
        <div>Tài khoản</div>
      </NavLink>
    </MenuItem>
    <Menu.Divider />
    <MenuItem>
      <a
        onClick={(e) => {
          e.preventDefault();
          props.onLogOut();
        }}
      >
        <div>Đăng xuất</div>
      </a>
    </MenuItem>
  </Menu>
))`
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15);
`;
const TopMenu = memo(
  ({
    isAuthenticated,
    collapsed,
    setCollapsed,
    profile,
    className,
    onLogOut,
    onSetAuthenticated,
  }) => {
    const [loadding, setLoadding] = useState(false);
    const [officeSelected, setOfficeSelected] = useState({
      key: profile.current_hub.id,
      label: profile.current_hub.name,
    });
    const [isVisiableModal, setVisiableModal] = useState(false);
    const _handleToggle = useCallback(() => {
      setCollapsed((prevState) => !prevState);
    }, [setCollapsed]);
    const hideModal = () => {
      setVisiableModal(false)
    };
    const _changeOffice = async () => {
      const data = officeSelected;
      setVisiableModal(false);
      setLoadding(true);
      const result = await ServiceBase.requestJson({
        method: "POST",
        url: "v1/van-phong/hub-staff",
        data: {
          hub_id: data.key,
        },
      });
      if (result.hasErrors) {
        Ui.showErrors(result.errors);
        setLoadding(false);
      } else {
        setLoadding(false);
        const profileNew = {
          ...profile,
          current_hub: {
            id: data.key,
            name: data.label,
          },
        };
        Globals.setSession({
          public: {
            currentUser: JSON.stringify(profileNew),
          },
          private: {
            token: hash(profileNew),
          },
        });
        onSetAuthenticated({
          isAuthenticated: true,
          profile: profileNew,
        });
        window.location.reload();
      }
    };

    const onShowModal = async (data) => {
      await setOfficeSelected(data)
      await setVisiableModal(true)
    }

    const getProfile = useCallback(async () => {
      const getProfile = await ServiceBase.requestJson({
        method: "GET",
        url: "/v1/me",
      });
      // Lấy thông tin user đăng nhập
      let profile = _.get(getProfile, "value.data");
      Globals.setSession({
        public: {
          currentUser: JSON.stringify(profile),
        },
        private: {
          token: hash(profile),
        },
      });
      onSetAuthenticated({
        isAuthenticated: true,
        profile,
      });
    }, []);

    useEffect(() => {
      getProfile();
    }, [getProfile]);
    return (
      <div className={className}>
        <Row justify="space-between" style={{ flex: 1 }} align="middle">
          <Col>
            {collapsed ? (
              <MenuUnfoldOutlined className="trigger" onClick={_handleToggle} />
            ) : (
                <MenuFoldOutlined className="trigger" onClick={_handleToggle} />
              )}
          </Col>
          <Col
            span={16}
            style={{
              alignItems: "flex-end",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Row gutter={16} align="bottom">
              <Col>
                <Row align="middle" gutter={16}>
                  <Col>
                    <div>Văn phòng hiện tại</div>
                  </Col>
                  <Col style={{ width: 200 }}>
                    <Spin spinning={loadding}>
                      <SelectChangeOffice
                        value={{
                          key: profile.current_hub.id,
                          label: profile.current_hub.name,
                        }}
                        loadOnMount
                        showSearch={false}
                        onChange={(data) => {
                          onShowModal(data)
                        }}
                      />
                    </Spin>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Dropdown
                  overlay={<MenuAccount onLogOut={onLogOut} />}
                  placement="bottomRight"
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 8px",
                      color: "#58595b",
                    }}
                  >
                    <span>{`Chào, ${_.get(profile, "name", "")}`}</span>
                    <UserOutlined
                      style={{ fontSize: "1.1rem", marginLeft: 5 }}
                    />
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          title="Thay đổi văn phòng"
          visible={isVisiableModal}
          onOk={_changeOffice}
          onCancel={hideModal}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn thay đổi văn phòng không ? </p>
        </Modal>
      </div>
    );
  }
);
TopMenu.propTypes = {
  className: PropTypes.any.isRequired,
  profile: PropTypes.any.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onLogOut: PropTypes.func.isRequired,
};
export default styled(TopMenu)`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${style.color.topMenu.bg};
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  .trigger {
    font-size: 18px;
  }
`;
