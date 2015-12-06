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
    var array = module.exports.range(1, length+1);
    module.exports.shuffle(array);
    return array;
};

module.exports.range = function(start, stop, step){
    var array = [];

    var i = stop === undefined ? 0 : start;
    var end = stop !== undefined ? stop : start;
    step = step === undefined ? 1 : step;

    for(i; step > 0? i<end: i>end; i+=step){
        array.push(i);
    }

    return array;
};

module.exports.reverse = function(array){
    return array.reverse();
};

module.exports.concat = function(){
    return Array.prototype.concat.apply([], arguments);
};

module.exports.checkSorted = function(array){
    for(var i=0; i<array.length; i++){
        if(array[i] <= array[i+1]){
            array.mark(i);
        }
    }
    array.mark(i-1);
};

