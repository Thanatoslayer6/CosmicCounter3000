// const { sin, cos, atan, isNegative, abs, pi, sqrt, square } = require('mathjs');
const { unit, round, Unit, add, sum, multiply, divide, subtract, isNumber } = require('mathjs')
const nerdamer = require('nerdamer/all')

class Electrostatics {
    // Pass the charge of the given object/s as input as well as their distance which is optional
    // Example input for charges
    constructor(charges, distance, radiusEquation) {
        this.givenInfo = `**Given:**\n - Charges:\n`
        this.distance = distance;
        let userInputCharges = charges.split(/(?<=[cC])\s*/g)
        this.parsedCharges = userInputCharges.map((input, index) => {
            let convertedToCoulombs = (unit(input).to('C'))
            this.givenInfo +=  `\t\t\n${input} ---> ${convertedToCoulombs}` 
            return {
                object: index + 1,
                givenCharge: input,
                convertedUnitCharge: convertedToCoulombs
            }
        })
        if (radiusEquation) {
            this.radiusEquation = radiusEquation
            this.parsedRadiusEquation = this._parseRadiusEquation(radiusEquation)
        }
        this.getTotalCharge()
        this.getFinalChargeIdentical()
        this.getFinalChargeUnidentical()
        console.log(this.givenInfo)
    }

    _parseRadiusEquation(req) {
        let splittedRadiusEquation = req.split('=');
        let result = splittedRadiusEquation.map(element => {
            return {
                name: element.trim().slice(-1),
                coefficient:  Number(element.match(/\d+/g)) || 1,
            }
        })
        return result;
        // temp = temp.map(i => result.set())
    }

    getTotalCharge() {
        this.totalChargeLatex = 'q_{total} = '

        // Just add (this is still a math object, just convert to string)
        this.totalCharge = sum(this.parsedCharges.map((charge, index) => {
            let chargeInCoulombs = charge.convertedUnitCharge;
            this.totalChargeLatex += chargeInCoulombs.toString()

            if (index < this.parsedCharges.length - 1) {
                this.totalChargeLatex += " + ";
            }

            return chargeInCoulombs
        })).to('C')
        this.totalChargeLatex += ` = ${this.totalCharge.toString()}`
        // console.log(this.totalCharge)
        // console.log(this.totalChargeLatex)
    }

    /*
     * HOW TO SOLVE FINAL CHARGE IF UNIDENTICAL/DIFFERENT RADIUS SIZE?
     *
          Understand that the charge of all objects is inversely proportional to its radius and is equal to all 

            qa/ra = qb/rb = qc/rc

          Although there is a pattern to be recognized... say the formula for the followng radius is ra = rb = 3rc
          then a derived formula can be obtained -> qa = qb = 3qc

            e.g if 3ra = 2rb = 5rc (equation 1) ---> 3qa = 2qb = 5qc (equation 2)

          After getting equation 2, we can then proceed to get equation 3 which is essentially using the formula for total charge
          which is qa + qb + qc = z then substituting the values needed, it is observed that there is also a pattern... 
          say eq.2 is 3qa = qb = 5qc, then a derived formula is -> 5qc/3 + 5qc + qc = z

            e.g if 3qa = 2qb = 5qc (equation 2) ---> 5qc/3 + 5qc/2 + qc = z

    */
    getFinalChargeUnidentical() {
        // Will not create latex for this.... 
        if (!this.parsedRadiusEquation && !this.totalCharge) {
            return; // Cannot solve so just end asap
        }
        let equation3 = ``
        let lastElementInTheEquation = this.parsedRadiusEquation[this.parsedRadiusEquation.length - 1]

        // Use the total charge equation
        for (let i = 0; i < this.parsedRadiusEquation.length; i++) {
            if (i == this.parsedRadiusEquation.length - 1) {
                // Append last element in the equation as well as the total charge, note that we remove its unit
                equation3 += `${this.parsedRadiusEquation[i].name} = ${this.totalCharge.toString().slice(0, -1)}`
                break;
            }
            // equation3 += `${this.parsedRadiusEquation[this.parsedRadiusEquation.length - 1].coefficient}${this.parsedRadiusEquation[i].name}/${this.parsedRadiusEquation[i].coefficient}`
            equation3 += `${lastElementInTheEquation.coefficient}${lastElementInTheEquation.name}/${this.parsedRadiusEquation[i].coefficient}`
            if (i < this.parsedRadiusEquation.length) {
                equation3 += ' + '
            }
        }
        let result = nerdamer.solve(equation3, lastElementInTheEquation.name)
        // Remove the '[  ]' and turn it into a math unit
        this.finalChargeUnidentical = `${result.toString().slice(1, -1)} C`
    }

    getFinalChargeIdentical() {
        // If identical... add all then divide by the number of objects
        this.finalChargeIdentical = divide(this.totalCharge, this.parsedCharges.length).to('C');
        // Get the content
        let splittedTotalChargeLatex = this.totalChargeLatex.split('=')
        this.finalChargeIdenticalLatex = `q_{final} = \\frac{${splittedTotalChargeLatex[1]}}{${this.parsedCharges.length}} = \\frac{${splittedTotalChargeLatex[2]}}{${this.parsedCharges.length}} = ${this.finalChargeIdentical.toString()}`
        // console.log(this.finalChargeIdenticalLatex)
        // console.log(this.finalChargeIdentical.toString())
    }
}

const ElectrostaticsCommand = {
    name: 'electrostatics',
    description: 'Calculates total charge and final charge of the given spheres/objects',
    options: [{
        name: 'charges',
        description: "The list of charges in order q1, q2, q3... (e.x format '-4 nC 12nC 5.23e-6C')",
        type: 3, // string
        required: true
    }, {
        name: 'distance',
        description: 'The distance between two spheres/object in meters (decimal/number)',
        type: 10, // double
        required: false
    }, {
        name: 'radiusEquation',
        description: "The given equation if spheres/object is unidentical... (e.x format 'ra = rb = 2rc')",
        type: 3, // string
        required: false
    }]
} 

module.exports = { Electrostatics, ElectrostaticsCommand }
