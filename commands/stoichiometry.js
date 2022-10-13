// const math = require('mathjs');
const { Balancer } = require('./balance');
const { unit, format, Unit, multiply, divide, subtract } = require('mathjs')
const parseCompound = require('compound-parser');

let MolarMass = [{
      "symbol": "H",
      "mass": 1
    },
    {
      "symbol": "He",
      "mass": 4
    },
    {
      "symbol": "Li",
      "mass": 7
    },
    {
      "symbol": "Be",
      "mass": 9
    },
    {
      "symbol": "B",
      "mass": 11
    },
    {
      "symbol": "C",
      "mass": 12
    },
    {
      "symbol": "N",
      "mass": 14
    },
    {
      "symbol": "O",
      "mass": 16
    },
    {
      "symbol": "F",
      "mass": 19
    },
    {
      "symbol": "Ne",
      "mass": 20
    },
    {
      "symbol": "Na",
      "mass": 23
    },
    {
      "symbol": "Mg",
      "mass": 24
    },
    {
      "symbol": "Al",
      "mass": 27
    },
    {
      "symbol": "Si",
      "mass": 28
    },
    {
      "symbol": "P",
      "mass": 31
    },
    {
      "symbol": "S",
      "mass": 32
    },
    {
      "symbol": "Cl",
      "mass": 35
    },
    {
      "symbol": "Ar",
      "mass": 40
    },
    {
      "symbol": "K",
      "mass": 39
    },
    {
      "symbol": "Ca",
      "mass": 40
    },
    {
      "symbol": "Sc",
      "mass": 45
    },
    {
      "symbol": "Ti",
      "mass": 48
    },
    {
      "symbol": "V",
      "mass": 51
    },
    {
      "symbol": "Cr",
      "mass": 52
    },
    {
      "symbol": "Mn",
      "mass": 55
    },
    {
      "symbol": "Fe",
      "mass": 56
    },
    {
      "symbol": "Co",
      "mass": 59
    },
    {
      "symbol": "Ni",
      "mass": 59
    },
    {
      "symbol": "Cu",
      "mass": 64
    },
    {
      "symbol": "Zn",
      "mass": 65
    },
    {
      "symbol": "Ga",
      "mass": 70
    },
    {
      "symbol": "Ge",
      "mass": 73
    },
    {
      "symbol": "As",
      "mass": 75
    },
    {
      "symbol": "Se",
      "mass": 79
    },
    {
      "symbol": "Br",
      "mass": 80
    },
    {
      "symbol": "Kr",
      "mass": 84
    },
    {
      "symbol": "Rb",
      "mass": 85
    },
    {
      "symbol": "Sr",
      "mass": 88
    },
    {
      "symbol": "Y",
      "mass": 89
    },
    {
      "symbol": "Zr",
      "mass": 91
    },
    {
      "symbol": "Nb",
      "mass": 93
    },
    {
      "symbol": "Mo",
      "mass": 96
    },
    {
      "symbol": "Tc",
      "mass": 99
    },
    {
      "symbol": "Ru",
      "mass": 101
    },
    {
      "symbol": "Rh",
      "mass": 103
    },
    {
      "symbol": "Pd",
      "mass": 106
    },
    {
      "symbol": "Ag",
      "mass": 108
    },
    {
      "symbol": "Cd",
      "mass": 112
    },
    {
      "symbol": "In",
      "mass": 115
    },
    {
      "symbol": "Sn",
      "mass": 119
    },
    {
      "symbol": "Sb",
      "mass": 122
    },
    {
      "symbol": "Te",
      "mass": 128
    },
    {
      "symbol": "I",
      "mass": 127
    },
    {
      "symbol": "Xe",
      "mass": 131
    },
    {
      "symbol": "Cs",
      "mass": 133
    },
    {
      "symbol": "Ba",
      "mass": 137
    },
    {
      "symbol": "La",
      "mass": 139
    },
    {
      "symbol": "Ce",
      "mass": 140
    },
    {
      "symbol": "Pr",
      "mass": 141
    },
    {
      "symbol": "Nd",
      "mass": 144
    },
    {
      "symbol": "Pm",
      "mass": 145
    },
    {
      "symbol": "Sm",
      "mass": 150
    },
    {
      "symbol": "Eu",
      "mass": 152
    },
    {
      "symbol": "Gd",
      "mass": 157
    },
    {
      "symbol": "Tb",
      "mass": 159
    },
    {
      "symbol": "Dy",
      "mass": 163
    },
    {
      "symbol": "Ho",
      "mass": 165
    },
    {
      "symbol": "Er",
      "mass": 167
    },
    {
      "symbol": "Tm",
      "mass": 169
    },
    {
      "symbol": "Yb",
      "mass": 173
    },
    {
      "symbol": "Lu",
      "mass": 175
    },
    {
      "symbol": "Hf",
      "mass": 178
    },
    {
      "symbol": "Ta",
      "mass": 181
    },
    {
      "symbol": "W",
      "mass": 184
    },
    {
      "symbol": "Re",
      "mass": 186
    },
    {
      "symbol": "Os",
      "mass": 190
    },
    {
      "symbol": "Ir",
      "mass": 192
    },
    {
      "symbol": "Pt",
      "mass": 195
    },
    {
      "symbol": "Au",
      "mass": 197
    },
    {
      "symbol": "Hg",
      "mass": 201
    },
    {
      "symbol": "Tl",
      "mass": 204
    },
    {
      "symbol": "Pb",
      "mass": 207
    },
    {
      "symbol": "Bi",
      "mass": 209
    },
    {
      "symbol": "Po",
      "mass": 210
    },
    {
      "symbol": "At",
      "mass": 210
    },
    {
      "symbol": "Rn",
      "mass": 222
    },
    {
      "symbol": "Fr",
      "mass": 223
    },
    {
      "symbol": "Ra",
      "mass": 226
    },
    {
      "symbol": "Ac",
      "mass": 227
    },
    {
      "symbol": "Th",
      "mass": 232
    },
    {
      "symbol": "Pa",
      "mass": 231
    },
    {
      "symbol": "U",
      "mass": 238
    },
    {
      "symbol": "Np",
      "mass": 237
    },
    {
      "symbol": "Pu",
      "mass": 244
    },
    {
      "symbol": "Am",
      "mass": 243
    },
    {
      "symbol": "Cm",
      "mass": 247
    },
    {
      "symbol": "Bk",
      "mass": 247
    },
    {
      "symbol": "Cf",
      "mass": 251
    },
    {
      "symbol": "Es",
      "mass": 254
    },
    {
      "symbol": "Fm",
      "mass": 257
    },
    {
      "symbol": "Md",
      "mass": 260
    },
    {
      "symbol": "No",
      "mass": 259
    },
    {
      "symbol": "Lr",
      "mass": 262
    },
    {
      "symbol": "Rf",
      "mass": 261
    },
    {
      "symbol": "Db",
      "mass": 262
    },
    {
      "symbol": "Sg",
      "mass": 266
    },
    {
      "symbol": "Bh",
      "mass": 262
    },
    {
      "symbol": "Hs",
      "mass": 265
    },
    {
      "symbol": "Mt",
      "mass": 266
    },
    {
      "symbol": "Ds",
      "mass": 281
    },
    {
      "symbol": "Rg",
      "mass": 272
    },
    {
      "symbol": "Cn",
      "mass": 285
    },
    {
      "symbol": "Uut",
      "mass": 284
    },
    {
      "symbol": "Fl",
      "mass": 289
    },
    {
      "symbol": "Uup",
      "mass": 288
    },
    {
      "symbol": "Lv",
      "mass": 293
    },
    {
      "symbol": "Uus",
      "mass": 294
    },
    {
      "symbol": "Uuo",
      "mass": 294
}]


