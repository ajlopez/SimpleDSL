
var sdsl = require('..');
var path = require('path');

exports['Define and execute conditional verb returning false'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('false', function (cmd, cb) { cb(null, false); }, { conditional: true })
		.define('fail', function (cmd, cb) { test.fail(); });

	dsl.execute([ 'false', 'fail' ], function (err, data) {
        test.equal(err, null);
        test.done();
    });
}
