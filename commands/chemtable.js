const { unit, round, Unit, multiply, divide, add, subtract } = require('mathjs')
const { MolarMass } = require('./stoichiometry')
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
            return add(divide(nSolvent, nSolute), nSolvent)
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
            return divide(nSolute, massSolvent)
          // return (nSolute) / (massSolvent / 1000)
        }
        return undefined
    },
    molarity: (nSolute, massSolution) => {
        // Mass solution can be Volume solution since Aqueous solutions is 1g/1ml
        if(nSolute != undefined && massSolution != undefined){
            return divide(nSolute, massSolution)
          // return (nSolute) / (massSolution / 1000)
        }
        return undefined
        // with molarity we can derive ---> nsolute and volume solution ORR mass solution actually
    },
    // normality: () => {
    
    // },
    // equithisentWeight: () => {
      
    // },
    // equithisentsOfSolute: () => {
      
    // }
}


class ChemTable {
    constructor(solution, massSolute, massSolvent, massSolution, nSolute, nSolvent, nfSolute, nfSolvent, molality, molarity, normality) {
        // First we figure out the molar mass of the solution
        this.solution = solution, // This one's required to no need to set to undefined
        // solute
        this.massSolute = massSolute,
        this.mwSolute = unit(this.getMolarMass(solution), "g/mol"), // already guds once user inputs solution
        this.nSolute = nSolute,
        this.nfSolute = nfSolute,
        // solvent
        this.massSolvent = massSolvent,
        this.mwSolvent = unit(18, "g/mol"), // required (default) already guds
        this.nSolvent = nSolvent,
        this.nfSolvent = nfSolvent,
        // others
        this.massSolution = massSolution,
        this.molality = molality,
        this.molarity = molarity,
        this.normality = normality

        this.checkGiven();
        this.solve();
         // Object.keys(this))
    }

    checkGiven() {
        // Solute
        (this.massSolute != undefined) ? this.massSolute = unit(this.massSolute) : undefined;
        (this.nSolute != undefined) ? this.nSolute = unit(this.nSolute) : undefined;
        (this.nfSolute != undefined) ? this.nfSolute = unit(this.nfSolute) : undefined;
        // Solvent
        (this.massSolvent != undefined) ? this.massSolvent = unit(this.massSolvent) : undefined;
        (this.nSolvent != undefined) ? this.nSolvent = unit(massSolvent) : undefined;
        (this.nfSolvent != undefined) ? this.nfSolvent = unit(this.nfSolvent) : undefined;
        // Others
        (this.massSolution != undefined) ? this.massSolution = unit(this.massSolution) : undefined;
        (this.molality != undefined) ? this.molality = unit(this.molality) : undefined;
        (this.molarity != undefined) ? this.molarity = unit(this.molarity) : undefined;
        (this.normality != undefined) ? this.normality = unit(this.normality) : undefined;
    }

    solve() {
        if(this.massSolute == undefined){
            this.massSolute = formulas.massSolute(this.massVolSolution, this.massSolvent, this.mwSolute, this.nSolute)
        } 
        if(this.massSolvent == undefined){
            this.massSolvent = formulas.massSolvent(this.massVolSolution, this.massSolute, this.mwSolvent, this.nSolvent, this.nSolute, this.molality)
        } 
        if(this.solution == undefined){
            this.massVolSolution = formulas.massSolution(this.massSolute, this.massSolvent, this.nSolute, this.molarity)
        }
        // Solve for mole solute and mole solvent
        if(this.nSolute == undefined){
            this.nSolute = formulas.nSolute(this.massSolute, this.mwSolute, this.nSolvent, this.nfSolvent, this.nfSolute, this.molality, this.massSolvent, this.molarity, this.massVolSolution)
        }
        if(this.nSolvent == undefined){
            this.nSolvent = formulas.nSolvent(this.massSolvent, this.mwSolvent, this.nSolute, this.nfSolute, this.nfSolvent)
        }
        // Solve for mole fraction
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
            this.molarity = formulas.molarity(this.nSolute, this.massVolSolution)
        }
    }

    // getNSolute() {
        // if (this.massSolute != undefined) { // main formula
        //     return divide(this.massSolute, this.mwSolute)
        // } else if (this.nSolvent != undefined && this.nfSolvent != undefined) { // derived formula from nfsolvent
        //     // return  (nSolvent/nfSolvent) - nSolvent 
        //     return subtract(divide(this.nSolvent, this.nfSolvent), this.nSolvent)
        // } else if (this.nSolvent != undefined && this.nfSolute != undefined) { // derived formula from nfsolute, parenthesis very improtnat
        //     return divide(multiply(this.nfSolute, this.nSolvent), subtract(1, this.nfSolute))
        // } else if(this.molality != undefined && this.massSolvent != undefined){
        //     // return molality * (massSolvent / 1000)
        //     return multiply(this.molality, this.massSolvent.to('kg'))
        // } else if(this.molarity != undefined && this.massSolution != undefined){
        //     // return molarity * (massSolution / 1000)
        //     return multiply(this.molarity, this.massSolution.to('kg'))
        // }
        // return undefined;
    // }
    
    getMolarMass(solution) {
        // Molar mass of element needed to be solved
        let temp = Array.from(parseCompound(solution))
        let ts, mm = 0;
        temp.forEach(i => {
            ts = MolarMass.find(k => {
                return k.symbol ==  i[0]
            })
            // mm is the molar mass of the compound, ts.mass is the molar mass of a particular the element,
            // while i[1] is the number of elements in the compound.
            mm += ts.mass * i[1];
        })
        return mm;
    }
}

module.exports = { ChemTable }
