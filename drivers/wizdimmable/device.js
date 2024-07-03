'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand.js');

var id = null;
var ipAddr = null;
var devices = null;
var isState = false;
var isDimming = true;
var kod = 0;

class WizDimmableDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      id = this.getData().id;
      const settings = this.getSettings();
      ipAddr = settings.ip;
      devices = new Command(null);

      isDimming = true;

      this.pollDevice(id, devices);

      isState = devices.getState(ipAddr);
      this.setCapabilityValue('onoff', isState);
      this.registerCapabilityListener('onoff', async (value) => {
          this.isState = value;
          const settings = this.getSettings();
          return await devices.setOnOff(settings.ip, value);
      });

      if (isDimming) {
          var dimdata = devices.getDimming(ipAddr);
          this.setCapabilityValue('dim', dimdata);
          this.registerCapabilityListener('dim', async (value) => {
              if (value < 0) {
                  value = 0;
              } else if (value > 100) {
                  value = 100;
              }
              const settings = this.getSettings();
              devices.setBrightness(settings.ip, value);
          });
      }
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizDimming has been added');
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
       this.log('WizDimmingDevice was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
       clearInterval(pfunc);
  }

  // FLOW functions

  async createDimming(args, state) {
      if (args.hasOwnProperty('dim')) {
          this.callDimming(args.dim);
      }
  }


  // HELPER FUNCTIONS
  pollDevice(id, device) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          state = devices.getState(ipAddr);
          setCapabilityValue('onoff', this.state);
          dim = devices.getDimming(ipAddr);
          this.setCapabilityValue('dim', dim);
      }, 600000);
  }

    callDimming(dim) {
      console.log(dim);
      devices.setBrightness(ipAddr, dim);
  }
}

module.exports = WizDimmableDevice;
