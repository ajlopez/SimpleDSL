
var fs = require('fs');
var parsers = require('./parsers');

function Verb(fn, options) {
	options = options || {};
	
	this.fn = function () { return fn; };
	this.options = function () { return options; };
}

function Dsl(options) {
	var self = this;
    var verbs = { };
	var parser = parsers.parser(options);
    
    this.define = function (verb, fn, options) {
        verbs[verb] = new Verb(fn, options);
		return this;
    }
    
    this.executeFile = function (filename, cb) {
        return this.execute(fs.readFileSync(filename).toString(), cb);
    }
    
    this.execute = function (text, cb) {
        if (Array.isArray(text))
			return executeSteps(compileSteps(text), cb);        

        var p = text.indexOf('\n');
        
        if (p >= 0)
            return this.execute(text.split('\n'), cb);
		
		return executeStep(compileStep(text), cb);
    }
	
	function compileStep(step) {
		return parser.parse(step);
	}
	
	function compileSteps(lines) {
		var steps = [];
		
		for (var n in lines)
			steps.push(compileStep(lines[n]));
		
		return steps;
	}
	
	function executeStep(step, cb) {
		var verbname = step.verb();
		
        if (verbname) {
			var verb = verbs[verbname];
			
            verb.fn()(step, cb);
		}
        else
            cb(null, null);
	}
	
	function executeSteps(steps, cb) {
		var ns = 0;
		
		doStep();
		
		function doStep() {       
			if (ns >= steps.length) {
				cb(null, null);
				return;
			}
			
			var step = steps[ns++];
			
			executeStep(step, function (err, data) {
				if (err) {
					cb(err, null);
					return;
				}
				
				if (isConditional(step) && !data) {
					while (ns < steps.length && !isClose(steps[ns]))
						ns++;
				}
				
				if (ns >= steps.length)
					cb(null, data);
				else
					setTimeout(doStep, 0);
			});
		}
		
		function isConditional(step) {
			return step && step.verb() && verbs[step.verb()] && verbs[step.verb()].options().conditional;
		}
		
		function isClose(step) {
			return step && step.verb() && verbs[step.verb()] && verbs[step.verb()].options().close;
		}
	}
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

