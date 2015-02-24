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