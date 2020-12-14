import _ from 'lodash';
import { $Cookies } from './cookies';
import { CURRENT_USER, JWT_TOKEN } from './constants';
import { $LocalStorage } from './localStorage';

/**
 * Contains global session.
 */
export default class Globals {
  static isInitialized = false;

  static session = {};

  static reset() {
    this.isInitialized = false;
    this.session = {
      public: {},
      private: {},
    };
  }

  static clear() {
    $Cookies.remove(CURRENT_USER);
    $Cookies.remove(JWT_TOKEN);
    $LocalStorage.sls.clear();
    $LocalStorage.pls.clear();
    this.session = {
      public: {},
      private: {},
    };
  }

  static init(session) {
    if (this.isInitialized) {
      throw Error('Globals is already initialized.');
    }

    this.session = session || {
      public: {},
      private: {},
    };

    this.isInitialized = true;
  }

  static throwIfNotInitialized() {
    if (!this.isInitialized) {
      throw Error(
        "'Globals' is not initialized. You have to call 'Globals.init' before.",
      );
    }
  }

  static getSession() {
    this.throwIfNotInitialized();
    return this.session;
  }

  static setSession(session) {
    this.throwIfNotInitialized();
    // Update session object by the new data.
    $Cookies.set(CURRENT_USER, session.public.currentUser);
    $Cookies.set(JWT_TOKEN, session.private.token);
    this.session = {
      ...this.session,
      ...session,
    };
  }

  static get currentUser() {
    const currentSession = this.getSession();
    if (currentSession) {
      const publicSession = currentSession.public;
      if (publicSession && publicSession.currentUser) {
        return JSON.parse(publicSession.currentUser);
      }
      return null;
    }
    return null;
  }

  static set currentUser(currentUser) {
    this.setSession({
      public: { currentUser: JSON.stringify(currentUser) },
    });
  }

  static get isAuthenticated() {
    return !(
      this.currentUser === null ||
      _.isNaN(this.session.private.token) ||
      _.isNull(this.session.private.token) ||
      _.isUndefined(this.session.private.token)
    );
  }
}
