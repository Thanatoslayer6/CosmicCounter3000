class Kinematics {

    constructor(knownValues, solveFor) {
        this.knownValues = knownValues;
        this.solveFor = solveFor;
    }

    parseAndValidateKnownValues() {
        // Split by the spaces
        this.knownValues = this.knownValues.split(/(?![0-9a-z])[,\s]+(?=[a-zA-Z])/gm);
        console.log(this.knownValues)
        // Works
        
    }

    validateSolveFor() {

    }

    acceleration() {
        // a = (vf - vi )/ t
        // a = (vf^{2} - vi^{2}) / 2d 
        // TODO: Find a way for this
    }

    main() {
        this.parseAndValidateKnownValues()
        this.validateSolveFor()
    }
}

module.exports = { Kinematics }
