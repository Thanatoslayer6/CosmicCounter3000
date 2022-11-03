const { unit, round, Unit, format, createUnit, multiply, divide, add, abs, subtract } = require('mathjs')
const { MolarMass } = require('./stoichiometry')
const { Ions } = require('./weq')
const parseCompound = require('compound-parser')

createUnit("equivalent", { aliases: [ 'eq', 'eqw', 'equiv' ] })
createUnit("equivalentPerLiter", { definition: ['eq/l', 'eqw/l' ,'equiv/l'] })

const formulas = {
    // Solute
    nSolute: (massSolute, mwSolute, nSolvent, nfSolvent, nfSolute, molality, massSolvent, molarity, massSolution) => {
        if (massSolute != undefined && mwSolute != undefined) { // main formula
            // return massSolute/mwSolute
            return divide(massSolute, mwSolute)
        } else if (nSolvent != undefined && nfSolvent != undefined) { // derived formula from nfsolvent
            // return  (nSolvent/nfSolvent) - nSolvent 
            return subtract(divide(nSolvent, nfSolvent), nSolvent)
        } else if (nSolvent != undefined && nfSolute != undefined) { // derived formula from nfsolute, parenthesis very improtnat
            // return (nfSolute * nSolvent)/ (1 - nfSolute)
            return divide(multiply(nfSolute, nSolvent), subtract(unit(1), nfSolute))
        } else if(molality != undefined && massSolvent != undefined){
            // return molality * (massSolvent / 1000)
            return multiply(molality, massSolvent.to('kg'))
        } else if(molarity != undefined && massSolution != undefined){
            try {
                return multiply(molarity, massSolution.to('kg'))
            } catch (exception) {
                return multiply(molarity, convertMassOrVolumeSolution(massSolution, true))
            }
        }
        return undefined
    },
    massSolute: (massSolution, massSolvent, mwSolute, nSolute) => {
        if (massSolution != undefined && massSolvent != undefined) {
            // return massSolution - massSolvent
            try {
                return subtract(massSolution, massSolvent)
                // return multiply(molarity, massSolution.to('kg'))
            } catch (exception) {
                return subtract(convertMassOrVolumeSolution(massSolution), massSolvent)
                // return multiply(molarity, convertMassOrVolumeSolution(massSolution))
            }
        } else if (nSolute != undefined && mwSolute != undefined) {
            // return mwSolute * nSolute 
            return multiply(mwSolute, nSolute)
        }
        return undefined
    },
    nfSolute: (nSolute, nSolvent, nfSolvent) => {
        if (nSolute != undefined && nSolvent != undefined) {
            // return ((nSolute) / ((nSolute) + (nSolvent)))
            return divide(nSolute, add(nSolute, nSolvent))
        } else if (nfSolvent != undefined) {
            // return 1 - nfSolvent
            return subtract(unit(1), nfSolvent)
        }
        return undefined
    },
    // Solvent
    nSolvent: (massSolvent, mwSolvent, nSolute, nfSolute, nfSolvent) => {
        if (massSolvent != undefined && mwSolvent != undefined) {
            // return massSolvent/mwSolvent
            return divide(massSolvent, mwSolvent)
        } else if (nSolute != undefined && nfSolute != undefined) {
            // return (nSolute/nfSolute) - nSolute
            return subtract(divide(nSolute, nfSolute), nSolute)
        } else if (nSolute != undefined && nfSolvent != undefined) {
            // return (nfSolvent * nSolute) /(1 - nfSolvent)
            // console.log(multiply(nfSolvent, nSolute))
            return divide(multiply(nfSolvent, nSolute), subtract(unit(1), nfSolvent))
        }
      return undefined
    },

    massSolvent: (massSolution, massSolute, mwSolvent, nSolvent, nSolute, molality) => {
        if (massSolution != undefined && massSolute != undefined) {
            // return massSolution - massSolute;
            try {
                return subtract(massSolution, massSolute) 
            } catch (exception) {
                return subtract(convertMassOrVolumeSolution(massSolution), massSolute) 
            }
        } else if (nSolvent != undefined && mwSolvent != undefined) {
            // return mwSolvent * nSolvent
            return multiply(mwSolvent, nSolvent)
        } else if(nSolute != undefined && molality != undefined){
          // return nSolute / molality
            return divide(nSolute, molality) 
        }
        return undefined
    },

    nfSolvent: (nSolute, nSolvent, nfSolute) => {
        if (nSolute != undefined && nSolvent != undefined) {
             // return ((nSolvent) / ((nSolute) + (nSolvent)))
            return divide(nSolvent, add(nSolvent, nSolute))
        } else if (nfSolute != undefined) {
            return subtract(unit(1), nfSolute)
          // return 1 - nfSolute
        }
        return undefined
    },
    // Added another method for calculating massSolution cuz of (undefined + somenumber = somenumber) issues
    massSolution: (massSolute, massSolvent, nSolute, molarity) => {
        if (massSolute != undefined && massSolvent != undefined) {
            return add(massSolute, massSolvent)
          // return massSolute + massSolvent;
        } else if(nSolute != undefined && molarity != undefined){
            // Since this is just mol / (mol / l) just convert to grams
            return convertMassOrVolumeSolution(divide(nSolute, molarity))
          // return nSolute / molarity
        }
        return undefined
    },
    molality: (nSolute, massSolvent) => {
        if(nSolute != undefined && massSolvent != undefined){
            return divide(nSolute, massSolvent.to('kg'))
          // return (nSolute) / (massSolvent / 1000)
        }
        return undefined
    },
    molarity: (nSolute, massSolution) => {
        // Mass solution can be Volume solution since Aqueous solutions is 1g/1ml
        if(nSolute != undefined && massSolution != undefined){
            try {
                return divide(nSolute, massSolution.to('l'))
            } catch (exception) {
                return divide(nSolute, convertMassOrVolumeSolution(massSolution, true))
            }
          // return (nSolute) / (massSolution / 1000)
        }
        return undefined
    },
    
    // TODO: Do equivalent solutes and discord output
    //  equivalent weight is already given
    equivalentOfSolute: (massSolute, equivalentWeight) => {
        if (massSolute != undefined && equivalentWeight != undefined) {
            let temp = divide(massSolute, equivalentWeight)
            return unit(temp, "eq")
        }         
        return undefined;
    },

    normality: (equivalentOfSolute, massSolution, molarity, valencyFactor) => {
        if (molarity != undefined && valencyFactor != undefined) {
            let temp = (multiply(molarity, valencyFactor)).toNumber('mol/l')
            return unit(temp, 'eq/l')
        } else if (equivalentOfSolute != undefined && massSolution != undefined) {
            try {
                return divide(equivalentOfSolute, massSolution.to('l'))
            } catch (exception) {
                return divide(equivalentOfSolute, convertMassOrVolumeSolution(massSolution, true))            
            }
        }
        return undefined
    },
}

