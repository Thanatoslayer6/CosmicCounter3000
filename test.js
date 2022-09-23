// const { Bearing } = require('./bearing');
const { AccuracyPrecision } = require('./commands/accuracyprecision')
// let into = new Bearing(179)

// let ad = into.actualDirection();
// console.log(ad);
// console.log(into.complementaryDirection(ad))

// let temp = new AccuracyPrecision("49.52, 50.65, 48.96, 51.43", 50);
let temp = new AccuracyPrecision("820.2 844.5 898.28 899.99", 800);
temp.main()

console.log(temp.listOfValues)
console.log(temp.average);
console.log(temp.listOfAdValues);
console.log(temp.averageAd)
console.log(temp.percentError);
console.log(temp.relativeDeviation);
console.log(temp.conclusion);

const { table } = require('table');

const data = [
    ['0A', '0B', '0C'],
    ['1A', '1B', '1C'],
    ['2A', '2B', '2C']
];

console.log(table(data));
