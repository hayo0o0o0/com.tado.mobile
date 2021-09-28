'use strict';

const { OAuth2Client } = require('homey-oauth2app');

class TadoOAuth2Client extends OAuth2Client {
  static API_URL = 'https://my.tado.com/api/v2';
  static TOKEN_URL = 'https://auth.tado.com/oauth/token';
  static AUTHORIZATION_URL = 'https://auth.tado.com/oauth/authorize';
  static SCOPES = [
    'identity:read',
    'home.details:read',
    'home.operation:read',
    'home.operation:write',
    'home.webhooks',
    'home.mobile.devices.details:read',
    'home.mobile.devices.location:read'
  ];

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
module.exports = TadoOAuth2Client;