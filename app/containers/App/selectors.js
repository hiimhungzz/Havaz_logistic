import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the demoApp state domain
 */

const selectAppDomain = state => state.App || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DemoApp
 */

export const makeSelectApp = () =>
  createSelector(
    selectAppDomain,
    substate => substate,
  );
export const makeSelectAppConfig = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('appConfig'),
  );
export const makeSelectProfile = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('profile'),
  );
export const makeSelectIsAuthenticated = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('isAuthenticated'),
  );
export const makeSelectTrip = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('trip'),
  );
export const makeSelectRoute = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('route'),
  );
export const makeSelectDefinitions = () =>
  createSelector(
    selectAppDomain,
    substate => substate.get('definitions'),
  );

export { selectAppDomain };
