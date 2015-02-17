
function Dsl(options) {
    var verbs = { };
    
    this.register = function (verb, fn) {
        verbs[verb] = fn;
    }
    
    this.execute = function (text, cb) {
        var cmd = parse(text, options);
        verbs[cmd.verb](cmd, cb);
    }
}

function parse(cmdtext, options) {
    options = options || {};
    cmdtext = cmdtext.trim();
    
    if (options.comment) {
        var p = cmdtext.indexOf(options.comment);
        
        if (p >= 0)
            cmdtext = cmdtext.substring(0, p);
    }
    
    var p = cmdtext.indexOf(' ');
    
    var verb;
    var args;
    
    if (p >= 0) {
        verb = cmdtext.substring(0, p).trim();
        args = cmdtext.substring(p + 1).trim();
    }
    else
        verb = cmdtext.trim();

    var cmd = { };

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

    return cmd;
}

function createDsl(options) {
    return new Dsl(options);
}

module.exports = {
    dsl: createDsl
}

