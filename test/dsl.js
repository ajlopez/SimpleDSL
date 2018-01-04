
var sdsl = require('..');
var path = require('path');

exports['Create dsl'] = function (test) {
    var dsl = sdsl.dsl();
    
    test.ok(dsl);
    test.equal(typeof dsl, 'object');   
}

exports['Execute unknown verb'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();

	try {
		dsl.execute('foo', function (err, data) {
			test.equal(err, null);
			test.equal(data, 1);
			test.done();
		});
		
		test.fail();
	}
	catch (ex) {
		test.equal(ex, 'Error: unknown verb "foo"');
		test.done();
	}
}

exports['Define and execute verb'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { cb(null, 1); });
    dsl.execute('foo', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Define and execute verb with function that raise exception'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { throw "error"; });
    dsl.execute('foo', function (err, data) {
        test.equal(err, "error");
        test.ok(!data);
        test.done();
    });
}

exports['Define and execute verb with arguments'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { cb(null, cmd.arguments()); });
    dsl.execute('foo one two three', function (err, data) {
        test.equal(err, null);
        test.deepEqual(data, ['one', 'two', 'three']);
        test.done();
    });
}

exports['Define and execute verb with arguments in multiline'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl
		.define('foo', function (cmd, cb) { cb(null, cmd.arguments()); })
		.define('{{{', { multiline: '}}}' });
		
    dsl.execute([
			'{{{',
				'foo',
				'one',
				'two',
				'three',
			'}}}'
		], function (err, data) {
        test.equal(err, null);
        test.deepEqual(data, ['one', 'two', 'three']);
        test.done();
    });
}

exports['Define and execute verb with two arguments'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { cb(null, cmd.arguments()); }, { arguments: 2 });
    dsl.execute('foo one two three', function (err, data) {
        test.equal(err, null);
        test.deepEqual(data, ['one', 'two three']);
        test.done();
    });
}

exports['Define and execute verb with spaces'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { cb(null, 1); });
    dsl.execute('  foo   ', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Receives command with verb'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
		test.equal(cmd.text(), 'foo arg1 arg2');
		test.equal(cmd.argumentsText(), 'arg1 arg2');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
        cb(null, 1); 
    });
    
	dsl.execute('\tfoo\targ1\targ2\t', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Logs command with arguments'] = function (test) {
    test.async();
    
    var log = '';
    
    var dsl = sdsl.dsl({ log: function (text) { log += text + '\n'; }});
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
        cb(null, 1); 
    });
    
    dsl.execute(' foo  arg1;arg2 # a comment', function (err, data) {
        test.equal(err, null);
        test.equal(data, 1);
        test.done();
    });
}

exports['Execute two commands in two lines using chaining'] = function (test) {
    test.async();
    
    var dsl = sdsl.dsl();
    
    var counter = 0;
    
    dsl
	.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
        counter++;
        cb(null, counter); 
    })
	.define('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'bar');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg3');
        test.equal(cmd.arguments()[1], 'arg4');
        counter++;
        cb(null, counter); 
    })
	.execute('foo arg1 arg2\nbar arg3 arg4', function (err, data) {
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
        counter++;
        cb(null, counter); 
    });
    
    dsl.define('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb);
        test.equal(cmd.verb(), 'bar');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg3');
        test.equal(cmd.arguments()[1], 'arg4');
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
    
    dsl.define('foo', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'foo');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg1');
        test.equal(cmd.arguments()[1], 'arg2');
        counter++;
        cb(null, counter); 
    });
    
    dsl.define('bar', function (cmd, cb) { 
        test.ok(cmd);
        test.ok(cmd.verb());
        test.equal(cmd.verb(), 'bar');
        test.ok(cmd.arguments());
        test.equal(cmd.arguments().length, 2);
        test.equal(cmd.arguments()[0], 'arg3');
        test.equal(cmd.arguments()[1], 'arg4');
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

