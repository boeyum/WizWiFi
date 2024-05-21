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

class WizSocketDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      id = this.getData('id');
      const settings = this.getSettings();
      ipAddr = settings.ip;
      macAddr = settings.mac;
      devices = new Command(null);

      isState = devices.getState(ipAddr);

      stat = isState;

      this.pollDevice(id, devices);

      this.setCapabilityValue('onoff', isState);
      this.registerCapabilityListener('onoff', async (value) => {
          this.isState = value;
          const settings = this.getSettings();
          return await devices.setOnOff(settings.ip, value);
      });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizOnOffSocket has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      devices = new Command(ipAddr, null);
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   */
  async onRenamed(name) {
      this.log('WizOnOffSocket was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
      clearInterval(this.pollingInterval);
  }

  // FLOW functions
  async flowOnOff() {
      return devices.getState(this.ipAddr);
  }

  // HELPER FUNCTIONS
  pollDevice(id, device) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          stat = devices.getState(ipAddr);
          this.setCapabilityValue('onoff', stat);
      }, 600000);
  }

}

module.exports = WizSocketDevice;
