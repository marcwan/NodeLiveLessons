
setInterval(function () {
  console.log("Request!");
  if (Math.random() < 0.25) {
    throw new Error("Booo!");
  }
}, 2000);
