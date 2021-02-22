'use strict';

const { OAuth2Driver } = require('homey-oauth2app');
const Homey = require('homey');

module.exports = class TadoMobileDriver extends OAuth2Driver {

  onOAuth2Init() {
    
    this.homey.flow.getConditionCard('mobile_athome_true')
      .registerRunListener(async (args, state) => {
        var conditionResult = false;
        args.device.getStoreValue('mobileDevices').forEach(function (item) {
          if (args.mobile_device_selection.id === item.id) {
            if (item.settings.geoTrackingEnabled) {
              if (item.location && (item.location !== null)) {
                conditionResult = item.location.atHome
              }
            }
          }
        });
        return conditionResult;
      })
      .getArgument('mobile_device_selection')
      .registerAutocompleteListener(async (query, args) => {
        const devices = [];
        args.device.getStoreValue('mobileDevices').forEach(device => {
          if (device.settings.geoTrackingEnabled) {
            devices.push({
              name: device.name,
              id: device.id
            });
          }
        })
        return Promise.resolve(devices);
      });
  }

  async onPairListDevices({ oAuth2Client }) {
    const { homes } = await oAuth2Client.getMe();
    const devices = [];
    homes.map(async home => {
      devices.push({
        name: home.name,
        data: {
          homeId: home.id
        }
      });
    });
    return devices;
  }

}

