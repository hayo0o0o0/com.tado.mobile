import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import logger = require('fluent-logger');
const { OAuth2App } = require('homey-oauth2app');
const TadoOAuth2Client = require('./lib/TadoOAuth2Client');

require('inspector').open(9229, '0.0.0.0', true);

class TadoMobile extends OAuth2App {
  static OAUTH2_CLIENT = TadoOAuth2Client;
  static OAUTH2_DEBUG = false; // Default: false

  async onOAuth2Init() {
    logger.configure('com.hayo.tadomobile', {
      host: '192.168.1.104',
      port: 24224,
      timeout: 3.0,
      reconnectInterval: 600000 // 10 minutes
    });

    logger.on('error', (error) => {
      logger.emit('error', { message: error });
      this.log('error: ' + error);
    });
    logger.on('connect', () => {      
      this.log('connected!');
    });
    logger.emit('debug', { message: 'TadoMobile is running...'});
    this.log('TadoMobile is running...');
  }

}

module.exports = TadoMobile;