// Used for converting mass -> volume, volume <- mass, since aqueous solutions are 1g/1ml or 1kg/1l
const convertMassOrVolumeSolution = (u, isKiloOrLiter) => {
    let actualUnit = (Unit.parse(u.valueOf())).formatUnits()
    if (actualUnit == 'l') { // convert to kilograms
        return unit(u.toNumber(actualUnit), 'kg')
    } else if (actualUnit == 'ml'){ // convert to grams
        if (isKiloOrLiter) {
            return unit(u.toNumber(actualUnit), 'kg')
        }
        return unit(u.toNumber(actualUnit), 'g')

    } else if (actualUnit == 'g') { // convert to mL
        if (isKiloOrLiter) {
            return unit(u.toNumber(actualUnit), 'l')
        }
        return unit(u.toNumber(actualUnit), 'ml')
    } else if (actualUnit == 'kg') { // convert to liters
        return unit(u.toNumber(actualUnit), 'l')
    }
    return undefined;
}

class ChemTable {
    constructor(solution, massSolute, massSolvent, massSolution, nSolute, nSolvent, nfSolute, nfSolvent, molality, molarity, equivalentOfSolute, normality) {
        let temp = this.getMolarMassAndEquivalentWeight(solution);
        // First we figure out the molar mass of the solution
        this.solution = solution // This one's required to no need to set to undefined
        // solute
        this.massSolute = massSolute
        this.mwSolute = unit(temp.mwSolute, "g/mol") // already guds once user inputs solution
        this.nSolute = nSolute
        this.nfSolute = nfSolute
        // solvent
        this.massSolvent = massSolvent
        this.mwSolvent = unit(18, "g/mol") // required (default) already guds
        this.nSolvent = nSolvent
        this.nfSolvent = nfSolvent
        // others
        this.massSolution = massSolution
        this.molality = molality
        this.molarity = molarity
        // normality stuff
        this.normality = normality
        this.valencyFactor = temp.valencyFactor;
        this.equivalentWeight = unit(temp.equivalentWeight, 'g')
        this.equivalentOfSolute = equivalentOfSolute;
        this.checkGiven();
        this.solve()
        for (let i = 0; i < 3; i++) {
            this.solve();
        }
    }

