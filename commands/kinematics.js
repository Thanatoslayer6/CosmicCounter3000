const math = require('mathjs')

class Kinematics {

    constructor(knownValues, solveFor) {
        this.knownValues = this.parseAndValidateKnownValues(knownValues) 
        this.solveFor = solveFor;
        this.equationInLatex;
        this.result;
        // Solve and do the needful sirs
        this.validateSolveFor()
    }

    parseAndValidateKnownValues(kv) {
        // Split by the spaces or the units
        let info = []
        let sp, val, temp = kv.split(/(?![0-9a-z])[,\s]+(?=[a-zA-Z])/gm);
        temp.forEach(i => {
            // First split every element in the array by the equal sign
            sp = i.split(/\=/g);
            info.push({
                given: sp[0].trim(),
                value: sp[1].trim()
            })
        })
        return info;
    }
    
    knownValuesToString() {
        let ss = ""
        this.knownValues.forEach((item, index) => {
            ss += `${item.given} = ${item.value}`
            if (index < this.knownValues.length - 1) {
                ss += ', '
            }
        })
        return ss;
    }

    validateSolveFor() {
        let givenValues = this.knownValues.map(i => {
            return i.given;
        })
        if (this.solveFor.toLowerCase() == 'a' || this.solveFor.toLowerCase() == "acceleration") {
            // Change actual value for the final output, since it is not needed anymore...
            this.solveFor = "Acceleration";
            this.acceleration(givenValues)
        } else if (this.solveFor.toLowerCase() == "d" || this.solveFor.toLowerCase() == "displacement" || this.solveFor.toLowerCase() == "distance") {
            this.solveFor = "Displacement";
            this.distance(givenValues)
        } else if (this.solveFor.toLowerCase() == "vi" || this.solveFor.toLowerCase() == "initial velocity") {
            this.solveFor = "Initial Velocity";
            this.initialVelocity(givenValues)
        } else if (this.solveFor.toLowerCase() == "vf" || this.solveFor.toLowerCase() == "final velocity") {
            this.solveFor = "Final Velocity";
            this.finalVelocity(givenValues)
        }
    }

    acceleration(gv) {
        let vf, vi, t, d;
        // First we grab the values from the 'knownValues' array
        this.knownValues.forEach(i => {
            if (i.given == "vf") {
                vf = i;
            } else if (i.given == "vi") {
                vi = i;
            } else if (i.given == "t") {
                t = i;
            } else if (i.given == "d") {
                d = i;
            }
        })
        // Check the variables inputted by the user
        if (this.checkArrayEquality(gv, ["vf", "vi", "t"]))  {
            // a = (vf - vi )/ t
            // Write the needed equation in latex
            this.equationInLatex = `a = \\frac{v_{f} - v_{i}}{t} \\implies \\frac{${vf.value} - ${vi.value}}{${t.value}}`
            // Change the variables into units so that mathjs can work with it
            vf = math.unit(vf.value); 
            vi = math.unit(vi.value);
            t = math.unit(t.value);
            // Get the result based on the formula
            this.result = (math.divide(math.subtract(vf, vi), t)).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        } else if (this.checkArrayEquality(gv, ["vf", "vi", "d"])) {
            // a = (vf^{2} - vi^{2}) / 2d  (Derived formula)
            this.equationInLatex = `a = \\frac{vf^{2} - vi^{2}}{2d} \\implies \\frac{(${vf.value})^{2} - (${vi.value})^{2}}{2(${d.value})}` 
            // Change the variables into units so that mathjs can work with it
            vf = math.unit(vf.value); 
            vi = math.unit(vi.value);
            d = math.unit(d.value);
            // Get the result based on the formula
            this.result = (math.divide(math.subtract(math.square(vf), math.square(vi)), math.multiply(2, d))).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        } else if (this.checkArrayEquality(gv, ["d", "vi", "t"])) {
            // a = 2d - 2vit / t^2
            this.equationInLatex = `a = \\frac{2d - 2v_{i}t}{t^{2}} \\implies \\frac{2(${d.value}) - 2(${vi.value})(${t.value})}{(${t.value})^{2}}`
            t = math.unit(t.value); 
            vi = math.unit(vi.value);
            d = math.unit(d.value);
            // Get the result
            this.result = (math.divide(math.subtract(math.multiply(2, d), math.multiply(math.multiply(2, vi), t)), math.square(t)))
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        }
    }

