var Base = require('./base');
var util = require("util");

var React = function(pattern) {
	Base.call(this);
	this.pattern = pattern;
};

util.inherits(React, Base);

React.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		if (!message.content.match(that.pattern))
			return;

		that.execute(bot, message);
	});
};

module.exports = React;
