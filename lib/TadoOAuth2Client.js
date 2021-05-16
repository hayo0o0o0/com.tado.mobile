'use strict';

const { OAuth2Client } = require('homey-oauth2app');

module.exports = class TadoOAuth2Client extends OAuth2Client {

  async getMobileDevicesForHome(homeId) {
    return this.get({
      path: `/homes/${homeId}/mobileDevices`,
    });
  }

  async getMe() {
    return this.get({
      path: '/me',
    });
  }

};
