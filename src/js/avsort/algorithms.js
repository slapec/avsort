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
        for(var i=array.length-1; 0<i; --i){
            for(var j=0; j<i; ++j){
                if(array.gt(j, j+1)){
                    array.swap(j, j+1);
                }
            }
        }
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

        (function quick(start, end){
            if(array.length > 1){
                var index = partition(start, end);

                if(start < index - 1){
                    quick(start, index-1);
                }
                if(index < end){
                    quick(index, end);
                }
            }
        })(0, array.length-1);
    });
});

module.exports.insertion = new AVAlgorithm('Insertion sort',
function(avsort, utils){
    var n = 20;
    avsort.setColumnSpacing(1);
    avsort.setColumnWidth(parseInt((window.innerWidth-(n*avsort.columnSpacing)) / n));
    avsort.setArray(utils.randomArray(n));

    avsort.sort(function(array){
        for(var i=1; i<array.length; i++){
            var j = i;
            while(j > 0 && array.gt(j-1, j)){
                array.swap(j, j-1);
                j--;
            }
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
        function siftDown(start, end){
            var root = start;
            while(root*2+1 < end){
                var child = 2*root + 1;
                if((child + 1 < end ) && array[child] < array[child + 1]){
                    child += 1;
                }
                if(array.lt(root, child)){
                    array.swap(child, root);
                    root = child;
                }
                else {
                    return;
                }
            }
        }

        for(var start = parseInt(array.length-2)/2; start>=0; start--){
            siftDown(start, array.length);
        }

        for(var end=array.length-1; end>0; end--){
            array.swap(end, 0);
            siftDown(0, end);
        }
    });
});