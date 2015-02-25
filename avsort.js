(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./globals.js');

window.onload = function(){
    require('./setup.js')();
};
},{"./globals.js":7,"./setup.js":8}],2:[function(require,module,exports){
/* jshint -W098 */
function AVAlgorithm(name, code){
    if(!(this instanceof AVAlgorithm)){
        return new AVAlgorithm(code);
    }

    this.name = name;
    this.__code = code;
}

Object.defineProperty(AVAlgorithm.prototype, 'code', {
    get: function(){
        return '(' + this.__code.toString() + ')';
    }
});

module.exports.empty = new AVAlgorithm('Empty Code',
function(avsort, utils){
    avsort.sort(function(array){
        //Select an algorithm from the dropdown or insert your code here!
    });
});

module.exports.bubble = new AVAlgorithm('Bubble sort',
function(avsort, utils){
    var n = 10;
    avsort.setColumnSpacing(2);
    avsort.setColumnWidth((window.innerWidth-(n*avsort.columnSpacing)) / n);
    avsort.setArray(utils.randomArray(n));

    avsort.sort(function(array){
        var swapped;
        do {
            swapped = false;
            for(var i=0; i<array.length-1; i++){
                if(array.lt(i+1, i)){
                    array.swap(i+1, i);
                    swapped = true;
                }
            }
        } while(swapped);
    });
});

module.exports.quick = new AVAlgorithm('Quick (w/ partitioning)',
function(avsort, utils){
    var n = 80;
    avsort.setColumnSpacing(1);
    avsort.setColumnWidth(parseInt((window.innerWidth-(n*avsort.columnSpacing)) / n));
    avsort.setArray(utils.randomArray(n));

    avsort.sort(function(array){
        function partition(start, end) {
            var pivotIndex = Math.floor((start + end) / 2);
            var pivot = array[pivotIndex];
            array.mark(pivotIndex);
            while(start <= end){
                while(array[start] < pivot){
                    array.lt(start, end);
                    start++;
                }

                while(array[end] > pivot){
                    array.lt(start, end);
                    end--;
                }

                if(start <= end){
                    array.highlight(start, end);
                    array.swap(start, end);
                    start++;
                    end--;
                }
            }
            array.unmarkAll();
            return start;
        }

        function _quick(start, end){
            var index;
            if(array.length > 1){
                index = partition(start, end);

                if(start < index - 1){
                    _quick(start, index-1);
                }
                if(index < end){
                    _quick(index, end);
                }
            }
        }

        _quick(0, array.length-1);
    });
});

module.exports.insertion = new AVAlgorithm('Insertion sort',
function(avsort, utils){
    var n = 80;
    avsort.setColumnSpacing(1);
    avsort.setColumnWidth(parseInt((window.innerWidth-(n*avsort.columnSpacing)) / n));
    avsort.setArray(utils.randomArray(n));

    avsort.sort(function(array){
        for(var i=1; i<array.length; i++){
            var value = array[i];
            for(var j=i; j>0 && value < array[j-1]; j--){
                array.lt(j, j-1);
                array.swap(j, j-1);
            }
            array[j] = value;
        }
    });
});

module.exports.heapsort = new AVAlgorithm('Heapsort',
function(avsort, utils){
    var n = 80;
    avsort.setColumnSpacing(1);
    avsort.setColumnWidth(parseInt((window.innerWidth-(n*avsort.columnSpacing)) / n));
    avsort.setArray(utils.randomArray(n));

    avsort.sort(function(array){
        var siftDown = function(a, start, end){
            var root = start;
            while(root*2+1 < end){
                var child = 2*root + 1;
                if((child + 1 < end ) && array[child] < array[child + 1]){
                    child += 1;
                }
                if(array[root] < array[child]){
                    array.swap(child, root);
                    root = child;
                }
                else {
                    return;
                }
            }
        };

        var heapsort = function(a){
            for(var start = parseInt(array.length-2)/2; start>=0; start--){
                siftDown(a, start, array.length);
            }

            for(var end=array.length-1; end > 0; end--){
                array.swap(end, 0);
                siftDown(a, 0, end);
            }
        };

        heapsort(array, array.length);
    });
});
},{}],3:[function(require,module,exports){
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
    return Array.prototype.push.apply(this, arguments);
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
},{"../defaults.js":6}],4:[function(require,module,exports){
/* jshint -W004 */
var defaults = require('../defaults.js');
var utils = require('../utils.js');
var AVArray = require('./array.js');
var AVSynth = require('./synth.js');

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

    this.synth = new AVSynth();
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

    var synth = this.synth;
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

        var lFreq = this.minFrequency + ((columns[l].value/this.arrayMax)*this.frequencyRange);
        var rFreq = this.minFrequency + ((columns[r].value/this.arrayMax)*this.frequencyRange);

        synth.sound(lFreq);
        synth.sound(rFreq);
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

            this.synth.sound(this.minFrequency + (column.value/this.arrayMax)*this.frequencyRange);
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

AVCanvas.prototype.setVolume = function(value){
    this.synth.setVolume(value);
};

module.exports = AVCanvas;
},{"../defaults.js":6,"../utils.js":9,"./array.js":3,"./synth.js":5}],5:[function(require,module,exports){
function AVSynth(){
    if(!(this instanceof  AVSynth)){
        return new AVSynth();
    }
    this.sustain = 0.02;
    this.release = 0.03;

    this.context = new AudioContext();
    this.compressor = this.context.createDynamicsCompressor();
    this.gain = this.context.createGain();

    this.compressor.connect(this.gain);
    this.gain.connect(this.context.destination);
}

AVSynth.prototype.sound = function(freq){
    var ctx = this.context;
    var comp = this.compressor;

    var gain = ctx.createGain();
    gain.connect(comp);

    var osc = ctx.createOscillator();
    osc.connect(gain);
    osc.frequency.value = freq;
    osc.type = 'square';

    osc.start(ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime+this.sustain);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime+this.sustain+this.release);
    osc.stop(ctx.currentTime+this.sustain+this.release);
};

AVSynth.prototype.setVolume = function(value){
    this.gain.gain.value = value/100;
};

module.exports = AVSynth;
},{}],6:[function(require,module,exports){
/* Defaults used by structures --------------------------------------------- */

module.exports.INSTRUCTION_LIMIT = 1e6;
module.exports.INSTRUCTION_TYPES = {
    compare: 0,
    swap: 1,
    highlight: 2,
    mark: 3,
    unmark: 4,
    unmarkAll: 5
};
module.exports.LIMIT_REACHED_ERROR_TEXT = 'Instruction queue size limit reached';


/* Canvas defaults --------------------------------------------------------- */
module.exports.COLUMN_WIDTH = 10;
module.exports.COLUMN_SPACING = 1;
module.exports.SAMPLE_ARRAY_SIZE = 100;

module.exports.PALETTE = {
    base: '#eef6e5',
    highlight: '#d3423d',
    swap: '#d3423d',
    mark: '#7ad43e'
};


/* Editor defaults --------------------------------------------------------- */
module.exports.EDITOR_SETTINGS = {
    lineNumbers: true,
    readOnly: true,
    mode: 'javascript',
    indentUnit: 4,
    extraKeys: {
        'Tab': function(cm) {
            var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        },
        'Ctrl-R': function(){
            q('#run').click();
        },
        'Ctrl-S': function(){
            var saveControls = q('#save-controls');

            if(saveControls.style.display !== ''){
                q('#save').click();
            }
        }
    }
};

module.exports.EDITOR_ALERT = 'Never paste source codes from unknown or untrusted sourses!\n\n' +
'Compiled code run on your own computer. Malicious codes can crash your browser or can steal your files.';

module.exports.DEFAULT_ALGO = 'quick';

/* Keyboard codes ---------------------------------------------------------- */
module.exports.KEYS = {
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
    SPACE: 32
};
},{}],7:[function(require,module,exports){
/*
q() is just a shortcut of document.querySelector();
 */
window.q = function(){
    if(arguments.length === 1){
        return document.querySelector(arguments[0]);
    }
    else if (arguments.length === 2 && arguments[0] instanceof HTMLElement){
        return arguments[0].querySelector(arguments[1]);
    }
    else {
        throw 'Invalid arguments for q(). (Valid: q(querystring) or q(HTMLElement, querystring))';
    }
};

/*
qa() is just a shortcut of document.querySelectorAll();
 */
window.qa = function(){
    if(arguments.length === 1){
        return document.querySelectorAll(arguments[0]);
    }
    else if (arguments.length === 2 && arguments[0] instanceof HTMLElement){
        return arguments[0].querySelectorAll(arguments[1]);
    }
    else {
        throw 'Invalid arguments for qa(). (Valid: qa(querystring) or qa(HTMLElement, querystring))';
    }
};

/*
Patching Array type so it can swap elements in place
 */

Array.prototype._swap = function (i, j) {
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
};
},{}],8:[function(require,module,exports){
var algos = require('./avsort/algorithms.js');
var defaults = require('./defaults.js');
var utils = require('./utils.js');
var forEach = utils.forEach;

var AVCanvas = require('./avsort/canvas.js');

var lastLoaded;
var editor;
var errorWidgets = [];

var divStatusbar;


var errorHandler = function (e) {
    var divError = document.createElement('div');
    divError.classList.add('eval-error');
    divError.innerHTML = 'Error: ' + e.error.message + ' at line: ' + e.lineno + ', column: ' + e.colno;
    errorWidgets.push(editor.addLineWidget(e.lineno - 1, divError));
};


var enableEdit = function(){
    var btnEnableEditing = q('#btn-enable-edit');

    editor.options.readOnly = false;

    btnEnableEditing.onclick = null;
    btnEnableEditing.classList.remove('ctrl-btn');
    btnEnableEditing.classList.add('statusbar');
    btnEnableEditing.innerHTML = '';

    divStatusbar = btnEnableEditing;
};


var loadAlgorithm = function(option){
    var doc;
    var saveControls = q('#save-controls');

    if(option.parentElement === q('#build-in-algorithms')){
        var algorithm = algos[option.value];

        doc = CodeMirror.Doc(algorithm.code, 'javascript');
        doc.title = algorithm.name;
        editor.swapDoc(doc);

        saveControls.style.display = null;
    }
    else {
        doc = CodeMirror.Doc(localStorage.getItem('algo-' + option.value), 'javascript');
        doc.title = option.text;
        editor.swapDoc(doc);

        saveControls.style.display = 'inline';
    }

    lastLoaded = option;
};


var addAlgorithmOption = function(to, obj){
    var option = document.createElement('option');
    option.text = obj.name;
    option.value = obj.index;
    to.appendChild(option);

    return option;
};


var registerAlgorithms = function(){
    var grpBuiltins = q('#build-in-algorithms');
    var builtins = Object.keys(algos);
    forEach(builtins, function(name){
        var algorithm = algos[name];

        addAlgorithmOption(grpBuiltins, {
            name: algorithm.name,
            index: name
        });
    });

    var grpUserAlgos = q('#user-algorithms');
    var algorithms = localStorage.getItem('algorithms');
    if(algorithms !== null){
        forEach(JSON.parse(algorithms), function(o){
            addAlgorithmOption(grpUserAlgos, o);
        });
    }
};


var serializeSettings = function(form){
    var settings = {};
    var inputs = qa(form, 'input');

    forEach(inputs, function(input){
        switch(input.type){
            case 'checkbox':
                settings[input.id] = input.checked;
                break;
        }
    });

    window.localStorage.setItem('settings', JSON.stringify(settings));
};


var deserializeSettings = function(form){
    var json = window.localStorage.getItem('settings');
    if(json !== null){
        var settings = JSON.parse(json);

        forEach(Object.keys(settings), function(k){
            var v = settings[k];
            var input = q(form, '[id='+ k +']');

            if(input !== null){
                switch(input.type){
                    case 'checkbox':
                        input.checked = v;
                        break;
                }
            }
        });
    }
};


var applySettings = function(){
    var json = window.localStorage.getItem('settings');
    if(json !== null){
        var settings = JSON.parse(json);

        if('editor-auto-enable' in settings){
            if(settings['editor-auto-enable'] === true){
                enableEdit();
            }
        }
    }
};


module.exports = function () {
    var slctAlgorithms = q('#algorithms');

    // Canvas
    var avsort = new AVCanvas({
        canvas: '#avsort-canvas',
        width: window.innerWidth,
        height: window.innerHeight,
        columnWidth: 10,
        columnSpacing: 1,
        minFrequency: 200,
        maxFrequency: 1200
    });

    avsort.onend = function () {
        q('#play').innerHTML = 'Reset';
    };

    avsort.onalgofinished = function () {
        if(q('.statusbar') !== null){
            q('.statusbar').innerHTML = 'Algorithm compiled';
        }
    };

    // Editor-related
    var divEditor = q('#editor');
    editor = new CodeMirror(divEditor, defaults.EDITOR_SETTINGS);

    editor.on('changes', function(){
        if(editor.isClean()){
            divStatusbar.innerHTML = '';
        }
        else {
            divStatusbar.innerHTML = 'Changed';
        }
    });

    editor.on('swapDoc', function () {
        if(divStatusbar !== undefined) {
            divStatusbar.innerHTML = "Loaded '" + editor.getDoc().title + "'";
        }
    });

    // Window-related
    window.addEventListener('error', errorHandler);

    window.addEventListener('beforeunload', function (e) {
        if(!editor.isClean()){
            e.returnValue = 'You have unsaved changes.';
        }
    });

    window.addEventListener('resize', function(){
        avsort.setSize(window.innerWidth, window.innerHeight);
        avsort.drawFrame();
    });

    window.addEventListener('keydown', function(e){
        if(e.target === document.body){
            switch(e.keyCode){
                case defaults.KEYS.RIGHT:
                    avsort.stepForward();
                    break;
                case defaults.KEYS.SPACE:
                    q('#play').onclick();
                    break;
            }
        }
    });

    // Settings-related
    var btnEnableEditing = q('#btn-enable-edit');
    btnEnableEditing.onclick = function(){
        alert(defaults.EDITOR_ALERT);
        enableEdit();
    };

    var chkEditorAutoEnable = q('#editor-auto-enable');
    chkEditorAutoEnable.onclick = function(){
        if(this.checked === true){
            alert(defaults.EDITOR_ALERT);
            enableEdit();
        }
    };

    var formSettings = q('#settings');
    formSettings.onchange = function () {
        serializeSettings(this);
        applySettings();
    };
    deserializeSettings(formSettings);
    applySettings();


    // Controls
    var btnLoad = q('#load');
    btnLoad.onclick = function(){
        var option = slctAlgorithms.options[slctAlgorithms.selectedIndex];

        if(!editor.isClean()){
            var loadAnyway = confirm('You have unsaved changes.\n' +
            'Are you sure you want to load another code?');

            if(loadAnyway){
                loadAlgorithm(option);
            }
        }
        else {
            loadAlgorithm(option);
        }
    };

    var btnSaveAs = q('#save-as');
    btnSaveAs.onclick = function(){
        var name = prompt('Save algorithm as:');
        if(name !== null && name !== ''){
            if(localStorage.getItem('algorithms') === null){
                localStorage.setItem('algorithms', JSON.stringify([]));
            }

            var algorithms = JSON.parse(localStorage.getItem('algorithms'));
            var nameConflicts = algorithms.filter(function(algoName){
                if(algoName.name === name){
                    return algoName.name;
                }
            });

            var newAlgorithmIndex = algorithms.reduce(function(p, n){
                return Math.max(p, n.index);
            }, algorithms.length>0?algorithms[0].index:-1) + 1;

            if(nameConflicts.length > 0){
                var conflictedName = name + ' #' +newAlgorithmIndex;

                alert("An algorithm has already been saved as '" + name + "'\n" +
                "Your code will be renamed to '" + conflictedName + "'");
                name = conflictedName;
            }

            var obj = {name: name, index: newAlgorithmIndex};
            algorithms.push(obj);
            localStorage.setItem('algorithms', JSON.stringify(algorithms));
            localStorage.setItem('algo-' + newAlgorithmIndex, editor.getValue());

            lastLoaded = addAlgorithmOption(q('#user-algorithms'), obj);
            lastLoaded.selected = true;
            q('#save-controls').style.display = 'inline';
            editor.markClean();
        }
    };

    var btnSave = q('#save');
    btnSave.onclick = function(){
        localStorage.setItem('algo-' + lastLoaded.value, editor.getValue());
        divStatusbar.innerHTML = "Saved '"+ editor.getDoc().title +"'";
        editor.markClean();
    };

    var btnDelete = q('#delete');
    btnDelete.onclick = function () {
        var choice = confirm("Are you sure you want to delete '"+ lastLoaded.text +"' ?");
        if(choice === true){
            localStorage.removeItem('algo-' + lastLoaded.value);

            var json = localStorage.getItem('algorithms');
            if(json !== null){
                var algorithms = JSON.parse(json);
                var toRemove = algorithms.filter(function(algorithm){
                    return algorithm.index === parseInt(lastLoaded.value, 10);
                })[0];

                algorithms.splice(algorithms.indexOf(toRemove), 1);
                localStorage.setItem('algorithms', JSON.stringify(algorithms));

                lastLoaded.parentElement.removeChild(lastLoaded);
                lastLoaded = null;

                var defaultOption = q('option[value='+ defaults.DEFAULT_ALGO +']');
                defaultOption.selected = true;
                loadAlgorithm(defaultOption);

                q('#save-controls').style.display = null;
            }
        }
    };

    var btnRun = q('#run');
    btnRun.onclick = function(){
        forEach(errorWidgets, function (o) {
            editor.removeLineWidget(o);
        });
        errorWidgets = [];
        q('#play').innerHTML = 'Play';

        var code = editor.getValue();
        eval.call(this, code)(avsort, utils);
        avsort.drawFrame();
    };

    var btnPlay = q('#play');
    btnPlay.onclick = function(){
        switch(this.innerHTML){
            case 'Play':
                avsort.play();
                this.innerHTML = 'Pause';
                break;
            case 'Reset':
                avsort.replay();
                this.innerHTML = 'Play';
                break;
            default:
                avsort.pause();
                this.innerHTML = 'Play';
                break;
        }
    };

    var btnStepForward = q('#step-forward');
    btnStepForward.onclick = function(){
        avsort.stepForward();
    };

    var rngVolume = q('#volume');
    var volume = localStorage.getItem('volume');
    if(volume !== null){
        rngVolume.value = volume;
    }
    avsort.setVolume(rngVolume.value);
    rngVolume.oninput = function(e){
        avsort.setVolume(e.target.value);
    };

    rngVolume.onchange = function(e){
        localStorage.setItem('volume', e.target.value);
    };

    // Loading data
    registerAlgorithms();
    var defaultOption = q('option[value='+ defaults.DEFAULT_ALGO +']');
    defaultOption.selected = true;
    loadAlgorithm(defaultOption);
};
},{"./avsort/algorithms.js":2,"./avsort/canvas.js":4,"./defaults.js":6,"./utils.js":9}],9:[function(require,module,exports){
module.exports.forEach = function(iterable, callback){
    for(var i=0; i<iterable.length; i++){
        callback(iterable[i], i);
    }
};

module.exports.shuffle = function(array){
    var randomIndex;
    var length = array.length;

    while(length > 0){
        randomIndex = Math.floor(Math.random() * length--);

        var temp = array[length];
        array[length] = array[randomIndex];
        array[randomIndex] = temp;
    }
};

module.exports.randomArray = function(length){
    var array = [];

    for(var i=1; i<length+1; i++){
        array.push(i);
    }

    module.exports.shuffle(array);

    return array;
};

module.exports.range = function(start, stop){
    var array = [];

    var i = stop===undefined?0:start;
    var end = stop!==undefined?stop:start;

    for(i; i<=end; i++){
        array.push(i);
    }

    return array;
};

module.exports.reverse = function(array){
    array.reverse();
};

module.exports.checkSorted = function(array){
    for(var i=0; i<array.length; i++){
        if(array[i] <= array[i+1]){
            array.mark(i);
        }
    }
    array.mark(i-1);
};


},{}]},{},[1]);
