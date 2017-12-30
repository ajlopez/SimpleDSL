
var fs = require('fs');
var parsers = require('./parsers');

var breakObject = {};
var continueObject = {};

function defaultFn(cmd, cb) {
	return cb(null, null);
}

function breakFn(cmd, cb) {
	return cb(breakObject, null);
}

function continueFn(cmd, cb) {
	return cb(continueObject, null);
}

function Verb(fn, options) {
	options = options || {};
	
	this.fn = function () { return fn; };
	this.options = function () { return options; };
}

function Step(verb, command) {
	this.verb = function () { return verb; };
	this.close = function () { return verb.options().close; };
	this.else = function () { return verb.options().else; };
	this.block = function () { return verb.options().conditional || verb.options().loop; };
	
	if (this.block()) {
		var steps = [];
		var composite;
		
		var elseself = this;
		var elsesteps = [];
		
		var composite;
		var elsecomposite;
		
		var inelse = false;
		var isloop = verb.options().loop;
		
		this.execute = function (cb) {
			var self = this;
			
			verb.fn()(command, function (err, data) {
				if (err)
					return cb(err, null);
				
				if (!composite)
					composite = new CompositeStep(steps);
				
				if (!elsecomposite)
					elsecomposite = new CompositeStep(elsesteps);
				
				if (!data)
					if (elsesteps.length)
						return elsecomposite.execute(cb);
					else
						return cb(null, null);

				if (!isloop)
					return composite.execute(cb);
				
				composite.execute(function (err, data) {
					if (err === breakObject)
						return cb(null, null);
				
					if (err && err !== continueObject)
						return cb(err, data);
					
					setTimeout(function() { self.execute(cb); }, 0);
				});
			});
		};
		
		this.add = function (step) {
			if (inelse)
				elsesteps.push(step);
			else
				steps.push(step);
		}
		
		this.inelse = function () {
			inelse = true;
		}
	}
	else
		this.execute = function (cb) { verb.fn()(command, cb); };
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
		if (typeof fn === 'object' && !options) {
			options = fn;
			
			if (options.break)
				fn = breakFn;
			else if (options.continue)
				fn = continueFn;
			else
				fn = defaultFn;
		}
		
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
		var cmd = parser.parse(step, verbs);
		
		if (!cmd || !cmd.verb())
			return null;
		
		var verb = verbs[cmd.verb()];
		
		if (!verb)
			throw new Error('unknown verb "' + cmd.verb() + '"');
		
		return new Step(verb, cmd);
	}
	
	function compileSteps(lines) {
		var steps = [];
		var blocks = [];
		var nlines = lines.length;
		
		for (var k = 0; k < nlines; k++) {
			var step = compileStep(lines[k]);
			
			if (!step)
				continue;
			
			if (step.close()) {
				if (blocks.length)
					blocks.shift();
				else
					steps.push(step);
				
				continue;
			}
			
			if (step.else()) {
				blocks[0].inelse();
				continue;
			}

 			if (blocks.length)
				blocks[0].add(step);
			else					
				steps.push(step);
			
			if (step.block())
				blocks.unshift(step);
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

