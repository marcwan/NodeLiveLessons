
var arrays =  require('./arrays.js');


setTimeout(function () {
    console.log("YO YO YO!");
}, 3000);


function intersect(arr1, arr2, callback) {

    var intersection = [];

    var i = 0;

    function sub_compute_intersection() {
        for (var j = 0; j < arr2.length; j++) {
            if (arr2[j] == arr1[i]) {
                intersection.push(arr2[j]);
                break;
            }
        }

        if (i < arr1.length) {
            i++;
            if (i % 1000 == 0) console.log(i);
            process.nextTick(sub_compute_intersection);
        } else {
            callback(intersection);
        }
    }

    sub_compute_intersection();
}



intersect(arrays.arr1, arrays.arr2, function (results) {
    console.log(results.length);
});



