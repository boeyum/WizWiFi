"use strict";

const Dgram = require('dgram');
const build = require('./messageBuilder');
const konst = require('./constants');

var cmnd;
var isPower = false;

class WizConnect {

    async connect(ipAdr, devtype) {
        let res = await this.getConnection(ipAdr);
        if (res == null) {
            return null;
        }
        let mac = res.macAdr;
        let str = res.modTyp;
        let modelType = Number(str);

        if (modelType == konst.LIGHT_SOCKET) {
            let rok = await this.isPowerSocket(ipAdr);
            isPower = rok.found;
            if (isPower) {
                modelType = konst.LIGHT_POWERSOCKET;
            }
        }
        let fmac = this.formater(mac);
        if (devtype == modelType) {
            let deviceData = {
                "id": mac,
                "ipadr": ipAdr,
                "macadr": fmac
            };
            return deviceData;
        } else {
            return null;
        }
    }

    async getConnection(ipAdr) {
        return new Promise(function (resolve, reject) {
            var bld = new build();
            cmnd = bld.configMessage();
            const client = Dgram.createSocket('udp4');

            process.on('unhandledRejection', error => {
                if (client) {
                    client.close();
                }
            });

            client.on('message', function (msg, info) {
                client.close();
                var koding = null;
                var jString = msg.toString('utf8');
                let JSonObj = JSON.parse(jString);
                let vmac = JSonObj.result.mac;
                let vmoduleName = JSonObj.result.moduleName;
                var model = 0;
                var modType = 0;
                var funks = 0;
                for (var x = 1; x < 99; x++) {
                    var chk = null;
                    if (x < 10) {
                        chk = "ESP0" + x.toString();
                    } else {
                        chk = "ESP" + x.toString();
                    }
                    if (vmoduleName.includes(chk)) {
                        model = x;
                        x = 100;
                    }
                }

                if (vmoduleName.includes("SOCKET")) {
                    modType = konst.LIGHT_SOCKET;
                }

                if (vmoduleName.includes("RGB")) {
                    modType = konst.LIGHT_COLOR;
                }

                if (vmoduleName.includes("TW")) {
                    modType = konst.LIGHT_TUNEABLE;
                }

                if (vmoduleName.includes("DW")) {
                    modType = konst.LIGHT_DIMMABLE;
                }
                var mt = modType.toString();
                if (modType > 0) {
                    let result = {
                        "macAdr": vmac,
                        "modTyp": mt
                    }
                    resolve(result);
                }
                resolve(null);
            });

            client.send(cmnd, 0, cmnd.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
                if (err) {
                    client.close();
                    success = false;
                    consol.log(err);
                    resolve(null);
                }
            });
        });
    }

    async isPowerSocket(ipAdr) {
        return new Promise(function (resolve, reject) {
            var bld = new build();
            cmnd = bld.getMessage();
            const client = Dgram.createSocket('udp4');

            process.on('unhandledRejection', error => {

            });

            client.on('message', function (msg, info) {
                client.close();
                var koding = null;
                let str = msg.toString('utf8');
                if (str.includes('"pc"')) {
                    let result = {
                        "found": true
                    };
                    resolve(result);
                 } else {
                    let result = {
                        "found": true
                    };
                    resolve(result);
                }
                resolve(null);
            });

            client.send(cmnd, 0, cmnd.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
                if (err) {
                    client.close();
                    consol.log(err);
                    msg.toString('utf8')(false);
                }
            });
        });
    }

    formater(data) {
        var newString = data.charAt(0) + data.charAt(1) + ':' + data.charAt(2) + data.charAt(3) + ':' + data.charAt(4) + data.charAt(5) + ':' + data.charAt(6) + data.charAt(7) + ':' + data.charAt(8) + data.charAt(9) + ':' + data.charAt(10) + data.charAt(11);
        return newString;
    }

    reformater(data) {
        var newString = data.charAt(0) + data.charAt(1) + data.charAt(3) + data.charAt(4) + data.charAt(6) + data.charAt(7) + data.charAt(9) + data.charAt(10) + data.charAt(12) + data.charAt(13) + data.charAt(15) + data.charAt(16);
        return newString;
    }
}
module.exports = WizConnect;