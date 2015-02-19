var defaults = require('../defaults.js');

var limit = defaults.INSTRUCTION_LIMIT;
var types = defaults.INSTRUCTION_TYPES;

/* This function inherits from the built-in Array type and adds a thin checking
   before Array.push() to keep the instruction queue size limited.
 */

function AVInstructions(instructionLimit){
    if(!(this instanceof AVInstructions)){
        return new AVInstructions(instructionLimit);
    }
    this.limit = instructionLimit===undefined?limit:instructionLimit;
}

AVInstructions.prototype = Object.create(Array.prototype);

AVInstructions.prototype.push = function(){
    if(this.length >= this.limit){
        throw new Error(defaults.LIMIT_REACHED_ERROR_TEXT);
    }
};

/* AVArray is a special subclass of Array type. It both remembers its initial
   values and also has an instruction queue. Some methods (mainly arithmetic
   ones) adds instructions when they are invoked.
 */

function AVArray(array, instructionLimit){
    if(!(this instanceof AVArray)){
        return new AVArray(array, instructionLimit);
    }

    this.initState = array.slice(0);
    this.instructions = new AVInstructions(instructionLimit);

    this.push.apply(this, array);
}

AVArray.prototype = Object.create(Array.prototype);

AVArray.prototype.reset = function(){
    this.instructions = new AVInstructions(this.instructions.limit);

    for(var i=0; i<this.length; i++){
        this[i] = this.initState[i];
    }
};

/* Helper methods ---------------------------------------------------------- */

AVArray.prototype.getMax = function () {
    var maxIndex = 0;
    var max = this[maxIndex];

    for(var i=0; i<this.length; i++){
        if(this[i] > max){
            max = this[i];
            maxIndex = i;
        }
    }

    return {value: max, index: maxIndex};
};

AVArray.prototype.getMin = function(){
    var minIndex = 0;
    var min = this[minIndex];

    for(var i=0; i<this.length; i++){
        if(this[i] < min){
            min = this[i];
            minIndex = i;
        }
    }

    return {value: min, index: minIndex};
};

AVArray.prototype._swap = function(i, j){
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
};

/* Methods which create instructions too ----------------------------------- */

AVArray.prototype.swap = function(i, j){
    this.instructions.push({
        c: types.swap,
        i: [i, j]
    });

    this._swap(i, j);
};

AVArray.prototype.mark = function(i){
    this.instructions.push({
        c: types.mark,
        i: [i]
    });
};

AVArray.prototype.unmark = function(i){
    this.instructions.push({
        c: types.unmark,
        i: [i]
    });
};

AVArray.prototype.unmarkAll = function(){
    this.instructions.push({
        c: types.unmarkAll
    });
};

AVArray.prototype.highlight = function(){
    this.instructions.push({
        c: types.highlight,
        i: Array.prototype.slice.call(arguments)
    });
};

/* Arithmetic methods which create instructions too ------------------------ */

AVArray.prototype.lt = function(i, j){
    this.instructions.push({
        c: types.compare,
        i: [i, j]
    });

    return this[i] < this[j];
};

AVArray.prototype.lte = function(i, j){
    this.instructions.push({
        c: types.compare,
        i: [i, j]
    });

    return this[i] <= this[j];
};

AVArray.prototype.gt = function(i, j){
    this.instructions.push({
        c: types.compare,
        i: [i, j]
    });

    return this[i] > this[j];
};

AVArray.prototype.gte = function(i, j){
    this.instructions.push({
        c: types.compare,
        i: [i, j]
    });

    return this[i] >= this[j];
};

AVArray.prototype.ne = function(i, j){
    this.instructions.push({
        c: types.compare,
        i: [i, j]
    });

    return this[i] !== this[j];
};

module.exports = AVArray;