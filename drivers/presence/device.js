const { OAuth2Device } = require('homey-oauth2app');
const Homey = require('homey');
const delay = require('delay');

module.exports = class TadoHomeDevice extends OAuth2Device {
    async onOAuth2Init() {
        const { homeId } = this.getData();
        this._homeId = homeId;
        this.log('Starting up home device...');
        this.startPolling()

        this._flowTriggerMobileAtHome = this.homey.flow.getActionCard('mobile_athome_changed')
        this._flowTriggerMobileAtHome
            .registerRunListener((args, state) => {
                return args.mobile_device_selection.id === state.mobile_id;
            })
            .getArgument('mobile_device_selection')
            .registerAutocompleteListener((query, args) => {
                const devices = [];
                args.device.getStoreValue('mobileDevices').forEach(device => {
                    if (device.settings.geoTrackingEnabled) {
                        devices.push({
                            name: device.name,
                            id: device.id
                        });
                    }
                })
                return devices;
            });
    }

    async onOAuth2Deleted() {
        // Clean up here
    }

    async startPolling() {
        while (true) {
            this.log('Checking presence');
            this.checkPresence();
            await delay(10000);
        }
    }

    checkPresence() {
        return this.oAuth2Client.getMobileDevicesForHome(this._homeId)
            .then(response => {
                this.setAvailable();
                this.parsePresence(response);
            })
            .catch(err => {
                this.error(err);
                this.setUnavailable(err);
                throw err;
            })
    }

    parsePresence(response) {
        let previousResponse = this.getStoreValue('mobileDevices');
        if (previousResponse === null) {
            previousResponse = [];
            response.forEach(device => {
                previousResponse.push({
                    id: device.id,
                    location: null
                });
            });
        }
        response.forEach(device => {
            previousResponse.forEach(previousDevice => {
                if (device.id == previousDevice.id) {
                    if (device.settings.geoTrackingEnabled) {
                        const location = device.location;
                        if (location && (location !== null)) {
                            if ((previousDevice.location === null) || (previousDevice.location.atHome !== location.atHome)) {
                                this._flowTriggerMobileAtHome.trigger(this,
                                    { 'mobile_athome': location.atHome },
                                    { 'mobile_id': device.id });
                            }
                        }
                    }
                }
            })

        });
        this.setStoreValue('mobileDevices', response);
    }
}