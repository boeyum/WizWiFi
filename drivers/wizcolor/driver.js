'use strict';

const { Driver } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class WizColorDriver extends Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        const colooCard = this.homey.flow.getConditionCard('wfcolor_onoff');
        colooCard.registerRunListener(async ({ device, message }) => {
            await device.flowOnOff(message);
        });

        const showColScnActionCard = this.homey.flow.getActionCard('wfcolor_setcolor');
        showColScnActionCard.registerRunListener(async ({ device, message }) => {
            await device.createColorScene(message);
        });

        const showColorActionCard = this.homey.flow.getActionCard('wfcolor_setdim');
        showColorActionCard.registerRunListener(async ({ device, message }) => {
            await device.createDimming(message);
        });
    }

    async onPair(session) {
        var devices = [];

        session.setHandler("get_devices", async (data, callback) => {
            var CeD = new check();

            var devData = await CeD.connect(data.ipaddress, konst.LIGHT_COLOR);
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
                    "capabilities": ["onoff", "dim", "light_hue", "light_saturation", "light_temperature", "light_mode", "wiz_colorscene"]
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

module.exports = WizColorDriver;
