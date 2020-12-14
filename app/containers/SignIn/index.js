/* eslint-disable no-underscore-dangle */
/**
 *
 * SignIn
 *
 */

import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import Globals from "utils/globals";
import { Ui } from "utils/Ui";
import { makeSelectIsAuthenticated } from "containers/App/selectors";
import { setAuthenticated, logOut } from "containers/App/actions";
import ServiceBase from "utils/ServiceBase";
import { createStructuredSelector } from "reselect";
import { Form, Row, Typography, Button, Checkbox, Col, Modal } from "antd";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";
import hash from "object-hash";
import Input from "components/Input";
import { URI } from "./constants";
import { BASE_URL } from "utils/constants";
import * as style from "components/Variables";
import SelectChangeOffice from "components/Select/SelectChangeOffice";


const TypeDomain = {
  'https://devhh.haivan.com/api': 'HẢI VÂN LOGISTICS',
  'https://api.cpn.haivanexpress.vn/api': 'HẢI VÂN LOGISTICS',
  'https://api.cpn.hasonhaivan.vn/api': 'HÀ SƠN HẢI VÂN LOGISTICS',
  'https://api.cpn.vungtau.havaz.vn/api': 'VÙNG TÀU LOGISTICS'
}

const { Title } = Typography;
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const SignIn = ({ className, isAuthenticated, setAuthenticated, logOut }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [loadding, setLoadding] = useState(false);
  const [officeSelected, setOfficeSelected] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isShowModal, setShowModal] = useState(false);
  const _handleLogIn = useCallback(
    async (param) => {
      setIsFetching(true);

      // Lấy csrf token
      let getSession = await ServiceBase.requestJson({
        method: "GET",
        baseUrl: BASE_URL,
        url: "/sanctum/csrf-cookie",
        // data: {},
      });
      if (getSession.hasErrors) {
        Ui.showErrors(getSession.errors);
        setIsFetching(false);
        return;
      } else {
        // Call api đăng nhập
        const result = await ServiceBase.requestJson({
          method: "POST",
          baseUrl: BASE_URL,
          url: URI.SIGN_IN,
          data: {
            username: _.get(param, "username"),
            password: _.get(param, "password"),
          },
        });
        if (result.statusCode && result.statusCode === 204) {
          setIsFetching(false);
          logOut();
        }
        if (result.hasErrors) {
          Ui.showErrors(result.errors);
          setIsFetching(false);
        } else if (result.value.data.current_hub === null) {
          Ui.showError({
            message: "Người dùng chưa được chỉ định vào văn phòng",
          });
          setIsFetching(false);
        } else {
          setShowModal(true);
          setIsFetching(false);
          setUserInfo(result.value.data);
          setOfficeSelected({
            key: result.value.data.current_hub.id,
            label: result.value.data.current_hub.name,
          });
        }
      }
    },
    [setAuthenticated]
  );

  const _changeOffice = useCallback(async (data) => {
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
    }
  }, []);

  const onStart = useCallback(async () => {
    setShowModal(false);
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
    Ui.showSuccess({ message: "Đăng nhập hệ thống thành công." });
    setAuthenticated({
      isAuthenticated: true,
      profile,
    });
  }, []);

  const onFinishFailed = useCallback(() => { }, []);
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className={className}>
      <div className="content">
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Title className="loginTitle" level={3}>
              {TypeDomain[process.env.REACT_APP_API_BASE_URL]}
            </Title>
          </Col>
          <Form
            style={{ width: "100%" }}
            {...formLayout}
            name="signin"
            initialValues={{
              remember: true,
              username: null,
              password: null,
            }}
            onFinish={_handleLogIn}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Nhập tên tài khoản" }]}
            >
              <Input className="input" placeholder="Tài khoản" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Nhập mật khẩu" }]}
            >
              <Input.Password className="input" placeholder="Mật khẩu" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox style={{ fontWeight: 'bold' }}>Ghi nhớ mật khẩu</Checkbox>
            </Form.Item>
            <div className="btnLogin">
              <Button style={{ fontWeight: 'bold' }} loading={isFetching} type="default" htmlType="submit">
                Đăng nhập
              </Button>
            </div>
          </Form>
        </Row>
      </div>
      <Modal
        onCancel={() => {
          // logOut();
          setShowModal(false);
        }}
        footer={null}
        visible={isShowModal}
      >
        {officeSelected && (
          <>
            <div style={{ fontSize: 35, color: "#FFC20E" }}>Chào mừng!</div>
            <div>
              Chào mừng bạn{" "}
              <span style={{ color: "#FFC20E" }}>{userInfo.name}</span> đến với
              hệ thống!
            </div>
            <div>Vui lòng chọn văn phòng làm việc của bạn để bắt đầu</div>
            <div style={{ paddingTop: 30, paddingBottom: 10 }}>Văn phòng</div>
            <SelectChangeOffice
              value={officeSelected}
              loadOnMount
              onChange={(data) => {
                setOfficeSelected(data);
                _changeOffice(data);
              }}
            />
            <Button style={{ marginTop: 20 }} onClick={onStart} type="primary">
              Bắt đầu làm việc
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

SignIn.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  className: PropTypes.any.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setAuthenticated,
      logOut,
    },
    dispatch
  );
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
export default compose(
  withConnect,
  memo
)(styled(SignIn)`
opacity: 0.9;
  display: flex;
  justify-content: center;
  margin: 200px auto auto auto;
  .content {
    min-width: 350px;
    opacity: 1;
    .loginTitle {
      text-align: center;
      color: ${style.color.haiVan.primary};
      padding-bottom: 4px;
      border-bottom: 1.2px solid #000;
    }
    .ant-row {
      background-color: #fff;
      border-radius: 5px;
      padding: 10px;
      justify-content: center;
      .btnLogin {
        display: flex;
      }
    }
    .ant-form-item {
      margin-bottom: 0px;
      .ant-form-item-label {
        text-align: left;
        label {
          color: ${style.color.haiVan.primary};
          font-weight: 700;
        }
      }
      input {
        font-weight: 600;
       
      }
      .ant-form-item-required:before {
        display: none !important;
      }
      .ant-form-item-required:after {
        color: #f5222d;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: "*" !important;
      }
      
  }
  .btnLogin {
    display: flex;
    justify-content: center !important;
    align-items: center;
    }
  
  }
`);
