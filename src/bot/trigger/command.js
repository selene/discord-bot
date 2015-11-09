var Base = require('./base');
var util = require("util");

var Command = function(command) {
	console.log(command);
	Base.call(this);
	this.command = command;
};

util.inherits(Command, Base);

Command.prototype._parseArgs = function(rawArgs) {
	var args = [];
	var argi = 0;
	var escaped = false;
	var inquotes = false;
	for (var i = 0; i < rawArgs.length; i++) {
		var c = rawArgs[i];

		if (c == '\\') {
			escaped = true;
		} else {
			if (c == ' ' && !inquotes && args[argi]) {
				argi++;
			} else if (c == '"' && !escaped && inquotes) {
				inquotes = false;
			} else if (c == '"' && !escaped && !inquotes) {
				inquotes = true;
			} else {

				if (!args[argi])
					args[argi] = '';

				args[argi] += c;
			}

			escaped = false;
		}
	}

	return args;
};

Command.prototype.run = function(bot) {
	var that = this;

	var cmdStartLength = this.command.length + 1;

	bot.client.on('message', function(message) {
		if (message.content.substr(0, cmdStartLength) != '!' + that.command)
			return;

		var rawArgs = message.content.substr(cmdStartLength);
		var cmdArgs = rawArgs
			? that._parseArgs(rawArgs)
			: [];

		that.execute(bot, {
			message: message,
			commandArgs: rawArgs
		});
	});
};

module.exports = Command;
