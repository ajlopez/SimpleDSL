
var fs = require('fs');
var parsers = require('./parsers');

function Dsl(options) {
	var self = this;
    var verbs = { };
	var parser = parsers.parser(options);
    
    this.define = function (verb, fn) {
        verbs[verb] = fn;
		return this;
    }
    
    this.executeFile = function (filename, cb) {
        return this.execute(fs.readFileSync(filename).toString(), cb);
    }
    
    this.execute = function (text, cb) {
        if (Array.isArray(text))
			return executeSteps(text, cb);        

        var p = text.indexOf('\n');
        
        if (p >= 0)
            return this.execute(text.split('\n'), cb);
		
		return executeStep(compileStep(text), cb);
    }
	
	function compileStep(step) {
		return parser.parse(step);
	}
	
	function executeStep(step, cb) {
        if (step.verb())
            verbs[step.verb()](step, cb);
        else
            cb(null, null);
	}
	
	function executeSteps(steps, cb) {
		doStep();
		
		function doStep() {               
			if (!steps.length) {
				cb(null, null);
				return;
			}
			
			var line = steps.shift();
			
			self.execute(line, function (err, data) {
				if (err) {
					cb(err, null);
					return;
				}
				
				if (!steps.length)
					cb(null, data);
				else
					setTimeout(doStep, 0);
			});
		}
	}
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

