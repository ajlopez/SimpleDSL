
var fs = require('fs');

function Dsl(options) {
    var verbs = { };
    
    this.register = function (verb, fn) {
        verbs[verb] = fn;
    }
    
    this.executeFile = function (filename, cb) {
        return this.execute(fs.readFileSync(filename).toString(), cb);
    }
    
    this.execute = function (text, cb) {
        if (Array.isArray(text)) {
            var self = this;
            
            doStep();
            
            function doStep() {               
                if (!text.length) {
                    cb(null, null);
                    return;
                }
                
                var line = text.shift();
                
                self.execute(line, function (err, data) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    
                    if (!text.length)
                        cb(null, data);
                    else
                        setTimeout(doStep, 0);
                });
            }
            
            return;
        }
        
        var p = text.indexOf('\n');
        
        if (p >= 0) {
            this.execute(text.split('\n'), cb);
            return;
        }
        
        var cmd = parse(text, options);
        
        if (cmd.verb)
            verbs[cmd.verb](cmd, cb);
        else
            cb(null, null);
    }
}

function parse(cmdtext, options) {
    options = options || {};
    cmdtext = cmdtext.trim();
    
    if (options.log)
        options.log(cmdtext);
    
    if (options.comment) {
        var p = cmdtext.indexOf(options.comment);
        
        if (p >= 0)
            cmdtext = cmdtext.substring(0, p);
    }
    
    var p = cmdtext.search(/\s+/);
    
    var verb;
    var args;
    
    if (p >= 0) {
        verb = cmdtext.substring(0, p).trim();
        args = cmdtext.substring(p + 1).trim();
    }
    else
        verb = cmdtext.trim();

    var cmd = { };
	
	cmd.text = cmdtext;
	cmd.argstext = args;

    if (verb && verb != '')
        cmd.verb = verb;
        
    var delimiter;
    
    if (options.delimiter)
        delimiter = options.delimiter;
    else
        delimiter = /\s+/;
    

    if (args)
        cmd.args = args.split(delimiter);
    else
        cmd.args = [];
        
    for (var k = 0; k < cmd.args.length; k++) {
        var arg = cmd.args[k].trim();
        
        if (arg[0] === '{' && arg[arg.length - 1] === '}') {
            eval('arg = ' + arg);
            cmd.args[k] = arg;
        }
    }

    return cmd;
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

