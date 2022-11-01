const { unit, round, Unit, clone, multiply, divide, add, abs, subtract } = require('mathjs')
const { MolarMass } = require('./stoichiometry')
const { Ions } = require('./weq')
const parseCompound = require('compound-parser')

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
            return divide(multiply(nfSolute, nSolvent), subtract(1, nfSolute))
        } else if(molality != undefined && massSolvent != undefined){
            // return molality * (massSolvent / 1000)
            return multiply(molality, massSolvent.to('kg'))
        } else if(molarity != undefined && massSolution != undefined){
            // return molarity * (massSolution / 1000)
            return multiply(molarity, massSolute.to('kg'))
        }
        return undefined
    },
    massSolute: (massSolution, massSolvent, mwSolute, nSolute) => {
        if (massSolution != undefined && massSolvent != undefined) {
            // return massSolution - massSolvent
            return subtract(massSolution, massSolvent)
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
            return subtract(1, nfSolvent)
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
            return divide(multiply(nfSolvent, nSolute), subtract(1 - nfSolvent))
        }
      return undefined
    },

    massSolvent: (massSolution, massSolute, mwSolvent, nSolvent, nSolute, molality) => {
        if (massSolution != undefined && massSolute != undefined) {
            // return massSolution - massSolute;
            return subtract(massSolution, massSolute) 
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
            return subtract(1, nfSolute)
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
            return divide(nSolute, molarity)
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
            // let temp = clone(massSolution)
            // temp = multiply() // Convert to liters
            // Assuming that massSolution is already in kilograms...
            // console.log(massSolution.formatUnits())
            massSolution = massSolution.to('kg')
            let temp = nSolute.value / massSolution.value
            // return divide(nSolute, massSolution)
            return unit(temp, "mol/l")
            // TODO: Fix conversoin issues and normality, also equivalentSolutes
            // return divide(nSolute, multiply(massSolution))
          // return (nSolute) / (massSolution / 1000)
        }
        return undefined
        // with molarity we can derive ---> nsolute and volume solution ORR mass solution actually
    },

    // equivalentSolutes: (massSolute, massSolution, equivalentWeight, normality) => {
    //     if (massSolute != undefined && equivalentWeight != undefined) {
    //         return divide(massSolute, equivalentWeight)
    //     } else if (massSolution != undefined && normality != undefined) {
    //         return multiply(normality, massSolution.to('kg'))
    //     }
    //     return undefined;
    // },

    normality: (equivalentSolutes, equivalentWeight, molarity, valencyFactor) => {
        if (molarity != undefined && valencyFactor != undefined) {
            return (multiply(molarity, valencyFactor))
        } 
        // else if (equivalentSolutes != undefined && equivalentWeight != undefined) {
        //     return divide(equivalentSolutes, equivalentWeight)            
        // }
        return undefined
    },
}


class ChemTable {
    constructor(solution, massSolute, massSolvent, massSolution, nSolute, nSolvent, nfSolute, nfSolvent, molality, molarity, equivalentSolutes, normality) {
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
        this.equivalentSolutes = equivalentSolutes;
        this.checkGiven();
        for (let i = 0; i < 5; i++) {
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
        (this.nSolvent != undefined) ? this.nSolvent = unit(massSolvent, "mol") : undefined;
        (this.nfSolvent != undefined) ? this.nfSolvent = unit(this.nfSolvent) : undefined;
        // Others
        (this.massSolution != undefined) ? this.massSolution = unit(this.massSolution, "g") : undefined;
        (this.molality != undefined) ? this.molality = unit(this.molality, "mol/kg") : undefined;
        (this.molarity != undefined) ? this.molarity = unit(this.molarity) : undefined;
        (this.equivalentSolutes != undefined) ? this.equivalentSolutes = unit(this.equivalentSolutes) : undefined;
        (this.normality != undefined) ? this.normality = unit(this.normality) : undefined;
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
        // if (this.equivalentSolutes == undefined) {
        //     this.equivalentSolutes formulas.equivalentSolutes()
        // }
        // Normality
        if (this.normality == undefined) {
            this.normality = formulas.normality(this.equivalentSolutes, this.equivalentWeight, this.molarity, this.valencyFactor)
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

    showOutput() {
        let output = `
            Solution: ${this.solution}

            Mass Solute: ${this.massSolute?.toString()}
            MW Solute: ${this.mwSolute?.toString()}
            Mole Solute (nSolute): ${this.nSolute?.toString()}
            Mole Fraction Solute (nfSolute): ${this.nfSolute?.toString()}

            Mass Solvent: ${this.massSolvent?.toString()}
            MW Solvent: ${this.mwSolvent?.toString()}
            Mole Solvent (nSolvent): ${this.nSolvent?.toString()}
            Mole Fraction Solvent (nfSolvent): ${this.nfSolvent?.toString()}

            Mass Solution: ${this.massSolution?.toString()}
            Molality: ${this.molality?.toString()}
            Molarity: ${this.molarity?.toString()}
            Normality: ${this.normality?.toString()}

            Valency Factor: ${this.valencyFactor}
            Equivalent Weight: ${this.equivalentWeight?.toString()}
            Equivalent Solute: ${this.equivalentSolutes?.toString()}
        `;
        // Object.keys(this).forEach(i => {
        //     output += this[i]
        // })
        return output
    }

}

module.exports = { ChemTable }
