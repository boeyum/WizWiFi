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

var stat = 0;
var dim = 0;
var scene = 0;
var temp = 0;

class WizTuneableDevice extends Device {

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
      isDimming = true;
      isTemp = true;
      isScenes = true;

      stat = isState;

      this.pollDevice(id, devices);

      this.setCapabilityValue('onoff', stat);
      this.registerCapabilityListener('onoff', async (value) => {
          stat = value;
          const settings = this.getSettings();
          return await devices.setOnOff(settings.ip, value);
      });

      if (isDimming) {
          dim = devices.getDimming(ipAddr);
          this.setCapabilityValue('dim', dim);
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

      if (isTemp) {
          temp = devices.getTemperature(ipAddr);
          this.setCapabilityValue('wiz_kelvin', temp);
          this.registerCapabilityListener('wiz_kelvin', async (value) => {
              if (value < 2100) {
                  value = 2100;
              } else if (value > 6000) {
                  value = 6000;
              }
              const settings = this.getSettings();
              devices.setLightTemp(settings.ip, value);
          });
      }

      if (isScenes) {
          this.registerCapabilityListener('wiz_scene', async (value) => {
              scene = devices.getScene(ipAddr);
              this.setCapabilityValue('wiz_scene', scene);
              const settings = this.getSettings();
              if (scene == 0) {
                  scene = 0;
                  devices.setLightTemp(settings.ip, 2700);
              } else {
                  devices.setLightScene(settings.ip, this.scene);
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
      devices = new Command(ipAddr, null);
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
  async flowOnOff() {
      return devices.getState(ipAddr);
  }

  async createDimming(args) {
      const { dim } = args;
      devices.setBrightness(ipAddr, dim);
  }

  async createKelvin(args) {
      const { ktemp } = args;
      devices.setLightTemp(ipAddr, ktemp);
  }

  async createWhiteC(args) {
      const { id } = args;
      devices.onLightScene(ipAddr, id);
  }

  // HELPER FUNCTIONS
  pollDevice(id, device) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          state = devices.getState(ipAddr);
          setCapabilityValue('onoff', state);
          dim = devices.getDimming(ipAddr);
          this.setCapabilityValue('dim', dim);
          temp = devices.getTemperature(ipAddr);
          this.setCapabilityValue('wiz_kelvin', temp);
          scene = devices.getScene(ipAddr);
          this.setCapabilityValue('wiz_scene', scene);
      }, 600000);
  }

}

module.exports = WizTuneableDevice;
