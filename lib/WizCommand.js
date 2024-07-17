"use strict";

const Dgram = require('dgram');
const build = require('./messageBuilder');
const konst = require('./constants');

var state = false;
var mac = null;
var dimming = 50;
var temp = 2700;
var sceneId = 0;
var speed = 0;
var red = 255;
var green = 255;
var blue = 240;
var powerc = 0;
var ccol = 0;
var wcol = 0;
var func = [];
var moduleName = "";
var msgBuilder;

class WizCommand {
	// Constructor
	constructor(options = {}) {
		msgBuilder = new build();
	}

	// SET device functions
	async setOnOff(address, value) {
		var msg = msgBuilder.onoffMessage(value);
		await this.sendMessage(msg, address);
	}

	async setBrightness(address, level) {
		var msg = msgBuilder.dimmingMessage(level);
		if (msg != null) {
			await this.sendMessage(msg, address);
        }
	}

	async setLightTemp(address, level) {
		var msg = msgBuilder.lighttempMessage(level);
		if (msg != null) {
			await this.sendMessage(msg, address);
		}
	}

	async setColorRGB(address, red, green, blue) {
		var msg = msgBuilder.rgbMessage(red, green, blue);
		if (msg != null) {
			await this.sendMessage(msg, address);
		}
	}

	async setLightScene(address, scene) {
		var msg = msgBuilder.sceneMessage(scene, speed);
		if (msg != null) {
			await this.sendMessage(msg, address);
		}
	}

	async setLightSpeed(address, speed) {
		var msg = msgBuilder.speedMessage(speed);
		await this.sendMessage(msg, address);
	}



	// GET device functions
	getMacAdr(address) {
		this.getCommon(address);
		return mac;
	}

	getState(address) {
		this.getCommon(address);
		return state;
	}

	getDimming(address) {
		this.getCommon(address);
		return dimming;
	}

	getTemperature(address) {
		this.getCommon(address);
		return temp;
	}

	getRGB(address) {
		this.getCommon(address);
		return [red, green, blue];
	}

	getScene(address) {
		this.getCommon(address);
		return sceneId;
	}

	getSpeed(address) {
		this.getCommon(address);
		return speed;
	}

	getPower(address) {
		this.getCommon(address);
		return powerc;
	}

	getDeviceType() {
		return this.checkType(deviceName);
	}

	// Get Common
	async getCommon(address) {
		var msg = msgBuilder.getMessage();
		let sett = await this.getMessage(address, msg);
		if (sett != null) {
			state = sett.state;
			mac = sett.macAdr;
			dimming = sett.dim;
			temp = sett.temp;
			sceneId = sett.scene;
			speed = sett.speed;
			red = sett.red;
			green = sett.green;
			blue = sett.blue;
			powerc = sett.power;
			ccol = sett.ccol;
			wcol = sett.wcol;
		}
	}

	// Maintenance fuctions 

