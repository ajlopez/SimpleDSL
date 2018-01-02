
function Lexer(text, options) {
	options = options || {};
	l = text.length;
	p = 0;
	
	this.getToken = function () {
		var nodelimiter = (p === 0);
		
		while (p < l && isSpace(text[p]) && !isComment(text[p]))
			p++;
		
		if (isComment(text[p])) {
			p = l;
			return null;
		}
		
		if (p >= l)
			return null;
		
		if (!nodelimiter && isArgumentDelimiter(text[p])) {
			p++;
			return '';
		}
		
		var value = text[p++];
		
		if (value === '"' || value === "'") {
			var delimiter = value;
			
			while (p < l && text[p] !== delimiter)
				value += text[p++];
			
			if (p < l)
				value += text[p++];
		}
		else if (value === '(') {
			while (p < l && text[p] !== ')')
				value += text[p++];
			
			if (p < l)
				value += text[p++];
		}
		else if (!nodelimiter && hasArgumentDelimiter()) {
			while (p < l && !isArgumentDelimiter(text[p]) && !isComment(text[p]))
				value += text[p++];
			
			if (isArgumentDelimiter(text[p]))
				p++;
			else if (isComment(text[p]))
				p = l;
			else if (p < l)
				p++;
		}
		else
			while (p < l && !isSpace(text[p]) && !isComment(text[p]))
				value += text[p++];
		
		return value.trim();
	}

	this.getTokens = function (ntokens) {
		var tokens = [];
		
		while (p < l) {
			var token;
			
			if (ntokens != null && tokens.length === ntokens - 1) {
				token = text.substring(p).trim();
				p = l;
			}
			else	
				token = this.getToken();
			
			if (token && token.length)
				tokens.push(token);
		}
		
		return tokens;		
	
	}

	function isComment(ch) {
		return options.comment === ch;
	}
	
	function isArgumentDelimiter(ch) {
		return options.delimiter === ch;
	}
	
	function hasArgumentDelimiter() {
		return options.delimiter;
	}	

	function isSpace(ch) {
		return ch <= ' ';
	}
}

function createLexer(text, options) {
	return new Lexer(text, options);
}

module.exports = {
	lexer: createLexer
};

