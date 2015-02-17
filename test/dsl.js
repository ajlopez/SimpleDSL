
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

exports['Receives command with arguments'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        cb(null, 1); 
    });
    
    dsl.execute('foo arg1 arg2', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with arguments and spaces'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        cb(null, 1); 
    });
    
    dsl.execute(' foo  arg1   arg2  ', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with arguments and delimiter'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl({ delimiter: ';' });
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        cb(null, 1); 
    });
    
    dsl.execute(' foo  arg1;arg2 ', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with arguments and comment'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl({ delimiter: ';', comment: '#' });
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        cb(null, 1); 
    });
    
    dsl.execute(' foo  arg1;arg2 # a comment', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

