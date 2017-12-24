
function Lexer(options) {
	this.getTokens = function (text) {
		var tokens = text.trim().split(/\s+/);
		
		return tokens;
	}
}

function createLexer(options) {
	return new Lexer(options);
}

module.exports = {
	lexer: createLexer
};

