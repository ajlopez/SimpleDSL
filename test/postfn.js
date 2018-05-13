
var sdsl = require('..');
var path = require('path');

exports['Define and execute verb with post function'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
	
	var error = true;
	var result = true;
    
    dsl.define('foo', function (cmd, cb) { cb(null, 1); }, { postfn: function (err, data, cb) {
		error = err;
		result = data;
		cb(err, data);
	}});
	
    dsl.execute('foo', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
		test.equal(error, null);
		test.equal(result, 1);
        test.done();
    });
}
