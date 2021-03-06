
var fs = require('fs');
var parsers = require('./parsers');

var breakObject = {};
var continueObject = {};

function defaultFn(cmd, cb) {
	return cb(null, null);
}

function trueFn(cmd, cb) {
	return cb(null, true);
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
	this.multiline = function () { return verb.options().multiline; };
	this.else = function () { return verb.options().else; };
	this.block = function () { return verb.options().conditional || verb.options().loop || verb.options().block || verb.options().fail; };

	function makeCallback(cb) {
		if (!verb.options().postfn)
			return cb;
		
		return function (err, data) {
			verb.options().postfn(err, data, cb);
		}
	}
	
	if (this.block()) {
		var steps = [];
		var composite;
		
		var elseself = this;
		var elsesteps = [];
		
		var composite;
		var elsecomposite;
		
		var inelse = false;
		var isloop = verb.options().loop;
		var isfail = verb.options().fail;
		
		this.execute = function (cb) {
			cb = makeCallback(cb);
			
			var self = this;
			
			try {
				verb.fn()(command, callback); 
			}
			catch (err) {
				return cb(err, null);
			}
			
			function callback(err, data) {
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
					if (isfail)
						return composite.execute(function (err, data) {
							if (err)
								cb(null, err);
							else
								cb(new Error('fail expected'), data);
						});
					else
						return composite.execute(cb);
				
				composite.execute(function (err, data) {
					if (err === breakObject)
						return cb(null, null);
				
					if (err && err !== continueObject)
						return cb(err, data);
					
					setTimeout(function() { self.execute(cb); }, 0);
				});
			}
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
		this.execute = function (cb) { 
			cb = makeCallback(cb);
			
			try {
				verb.fn()(command, cb); 
			}
			catch (err) {
				return cb(err, null);
			}
		};
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
			else if (options.loop || options.fail || options.block)
				fn = trueFn;
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
			
			if (step.multiline()) {
				var ending = step.verb().options().multiline;
				
				for (var k2 = k + 1; k2 < nlines && lines[k2].trim().substring(0, ending.length) !== ending; k2++)
					;
				
				var line = lines.slice(k + 1, k2).join('\n');
				k = k2;
				
				step = compileStep(line);
				
				if (!step)
					continue;
			}
			
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

