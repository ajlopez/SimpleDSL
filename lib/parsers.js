
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
		
		cmd.text = cmdtext;
		cmd.argstext = argstext;

		if (verb && verb != '')
			cmd.verb = verb;
			
		var delimiter;
		
		if (options.delimiter)
			delimiter = options.delimiter;
		else
			delimiter = /\s+/;
		
		if (argstext)
			cmd.args = argstext.split(delimiter);
		else
			cmd.args = [];
			
		for (var k = 0; k < cmd.args.length; k++) {
			var arg = cmd.args[k].trim();
			
			if (arg[0] === '{' && arg[arg.length - 1] === '}') {
				eval('arg = ' + arg);
				cmd.args[k] = arg;
			}
		}

		return cmd;		
	}
}

function createParser(options) {
	return new Parser(options);
}

module.exports = {
	parser: createParser
};