    checkGiven() {
        // Solute
        (this.massSolute != undefined) ? this.massSolute = unit(this.massSolute, "g") : undefined;
        (this.nSolute != undefined) ? this.nSolute = unit(this.nSolute, "mol") : undefined;
        (this.nfSolute != undefined) ? this.nfSolute = unit(this.nfSolute) : undefined;
        // Solvent
        (this.massSolvent != undefined) ? this.massSolvent = unit(this.massSolvent, "g") : undefined;
        (this.nSolvent != undefined) ? this.nSolvent = unit(this.nSolvent, "mol") : undefined;
        (this.nfSolvent != undefined) ? this.nfSolvent = unit(this.nfSolvent) : undefined;
        // Others
        (this.massSolution != undefined) ? this.massSolution = unit(this.massSolution, "g") : undefined;
        (this.molality != undefined) ? this.molality = unit(this.molality, "mol/kg") : undefined;
        (this.molarity != undefined) ? this.molarity = unit(this.molarity, "mol/l") : undefined;
        (this.equivalentOfSolute != undefined) ? this.equivalentOfSolute = unit(this.equivalentOfSolute, "eq") : undefined;
        (this.normality != undefined) ? this.normality = unit(this.normality, "eq/l") : undefined;
    }

    solve() {
        // Mass
        if(this.massSolute == undefined){
            this.massSolute = formulas.massSolute(this.massSolution, this.massSolvent, this.mwSolute, this.nSolute)
        } 
        if(this.massSolvent == undefined){
            this.massSolvent = formulas.massSolvent(this.massSolution, this.massSolute, this.mwSolvent, this.nSolvent, this.nSolute, this.molality)
        } 
        if(this.massSolution == undefined){
            this.massSolution = formulas.massSolution(this.massSolute, this.massSolvent, this.nSolute, this.molarity)
        }
        // Mole solute and Mole solvent
        if(this.nSolute == undefined){
            this.nSolute = formulas.nSolute(this.massSolute, this.mwSolute, this.nSolvent, this.nfSolvent, this.nfSolute, this.molality, this.massSolvent, this.molarity, this.massSolution)
        }
        if(this.nSolvent == undefined){
            this.nSolvent = formulas.nSolvent(this.massSolvent, this.mwSolvent, this.nSolute, this.nfSolute, this.nfSolvent)
        }
        // Mole fraction solute and solvent
        if(this.nfSolute == undefined){
            this.nfSolute = formulas.nfSolute(this.nSolute, this.nSolvent, this.nfSolvent)
        }
        if(this.nfSolvent == undefined){
            this.nfSolvent = formulas.nfSolvent(this.nSolute, this.nSolvent, this.nfSolute)
        }
        // Molality
        if(this.molality == undefined){
            this.molality = formulas.molality(this.nSolute, this.massSolvent)
        }
        // Molarity
        if(this.molarity == undefined){
            this.molarity = formulas.molarity(this.nSolute, this.massSolution)
        }
        // Equivalent solutes (mass of solute / equivalent weight) this is like moles but in terms of eq
        if (this.equivalentOfSolute == undefined) {
            this.equivalentOfSolute = formulas.equivalentOfSolute(this.massSolute, this.equivalentWeight)
        }
        // Normality
        if (this.normality == undefined) {
            this.normality = formulas.normality(this.equivalentOfSolute, this.massSolution, this.molarity, this.valencyFactor)
        }
    }

    getMolarMassAndEquivalentWeight(solution) {
        // Molar mass of element needed to be solved
        let temp = Array.from(parseCompound(solution))
        let ts, mm = 0, n = 0;
        temp.forEach(i => {
            if (i[0] == 'H') { // Works on H and (OH) ions
                n = i[1]
            }
            ts = MolarMass.find(k => {
                return k.symbol == i[0]
            })
            // mm is the molar mass of the compound, ts.mass is the molar mass of a particular the element,
            // while i[1] is the number of elements in the compound.
            mm += ts.mass * i[1];
        })
        /*
            If there are no H or (OH) ions this means it aint acid, its salt
            multiply number of cations with its charge, usually index 0 is the cation,
            if that doesn't work then 
        */
        if (n == 0) { 
            try {
                n = temp[0][1] * this.getCharge(temp[0][0])
            } catch(exception) {
                console.log(`Checking for whole compound: ${solution} and its charge`)
                n = abs(this.getCharge(solution))
            }
        }
        return {
            mwSolute: mm,
            equivalentWeight: mm/n,
            valencyFactor: n
        }
    }

