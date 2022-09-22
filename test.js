const { Bearing } = require('./bearing');

let into = new Bearing(179)

let ad = into.actualDirection();
console.log(ad);
console.log(into.complementaryDirection(ad))
