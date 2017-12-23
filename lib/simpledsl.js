
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
	this.conditional = function () { return verb.options().conditional; };
	this.close = function () { return verb.options().close; };
	this.composite = function () { return verb.options().composite; };
}

function CompositeStep(steps) {
	this.execute = function (cb) {
		var pc = 0;
		var ns = steps.length;
		
		doStep();
		
		function doStep() {
			if (pc >= ns) {
				cb(null, null);
				return;
			}
			
			var step = steps[pc++];
			
			step.execute(function (err, data) {
				if (err) {
					cb(err, null);
					return;
				}
				
				if (step.conditional() && !data) {
					while (pc < ns && !steps[pc].close())
						pc++;
				}
				
				if (pc >= ns)
					cb(null, data);
				else
					setTimeout(doStep, 0);
			});
		}
	}
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
			return compileSteps(text).execute(cb);        

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
		
		return new CompositeStep(steps);
	}
	
	function executeStep(step, cb) {
		step.execute(cb);
	}
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

