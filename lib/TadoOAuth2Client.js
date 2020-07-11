'use strict'

const { OAuth2Client, fetch } = require('homey-oauth2app');

module.exports = class TadoOAuth2Client extends OAuth2Client {
  async onGetTokenByCredentials({ username, password }) {
    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('client_id', this._clientId);
    body.append('client_secret', this._clientSecret);
    body.append('username', username);
    body.append('password', password);

    const response = await fetch(this._tokenUrl, {
      body,
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Invalid Response (${response.status})`);
    }

    this._token = await this.onHandleGetTokenByCodeResponse({ response });
    return this.getToken();
  }

  async onGetTokenByCode({ code }) {
    const query = querystring.stringify({
      code,
      grant_type: 'authorization_code',
      client_id: this._clientId,
      client_secret: this._clientSecret,
      redirect_uri: this._redirectUrl,
    });

    const res = await fetch(`${this._tokenUrl}?${query}`, {
      method: 'POST',
    });

    const body = await res.json();
    return new OAuth2Token(body);
  }

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

}