	validateIPaddress(ipaddress) {
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
			return (true)
		}
		return (false)
	}

	formater(data) {
		var newString = data.charAt(0) + data.charAt(1) + ':' + data.charAt(2) + data.charAt(3) + ':' + data.charAt(4) + data.charAt(5) + ':' + data.charAt(6) + data.charAt(7) + ':' + data.charAt(8) + data.charAt(9) + ':' + data.charAt(10) + data.charAt(11);
		return newString;
	}

	reformater(data) {
		var newString = data.charAt(0) + data.charAt(1) + data.charAt(3) + data.charAt(4) + data.charAt(6) + data.charAt(7) + data.charAt(9) + data.charAt(10) + data.charAt(12) + data.charAt(13) + data.charAt(15) + data.charAt(16);
		return newString;
	}


	// Get constants values
	constDimmable() {
		return konst.LIGHT_DIMMABLE;
	}

	constTuneable() {
		return konst.LIGHT_TUNEABLE;
	}

	constColor() {
		return konst.LIGHT_COLOR;
	}

	constSocket() {
		return konst.LIGHT_SOCKET;
	}

	constPowersocket() {
		return konst.LIGHT_POWERSOCKET;
	}


	// Help functions
	parseRegistration(messg) {
		var JSonObj = JSON.stringify(msg.toString('utf8'));
		if (JSonObj.hasOwnProperty('mac')) {
			mac = JSonObj.mac;
		}
		if (JSonObj.hasOwnProperty('moduleName')) {
			moduleName = JSonObj.moduleName;
		}
	}

	async getMessage(ipAdr, cmnd) {
		return new Promise(function (resolve, reject) {
			const client = Dgram.createSocket('udp4');

			const id = setTimeout(() => {
				clearTimeout(id);
				client.close();
				resolve(null);
			}, 5000);

			process.on('unhandledRejection', error => {
				clearTimeout(id);
				resolve(null);
			});

			client.on('message', function (msg, info) {
				clearTimeout(id);
				client.close();
				var koding = null;
				let str = msg.toString('utf8');
				var obj = JSON.parse(str);
				var wmac;
				var wrkstate;
				var wdimming;
				var wtemp;
				var wred;
				var wgreen;
				var wblue;
				var wsceneId;
				var wccol;
				var wwcol;
				var wspeed;
				var wpowerc;

				if (str.includes('"mac"')) {
					wmac = obj.result.mac;
				} else {
					wmac = 'none';
				}
				if (str.includes('"state"')) {
					wrkstate = obj.result.state;
				} else {
					wrkstate = false;
				}
				if (str.includes('"dimming"')) {
					wdimming = obj.result.dimming;
				} else {
					wdimming = 0;
				}
				if (str.includes('"temp"')) {
					wtemp = obj.result.temp;
				} else {
					wtemp = 0;
				}
				if (str.includes('"r"')) {
					wred = obj.result.r;
					wgreen = obj.result.g;
					wblue = obj.result.b;
				} else {
					wred = 0;
					wgreen = 0;
					wblue = 0;
				}
				if (str.includes('"sceneId"')) {
					wsceneId = obj.result.sceneId;
				} else {
					wsceneId = 0;
				}
				if (str.includes('"c"')) {
					wccol = obj.result.c;
				} else {
					wccol = 0;
				}
				if (str.includes('"w"')) {
					wwcol = obj.result.w;
				} else {
					wwcol = 0;
				} 
				if (str.includes('"speed"')) {
					wspeed = obj.result.speed;
				} else {
					wspeed = 0;
				}
				if (str.includes('"pc"')) {
					wpowerc = obj.result.pc;
				} else {
					wpowerc = 0;
				}

				let datasett = {
					"macAdr": wmac,
					"state": wrkstate,
					"dim": wdimming,
					"temp": wtemp,
					"red": wred,
					"green": wgreen,
					"blue": wblue,
					"scene": wsceneId,
					"ccol": wccol,
					"wcol": wwcol,
					"speed": wspeed,
					"power": wpowerc
				};

				resolve(datasett);
			});

			client.send(cmnd, 0, cmnd.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
				if (err) {
					clearTimeout(id);
					success = false;
					consol.log(err);
					resolve(null);
				}
			});
		});

	}

	async sendMessage(message, ipAdr) {
		return new Promise(function (resolve, reject) {
			const client = Dgram.createSocket('udp4');

			process.on('unhandledRejection', error => {
				resolve(false);
			});

			client.on('message', function (msg, info) {
				client.close();
				var JSonObj = JSON.parse(msg.toString('utf8'));
				if (JSonObj.hasOwnProperty('success')) {
					let wsuccess = JSonObj.result.success;
					resolve(wsuccess);
				}
				resolve(false);
			});

			client.send(message, 0, message.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
				if (err) {
					client.close();
					resolve(false);
				}
			});
		});
	}

}
module.exports = WizCommand;