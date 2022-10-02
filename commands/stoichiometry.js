const math = require('mathjs');
const { Balancer } = require('./balance');
const { Unit } = require('mathjs')
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
        this.result, this.equationInLatex;
        this.info = {
            given: {
                equation: equation,
                element: t1[1],
                elementInfo: math.unit(t1[0]).toJSON(),
                elementMolarMass: null 
            },
            solveFor: t2[0],
            solveForElement: t2[1],
            solveForElementMolarMass: null
        }
        // SOLVE
        this.determineWhatToSolve()
        // this.getMolarMass()
    }

    determineWhatToSolve() { // Function supports mL, L, kg, and g units for now
        if (this.info.solveFor.toLowerCase() == "mass" || this.info.solveFor.toLowerCase() == "m") { 
            // Two things are possible it can be  m to m or m to v
            if (this.info.given.elementInfo.unit == "g" || this.info.given.elementInfo.unit == "kg")  {
                // Mass to Mass
                this.massToMass()        
            } else if (this.info.given.elementInfo.unit == "ml" || this.info.given.elementInfo.unit == "l") {
                // Volume to Mass
                this.volumeToMass()
            }
        } else if (this.info.solveFor.toLowerCase() == "volume" || this.info.solveFor.toLowerCase() == "v") {
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

    massToMass() {
        // m/n(MW) = x/n(MW) ---> m/n(MW) * n1(MW1) = x
        // Assign variables for convenience
        // let g1 = JSON.parse(JSON.stringify(this.info.given.elementInfo), math.reviver())
        let g1 = (Unit.fromJSON(this.info.given.elementInfo)).toString()
        // Then get molar mass of the elements
        this.getMolarMass()
        // After that balance the equation
        // let balanced = new Balancer(this.info.equation);
        this.equationInLatex = `\\frac{m}{n(MW)} = \\frac{x}{n(MW)} \\implies \\frac{${g1}}{n()}`

        // TODO: Get the coefficients of the elements after balanced, probably don't convert math.js unit for now
        // 
    }

    massToVolume() {

    }
    volumeToMass() {

    }

    volumeToVolume() {

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
        this.info.solveForElementMolarMass = (math.unit(mm, "g/mol")).toJSON()
        // Molar mass of given element (reset variables to be efficient)
        mm = 0, temp = Array.from(parseCompound(this.info.given.element))
        temp.forEach(i => {
            ts = MolarMass.find(k => {
                return k.symbol == i[0]
            })
            mm += ts.mass * i[1]
        })
        this.info.given.elementMolarMass = (math.unit(mm, "g/mol")).toJSON()
        // console.log(this.info)
    }

}

module.exports = { Stoichiometry }
