// const { sin, cos, atan, isNegative, abs, pi, sqrt, square } = require('mathjs');
const { unit, round, Unit, add, sum, multiply, divide, subtract } = require('mathjs')

class Electrostatics {
    // Pass the charge of the given object/s as input as well as their distance which is optional
    // Example input for charges
    constructor(charges, distance) {
        this.charges = this.parsedCharges = charges.split(/(?<=[cC])\s*/g)
        // Assign the number of objects, depending upon the # of passed charges
        this.numberOfObjects = this.parsedCharges.length;
        // First we convert the following charges into a unit
        this.charges = this.charges.map(i => unit(i))
        // console.log(this.charges) // An array of math units
        // console.log(this.parsedCharges) // An array of the input values, splitted/exracted
    }

    totalCharge() {
        this.totalCharge = sum(this.charges)
        // console.log(this.totalCharge.toString())
    }

    finalCharge() {
        
    }

    finalChargeIdentical() {
        this.finalChargeIdentical = divide(this.totalCharge, this.numberOfObjects);
        // console.log(this.finalChargeIdentical.toString())
    }
}

const ElectrostaticsCommand = {
    name: 'electrostatics',
    description: 'Calculates total charge and final charge of the given spheres/objects',
    options: [{
        name: 'charges',
        description: "The list of charges q1, q2, q3... (e.x format '-4 nC 12nC -5.2 nC 5.23e-6C')",
        type: 3, // string
        required: true
    }, {
        name: 'distance',
        description: 'The distance between two spheres/object (decimal/number)',
        type: 10, // double
        required: false
    }]
} 

module.exports = { Electrostatics, ElectrostaticsCommand}
