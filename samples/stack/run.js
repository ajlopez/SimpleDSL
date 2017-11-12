
var simpledsl = require('../..');

var dsl = simpledsl.dsl();

var stack = [];

dsl
.define('push', function (cmd, next) {
	var value = evaluate(cmd);
	stack.push(value);
	next(null, value);
})
.define('pop', function (cmd, next) {
	next(null, stack.pop());
})
.define('dump', function (cmd, next) {
	console.dir(stack);
	next(null, null);
})

function evaluate(cmd) {
	return eval(cmd.argstext());
}

process.argv.slice(2).forEach(function (filename) {
	dsl.executeFile(filename);
});


