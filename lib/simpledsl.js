
function Dsl() {
    var verbs = { };
    
    this.register = function (verb, fn) {
        verbs[verb] = fn;
    }
    
    this.execute = function (text, cb) {
        var cmd = parse(text);
        verbs[cmd.verb](cmd, cb);
    }
}

function parse(cmdtext) {
    cmdtext = cmdtext.trim();
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
    
    if (args)
        cmd.args = args.split(/\s+/);
    else
        cmd.args = [];

    return cmd;
}

function createDsl() {
    return new Dsl();
}

module.exports = {
    dsl: createDsl
}

