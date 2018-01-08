
var sdsl = require('..');
var path = require('path');

exports['Define and execute fail with error'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('fail', { fail: true })
		.define('error', function (cmd, cb) { cb('error', null); })
		.define('end', { close: true });

	dsl.execute([ 'fail', 'error', 'end' ], function (err, data) {
        test.equal(err, null);
		test.equal(data, 'error');
        test.done();
    });
}

exports['Define and execute fail without error'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('fail', { fail: true })
		.define('ok', function (cmd, cb) { cb(null, null); })
		.define('end', { close: true });

	dsl.execute([ 'fail', 'ok', 'end' ], function (err, data) {
        test.ok(err);
        test.done();
    });
}
