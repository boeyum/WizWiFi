'use strict';

const { Driver } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class WizPowerSocketDriver extends Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        const pplugCard = this.homey.flow.getConditionCard('pplug_onoff');
        pplugCard.registerRunListener(async ({ device, message }) => {
            await device.flowOnOff(message);
        });

        const powerCard = this.homey.flow.getConditionCard('pplug_power');
        powerCard.registerRunListener(async ({ device, message }) => {
            await device.flowPower(message);
        });
    }

    async onPair(session) {
        var devices = [];

        session.setHandler("get_devices", async (data, callback) => {
            var CeD = new check();

            var devData = await CeD.connect(data.ipaddress, konst.LIGHT_POWERSOCKET);
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
                    "capabilities": ["onoff", "measure_power"]
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

module.exports = WizPowerSocketDriver;
