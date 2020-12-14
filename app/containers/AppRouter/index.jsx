import { compose } from "recompose";
import { Route, BrowserRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import React, { memo } from "react";
import { Switch, Redirect } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { $LocalStorage } from "utils/localStorage";
import { APP_PARAM } from "utils/constants";
import { Helmet } from "react-helmet";
import {
  makeSelectAppConfig,
  makeSelectProfile,
  makeSelectIsAuthenticated,
} from "containers/App/selectors";
import { publicRoutes } from "./routes";

const AppRoute = ({
  component: Component,
  layout: Layout,
  path: Path,
  appConfig,
  profile,
  isAuthenticated,
  ...rest
}) => {
  let isLoginPath = Path === "/signin";
  if (!isAuthenticated && !isLoginPath) {
    return (
      <Redirect
        to={{
          pathname: "/signin",
          state: { from: rest.location },
        }}
      />
    );
  }
  if (isAuthenticated && isLoginPath) {
    return <Redirect to="/" />;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        const appParam = _.get($LocalStorage.sls.getObject(APP_PARAM), "", {});
        return (
          <Layout {...props} profile={profile}>
            <Helmet titleTemplate="%s - HÀNG HÓA" defaultTitle="HÀNG HÓA">
              <meta name="description" content="HÀNG HÓA" />
            </Helmet>
            <Component
              appParam={appParam}
              appConfig={appConfig}
              profile={profile}
            />
          </Layout>
        );
      }}
    />
  );
};
AppRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.any.isRequired,
  appConfig: PropTypes.any.isRequired,
  profile: PropTypes.any.isRequired,
  isAuthenticated: PropTypes.any.isRequired,
};

const AppRouter = ({ appConfig, profile, isAuthenticated }) => (
  <BrowserRouter>
    <Switch>
      {_.map(publicRoutes, (route, routeId) => (
        <AppRoute
          {...route}
          appConfig={appConfig}
          profile={profile}
          isAuthenticated={isAuthenticated}
          key={routeId}
        />
      ))}
    </Switch>
  </BrowserRouter>
);
AppRouter.propTypes = {
  appConfig: PropTypes.any.isRequired,
  profile: PropTypes.any.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
  appConfig: makeSelectAppConfig(),
  profile: makeSelectProfile(),
});
const withConnect = connect(
  mapStateToProps,
  null
);
export default compose(
  withConnect,
  memo
)(AppRouter);
