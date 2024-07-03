'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand');

var id = null;
var ipAddr = null;
var macAddr = null;
var devices = null;
var isState = false;
var stat = false;
var power = 0;
var limit = 0;

var stat = 0;
var kod = 0;

class WizPowerSocketDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      id = this.getData('id');
      const settings = this.getSettings();
      ipAddr = settings.ip;
      macAddr = settings.mac;
      devices = new Command(null);

      isState = devices.getState(settings.ip);

      stat = isState;

      this.pollDevice(id, devices);

      this.setCapabilityValue('onoff', isState);
      this.registerCapabilityListener('onoff', async (value) => {
          this.stat = value;
          const settings = this.getSettings();
          return await devices.setOnOff(settings.ip, value);
      });

      power = devices.getPower(ipAddr);
      var tempn = Number(power);
      var npower = Math.abs(tempn / 1000);
      this.setCapabilityValue('measure_power', npower);
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizPowerSocket has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
      const settings = this.getSettings();
      ipAddr = settings.ip;
      devices = new Command(ipAddr, null);
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   */
  async onRenamed(name) {
      this.log('WizPowerPlugDevice was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
      clearInterval(this.pollingInterval);
  }

  // FLOW functions
  async flowPower(message) {
      if (args.hasOwnProperty('nwatt')) {
          return this.getPower(args.nwatt);
      }
      return false;
  }

  // HELPER FUNCTIONS
  pollDevice(id, device) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = setInterval(async () => {
          var sstat = devices.getState(ipAddr);
          this.setCapabilityValue('onoff', sstat);
          var xpower = devices.getPower(ipAddr);
          var tpower = Number(xpower);
          var npower = Math.abs(tpower / 1000)
          this.setCapabilityValue('measure_power', npower);
      }, 60000);
  }

  getPower(velk) {
      this.power = devices.getPower(this.ipAddr);
      if (this.power <= velk) {
          return true;
      }
      return false;
  }
}

module.exports = WizPowerSocketDevice;
