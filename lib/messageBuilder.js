"use strict";

const util = require('util');

class messageBuilder {
	constructor(options = {}) {
	}

	registration() {
		var msg = '{"method":"registration","params":{"phoneMac":"AAAAAAAAAAAA","register":false,"phoneIp":"1.2.3.4","id":"1"}}';
		return msg;
	}

    onoffMessage(value) {
		if (value) {
			var msg = '{"method":"setPilot","params":{"state":true}}';
		} else {
			var msg = '{"method":"setPilot","params":{"state":false}}';
		}
		return msg;
	}

	dimmingMessage(level) {
		if (level => 0 && level <= 100) {
			return util.format('{"method":"setPilot","params":{"dimming":%d}}', level);
		}
		return null;
	}

	lighttempMessage(level) {
		if (level => 0 && level <= 100) {
			return util.format('{"method":"setPilot","params":{"temp":%d}}', level);
		}
		return null;
	}

	rgbMessage(red, green, blue) {
		if (red => 0 && red <= 255) {
			if (green => 0 && green <= 255) {
				if (blue => 0 && blue <= 255) {
					return util.format('{"method":"setPilot","params":{"r":%d,"g":%d,"b":%d}}', Math.round(red), Math.round(green), Math.round(blue));
				}
			}
		}
		return null;
	}

	sceneMessage(scene, speed) {
		if (scene => 1 && scene <= 32) {
			if (speed => 0 && speed <= 100) {
				return util.format('{"method":"setPilot","params":{"sceneId":%d}}', scene);
			}
		} else if (scenes == 1000) {
			if (speed => 0 && speed <= 100) {
				return '{"method":"setPilot","params":{"sceneId":1000}}';
			}
		}
		return null;
	}

	speedMessage(speed) {
		return util.format('{"method":"setPilot","params":{"speed":%d}}', speed);
	}

	getMessage() {
		return '{"method":"getPilot","params":{}}';
	}

	configMessage() {
		return '{"method":"getSystemConfig","params":{}}';
    }
}
module.exports = messageBuilder;