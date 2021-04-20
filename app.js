'use strict';

const { OAuth2App } = require('homey-oauth2app');
const { Log } = require('homey-log');
const TadoOAuth2Client = require('./lib/TadoOAuth2Client');

require('inspector').open(9229, '0.0.0.0', true);

const SCOPES = [
  'identity:read',
  'home.details:read',
  'home.operation:read',
  'home.operation:write',
  'home.webhooks',
  'home.mobile.devices.details:read',
  'home.mobile.devices.location:read'
];

class TadoMobile extends OAuth2App {

  onOAuth2Init() {
    this.homeyLog = new Log({ homey: this.homey });
    // this.enableOAuth2Debug();
    this.setOAuth2Config({
      client: TadoOAuth2Client,
      grantType: 'password',
      apiUrl: 'https://my.tado.com/api/v2',
      tokenUrl: 'https://auth.tado.com/oauth/token',
      authorizationUrl: 'https://auth.tado.com/oauth/authorize',
      scopes: SCOPES,
    });

    this.log('TadoMobile is running...');
  }

}

module.exports = TadoMobile;