class Stoichiometry {
    constructor(equation, given, solve) {
        // First get the elements of the unbalanced equation, and check if the values for 'given' and 'solve' are right
        let t1 = given.split(' of ');
        let t2 = solve.split(' of ');
        this.result, this.equationInLatex, this.balancedEquation;
        this.info = {
            given: {
                equation: equation,
                element: t1[1],
                elementInfo: unit(t1[0]).toJSON(),
                elementMolarMass: null 
            },
            solveForElement: t2[1],
            solveForElementMolarMass: null
        }
        this.solveFor = t2[0],
        // SOLVE
        this.determineWhatToSolve()
        // this.getMolarMass()
    }

    determineWhatToSolve() { // Function supports mL, L, kg, and g units for now
        if (this.solveFor.toLowerCase() == "mass" || this.solveFor.toLowerCase() == "m") { 
            // Two things are possible it can be  m to m or m to v
            if (this.info.given.elementInfo.unit == "g" || this.info.given.elementInfo.unit == "kg")  {
                // Mass to Mass
                this.massToMass()        
            } else if (this.info.given.elementInfo.unit == "ml" || this.info.given.elementInfo.unit == "l") {
                // Volume to Mass
                this.volumeToMass()
            }
        } else if (this.solveFor.toLowerCase() == "volume" || this.solveFor.toLowerCase() == "v") {
            // can be m to v or v to v
            if (this.info.given.elementInfo.unit == "g" || this.info.given.elementInfo.unit == "kg")  {
                // Mass to Volume
                this.massToVolume()
            } else if (this.info.given.elementInfo.unit == "ml" || this.info.given.elementInfo.unit == "l") {
                // Volume to Volume
                this.volumeToVolume()
            }
        }
    }

