'use strict';

const TadoOAuth2Client = require('./lib/TadoOAuth2Client');
const { OAuth2App } = require('homey-oauth2app');
require('inspector').open(9229, '0.0.0.0', true);
class TadoMobile extends OAuth2App {

	onOAuth2Init() {
		this.enableOAuth2Debug();
		this.setOAuth2Config({
			client: TadoOAuth2Client,
			apiUrl: 'https://my.tado.com/api/v2',
			tokenUrl: 'https://auth.tado.com/oauth/token',
			authorizationUrl: 'https://auth.tado.com/oauth/authorize',
			scopes: ['home.user'],
		});

		this.log('TadoMobile is running...');
	}
}

module.exports = TadoMobile;