    getCharge(ion) {
        let temp = Ions.find(i => {
            return ion == i[1]
        })
        return parseInt(temp[2]);
    }

    // Mass Solute: ${this.massSolute.to('g')?.toString()}
    showOutput() {
        let output = `
        Mass Solute: \`${format(this.massSolute?.to('g'), {notation: 'fixed', precision: 2})}\`
        Mass Solvent: \`${format(this.massSolvent?.to('g'), {notation: 'fixed', precision: 2})}\`
        Mass Solution: \`${format(this.massSolution?.to('g'), {notation: 'fixed', precision: 2})}\`

        MW Solute: \`${format(this.mwSolute, {notation: 'fixed', precision: 2})}\`
        MW Solvent: \`${format(this.mwSolvent, {notation: 'fixed', precision: 2})}\`

        Mole Solute (nSolute): \`${format(this.nSolute, {notation: 'fixed', precision: 2})}\`
        Mole Solvent (nSolvent): \`${format(this.nSolvent, {notation: 'fixed', precision: 2})}\`

        Mole Fraction Solute (nfSolute): \`${format(this.nfSolute, {notation: 'fixed', precision: 2})}\`
        Mole Fraction Solvent (nfSolvent): \`${format(this.nfSolvent, {notation: 'fixed', precision: 2})}\`

        Molality: \`${format(this.molality, {notation: 'fixed', precision: 2})}\`
        Molarity: \`${format(this.molarity, {notation: 'fixed', precision: 2})}\`
        Normality: \`${format(this.normality, {notation: 'fixed', precision: 2})}\`

        Valency Factor (n): \`${this.valencyFactor}\`
        Equivalent Weight: \`${format(this.equivalentWeight, {notation: 'fixed', precision: 2})}\`
        Equivalent of Solute: \`${this.equivalentOfSolute?.toString()}\``;
        return output
    }

}

// let item = new ChemTable()
const ChemTableCommand = {
    name: "chemistry-table",
    description: "Solves the whole chemistry table solution from mass solute/solvent up to normality",
    options: [{
        name: "solution",
        description: "The given solution like NaCl, LiCl, or any other compound",
        type: 3,
        required: true,
    },{
        name: "mass-solute",
        description: "Mass solute of the solution can be in g or kg, default is in grams (245, 245g, 0.245kg)",
        type: 3,
    },{
        name: "mass-solvent",
        description: "Mass solvent of the solution can be in g or kg, default is in grams (245, 245g, 0.245kg)",
        type: 3,
    },{
        name: "mass-solution",
        description: "Mass solution can be in g or kg, default is in grams (120, 120, 0.12kg)",
        type: 3,
    },{
        name: "nsolute",
        description: "Mole solute, default is in mol (0.20, 0.20 mol)",
        type: 3,
    },{
        name: "nsolvent",
        description: "Mole solvent, default is in mol (0.20, 0.20 mol)",
        type: 3,
    },{
        name: "nfsolute",
        description: "Mole fraction solute, no unit needed (0.79, 0.21)",
        type: 3,
    }, {
        name: "nfsolvent",
        description: "Mole fraction solvent, no unit needed (0.54, 0.46)",
        type: 3
    }, {
        name: "molality",
        description: "Molality amount of moles per kilogram solvent, default is in mol/kg (8.2, 8.2 mol/kg)",
        type: 3
    }, {
        name: "molarity",
        description: "Molarity amount of moles per liter solution, default is in mol/L (8.2, 8.2 mol/l)",
        type: 3
    }, {
        name: "equivalent-of-solute",
        description: "Equivalent grams of solute default is in eq (2.4, 2.4 eq)",
        type: 3
    }, {
        name: "normality",
        description: "Normality amount of equivalents of solute per liter solution, default is in eq/L (8.2, 8.2 eq/l)",
        type: 3
    }]
}

module.exports = { ChemTable, ChemTableCommand }
