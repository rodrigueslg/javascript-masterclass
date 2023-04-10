f1 = function() {
  var v1 = 10;
  return function() {
    return v1;
  }()
};
console.log(f1());