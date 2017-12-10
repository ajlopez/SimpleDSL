
var fs = require('fs');
var parsers = require('./parsers');

function Verb(fn, options) {
	options = options || {};
	
	this.fn = function () { return fn; };
	this.options = function () { return options; };
}

function Step(verb, command) {
	this.verb = function () { return verb; };
	this.execute = function (cb) { verb.fn()(command, cb); };
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
		var cmd = parser.parse(step);
		
		if (!cmd || !cmd.verb())
			return null;
		
		var verb = verbs[cmd.verb()];
		
		if (!verb)
			return null;
		
		return new Step(verb, cmd);
	}
	
	function compileSteps(lines) {
		var steps = [];
		
		for (var n in lines) {
			var step = compileStep(lines[n]);
			
			if (step)
				steps.push(step);
		}
		
		return steps;
	}
	
	function executeStep(step, cb) {
		step.execute(cb);
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
			return step && step.verb() && step.verb().options().conditional;
		}
		
		function isClose(step) {
			return step && step.verb() && step.verb().options().close;
		}
	}
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

