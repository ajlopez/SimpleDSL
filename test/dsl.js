
var sdsl = require('..');

exports['Create dsl'] = function (test) {
    var dsl = sdsl.dsl();
    
    test.ok(dsl);
    test.equal(typeof dsl, 'object');   
}

exports['Register and execute verb'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.register('foo', function (cmd, cb) { cb(null, 1); });
    dsl.execute('foo', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Register and execute verb with spaces'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.register('foo', function (cmd, cb) { cb(null, 1); });
    dsl.execute('  foo   ', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with verb'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        cb(null, 1); 
    });
    
    dsl.execute('  foo   ', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}