    // TODO: Lessen the codebase... this is a current mess but it works!
    
    // g1, g2 are masses, meanwhile n1, n2 are coefficients... you get it...
    massToMass() {
        // m/n(MW) = x/n(MW) ---> m/n(MW) * n1(MW1) = x
        // Assign variables for convenience (as Math.js UNITS)
        let m = (Unit.fromJSON(this.info.given.elementInfo))
        // Then get molar mass of the elements 'given' and 'solve for' elements
        this.getMolarMass()
        // Assign the solved molar masses into their own temporary variables
        let mw = Unit.fromJSON(this.info.given.elementMolarMass)
        let mw1 = Unit.fromJSON(this.info.solveForElementMolarMass)
        // After that balance the equation (then assign it to the global class variable)
        let balanced = new Balancer(this.info.given.equation);
        this.balancedEquation = balanced.equation;
        // console.log(balanced)
        // Get the coefficient of the known elemenet
        let n = balanced.reactants.find(item => {
            return item.name == this.info.given.element
        }) || balanced.products.find(item => {
            return item.name == this.info.given.element
        })
        // console.log(n)
        // Get the coefficient of the element to be solved 
        let n1 = balanced.products.find(item => {
            return item.name == this.info.solveForElement
        }) || balanced.reactants.find(item => {
            return item.name == this.info.solveForElement
        })
        // console.log(n1)

        this.result = (multiply(divide(m, multiply(n.coefficient, mw)), multiply(n1.coefficient, mw1))).toString()

        // Transform the variables into strings for latex
        this.equationInLatex = `\\frac{m}{n(MW)} = \\frac{x}{n(MW)} \\implies \\frac{${m.toString()}}{${n.coefficient}(${mw.toString()})} \\times ${n1.coefficient}(${mw1.toString()}) = ${this.result}`
    }

    massToVolume() {
        // m/n(MW) = V/n(22.4 L) ---> m/n(MW) * n(22.4L) = V
        let m = (Unit.fromJSON(this.info.given.elementInfo))
        // Then get molar mass of the elements 'given' and 'solve for' elements
        this.getMolarMass()
        // Assign the solved molar masses into their own temporary variables
        let mw = Unit.fromJSON(this.info.given.elementMolarMass)
        // After that balance the equation (then assign it to the global class variable)
        let balanced = new Balancer(this.info.given.equation);
        this.balancedEquation = balanced.equation;
        // console.log(balanced)
        // Get the coefficient of the known elemenet
        let n = balanced.reactants.find(item => {
            return item.name == this.info.given.element
        }) || balanced.products.find(item => {
            return item.name == this.info.given.element
        })
        // console.log(n)
        // Get the coefficient of the element to be solved 
        let n1 = balanced.products.find(item => {
            return item.name == this.info.solveForElement
        }) || balanced.reactants.find(item => {
            return item.name == this.info.solveForElement
        })
        let stp = unit('22.4l');
        // I guess the correct unit would be liters/mole (cause default was m^3/mol) 
        this.result = unit(multiply(divide(m, multiply(n.coefficient, mw)), multiply(n1.coefficient, stp))).to("l mol")

        // Transform the variables into strings for latex
        this.equationInLatex = `\\frac{m}{n(MW)} = \\frac{V}{n(22.4l)} \\implies \\frac{${m.toString()}}{${n.coefficient}(${mw.toString()})} \\times ${n1.coefficient}(22.4l) = ${this.result}`
    }

