'use strict';

const { OAuth2Device } = require('homey-oauth2app');
const logger = require('fluent-logger');

const delay = require('delay');

const POLL_INTERVAL = 1 * 60 * 1000; // 1 minutes in ms

module.exports = class TadoHomeDevice extends OAuth2Device {

  async onOAuth2Init() {
    const { homeId } = this.getData();
    this._homeId = homeId;
    this.log('Starting up home device...');
    this.startPolling();

    this._flowTriggerMobileAtHome = this.homey.flow.getDeviceTriggerCard('mobile_athome_changed');
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
        });
        return devices;
      });
  }

  async onOAuth2Deleted() {
    // Clean up here
  }

  async startPolling() {
    const shouldRun = true;
    while (shouldRun) {
      logger.emit('debug', { message: `Checking presence for home id: ${this._homeId}` });      
      this.checkPresence();
      await delay(POLL_INTERVAL);
    }
  }

  checkPresence() {
    return this.oAuth2Client
      .getMobileDevicesForHome(this._homeId)
      .then(response => {
        this.setAvailable();
        this.parsePresence(response);
      })
      .catch(err => {
        logger.emit('error', {message: `Error checking presence: ${err}`})
        this.error(err);
        this.setUnavailable(err);
      });
  }

  parsePresence(response) {
    try {
      let previousResponse = this.getStoreValue('mobileDevices');
      if (previousResponse === null) {
        logger.emit('debug', {message: `No previous response pushing ${response.length}`})
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
          logger.emit('debug', {message: `checking for  ${device.id}`})
          if (device.id === previousDevice.id) {
            if (device.settings.geoTrackingEnabled) {
              const { location } = device;
              if (location && location !== null) {
                logger.emit('debug', { message: `Checking state for: ${device.name} atHome: ${location.atHome}` });
                if (!previousDevice.location
                    || previousDevice.location.atHome !== location.atHome) {
                  logger.emit('debug', { message: `Changing state for: ${device.name} to atHome: ${location.atHome}` });
                  this.log(`Changing state for: ${device.name} to atHome: ${location.atHome}`);
                  this._flowTriggerMobileAtHome.trigger(
                    this,
                    { mobile_athome: location.atHome },
                    { mobile_id: device.id }
                  );
                }
              }
            }
          }
        });
      });
      this.setStoreValue('mobileDevices', response);
    } catch (err) {
      logger.emit('error', { message: "Error parsing response: " + err });
      this.error(err);
      throw err;
    }
  }

};
