
var sdsl = require('..');
var path = require('path');

exports['Define and execute block verb returning false'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { block: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true });

	dsl.execute([ 'false', 'fail', 'end' ], function (err, data) {
        test.equal(err, null);
        test.done();
    });
}

exports['Define and execute block verb returning true'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('true', function (cmd, cb) { cb(null, true); }, { block: true })
		.define('one', function (cmd, cb) { cb(null, 1); })
		.define('end', { close: true });

	dsl.execute([ 'true', 'one', 'end' ], function (err, data) {
        test.equal(err, null);
		test.equal(data, 1);
        test.done();
    });
}

exports['Define and execute block verb returning false skipping fail'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { block: true })
		.define('fail', function (cmd, cb) { test.fail(); })
		.define('end', { close: true })
		.define('one', function (cmd, cb) { cb(null, 1); });

	dsl.execute([ 'false', 'fail', 'end', 'one' ], function (err, data) {
        test.equal(err, null);
		test.equal(data, 1);
        test.done();
    });
}

