/* eslint-disable react/prop-types */
import React, { memo, useEffect, useState, useLayoutEffect } from "react";
import { makeSelectIsAuthenticated } from "containers/App/selectors";
import { createStructuredSelector } from "reselect";
import ErrorBoundary from "react-error-boundary";
import {
  browseGlobalConfig,
  browseTrip,
  browseRoute,
  logOut,
  setAuthenticated,
  setLeftMenu

} from "containers/App/actions";
import { connect } from "react-redux";
import { Layout } from "antd";
import styled from "styled-components";
import { compose } from "recompose";
import ErrorMessage from "components/ErrorMessage";
import TopMenu from "./TopMenu";
import Sidebar from "./Sidebar";
import SubTopMenu from "./SubTopMenu";
const { Header, Content } = Layout;

const Delayed = memo(({ children, location }) => {
  const [delayed, setDelayed] = useState(true);
  useLayoutEffect(() => {
    setTimeout(() => setDelayed(false), 500);
  }, [location]);
  if (delayed) {
    return null;
  }
  return children;
});

const AuthorizedLayout = ({
  className,
  location,
  children,
  profile,
  isAuthenticated,
  onBrowseGlobalConfig,
  onBrowseTrip,
  onBrowseRoute,
  onLogOut,
  onSetAuthenticated,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setTimeout(onBrowseGlobalConfig, 10);
    setTimeout(onBrowseTrip, 20);
    setTimeout(onBrowseRoute, 30);
  }, [onBrowseGlobalConfig, onBrowseRoute, onBrowseTrip]);
  return (
    <Layout className={className}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header>
          <TopMenu
            setCollapsed={setCollapsed}
            collapsed={collapsed}
            profile={profile}
            isAuthenticated={isAuthenticated}
            onLogOut={onLogOut}
            onSetAuthenticated={onSetAuthenticated}
          />
        </Header>
        <Content>
          {location.pathname !== "/" && (
            <SubTopMenu pathName={location.pathname} />
          )}
          <ErrorBoundary FallbackComponent={ErrorMessage}>
            <div className="main-content">
              <Delayed children={children} location={location} />
            </div>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
};
const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});
const mapDispatchToProps = (dispatch) => ({
  onBrowseGlobalConfig: () => dispatch(browseGlobalConfig()),
  onBrowseTrip: () => dispatch(browseTrip()),
  onBrowseRoute: () => dispatch(browseRoute()),
  onLogOut: () => dispatch(logOut()),
  onSetAuthenticated: (payload) => dispatch(setAuthenticated(payload)),
  onSetLeftMenu: (payload) => dispatch(setLeftMenu(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
export default styled(
  compose(
    withConnect,
    memo
  )(AuthorizedLayout)
)`
  height: 100vh;
  header {
    padding: 0;
    height: 40px;
    line-height: inherit;
  }
  main {
    min-height: calc(100vh - 56px - 200px);
    padding: 8px 0.8rem 0.8rem 0.8rem;
    .main-content {
      padding: 14px 14px;
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      box-shadow: 0 0 13px 0 rgba(82, 63, 105, 0.05);
      background-color: #fff;
      margin-bottom: 0rem;
      border-radius: 0.3rem;
    }
  }
`;
