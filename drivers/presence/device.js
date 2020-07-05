const { OAuth2Device } = require('homey-oauth2app');

module.exports = class TadoMobileDevice extends OAuth2Device {

    async onOAuth2Init() {
        this.startPolling()
    }

    async onOAuth2Deleted() {
        // Clean up here
    }

    async startPolling() {
        while (true) {
            this.checkPresence();
            await delay(10000);
        }
    }

    checkPresence() {
        return this.oAuth2Client.getMobileDevices(this._homeId)
            .then(state => {
                this.setAvailable();
                this._devices(state);
            })
            .catch(err => {
                this.error(err);
                this.setUnavailable(err);
                throw err;
            })
    }

    _devices(state) {

    }

}