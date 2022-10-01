class Kinematics {

    constructor(knownValues, solveFor) {
        this.knownValues = knownValues;
        this.solveFor = solveFor;
    }

    parseAndValidateKnownValues() {
        // Split by the spaces or the units
        let info = []
        let sp, temp = this.knownValues.split(/(?![0-9a-z])[,\s]+(?=[a-zA-Z])/gm);
        temp.forEach(i => {
            // First split every element in the array by the equal sign
            sp = i.split(/\=/g);
            info.push({
                given: sp[0],
                value: sp[1],
                unit: 
            })
        })
        console.log(info)
        
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
