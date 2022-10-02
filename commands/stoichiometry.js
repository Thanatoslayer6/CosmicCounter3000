const math = require('mathjs')
const { Balancer } = require('./balance')
const MolarMass = [{
    symbol: "H",
    mass: 1
}, {
    symbol: "C",
    mass: 12
}, {
    symbol: "O",
    mass: 16
}, {
    symbol: "N",
    mass: 14
}, {
    symbol: "O",
    mass: 16
    // TODO: Add molar mass list, of all elements if can
}]

class Stoichiometry {
    constructor(equation, given, solve) {
        this.info = [];
        // First get the elements of the unbalanced equation, and check if the values for 'given' and 'solve' are right
        let givenInfo = given.split(' of ');
        let solveInfo = solve.split(' of ');
        console.log(givenInfo, solveInfo)
    }

}

module.exports = { Stoichiometry }
