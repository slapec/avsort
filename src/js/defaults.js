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