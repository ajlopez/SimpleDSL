
var sdsl = require('..');
var path = require('path');

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

exports['Receives command with arguments and additional data'] = function (test) {
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
		test.equal(cmd.text, 'foo arg1 arg2');
		test.equal(cmd.argstext, 'arg1 arg2');
        cb(null, 1); 
    });
    
    dsl.execute('foo arg1 arg2', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with arguments and tabs'] = function (test) {
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
    
dsl.execute('\tfoo\targ1\targ2\t', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with JSON argument'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl({ delimiter: ';' });
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 1);
        test.deepEqual(cmd.args[0], { name: 'Adam', age: 800 });
        cb(null, 1); 
    });
    
    dsl.execute('foo { name: "Adam", age: 800 }', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Logs command with arguments'] = function (test) {
    test.async();
    
    var log = '';
    
    var dsl = sdsl.dsl({ log: function (text) { log += text + '\n'; }});
    
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
        test.equal(log, 'foo arg1 arg2\n');
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

exports['Execute two commands in two lines'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    var counter = 0;
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        counter++;
        cb(null, counter); 
    });
    
    dsl.register('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'bar');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg3');
        test.equal(cmd.args[1], 'arg4');
        counter++;
        cb(null, counter); 
    });
    
    dsl.execute('foo arg1 arg2\nbar arg3 arg4', function (err, data) {
        test.equal(err, null);
        test.equal(data, 2);
        test.equal(counter, 2);
        test.done();
    });
}

exports['Execute two commands in three lines'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    var counter = 0;
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        counter++;
        cb(null, counter); 
    });
    
    dsl.register('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'bar');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg3');
        test.equal(cmd.args[1], 'arg4');
        counter++;
        cb(null, counter); 
    });
    
    dsl.execute('foo arg1 arg2\n\nbar arg3 arg4', function (err, data) {
        test.equal(err, null);
        test.equal(data, 2);
        test.equal(counter, 2);
        test.done();
    });
}

exports['Execute two commands from file'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    var counter = 0;
    
    dsl.register('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'foo');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg1');
        test.equal(cmd.args[1], 'arg2');
        counter++;
        cb(null, counter); 
    });
    
    dsl.register('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb, 'bar');
        test.ok(cmd.args);
        test.equal(cmd.args.length, 2);
        test.equal(cmd.args[0], 'arg3');
        test.equal(cmd.args[1], 'arg4');
        counter++;
        cb(null, counter); 
    });
    
    dsl.executeFile(path.join(__dirname, 'files', 'twocommands.txt'), function (err, data) {
        test.equal(err, null);
        test.equal(data, 2);
        test.equal(counter, 2);
        test.done();
    });
}

exports['Execute file with only comments'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl({ comment: '#' });

    dsl.executeFile(path.join(__dirname, 'files', 'comments.txt'), function (err, data) {
        test.equal(err, null);
        test.equal(data, null);
        test.done();
    });
}

