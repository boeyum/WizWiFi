'use strict';

const { Device } = require('homey');
const tinycolor = require('tinycolor2');
const util = require('util');
const Command = require('../../lib/WizCommand');

var id = null;
var ipAddr = null;
var devices = null;
var isState = false;
var isDimming = true;
var isTemp = true;
var isColor = true;
var isScenes = true;
var sce = 0;
var red = 255;
var grn = 255;
var blu = 255;
var hue = 60;
var sat = 100;
var lig = 100;
var tmp = 2700;
var kod = 0;

class WizColorDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      this.id = this.getData().id;
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      this.devices = new Command(ipAddr, null);
 
      this.isState = this.devices.getState(this.ipAddr);
      this.isDimming = true;
      this.isTemp = true;
      this.isColor = true;
      this.isScenes = true;

      this.pollDevice(this.id, this.devices);

      this.kod = this.devices.getState(this.ipAddr);
      this.setCapabilityValue('onoff', this.kod);
      this.registerCapabilityListener('onoff', async (value) => {
          this.isState = value;
          const settings = this.getSettings();
          return await this.devices.setOnOff(settings.ip, value);
      });

      if (isDimming) {
          var dimdata = this.devices.getDimming(this.ipAddr);
          this.setCapabilityValue('dim', dimdata);
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

      if (isColor) {
          let rbgdata = this.devices.getRGB(this.ipAddr);
          this.red = rbgdata[0];
          this.grn = rbgdata[1];
          this.blu = rbgdata[2];
          let jrbg = util.format("rgb %d %d %d", this.red, this.green, this.blue);

          const { h, s, v } = tinycolor(jrbg).toHsv();

          this.setCapabilityValue('light_hue', h / 360);
          this.setCapabilityValue('light_saturation', s / 100);

          this.registerMultipleCapabilityListener(['light_hue', 'light_saturation', 'light_mode', 'light_temperature'], this.onCapabilityLight.bind(this), 200);

      }

      if (isScenes) {
          this.registerCapabilityListener('wiz_colorscene', async (value) => {
              sce = parseInt(value);
              const settings = this.getSettings();
              if (sce == 0) {
                  sce = 0;
                  this.devices.setLightTemp(settings.ip, 2700);
              } else {
                  this.devices.setLightScene(settings.ip, sce);
              }
          });
      }
  }

  /**
   * Helping function for capability listner for color lamps
   */
    async onCapabilityLight({
        light_mode = this.getCapabilityValue('light_mode'),
        light_hue = this.getCapabilityValue('light_hue'),
        light_saturation = this.getCapabilityValue('light_saturation'),
        light_temperature = this.getCapabilityValue('light_temperature'),
    }) {
        this.hue = light_hue * 360;
        this.sat = light_saturation * 100;
        this.lig = 50;
        this.tmp = light_temperature;
        let jhsl = util.format("hsl %d %d 50", this.hue, this.sat);
        const kode = tinycolor(jhsl).toRgb();
        this.red = kode.r;
        this.grn = kode.g;
        this.blu = kode.b;
        const settings = this.getSettings();
        if (this.isState) {
            this.devices.setColorRGB(settings.ip, this.red, this.grn, this.blu);
        }
    }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('WizColor has been added');
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
      this.log('WizColor device was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
      clearInterval(this.pollingInterval);
  }

  // FLOW functions

  async createDimming(args) {
      if (args.hasOwnProperty('dim')) {
          this.callDimming(args.dim);
      }
  }

  async createColorScene(args) {
      if (args.hasOwnProperty('colorscene')) {
          this.callScene(args.colorscene);
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
          this.tmp = this.devices.getTemperature(this.ipAddr);
          this.sce = this.devices.getScene(this.ipAddr);
          let _rbgdata = this.devices.getRGB(this.ipAddr);
          this.red = _rbgdata[0];
          this.grn = _rbgdata[1];
          this.blu = _rbgdata[2];
          let jrbg = util.format("{ r: %s, g: %s, b: %s }", this.red, this.grn, this.blu);
          const { h, s, v } = tinycolor(jrbg).toHsv();
          this.hue = h;
          this.sat = s;
          this.setCapabilityValue('light_hue', (this.hue / 360));
          this.setCapabilityValue('light_saturation', this.sat);
      }, 600000);
  }

  callDimming(xdim) {
      this.devices.setBrightness(this.ipAddr, xdim);
  }

  callScene(sid) {
      var sce = parseInt(sid);
      this.devices.setLightScene(this.ipAddr, sce);
  }

}

module.exports = WizColorDevice;
