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
  mwSolute: (massSolute, nSolute) => {
    if (massSolute != null && nSolute != null) {
      return massSolute/nSolute
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
  mwSolvent: (massSolvent, nSolvent) => {
    if (massSolvent != null && nSolvent != null) {
      return massSolvent/nSolvent
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
    constructor(solution, massSolute, massSolvent, massSolution, nsolute, nsolvent, nfsolute, nfsolvent, molality, molarity, normality) {
        // First we figure out the molar mass of the solution
        // let temp = Array.from(parseCompound(solution))
        this.solution = solution; // This one's required to no need to set to null
        // solute
        this.massSolute = unit(massSolute).to('g') ?? null
        this.mwSolute = unit(this.getMolarMass(solution)).to("g/mol")
        this.nsolute = unit(nsolute).to("mol") ?? null
        this.nfsolute = nfsolute ?? null
        // solvent
        this.massSolvent = unit(massSolvent).to('g') ?? null
        this.mwSolvent = unit(18, "g/mol")
        this.nsolvent = nsolvent ?? null
        this.nfsolvent = nfsolvent ?? null
        // others
        this.massSolution = massSolution ?? null
        this.molality = molality ?? null
        this.molarity = molarity ?? null
        this.normality = normality ?? null

        this.solve();
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
