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

    // Loading data
    registerAlgorithms();
    var defaultOption = q('option[value='+ defaults.DEFAULT_ALGO +']');
    defaultOption.selected = true;
    loadAlgorithm(defaultOption);
};