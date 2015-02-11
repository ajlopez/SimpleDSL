
function Dsl() {
    var verbs = { };
    
    this.register = function (verb, fn) {
        verbs[verb] = fn;
    }
    
    this.execute = function (text, cb) {
        verbs[text]({ }, cb);
    }
}

function createDsl() {
    return new Dsl();
}

module.exports = {
    dsl: createDsl
}