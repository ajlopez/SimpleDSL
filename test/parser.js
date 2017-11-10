
var parsers = require('../lib/parsers');

exports['parse simple line'] = function (test) {
	var parser = parsers.parser();
	
	var result = parser.parse('verb arg1 arg2');
	
	test.ok(result);
	test.equal(result.verb(), 'verb');
	test.equal(result.text(), 'verb arg1 arg2');
	test.equal(result.argumentsText(), 'arg1 arg2');
	test.deepEqual(result.arguments(), ['arg1', 'arg2']);
}

