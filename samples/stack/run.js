
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
.define('dup', function (cmd, next) {
	var value = stack[stack.length - 1];
	stack.push(value);
	next(null, value);
})
.define('add', function (cmd, next) {
	next(null, stack.push(stack.pop() + stack.pop()));
})
.define('dump', function (cmd, next) {
	console.dir(stack);
	next(null, null);
})

function evaluate(cmd) {
	return eval(cmd.argumentsText());
}

var filename = process.argv[2];

dsl.executeFile(filename, function (err, data) {
	if (err)
		console.error(err);
});



