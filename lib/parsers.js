
var lexers = require('./lexers');

function Command(text, argstext, verb, args) {
	this.text = function () { return text; };
	this.argumentsText = function () { return argstext; };
	this.verb = function () { return verb; };
	this.arguments = function () { return args; };
}

function Parser(options) {
	this.parse = function (cmdtext) {
		options = options || {};
		
		if (options.log)
			options.log(cmdtext);

		var tokens = lexers.lexer(cmdtext, options).getTokens();
		
		if (tokens.length === 0)
			return null;
		
		var verb = tokens[0];
		var args = tokens.slice(1);
		
		var p = cmdtext.indexOf(verb);
		
		var argstext = cmdtext.substring(p + verb.length).trim();

		var cmd = { };
		
		return new Command(cmdtext, argstext, verb, args);
	}
}

function createParser(options) {
	return new Parser(options);
}

module.exports = {
	parser: createParser
};

