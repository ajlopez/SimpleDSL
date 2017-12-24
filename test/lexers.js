
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

