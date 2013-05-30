

var b = new Buffer(10000);

var s = "我叫王马克";

b.write(s);

console.log(s.length);
console.log(Buffer.byteLength(s));



