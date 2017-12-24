
function Lexer(options) {
	this.getTokens = function (text) {
		var l = text.length;
		var p = 0;
		
		var tokens = [];
		
		while (p < l) {
			var token = nextToken();
			
			if (token)
				tokens.push(token);
		}
		
		return tokens;
		
		function nextToken() {
			while (p < l && isSpace(text[p]))
				p++;
			
			if (p >= l)
				return null;
			
			var value = text[p++];
			
			while (p < l && !isSpace(text[p]))
				value += text[p++];
			
			return value;
		}
		
		function isSpace(ch) {
			return ch <= ' ';
		}
	}
}

function createLexer(options) {
	return new Lexer(options);
}

module.exports = {
	lexer: createLexer
};

