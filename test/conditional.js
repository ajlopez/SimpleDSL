
var sdsl = require('..');
var path = require('path');

exports['Define and execute conditional verb returning false'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { conditional: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true });

	dsl.execute([ 'false', 'fail', 'end' ], function (err, data) {
        test.equal(err, null);
        test.done();
    });
}

exports['Define and execute conditional verb returning true'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('true', function (cmd, cb) { cb(null, true); }, { conditional: true })
		.define('one', function (cmd, cb) { cb(null, 1); });

	dsl.execute([ 'true', 'one' ], function (err, data) {
        test.equal(err, null);
		test.equal(data, 1);
        test.done();
    });
}

exports['Define and execute conditional verb returning false skipping fail'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { conditional: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true })
		.define('one', function (cmd, cb) { cb(null, 1); });

	dsl.execute([ 'false', 'fail', 'end', 'one' ], function (err, data) {
        test.equal(err, null);
		test.equal(data, 1);
        test.done();
    });
}

exports['Execute else'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
	
	var done = false;
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { conditional: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true })
		.define('done', function (cnd, cb) { done = true; cb(null, null) })
		.define('else', { else: true });

	dsl.execute(
		[ 
			'false', 
				'fail', 
			'else',
				'done',
			'end'
		], function (err, data) {
			test.equal(err, null);
			test.equal(data, null);
			test.ok(done);
			test.done();
    });
}

