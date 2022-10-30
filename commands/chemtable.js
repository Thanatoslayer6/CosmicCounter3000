const { unit, round, Unit, multiply, divide, subtract } = require('mathjs')
const { MolarMass } = require('./stoichiometry')
const parseCompound = require('compound-parser')

const formulas = {
    // Solute
    nSolute: (massSolute, mwSolute, nSolvent, nfSolvent, nfSolute, molality, massSolvent, molarity, massSolution) => {
        if (massSolute != null && mwSolute != null) { // main formula
            return massSolute/mwSolute
        } else if (nSolvent != null && nfSolvent != null) { // derived formula from nfsolvent
            return  (nSolvent/nfSolvent) - nSolvent 
        } else if (nSolvent != null && nfSolute != null) { // derived formula from nfsolute, parenthesis very improtnat
            return (nfSolute * nSolvent)/ (1 - nfSolute)
        } else if(molality != null && massSolvent != null){
            return molality * (massSolvent / 1000)
        } else if(molarity != null && massSolution != null){
            return molarity * (massSolution / 1000)
        }
        return null
    },
    massSolute: (massSolution, massSolvent, mwSolute, nSolute) => {
        if (massSolution != null && massSolvent != null) {
            return massSolution - massSolvent
        } else if (mwSolute != null && nSolute != null) {
            return mwSolute * nSolute 
        }
        return null
    },
    nfSolute: (nSolute, nSolvent, nfSolvent) => {
        if (nSolute != null && nSolvent != null) {
            return ((nSolute) / ((nSolute) + (nSolvent)))
        } else if (nfSolvent != null) {
            return 1 - nfSolvent
        }
        return null
    },
      // Solvent
    nSolvent: (massSolvent, mwSolvent, nSolute, nfSolute, nfSolvent) => {
        if (massSolvent != null && mwSolvent != null) {
            return massSolvent/mwSolvent
        } else if (nSolute != null && nfSolute != null) {
            return (nSolute/nfSolute) - nSolute
        } else if (nSolute != null && nfSolvent != null) {
            return (nfSolvent * nSolute) /(1 - nfSolvent)
        }
      return null
    },

    massSolvent: (massSolution, massSolute, mwSolvent, nSolvent, nSolute, molality) => {
        if (massSolution != null && massSolute != null) {
          return massSolution - massSolute;
        } else if (mwSolvent != null && nSolvent != null) {
          return mwSolvent * nSolvent
        } else if(nSolute != null && molality != null){
          return nSolute / molality
        }
        return null
    },

    nfSolvent: (nSolute, nSolvent, nfSolute) => {
      if (nSolute != null && nSolvent != null) {
        return ((nSolvent) / ((nSolute) + (nSolvent)))
      } else if (nfSolute != null) {
        return 1 - nfSolute
      }
      return null
    },
    // Added another method for calculating massSolution cuz of (null + somenumber = somenumber) issues
    massSolution: (massSolute, massSolvent, nSolute, molarity) => {
      if (massSolute != null && massSolvent != null) {
        return massSolute + massSolvent;
      } else if(nSolute != null && molarity != null){
        return nSolute / molarity
      }
      return null
    },
    molality: (nSolute, massSolvent) => {
      if(nSolute != null && massSolvent != null){
        return (nSolute) / (massSolvent / 1000)
      }
      return null
    },
    molarity: (nSolute, massSolution) => {
      // Mass solution can be Volume solution since Aqueous solutions is 1g/1ml
      if(nSolute != null && massSolution != null){
        return (nSolute) / (massSolution / 1000)
      }
      return null
      // with molarity we can derive ---> nsolute and volume solution ORR mass solution actually
    },
    normality: () => {
    
    },
    equivalentWeight: () => {
      
    },
    equivalentsOfSolute: () => {
      
    }
}


class ChemTable {
    constructor(solution, massSolute, massSolvent, massSolution, nSolute, nSolvent, nfSolute, nfSolvent, molality, molarity, normality) {
        // First we figure out the molar mass of the solution
        // let temp = Array.from(parseCompound(solution))
        this.given = {
            solution: solution, // This one's required to no need to set to null
            // solute
            // TODO: Do this stuff
            massSolute: unit(massSolute).to('g'), // already guds
            mwSolute: unit(this.getMolarMass(solution)).to("g/mol"), // already guds
            nSolute: nSolute,
            nfSolute: nfSolute,
            // solvent
            massSolvent: unit(massSolvent).to('g'),
            mwSolvent: unit(18).to("g/mol"), // required (default)
            nSolvent: nSolvent,
            nfSolvent: nfSolvent,
            // others
            massSolution: unit(massSolution).to('g'),
            molality: molality,
            molarity: molarity,
            normality: normality
        }

        this.checkGiven();
        this.solve();
    }

    checkGiven() {
        if (this.nSolute != undefined) {
            this.nSolute = unit(this.nSolute).to("mol");
        }
        if (this.nfSolute != undefined) {
            this.nfSolute = parseFloat(this.nfSolute)
        }

        if (this.nSolvent != undefined) {
            this.nSolvent = unit(this.nSolvent).to("mol");
        }

        if (this.nfSolvent != undefined) {
            this.nfSolvent = parseFloat(this.nfSolvent)
        }
    }
    solve() {
        this.nSolute
    }

    getNSolute() {
        if (this.massSolute != null) { // main formula
            return divide(this.massSolute, this.mwSolute)
        } else if (this.nSolvent != null && this.nfSolvent != null) { // derived formula from nfsolvent
            // return  (nSolvent/nfSolvent) - nSolvent 
            return subtract(divide(this.nSolvent, this.nfSolvent), this.nSolvent)
        } else if (this.nSolvent != null && this.nfSolute != null) { // derived formula from nfsolute, parenthesis very improtnat
            return divide(multiply(this.nfSolute, this.nSolvent), subtract(1, this.nfSolute))
        } else if(this.molality != null && this.massSolvent != null){
            // return molality * (massSolvent / 1000)
            return multiply(this.molality, this.massSolvent.to('kg'))
        } else if(molarity != null && massSolution != null){
            // return molarity * (massSolution / 1000)
            return multiply(this.molarity, this.massSolution.to('kg'))
        }
        return null;
    }
    
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
