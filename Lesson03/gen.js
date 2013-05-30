

var a = [];


for (var i = 0; i < 100000; i++) {
    a.push(Math.round(Math.random() * 1000000));
}

console.log(JSON.stringify(a));