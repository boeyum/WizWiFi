'use strict';

const { Driver } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class WizSocketDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
      const splugCard = this.homey.flow.getConditionCard('splug_onoff');
      splugCard.registerRunListener(async ({ device, message }) => {
          await device.flowOnOff(message);
      });
  }

  async onPair(session) {
      var devices = [];

      session.setHandler("get_devices", async (data, callback) => {
          var CeD = new check();

          var devData = await CeD.connect(data.ipaddress, konst.LIGHT_SOCKET);
          if (devData != null) {
              var deviceDescriptor = {
                  "name": data.deviceName,
                  "data": {
                      "id": devData.id,
                      "ipadr": devData.ipadr,
                      "macadr": devData.macadr
                  },
                  "settings": {
                      "ip": devData.ipadr,
                      "mac": devData.macadr
                  },
                  "capabilities": ["onoff"]
              };
              devices.push(deviceDescriptor);
              session.emit("found", null);
          } else {
              session.emit("not_found", null);
          }
      });

      session.setHandler("list_devices", function (data, callback) {
          return devices;
      });
  }


  async onPairListDevices() {
    return [];
  }


}

module.exports = WizSocketDriver;
