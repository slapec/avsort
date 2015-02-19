/* jshint -W004 */
var defaults = require('../defaults.js');
var utils = require('../utils.js');
var AVArray = require('./array.js');

var types = defaults.INSTRUCTION_TYPES;
var palette = defaults.PALETTE;

function AVColumn(value, fillStyle){
    if(!(this instanceof  AVColumn)){
        return new AVColumn(value, fillStyle);
    }

    this.value = value;
    this.fillStyle = fillStyle;
    this.oldStyles = [];
    this.marked = false;
}

AVColumn.prototype.save = function(){
    this.oldStyles.push(this.fillStyle);
};

AVColumn.prototype.restore = function(){
    this.fillStyle = this.oldStyles.pop();
};

function AVCanvas(options){
    if(!(this instanceof AVCanvas)){
        return new AVCanvas(options);
    }

    this.options = options || {};

    this.canvas = q(this.options.canvas);
    this.size = [this.options.width, this.options.height];
    this.columnWidth = this.options.columnWidth!==undefined?this.options.columnWidth:defaults.COLUMN_WIDTH;
    this.columnSpacing = this.options.columnSpacing!==undefined?this.options.columnSpacing:defaults.COLUMN_SPACING;
    this.palette = this.options.palette!==undefined?this.options.palette:defaults.PALETTE;
    this.minFrequency = this.options.minFrequency!==undefined?this.options.minFrequency:defaults.MIN_FREQUENCY;
    this.maxFrequency = this.options.maxFrequency!==undefined?this.options.maxFrequency:defaults.MAX_FREQUENCY;

    this.frequencyRange = this.maxFrequency - this.minFrequency;
    this.context = this.canvas.getContext('2d');
    this.setSize.apply(this, this.size);

    this.instructionPointer = 0;
    this.toReset = [];
}

AVCanvas.prototype.onend = function(){
    return false;
};

AVCanvas.prototype.onalgofinished = function () {
    return false;
};

AVCanvas.prototype.setArray = function (array) {
    this.array = new AVArray(array);
    this.columns = [];
    this.arrayMax = this.array.getMax().value;
    this.arrayMin = this.array.getMin().value;

    for(var i=0; i<this.array.length; i++){
        this.columns.push(new AVColumn(this.array[i],this.palette.base));
    }

    this.lastFillStyle = '';
    this.toReset = [];
    this.instructionPointer = 0;
};

AVCanvas.prototype.getArray = function () {
    if(this.array === undefined){
        this.setArray(utils.randomArray(100));
    }
    return this.array;
};

AVCanvas.prototype.sort = function (sorter) {
    var array = this.getArray();
    if(array.instructions.length !== 0){
        array.reset();
    }
    sorter(array);
    utils.checkSorted(array);
    this.onalgofinished();
};

AVCanvas.prototype.setSize = function (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
};

AVCanvas.prototype.setColumnWidth = function(width){
    this.columnWidth = width;
};

AVCanvas.prototype.setColumnSpacing = function(spacing){
    this.columnSpacing = spacing;
};

AVCanvas.prototype.drawFrame = function(){
    if(this.array === undefined){
        return;
    }

    var columns = this.columns;
    var context = this.context;
    var canvasHeight = this.canvas.height;
    var columnHeight = canvasHeight / this.arrayMax;

    context.clearRect(0, 0, this.canvas.width, canvasHeight);

    for(var i=0; i < columns.length; i++){
        var height = columns[i].value * columnHeight;
        context.fillStyle = columns[i].fillStyle;
        context.fillRect(
            i*(this.columnWidth + this.columnSpacing),
            canvasHeight - height,
            this.columnWidth,
            height
        );
    }
};

AVCanvas.prototype._drawColumn = function(idx){
    var ctx = this.context;
    var max = this.arrayMax;
    var column = this.columns[idx];
    var columnHeight = this.canvas.height / max;

    if(this.lastFillStyle !== column.fillStyle){
        ctx.fillStyle = column.fillStyle;
        this.lastFillStyle = column.fillStyle;
    }

    ctx.clearRect(idx*(this.columnWidth + this.columnSpacing), 0, this.columnWidth, this.canvas.height);
    ctx.fillRect(idx*(this.columnWidth + this.columnSpacing), this.canvas.height - column.value * columnHeight, this.columnWidth, column.value * columnHeight);

};

AVCanvas.prototype.processInstruction = function(){
    if(this.array === undefined){
        return false;
    }

    var instructions = this.array.instructions;
    var instruction = instructions[this.instructionPointer];
    if(instruction === undefined){
        this.onend();
        return false;
    }

    var columns = this.columns;

    if(this.toReset.length > 0){
        for(var i=0; i<this.toReset.length; i++){
            var columnIndex = this.toReset[i];
            columns[columnIndex].restore();
            this._drawColumn(columnIndex);
        }
        this.toReset = [];
    }

    var cmd = instruction.c;

    if(cmd === types.compare){
        var l = instruction.i[0];
        var r = instruction.i[1];

        this.toReset.push(l, r);

        columns[l].save();
        columns[l].fillStyle = palette.highlight;

        columns[r].save();
        columns[r].fillStyle = palette.highlight;
    }
    if(cmd === types.swap){
        var l = instruction.i[0];
        var r = instruction.i[1];

        this.toReset.push(l, r);

        columns[l].save();
        columns[l].fillStyle = palette.swap;

        columns[r].save();
        columns[r].fillStyle = palette.swap;

        columns._swap(l, r);
    }
    if (cmd === types.mark){
        var column = columns[instruction.i[0]];
        if(column.marked === false){
            column.save();
            column.fillStyle = palette.mark;
            column.marked = true;
        }
    }
    if (cmd === types.highlight){
        for(var i=0; i<instruction.i.length; i++){
            var column = columns[instruction.i[i]];
            column.save();
            column.fillStyle = palette.highlight;
            this.toReset.push(instruction.i[i]);
        }
    }
    if (cmd === types.unmark) {
        var column = columns[instruction.i[0]];
        if (column.marked === true){
            column.restore();
            column.marked = false;
        }
    }
    if (cmd === types.unmarkAll){
        for(var i=0; i<columns.length; i++){
            var column = columns[i];
            if(column.marked){
                column.marked = false;
                this.toReset.push(i);
            }
        }
    }

    if(instruction.i !== undefined) {
        for (var m = 0; m < instruction.i.length; m++) {
            this._drawColumn(instruction.i[m]);
        }
    }
};

AVCanvas.prototype.play = function () {
    var self = this;

    var render = function(){
        self._requestId = requestAnimationFrame(render);
        if(self.processInstruction() === false){
            cancelAnimationFrame(self._requestId);
            self._requestId = undefined;
        }
        self.instructionPointer++;
    };

    if(this._requestId === undefined){
        render();
    } else {
        cancelAnimationFrame(this._requestId);
        this._requestId = undefined;
    }
};

AVCanvas.prototype.pause = function(){
    if(this._requestId !== undefined){
        cancelAnimationFrame(this._requestId);
        this._requestId = undefined;
    }
};

AVCanvas.prototype.replay = function () {
    this.columns = [];
    for(var i=0; i<this.array.initState.length; i++){
        this.columns.push(new AVColumn(this.array.initState[i], this.palette.base));
    }

    this.lastFillStyle = '';
    this.toReset = [];
    this.instructionPointer = 0;

    this.drawFrame();
};

AVCanvas.prototype.stepForward = function () {
    if(this.array !== undefined && this.instructionPointer <= this.array.instructions.length) {
        this.processInstruction();
    }
    this.instructionPointer++;
};

module.exports = AVCanvas;