
function Lexer(options) {
	options = options || {};
	
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
			while (p < l && isSpace(text[p]) && !isComment(text[p]))
				p++;
			
			if (isComment(text[p])) {
				p = l;
				return null;
			}
			
			if (p >= l)
				return null;
			
			if (isArgumentDelimiter(text[p])) {
				p++;
				return '';
			}
			
			var value = text[p++];
			
			if (value === '"') {
				while (p < l && text[p] !== '"')
					value += text[p++];
				
				if (p < l)
					value += text[p++];
			}
			else if (hasArgumentDelimiter()) {				
				while (p < l && !isArgumentDelimiter(text[p]) && !isComment(text[p]))
					value += text[p++];
				
				if (p < l)
					p++;
			}
			else
				while (p < l && !isSpace(text[p]) && !isComment(text[p]))
					value += text[p++];
			
			return value.trim();
		}
		
		function isSpace(ch) {
			return ch <= ' ';
		}
		
		function isComment(ch) {
			return options.comment === ch;
		}
		
		function isArgumentDelimiter(ch) {
			return tokens.length && options.delimiter === ch;
		}
		
		function hasArgumentDelimiter() {
			return tokens.length && options.delimiter;
		}
	}
}

function createLexer(options) {
	return new Lexer(options);
}

module.exports = {
	lexer: createLexer
};

