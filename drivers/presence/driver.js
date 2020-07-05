'use strict';

const { OAuth2Driver } = require('homey-oauth2app');

module.exports = class TadoMobileDriver extends OAuth2Driver {
  
  onOAuth2Init() {
    // Register Flow Cards etc.
  }
  
  async onPairListDevices({ oAuth2Client }) {
    const things = await oAuth2Client.getMobileDevices();
    return things.map(thing => {
      return {
        name: thing.name,
        data: {
          id: thing.id,
        },
      }
    });
  }
	
}