    volumeToMass() {
        // m/n(MW) = V/n(22.4 L) ---> V/n(22.4L) * n(MW) = m
        let v = (Unit.fromJSON(this.info.given.elementInfo))
        // Then get molar mass of the elements 'given' and 'solve for' elements
        this.getMolarMass()
        // Assign the solved molar masses into their own temporary variables
        let mw1 = Unit.fromJSON(this.info.solveForElementMolarMass)
        // After that balance the equation (then assign it to the global class variable)
        let balanced = new Balancer(this.info.given.equation);
        this.balancedEquation = balanced.equation;
        // Get the coefficient of the known elemenet
        let n = balanced.reactants.find(item => {
            return item.name == this.info.given.element
        }) || balanced.products.find(item => {
            return item.name == this.info.given.element
        })
        // Get the coefficient of the element to be solved 
        let n1 = balanced.products.find(item => {
            return item.name == this.info.solveForElement
        }) || balanced.reactants.find(item => {
            return item.name == this.info.solveForElement
        })
        let stp = unit('22.4l');
        this.result = multiply(divide(v, multiply(n.coefficient, stp)), multiply(n1.coefficient, mw1))

        // Transform the variables into strings for latex
        this.equationInLatex = `\\frac{V}{n(22.4l)} = \\frac{m}{n(MW)} \\implies \\frac{${v.toString()}}{${n.coefficient}(22.4l)} \\times ${n1.coefficient}(${mw1.toString()}) = ${this.result}`
    }

    volumeToVolume() {
        // v/n = x/n --> v/n * n1 = x
        let v = (Unit.fromJSON(this.info.given.elementInfo))
        // Then get molar mass of the elements 'given' and 'solve for' elements
        // After that balance the equation (then assign it to the global class variable)
        let balanced = new Balancer(this.info.given.equation);
        this.balancedEquation = balanced.equation;
        // Get the coefficient of the known elemenet
        let n = balanced.reactants.find(item => {
            return item.name == this.info.given.element
        }) || balanced.products.find(item => {
            return item.name == this.info.given.element
        })
        // Get the coefficient of the element to be solved 
        let n1 = balanced.products.find(item => {
            return item.name == this.info.solveForElement
        }) || balanced.reactants.find(item => {
            return item.name == this.info.solveForElement
        })
        this.result = multiply(divide(v, n.coefficient), n1.coefficient)
        // Transform the variables into strings for latex
        this.equationInLatex = `\\frac{V}{n} = \\frac{V}{n} \\implies \\frac{${v.toString()}}{${n.coefficient}} \\times ${n1.coefficient} = ${this.result}`
    }

    getMolarMass() {
        // Molar mass of element needed to be solved
        let temp = Array.from(parseCompound(this.info.solveForElement))
        let ts, mm = 0;
        temp.forEach(i => {
            ts = MolarMass.find(k => {
                return k.symbol ==  i[0]
            })
            // mm is the molar mass of the compound, ts.mass is the molar mass of a particular the element,
            // while i[1] is the number of elements in the compound.
            mm += ts.mass * i[1];
        })
        this.info.solveForElementMolarMass = (unit(mm, "g/mol")).toJSON()
        // Molar mass of given element (reset variables to be efficient)
        mm = 0, temp = Array.from(parseCompound(this.info.given.element))
        temp.forEach(i => {
            ts = MolarMass.find(k => {
                return k.symbol == i[0]
            })
            mm += ts.mass * i[1]
        })
        this.info.given.elementMolarMass = (unit(mm, "g/mol")).toJSON()
        // console.log(this.info)
    }

}

class StoichiometryPercentage {
    constructor(percent, solute, solution, method) {
        this.solvent, this.equationInLatex, this.givenInfo, this.percent, this.solute, this.solution;
        if (percent != undefined) {
            this.percent = parseFloat(percent.slice(0,-1)); // Remove last character
        }
        if (solute != undefined) {
            this.solute = unit(solute);
        }
        if (solution != undefined) {
            this.solution = unit(solution);
        }
        if (method == "m/m") {
            this.percentByMass();
        } else if (method == "m/v") {
            let originalSolute, originalSolution;
            if (solute != undefined) {
                this.solute = this.solute.toJSON()
                originalSolute = Unit.fromJSON(this.solute)
            }
            if (solution != undefined) {
                this.solution = this.solution.toJSON()
                originalSolution = Unit.fromJSON(this.solution);
            }
            this.percentByMassVolume(originalSolute, originalSolution);
        } else if (method == "v/v") {
            this.percentByVolume();
        }
    }
    
