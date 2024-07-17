'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand');

var id = null;
var ipAddr = null;
var macAddr = null;
var devices = null;
var isState = false;
var isDimming = true;
var isTemp = true;
var isScenes = true;

var stat = false;
var dim = 0;
var scene = null;
var temp = 0;

class WizTuneableDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      id = this.getData('id');
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      this.macAddr = settings.mac;
      this.devices = new Command(null);

      this.isState = this.devices.getState(this.ipAddr);
      this.isDimming = true;
      this.isTemp = true;
      this.isScenes = true;

      this.stat = this.isState;

      this.pollDevice(this.id, this.devices);

      this.setCapabilityValue('onoff', this.isState);
      this.registerCapabilityListener('onoff', async (value) => {
          this.stat = value;
          this.isState = value;
          const settings = this.getSettings();
          return await this.devices.setOnOff(settings.ip, value);
      });

      if (isDimming) {
          this.dim = this.devices.getDimming(this.ipAddr);
          this.setCapabilityValue('dim', this.dim);
          this.registerCapabilityListener('dim', async (value) => {
              if (value < 0) {
                  value = 0;
              } else if (value > 100) {
                  value = 100;
              }
              const settings = this.getSettings();
              this.devices.setBrightness(settings.ip, value);
          });
      }

      if (isTemp) {
          this.temp = this.devices.getTemperature(this.ipAddr);
          this.setCapabilityValue('wiz_kelvin', this.temp);
          this.registerCapabilityListener('wiz_kelvin', async (value) => {
              if (value < 2100) {
                  value = 2100;
              } else if (value > 6000) {
                  value = 6000;
              }
              const settings = this.getSettings();
              this.devices.setLightTemp(settings.ip, value);
          });
      }

      if (isScenes) {
          this.scene = this.devices.getScene(this.ipAddr);
          this.setCapabilityValue('wiz_scene', this.scene.toString());
          this.registerCapabilityListener('wiz_scene', async (value) => {
              this.scene = value;
              const settings = this.getSettings();
              if (this.scene == 0) {
                  this.scene = 0;
                  this.devices.setLightTemp(settings.ip, 2700);
              } else {
                  this.devices.setLightScene(settings.ip, this.scene);
              }
          });
      }
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizTuneable has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      this.devices = new Command(settings.ip, null);
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   */
  async onRenamed(name) {
      this.log('WizTuneable was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
      clearInterval(this.pollingInterval);
  }

  // FLOW functions

  async createDimming(args, state) {
      if (args.hasOwnProperty('dim')) {
          this.callDimming(args.dim);
      }
  }

  async createKelvin(args, state) {
      if (args.hasOwnProperty('ktemp')) {
          this.callLightTemp(args.ktemp);
      }
  }

  async createWhiteC(args, state) {
      if (args.hasOwnProperty('scene')) {
          this.callSetScene(args.scene);
      }
  }

  // HELPER FUNCTIONS
  pollDevice(id, device) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          this.isState = this.devices.getState(this.ipAddr);
          this.setCapabilityValue('onoff', this.isState);
          this.dim = this.devices.getDimming(this.ipAddr);
          this.setCapabilityValue('dim', this.dim);
          this.temp = this.devices.getTemperature(this.ipAddr);
          this.setCapabilityValue('wiz_kelvin', this.temp);
          this.scene = this.devices.getScene(this.ipAddr);
      }, 600000);
  }

    callDimming(xdim) {
        this.devices.setBrightness(this.ipAddr, xdim);
    }

    callLightTemp(ktm) {
        this.devices.setLightTemp(this.ipAddr, ktm);
    }

    callSetScene(sce) {
        this.devices.setLightScene(this.ipAddr, sce);
    }
}

module.exports = WizTuneableDevice;
