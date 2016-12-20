var buf = new Buffer(100000);


var str = "我叫王马克";

b.write(str);


console.log(str.length);
console.log(buf.length);
console.log(Buffer.byteLength(str));
