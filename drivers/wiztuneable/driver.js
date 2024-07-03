'use strict';

const { Driver, Device } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class WizTuneableDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
    async onInit() {
        const showTuneableActionCard = this.homey.flow.getActionCard('wtune_setdim');
        showTuneableActionCard.registerRunListener((args, state) => {
            return (args.device.createDimming(args, state));
        });

        const showKelvinActionCard = this.homey.flow.getActionCard('wtune_setkelvin');
        showKelvinActionCard.registerRunListener((args, state) => {
            return (args.device.createKelvin(args, state));
        }); 

        const showWCActionCard = this.homey.flow.getActionCard('wtune_setscene');
        showWCActionCard.registerRunListener((args, state) => {
            return (args.device.createWhiteC(args, state));
        });
   }


    async onPair(session) {
        var devices = [];

        session.setHandler("get_devices", async (data, callback) => {
            var CeD = new check();

            var devData = await CeD.connect(data.ipaddress, konst.LIGHT_TUNEABLE);
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
                    "capabilities": ["onoff", "dim", "wiz_kelvin", "wiz_scene"]
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

module.exports = WizTuneableDriver;
