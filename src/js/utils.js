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

