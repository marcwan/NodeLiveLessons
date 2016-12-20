
try {
  setTimeout(() => {
    throw new Error("OH NOES!!!!");
  }, 4000);
} catch (e) {
  console.log("I caught the error: " + e.message);
}

// node waits for the timeout.

do_something(param1, param2, param3, (err, result1, result2) => {
  if (err != nil) {
    // something bad happened!!
  } else {
    //everyting is okay
  }
});
