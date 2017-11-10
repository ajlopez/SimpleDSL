
function Command(text, argstext, verb, args) {
	this.text = function () { return text; };
	this.argumentsText = function () { return argstext; };
	this.verb = function () { return verb; };
	this.arguments = function () { return args; };
}

function Parser(options) {
	this.parse = function (cmdtext) {
		options = options || {};
		cmdtext = cmdtext.trim();
		
		if (options.log)
			options.log(cmdtext);
		
		if (options.comment) {
			var p = cmdtext.indexOf(options.comment);
			
			if (p >= 0)
				cmdtext = cmdtext.substring(0, p);
		}
		
		var p = cmdtext.search(/\s+/);
		
		var verb;
		var argstext;
		
		if (p >= 0) {
			verb = cmdtext.substring(0, p).trim();
			argstext = cmdtext.substring(p + 1).trim();
		}
		else
			verb = cmdtext.trim();

		var cmd = { };
		
		var delimiter;
		
		if (options.delimiter)
			delimiter = options.delimiter;
		else
			delimiter = /\s+/;
		
		if (argstext)
			var args = argstext.split(delimiter);
		else
			var args = [];
			
		for (var k = 0; k < args.length; k++) {
			var arg = args[k].trim();
			
			if (arg[0] === '{' && arg[arg.length - 1] === '}') {
				eval('arg = ' + arg);
				args[k] = arg;
			}
		}

		return new Command(cmdtext, argstext, verb, args);
	}
}

function createParser(options) {
	return new Parser(options);
}

module.exports = {
	parser: createParser
};

