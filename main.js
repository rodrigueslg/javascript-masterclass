const calcArea = function(fn) {
  return fn(Math.PI * Math.pow(this.radius, 2));
}

const circle = {
  radius: 10,
  //calcArea
}

ca = calcArea.bind(circle);

console.log(ca(Math.round));
console.log(ca(Math.ceil));