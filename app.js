'use strict';

const Homey = require('homey');

class WizWifi extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('WizWifi has been initialized');
  }

}

module.exports = WizWifi;
