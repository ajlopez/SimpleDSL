
var lexers = require('./lexers');

function Command(text, argstext, verb, args) {
	this.text = function () { return text; };
	this.argumentsText = function () { return argstext; };
	this.verb = function () { return verb; };
	this.arguments = function () { return args; };
}

function Parser(options) {
	this.parse = function (cmdtext, verbdefs) {
		options = options || {};
		
		if (options.log)
			options.log(cmdtext);

		var lexer = lexers.lexer(cmdtext, options);
		
		var verb = lexer.getToken();
		
		if (!verb || verb.length == 0)
			return null;
		
		var ntokens = null;
		
		if (verbdefs && verbdefs[verb] && verbdefs[verb].options().arguments)
			ntokens = verbdefs[verb].options().arguments;
		
		var args = lexer.getTokens(ntokens);
		
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