    distance(gv) {
        let vi, vf, t, a;  
        // First we grab the values from the 'knownValues' array
        this.knownValues.forEach(i => {
            if (i.given == "vf") {
                vf = i;
            } else if (i.given == "vi") {
                vi = i;
            } else if (i.given == "t") {
                t = i;
            } else if (i.given == "a") {
                a = i;
            }
        })
        // Check the variables inputted by the user
        if (this.checkArrayEquality(gv, ["vi", "a", "t"]))  {
            // d = vit + at^{2}/ 2
            // Write the needed equation in latex
            this.equationInLatex = `d = \\frac{v_{i}t + at^{2}}{2} \\implies \\frac{(${vi.value})(${t.value}) + (${a.value})(${t.value})^{2}}{2}`
            // Change the variables into units so that mathjs can work with it
            vi = math.unit(vi.value);
            a = math.unit(a.value); 
            t = math.unit(t.value);
            // Get the result based on the formula
            this.result = (math.divide(math.add(math.multiply(vi, t), math.multiply(a, math.square(t))), 2)).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        } else if (this.checkArrayEquality(gv, ["vf", "vi", "a"])) {
            // d = (vf^{2} - vi^{2}) / 2a 
            this.equationInLatex = `d = \\frac{vf^{2} - vi^{2}}{2a} \\implies \\frac{(${vf.value})^{2} - (${vi.value})^{2}}{2(${a.value})}` 
            // Change the variables into units so that mathjs can work with it
            vf = math.unit(vf.value); 
            vi = math.unit(vi.value);
            a = math.unit(a.value);
            // Get the result based on the formula
            this.result = (math.divide(math.subtract(math.square(vf), math.square(vi)), math.multiply(2, a))).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        }
    }

    initialVelocity(gv) {
        let vf, a, t, d;
        // First we grab the values from the 'knownValues' array
        this.knownValues.forEach(i => {
            if (i.given == "vf") {
                vf = i;
            } else if (i.given == "a") {
                a = i;
            } else if (i.given == "t") {
                t = i;
            } else if (i.given == "d") {
                d = i;
            }
        })
        // Check the variables inputted by the user
        if (this.checkArrayEquality(gv, ["vf", "a", "t"]))  {
            // vi = vf - at
            // Write the needed equation in latex
            this.equationInLatex = `v_{i} = v_{f} - at \\implies (${vf.value}) - (${a.value})(${t.value})`
            // Change the variables into units so that mathjs can work with it
            vf = math.unit(vf.value);
            a = math.unit(a.value); 
            t = math.unit(t.value);
            // Get the result based on the formula
            this.result = (math.subtract(vf, math.multiply(a, t))).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        } else if (this.checkArrayEquality(gv, ["t", "d", "a"])) {
            // vi = (d - (at^{2})/2)/t
            this.equationInLatex = `v_{i} = \\frac{d - \\frac{at^{2}}{2}}{t} \\implies \\frac{(${d.value}) - \\frac{(${a.value})(${t.value})^{2}}{2}}{${t.value}}` 
            // Change the variables into units so that mathjs can work with it
            t = math.unit(t.value); 
            d = math.unit(d.value);
            a = math.unit(a.value);
            // Get the result based on the formula
            this.result = (math.divide(math.subtract(d, math.divide(math.multiply(a, math.square(t)), 2)), t)).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        } else if (this.checkArrayEquality(gv, ["vf", "a", "d"])) {
            // vi = sqrt(vf^2 - 2ad)
            this.equationInLatex = `v_{i} = \\sqrt{v_{f}^{2} - 2ad} \\implies \\sqrt{(${vf.value})^{2} - 2(${a.value})(${d.value})}` 
            // Change the variables into units so that mathjs can work with it
            vf = math.unit(vf.value); 
            a = math.unit(a.value);
            d = math.unit(d.value);
            // Get the result based on the formula
            this.result = (math.sqrt(math.subtract(math.square(vf), math.multiply(math.multiply(2, a), d)))).toString()
            // Append the result in the needed latex equation
            this.equationInLatex += ` = ${this.result}`
        }
    }

    finalVelocity() {
        // TO BE CONTINUED
    }

    // Checks array equality for determining the right formula to be used
    checkArrayEquality(arr1, arr2) {
        let state = false;
        if (arr1 === null || arr2 === null)
            return state;
        if (arr1.length !== arr2.length)
            return state;
        for (let i = 0; i < arr1.length; i++) {
            for (let k = 0; k < arr2.length; k++) {
                if (arr1[i] === arr2[k]) {
                    state = true;
                    break;
                } else {
                    state = false;
                }
            }
            if (state == false)
                break;
        }
        return state;
    }

}

module.exports = { Kinematics }
