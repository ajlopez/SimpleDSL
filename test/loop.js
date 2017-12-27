
var sdsl = require('..');
var path = require('path');

exports['Define and execute loop verb returning false'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('while', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); }, { loop: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true });

	dsl.execute([ 'while false', 'fail', 'end' ], function (err, data) {
        test.equal(err, null);
        test.done();
    });
}

exports['Define and execute loop verb many times'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
	
	var x = 0;
    
    dsl
		.define('while', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); }, { loop: true })
		.define('eval', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); })
		.define('end', { close: true });

	dsl.execute([ 'while x < 10', 'eval x++', 'end' ], function (err, data) {
        test.equal(err, null);
		test.equal(x, 10);
        test.done();
    });
}

exports['Define and execute loop verb many times until break'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
	
	var x = 0;
    
    dsl
		.define('while', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); }, { loop: true })
		.define('if', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); }, { conditional: true })
		.define('eval', function (cmd, cb) { cb(null, eval(cmd.argumentsText())); })
		.define('break', { break: true })
		.define('end', { close: true });

	dsl.execute(
		[
			'while x < 20',
				'if x == 10',
					'break',
				'end',
				'eval x++', 
			'end'			
		], function (err, data) {
			test.equal(err, null);
			test.equal(x, 10);
			test.done();
    });
}