    percentByMass() {  // Formula is m/m * 100 or m/v * 100 (can be g/g or kg/kg, g/kg and such)
        if (this.percent == undefined) { // Solve normally
            this.percent = `${multiply(divide(this.solute, this.solution), 100).toFixed(2)}%`;
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            this.equationInLatex = `\\text{% by Mass} = \\frac{\\text{Mass solute}}{\\text{Mass solution}} \\times \\text{100%} \\implies \\frac{${this.solute}}{${this.solution}} \\times \\text{100%} = \\text{${this.percent}}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - Mass solute: \`${this.solute}\`\n - Mass solvent: \`${this.solvent}\`\n - Mass solution: \`${this.solution}\`\n**Find:** \`Percent by Mass %(m/m)\`\n**Answer:** \`${this.percent}\``

        } else if (this.solute == undefined) { // %(m/m)/100 * solution
            this.solute = multiply(divide(this.percent, 100), this.solution);
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            this.equationInLatex = `\\text{Mass solute} = \\frac{\\text{% by Mass}}{\\text{100%}} \\times \\text{Mass solution} \\implies \\frac{${this.percent.toFixed(2)}}{100} \\times ${this.solution} = ${this.solute}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Mass: \`${this.percent.toFixed(2)}%\`\n - Mass solvent: \`${this.solvent}\`\n - Mass solution: \`${this.solution}\`\n**Find:** \`Mass of solute\`\n**Answer:** \`${this.solute}\``

        } else if (this.solution == undefined) { // solute * 100/%(m/m) = soln
            this.solution =  multiply(this.solute, divide(100, this.percent));
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            // this.equationInLatex = `\\text{Mass solute} = \\frac{\\text{% by Mass}}{\\text{100%}} \\times \\text{Mass solution} \\implies \\frac{${this.percent.toFixed(2)}}{100} \\times ${this.solution} = ${this.solute}`
            this.equationInLatex = `\\text{Mass solution} = \\frac{\\text{100%}}{\\text{% by Mass}} \\times \\text{Mass solute} \\implies \\frac{100}{${this.percent.toFixed(2)}} \\times ${this.solute} = ${this.solution}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Mass: \`${this.percent.toFixed(2)}%\`\n - Mass solvent: \`${this.solvent}\`\n - Mass solute: \`${this.solute}\`\n**Find:** \`Mass of solution\`\n**Answer:** \`${this.solution}\``
        }
    } // Works !
    
    // TODO: Fix unit issues
    percentByMassVolume(originalSolute, originalSolution) { // Same stuff
        if (this.percent == undefined) {
            // Units must be in pair with each other! convert them into (g/ml) or (kg/l)
            if (this.solute.unit == 'g' && this.solution.unit == 'l') { // Transform liters to ml (multiply by 1000)
                this.percent = `${multiply(divide(this.solute.value, multiply(this.solution.value, 1000)), 100).toFixed(2)}%`;
                this.solution = (originalSolution.to('ml')).toString();
                this.solute = originalSolute.toString();
            } else if (this.solute.unit == 'kg' && this.solution.unit == 'ml') { // Transform kg to g (multiply by 1000)
                this.percent = `${multiply(divide(multiply(this.solute.value, 1000), this.solution.value), 100).toFixed(2)}%`;
                this.solute = (originalSolute.to('g')).toString();
                this.solution = originalSolution.toString();
            } else { // Means the units are correct (g/ml, kg/l)
                this.percent = `${multiply(divide(this.solute.value, this.solution.value), 100).toFixed(2)}%`;
                this.solute = originalSolute.toString()
                this.solution = originalSolution.toString()
            }
        
            this.equationInLatex = `\\text{% by Mass/Volume} = \\frac{\\text{Mass solute}}{\\text{Volume solution}} \\times \\text{100%} \\implies \\frac{${this.solute}}{${this.solution}} \\times \\text{100%} = \\text{${this.percent}}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - Mass solute: \`${originalSolute}\`\n - Volume solution: \`${originalSolution}\`\n**Find:** \`Percent by Mass/Volume %(m/v)\`\n**Answer:** \`${this.percent}\``

        } else if (this.solute == undefined) { // %(m/v)/100 * solution
            if (this.solution.unit == 'ml') { // If 'ml' then solute must be in 'g'
                this.solute = `${(multiply(divide(this.percent, 100), this.solution.value)).toFixed(2)} g`
            } else if (this.solution.unit == 'l') { // Transform kg to g (multiply by 1000)
                this.solute = `${(multiply(divide(this.percent, 100), this.solution.value)).toFixed(2)} kg`
            } 
            // END
            this.solution = originalSolution.toString();
            this.equationInLatex = `\\text{Mass solute} = \\frac{\\text{% by Mass/Volume}}{\\text{100%}} \\times \\text{Volume solution} \\implies \\frac{${this.percent.toFixed(2)}}{100} \\times ${this.solution} = ${this.solute}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Mass/Volume: \`${this.percent.toFixed(2)}%\`\n - Volume solution: \`${this.solution}\`\n**Find:** \`Mass of solute\`\n**Answer:** \`${this.solute}\``

        } else if (this.solution == undefined) { // solute * 100/%(m/m) = soln
            if (this.solute.unit == 'g') { // should be in ml
                // this.solution = `${(multiply(divide(this.percent, 100), this.solution.value)).toFixed(2)} g`
                this.solution =  `${multiply(this.solute.value, divide(100, this.percent)).toFixed(2)} ml`
            } else if (this.solute.unit == 'kg') { // liters
                this.solution =  `${multiply(this.solute.value, divide(100, this.percent)).toFixed(2)} l`
                // this.solution = `${(multiply(divide(this.percent, 100), this.solution.value)).toFixed(2)} kg`
            } 

            this.solute = originalSolute.toString();
            this.equationInLatex = `\\text{Volume solution} = \\frac{\\text{100%}}{\\text{% by Mass}} \\times \\text{Mass solute} \\implies \\frac{100}{${this.percent.toFixed(2)}} \\times ${this.solute} = ${this.solution}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Mass/Volume: \`${this.percent.toFixed(2)}%\`\n - Mass solute: \`${this.solute}\`\n**Find:** \`Volume of solution\`\n**Answer:** \`${this.solution}\``
        }
    }

