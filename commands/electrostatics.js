const { unit, sum, multiply, divide, abs, square } = require('mathjs')
const nerdamer = require('nerdamer/all')

class Electrostatics {
    // Pass the charge of the given object/s as input as well as their distance which is optional
    // Example input for charges
    constructor(charges, distance, radiusEquation) {
        this.coulombConstant = unit(9.0e9, 'N m^2 C^-2')
        // console.log(coulombConstant.toString())
        this.info = `\t**Given:**\n\t   - Charges:`
        let userInputCharges = charges.split(/(?<=[cC])\s*/g)
        this.parsedCharges = userInputCharges.map((input, index) => {
            let convertedToCoulombs = (unit(input).to('C'))
            this.info += `\n\t\t${input} ---> \`${convertedToCoulombs}\`` 
            return {
                object: index + 1,
                givenCharge: input,
                convertedUnitCharge: convertedToCoulombs
            }
        })
        // Get total and final charges (identical radius)
        this.getTotalCharge()
        this.getFinalChargeIdentical()
        
        // Check if distance exists
        if (distance) {
            // Assign distance in meters
            this.distance = unit(distance, 'm').to('m');
            this.info += `\n\t   - Distance (m): \`${this.distance.toString()}\``
        }
        // Check if user has added some radius exists 
        if (radiusEquation) {
            this.radiusEquation = radiusEquation
            this.info += `\n\t   - Radius equation: \`${this.radiusEquation.toString()}\``
            this.parsedRadiusEquation = this._parseRadiusEquation(radiusEquation)
            // Get final charge for unequal radius
            this.getFinalChargeUnidentical()

            // Encapsulate all information
            this.info += `\n\t**Answer:**\n\t   - Total Charge: \`${this.totalCharge.toString()}\`\n\t   - Final Charge (identical radius): \`${this.finalChargeIdentical.toString()}\`\n\t   - Final Charge (unequal radius):`
            this.finalChargeUnidentical.forEach(finalCharge => {
                this.info += `\n\t\t${finalCharge.name} = \`${finalCharge.charge}\``
            })
        } else {

            // Encapsulate all information
            this.info += `\n\t**Answer:**\n\t   - Total Charge: \`${this.totalCharge.toString()}\`\n\t   - Final Charge (identical radius): \`${this.finalChargeIdentical.toString()}\``
        }

        // Check if the charges are only 2 meaning there are only 2 objects, then if yes solve for Coulomb's law
        if (distance && (userInputCharges.length == 2)) {
            this.getElectricForceMagnitudeBefore()
            this.getElectricForceMagnitudeAfter();
            this.info += `\n\t   - Electric Force (Before collision): ${this.electricForceMagnitudeBefore.toString()}`
            this.info += `\n\t   - Electric Force (After collision): ${this.electricForceMagnitudeAfter.toString()}`
        }

        // console.log(this.info)
        // console.log(this.totalChargeLatex)
        // console.log(this.finalChargeIdenticalLatex)
        // console.log(this.finalChargeUnidentical)
        this.equationInLatex = [
            this.totalChargeLatex,
            this.finalChargeIdenticalLatex,
            this.electricForceMagnitudeBeforeLatex,
            this.electricForceMagnitudeAfterLatex
        ].filter(i => i)
        // console.log(this.equationInLatex)
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
        // let lastElementInTheEquationCharge = `${result.toString().slice(1, -1)} C`
        // this.finalChargeUnidentical = `${result.toString().slice(1, -1)} C`
        this.finalChargeUnidentical = [];
        // console.log(this.parsedRadiusEquation)
        // Create an array for the terms of the equation, in this case it will be the charges solved
        // this.finalChargeUnidentical = this.parsedRadiusEquation.map(item => {
        //     let solvedTerm = nerdamer.solve(`${item.name} = ${lastElementInTheEquation.name}`, item.name)
        //     // TODO:
        //     // SHOW ALL CHARGES IF UNIDENTICAL....
        // })
        for (let i = 0; i < this.parsedRadiusEquation.length; i++) {
            let equationToSolve, solvedTerm;
            if (i == this.parsedRadiusEquation.length - 1) {
                this.finalChargeUnidentical.push({
                    name: `q${lastElementInTheEquation.name}`,
                    charge: `${result.toString().slice(1, -1)} C`
                })
            } else {
                // equationToSolve = `${this.parsedRadiusEquation[i].coefficient}${this.parsedRadiusEquation[i].name} = ${lastElementInTheEquation.coefficient}(${result.toString().slice(1,-1)})`
                equationToSolve = `${this.parsedRadiusEquation[i].coefficient}${this.parsedRadiusEquation[i].name} = ${lastElementInTheEquation.coefficient}(${result.toString().slice(1,-1)})`
                // console.log(equationToSolve)
                solvedTerm = nerdamer.solve(equationToSolve, this.parsedRadiusEquation[i].name)
                // console.log(solvedTerm.toString())
                this.finalChargeUnidentical.push({
                    name: `q${this.parsedRadiusEquation[i].name}`,
                    charge: `${solvedTerm.toString().slice(1, -1)} C`
                })
            }
            // let solvedTerm = nerdamer.solve(`${this.parsedRadiusEquation[i].name} = ${lastElementInTheEquation.name}`)
        }
        // console.log(this.finalChargeUnidentical)
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

    getElectricForceMagnitudeBefore() {
        // F_{e} = k\\frac{\\abs{q_{1}q_{2}}}{r^{2}}
        this.electricForceMagnitudeBefore = (multiply(this.coulombConstant, divide(abs(multiply(this.parsedCharges[0].convertedUnitCharge, this.parsedCharges[1].convertedUnitCharge)), square(this.distance)))).to('N')
        this.electricForceMagnitudeBeforeLatex = `F_{e} = k\\frac{| q_{1}q_{2} |}{r^{2}} \\rightarrow ${this.coulombConstant.toString()}\\frac{|${this.parsedCharges[0].convertedUnitCharge.toString()}\\times${this.parsedCharges[1].convertedUnitCharge.toString()}|}{(${this.distance.toString()})^{2}} = \`${this.electricForceMagnitudeBefore.toString()}\``
        // console.log(this.electricForceMagnitudeBefore.to('N').toString())
        // console.log(this.electricForceMagnitudeBeforeLatex)
    }

    getElectricForceMagnitudeAfter() {
        // If identical then simply substitute the final charge
        this.electricForceMagnitudeAfter = (multiply(this.coulombConstant, divide(abs(multiply(this.finalChargeIdentical, this.finalChargeIdentical)), square(this.distance)))).to('N')
        this.electricForceMagnitudeAfterLatex = `F_{e} = k\\frac{| q_{1}q_{2} |}{r^{2}} \\rightarrow ${this.coulombConstant.toString()}\\frac{|${this.finalChargeIdentical.toString()}\\times${this.finalChargeIdentical.toString()}|}{(${this.distance.toString()})^{2}} = \`${this.electricForceMagnitudeAfter.toString()}\``
        // console.log(this.electricForceMagnitudeAfter.to('N').toString())
        // console.log(this.electricForceMagnitudeAfterLatex)
    }
    // TODO: 
    // - Round to some number of significant figures???
    // - index.js 'temp.info' output properly
}

const ElectrostaticsCommand = {
    name: "electrostatics",
    description: "Calculates total charge and final charge of the given spheres/objects",
    options: [{
        name: 'charges',
        description: "The list of charges in order q1, q2, q3 (e.x format '-4 nC 12nC 5.23e-6C')",
        type: 3, // string
        required: true
    }, {
        name: 'distance',
        description: 'The distance between two spheres/object in meters (decimal/number)',
        type: 10, // double
        required: false
    }, {
        name: 'radius-equation',
        description: "The given equation if spheres/object is unidentical (e.x format 'ra = rb = 2rc')",
        type: 3, // string
        required: false
    }]
} 

module.exports = { Electrostatics, ElectrostaticsCommand }
