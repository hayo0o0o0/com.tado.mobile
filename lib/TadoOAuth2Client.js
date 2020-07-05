'use strict'

const { OAuth2Client } = require('homey-oauth2app');

module.exports = class TadoOAuth2Client extends OAuth2Client {

    onHandleAuthorizationURLScopes({ scopes }) {
        return scopes.join(' ')
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

    async getMobileDevices(homeId) {
        return this.get({
            path: `/homes/${homeId}/mobileDevices`,
        });
    }

}