
var fs = require('fs');
var parsers = require('./parsers');

function Dsl(options) {
    var verbs = { };
	var parser = parsers.parser(options);
    
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
        
        var cmd = parser.parse(text);
        
        if (cmd.verb)
            verbs[cmd.verb](cmd, cb);
        else
            cb(null, null);
    }
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