    percentByVolume() { // Copied from percent by mass, just change the format
        if (this.percent == undefined) { // Solve normally
            this.percent = `${multiply(divide(this.solute, this.solution), 100).toFixed(2)}%`;
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            this.equationInLatex = `\\text{% by Volume} = \\frac{\\text{Volume solute}}{\\text{Volume solution}} \\times \\text{100%} \\implies \\frac{${this.solute}}{${this.solution}} \\times \\text{100%} = \\text{${this.percent}}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - Volume solute: \`${this.solute}\`\n - Volume solvent: \`${this.solvent}\`\n - Volume solution: \`${this.solution}\`\n**Find:** \`Percent by Volume %(v/v)\`\n**Answer:** \`${this.percent}\``

        } else if (this.solute == undefined) { // %(m/m)/100 * solution
            this.solute = multiply(divide(this.percent, 100), this.solution);
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            this.equationInLatex = `\\text{Volume solute} = \\frac{\\text{% by Volume}}{\\text{100%}} \\times \\text{Volume solution} \\implies \\frac{${this.percent.toFixed(2)}}{100} \\times ${this.solution} = ${this.solute}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Volume: \`${this.percent.toFixed(2)}%\`\n - Volume solvent: \`${this.solvent}\`\n - Volume solution: \`${this.solution}\`\n**Find:** \`Volume of solute\`\n**Answer:** \`${this.solute}\``

        } else if (this.solution == undefined) { // solute * 100/%(m/m) = soln
            this.solution =  multiply(this.solute, divide(100, this.percent));
            this.solvent = subtract(this.solution, this.solute).toString();
            // Just transform the stuff to string back...
            this.solute = this.solute.toString();
            this.solution = this.solution.toString();
            // this.equationInLatex = `\\text{Mass solute} = \\frac{\\text{% by Mass}}{\\text{100%}} \\times \\text{Mass solution} \\implies \\frac{${this.percent.toFixed(2)}}{100} \\times ${this.solution} = ${this.solute}`
            this.equationInLatex = `\\text{Volume solution} = \\frac{\\text{100%}}{\\text{% by Volume}} \\times \\text{Volume solute} \\implies \\frac{100}{${this.percent.toFixed(2)}} \\times ${this.solute} = ${this.solution}`
            // Store info the givenInfo variable for outputting proper stuff into embed
            this.givenInfo = `**Given:**\n - % by Volume: \`${this.percent.toFixed(2)}%\`\n - Volume solvent: \`${this.solvent}\`\n - Volume solute: \`${this.solute}\`\n**Find:** \`Volume of solution\`\n**Answer:** \`${this.solution}\``
        }
    }
    
}

module.exports = { Stoichiometry, StoichiometryPercentage }
