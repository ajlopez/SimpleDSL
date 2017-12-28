
var lexers = require('../lib/lexers');

exports['create lexer as object'] = function (test) {
	var lexer = lexers.lexer();
	
	test.ok(lexer);
	test.equal(typeof lexer, 'object');
};

exports['get tokens'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('foo bar');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 2);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'bar');
};

exports['get tokens one verb and only one argument'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('foo this is an argument', 1);
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 2);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'this is an argument');
};

exports['get tokens with expression in parentheses'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('foo (bar zoo)');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 2);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], '(bar zoo)');
};

exports['get no token'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 0);
};

exports['get tokens with spaces'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('  foo   bar  ');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 2);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'bar');
};

exports['get tokens with string delimited by double quotes'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens('foo  bar "big zoo"');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 3);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'bar');
	test.equal(tokens[2], '"big zoo"');
};

exports['get tokens with string delimited by single quotes'] = function (test) {
	var lexer = lexers.lexer();
	
	var tokens = lexer.getTokens("foo  bar 'big zoo'");
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 3);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'bar');
	test.equal(tokens[2], "'big zoo'");
};

exports['get tokens with argument delimiter'] = function (test) {
	var lexer = lexers.lexer({ delimiter: ';'});
	
	var tokens = lexer.getTokens('foo  one ; two more; three');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 4);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'one');
	test.equal(tokens[2], 'two more');
	test.equal(tokens[3], 'three');
};

exports['no tokens with comment'] = function (test) {
	var lexer = lexers.lexer({ comment: '#'});
	
	var tokens = lexer.getTokens('# this is a comment');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 0);
};

exports['two tokens with comment'] = function (test) {
	var lexer = lexers.lexer({ comment: '#'});
	
	var tokens = lexer.getTokens('foo bar# this is a comment');
	
	test.ok(tokens);
	test.ok(Array.isArray(tokens));
	test.equal(tokens.length, 2);
	test.equal(tokens[0], 'foo');
	test.equal(tokens[1], 'bar');
};

