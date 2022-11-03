const { unit, clone, sqrt, square, add, cos, sin, Unit, multiply, divide, subtract, max } = require('mathjs')
const gravity = unit("9.8m/s^2");

const SigFig = (x, n) => +x.toPrecision(n);

class VerticallyDownward { 
    // When vertically thrown downward automatically, it has vi (e.g. yoyo, bball)
    // Usually height, final velocity, and time are the only things to solve here...
    // Gravity (g) = 9.8m/s^2, 980cm/s^2, 32ft/s^2 and is positive (+)
    constructor(initialVelocity, finalVelocity, height, time, roundToSigFig) {
        this.initialVelocity = {
            actual: initialVelocity,
            rounded: null
        };
        this.finalVelocity = {
            actual: finalVelocity,
            rounded: null
        };
        this.height = {
            actual: height,
            rounded: null
        };
        this.time = {
            actual: time,
            rounded: null
        };
        this.roundToSigFig = roundToSigFig;
        this.givenInfo;
        this.equationInLatex = [];
        this.main();
    }
    // TODO: Fix gravity issues when units are different (m/s or ft/s or cm/s)
    main() {
        if (this.initialVelocity.actual != undefined) { // If initial velocity is not missing
            this.initialVelocity.actual = unit(this.initialVelocity.actual);
            this.initialVelocity.rounded = clone(this.initialVelocity.actual);
            this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
            // Analyze the given, check what are the missing info that is needed to be solved...
            if (this.height.actual == undefined && this.time.actual == undefined) {
                this.finalVelocity.actual = unit(this.finalVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                // First find the height using the formula d = vf^2 - vi^2 / 2g 
                this.height.actual = divide(subtract(square(this.finalVelocity.actual), square(this.initialVelocity.actual)), multiply(2, gravity));
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`d = \\frac{{v_{f}}^{2} - {v_{i}}^{2}}{2g} \\implies \\frac{(${this.finalVelocity.actual.toString()})^{2} - (${this.initialVelocity.actual.toString()})^{2}}{2(${gravity.toString()})} = ${this.height.rounded.toString()}`)
                // Find the time use the formula t = vf - vi / g
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`t = \\frac{v_{f} - v_{i}}{g} \\implies \\frac{${this.finalVelocity.actual.toString()} - ${this.initialVelocity.actual.toString()}}{${gravity.toString()}} = ${this.time.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n
                **Find:** \`Height and Time\`\n
                **Answer:**\n
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\``
            } else if (this.finalVelocity.actual == undefined && this.time.actual == undefined) {
                // Convert the known units
                this.height.actual = unit(this.height.actual)
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                // First find final velocity (vf) where formula is: d = \frac{vf^{2} - vi^{2}}{2g}
                // Derived formula is: \sqrt{vi^{2} + 2gd} = vf
                this.finalVelocity.actual = sqrt(add(square(this.initialVelocity.actual), multiply(multiply(2, gravity), this.height.actual)))
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{f} = \\sqrt{{v_{i}}^{2} - 2gd} \\implies \\sqrt{(${this.initialVelocity.actual.toString()})^{2} - 2(${gravity.toString()})(${this.height.actual.toString()})} = ${this.finalVelocity.rounded.toString()}`)
                // Next find the time (use the computed final velocity)
                // Apply the derived formula from g=vf-vf/t to t = \frac{vf - vi}{g}
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity)
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`t = \\frac{v_{f} - v_{i}}{g} \\implies \\frac{${this.finalVelocity.actual.toString()} - ${this.initialVelocity.actual.toString()}}{${gravity.toString()}} = ${this.time.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\`\n
                **Find:** \`Final Velocity and Time\`\n
                **Answer:**\n
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\``
            } else if (this.finalVelocity.actual == undefined && this.height.actual == undefined) {
                this.time.actual = unit(this.time.actual);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                // Find the final velocity vf = gt + vi
                this.finalVelocity.actual = add(multiply(gravity, this.time.actual), this.initialVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{f} = v_{i} + gt \\implies ${this.initialVelocity.actual.toString()} + (${gravity.toString()})(${this.time.actual.toString()}) = ${this.finalVelocity.rounded.toString()}`)
                // Find the height d = vit + gt^2/2
                this.height.actual = add(multiply(this.initialVelocity.actual, this.time.actual), divide(multiply(gravity, square(this.time.actual)), 2))
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`d = v_{i}t + \\frac{gt^{2}}{2} \\implies (${this.initialVelocity.actual.toString()})(${this.time.actual.toString()}) + \\frac{(${gravity.toString()})(${this.time.actual.toString()})^{2}}{2} = ${this.height.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\`\n
                **Find:** \`Final Velocity and Height\`\n
                **Answer:**\n
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\``
            }
        } else if (this.initialVelocity.actual == undefined) { // If initial velocity is missing (rare scenario)
            if (this.finalVelocity.actual == undefined) {
                this.height.actual = unit(this.height.actual);
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                // Get time
                this.time.actual = unit(this.time.actual);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                // Find vi using the derived formula (d - gt^2/2)/ t = vi
                this.initialVelocity.actual = divide(subtract(this.height.actual, divide(multiply(gravity, square(this.time.actual)), 2)), this.time.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{i} = \\frac{d - \\frac{gt^{2}}{2}}{t} \\implies \\frac{${this.height.actual.toString()} - \\frac{(${gravity.toString()})(${this.time.actual.toString()})^{2}}{2}}{${this.time.actual.toString()}} = ${this.initialVelocity.rounded.toString()}`)
                // Use the formula vf = gt + vi
                this.finalVelocity.actual = add(multiply(gravity, this.time.actual), this.initialVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{f} = v_{i} + gt \\implies ${this.initialVelocity.actual.toString()} + (${gravity.toString()})(${this.time.actual.toString()}) = ${this.finalVelocity.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\`\n
                **Find:** \`Initial Velocity and Final Velocity\`\n
                **Answer:**\n
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\``
            } else if (this.height.actual == undefined) {
                this.finalVelocity.actual = unit(this.finalVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                // Get time
                this.time.actual = unit(this.time.actual);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                // Find vi using the derived formula vi = vf - gt
                this.initialVelocity.actual = subtract(this.finalVelocity.actual, multiply(gravity, this.time.actual));
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{i} = v_{f} + gt \\implies ${this.finalVelocity.actual.toString()} + (${gravity.toString()})(${this.time.actual.toString()}) = ${this.initialVelocity.rounded.toString()}`)
                // Just use d = vit + gt^2 / 2
                this.height.actual = add(multiply(this.initialVelocity.actual, this.time.actual), divide(multiply(gravity, square(this.time.actual)), 2)) 
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`d = v_{i}t + \\frac{gt^{2}}{2} \\implies (${this.initialVelocity.actual.toString()})(${this.time.actual.toString()}) + \\frac{(${gravity.toString()})(${this.time.actual.toString()})^{2}}{2} = ${this.height.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\`\n
                **Find:** \`Initial Velocity and Height\`\n
                **Answer:**\n
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\``
            } else if (this.time.actual == undefined) {
                this.finalVelocity.actual = unit(this.finalVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                // Get height
                this.height.actual = unit(this.height.actual)
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
                // Find vi using the derived formula vi = sqrt(vf^2 - 2gd)
                this.initialVelocity.actual = sqrt(subtract(square(this.finalVelocity.actual), multiply(multiply(2, gravity), this.height.actual)))
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`v_{i} = \\sqrt{{v_{f}}^{2} - 2gd} \\implies \\sqrt{(${this.finalVelocity.actual.toString()})^{2} - 2(${gravity.toString()})(${this.height.actual.toString()})} = ${this.initialVelocity.rounded.toString()}`)
                // t = vf - vi /g
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity)
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                this.equationInLatex.push(`t = \\frac{v_{f} - v_{i}}{g} \\implies \\frac{${this.finalVelocity.actual.toString()} - ${this.initialVelocity.actual.toString()}}{${gravity.toString()}} = ${this.time.rounded.toString()}`)
                this.givenInfo = `
                **Given:**\n 
                - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n
                - Height (d): \`${this.height.actual.toString()}\` = \`${this.height.rounded.toString()}\`\n
                **Find:** \`Initial Velocity and Time\`\n
                **Answer:**\n
                - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n
                - Time (t): \`${this.time.actual.toString()}\` = \`${this.time.rounded.toString()}\``
            }
        }
    }
}

class VerticallyUpward {
    // Again, when the object is thrown upward it means it has an initial velocity (vi), with gravity
    // as a factor, meaning that the value of it will be negative. as a result it would mean that the 
    // object will peak when its final velocity is vf = 0. Furthermore, the object will fall due to gravity 
    // VerticallyUpward (vi = +) -> Peak (vf = 0, vi = 0) -> VerticallyDownward/Freefall motion (vi = 0, vf = +) 
    constructor(initialVelocity, finalVelocity, maxHeight, halfTime, totalTime, roundToSigFig) {
        // Object going up...
        this.initialVelocity = {
            actual: initialVelocity,
            rounded: null
        }
        // Object going down / free fall
        this.finalVelocity = {
            actual: finalVelocity, 
            rounded: null
        } 
        this.maxHeight =  {
            actual: maxHeight,
            rounded: null
        }
        this.halfTime = {
            actual: halfTime,
            rounded: null
        }
        this.totalTime = { 
            actual: totalTime, 
            rounded: null 
        }
        this.roundToSigFig = roundToSigFig
        this.givenInfo = '';
        this.equationInLatex = [];
        this.main(this.identifyObjectPosition());
    }

    // Convert defined units and identify if the object is going up or going down.
    identifyObjectPosition() { 
        if (this.finalVelocity.actual == undefined && this.initialVelocity.actual != undefined) { // Means object will be thrown upwardly first
            this.initialVelocity.actual = unit(this.initialVelocity.actual);
            this.initialVelocity.rounded = clone(this.initialVelocity.actual);
            this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
            // Add this information to the givenInfo variable
            this.givenInfo += `**Given:**\n - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            return "Upward";
        } else if (this.initialVelocity.actual == undefined && this.finalVelocity.actual != undefined) { // Means object is now falling
            this.finalVelocity.actual = unit(this.finalVelocity.actual);
            this.finalVelocity.rounded = clone(this.finalVelocity.actual);
            this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig)
            // Add this information to the givenInfo variable
            this.givenInfo += `**Given:**\n - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n`
            return "Downward";
        } else { // No initialVelocity and finalVelocity
            return "Unknown" 
        }
    }

    // Main method
    main(position) {
        let find = '**Find:** ', answer = '\n**Answer:**\n';
        if (position == "Upward") { // Remember that g = -negative
            // Solve for maximum height attained by object, based on its initial velocity
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = -vi^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.initialVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                // Write formula into latex and store the answer
                this.equationInLatex.push(`d = \\frac{-{v_{i}}^{2}}{2g} \\implies \\frac{-(${this.initialVelocity.actual.toString()})^{2}}{2(-${gravity.toString()})} = ${this.maxHeight.rounded.toString()}`)
                find += "Height, "
                answer += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            } else { // Meaning it is defined then it would be given
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            }
            if (this.halfTime.actual == undefined) {
                // Apply the formula t = -vi/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.initialVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.equationInLatex.push(`t = \\frac{-v_{i}}{g} \\implies \\frac{-(${this.initialVelocity.actual.toString()})}{-${gravity.toString()}} = ${this.halfTime.rounded.toString()}`)
                find += "Half time, "
                answer += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            } else {
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`t_{T} = ${this.halfTime.actual.toString()} \\times 2 = ${this.totalTime.rounded.toString()}`)
                find += "Total time, "
                answer += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            } else {
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            }
            // Falling object -> g = vf/t
            if (this.finalVelocity.actual == undefined) {
                this.finalVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual)
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`v_{f} = gt \\implies ${gravity.toString()}(${this.halfTime.actual.toString()}) = ${this.finalVelocity.rounded.toString()}`)
                find += "Final Velocity, "
                answer += ` - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n`
            } else {
                this.finalVelocity.rounded = clone(this.finalVelocity.actual)
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n`
            }

        } else if (position == "Downward") { // Remember that g = +positive
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = vf^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.finalVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                this.equationInLatex.push(`d = \\frac{{v_{f}}^{2}}{2g} \\implies \\frac{(${this.finalVelocity.actual.toString()})^{2}}{2(-${gravity.toString()})} = ${this.maxHeight.rounded.toString()}`)
                find += "Height, "
                answer += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            } else {
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            }
            if (this.halfTime.actual == undefined) {
                // Apply the formula t = vf/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.finalVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.equationInLatex.push(`t = \\frac{v_{f}}{g} \\implies \\frac{(${this.finalVelocity.actual.toString()})}{-${gravity.toString()}} = ${this.halfTime.rounded.toString()}`)
                find += "Half time, "
                answer += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            } else {
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`t_{T} = ${this.halfTime.actual.toString()} \\times 2 = ${this.totalTime.rounded.toString()}`)
                find += "Total time, "
                answer += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            } else {
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            }

            if (this.initialVelocity.actual == undefined) {
                this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual)
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`v_{i} = gt \\implies ${gravity.toString()}(${this.halfTime.actual.toString()}) = ${this.initialVelocity.rounded.toString()}`)
                find += "Initial Velocity, "
                answer += ` - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            } else {
                this.initialVelocity.rounded = clone(this.initialVelocity.actual)
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            }
        } else if (position == "Unknown") { // Understand that vi = vf
            // Find initial velocity for now....
            if (this.halfTime.actual != undefined && this.initialVelocity.actual == undefined) { // We can find vf or vi
                // Known
                this.halfTime.actual = unit(this.halfTime.actual)
                this.halfTime.rounded = clone(this.halfTime.actual);
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
                // Unknown
                this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
                // Write formula initial vel
                this.equationInLatex.push(`v_{i} = gt \\implies ${gravity.toString()}(${this.halfTime.actual.toString()}) = ${this.initialVelocity.rounded.toString()}`)
                find += "Initial Velocity, "
                answer += ` - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            }
            if (this.totalTime.actual != undefined && this.initialVelocity.actual == undefined) {
                // Known 
                this.totalTime.actual = unit(this.totalTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual);
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
                this.givenInfo += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
                // Get the half time, divide the total time by 2 round to its chosen sig fig
                this.halfTime.actual = divide(this.totalTime.actual, 2);
                this.halfTime.rounded = clone(this.halfTime.actual);
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`t = \\frac{t_{T}}{2} \\implies \\frac{${this.totalTime.actual.toString()}}{2} = ${this.halfTime.rounded.toString()}`)
                find += "Half time, "
                answer += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
                // Get initial velocity 
                this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
                // Write formula initial vel
                this.equationInLatex.push(`v_{i} = gt \\implies ${gravity.toString()}(${this.halfTime.actual.toString()}) = ${this.initialVelocity.rounded.toString()}`)
                find += "Initial Velocity, "
                answer += ` - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            }
            if (this.maxHeight.actual != undefined && this.initialVelocity.actual == undefined) { // Same with having the max distance, we can find vf or vi
                this.maxHeight.actual = unit(this.maxHeight.actual)
                this.maxHeight.rounded = clone(this.maxHeight.actual);
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig)
                this.givenInfo += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
                // Apply the derived formula vi or vf = sqrt(2gd), make sure to transform into unit
                this.initialVelocity.actual = sqrt(multiply(multiply(2, gravity), this.maxHeight.actual))
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`v_{i} = \\sqrt{2gd} \\implies \\sqrt{2(${gravity.toString()})(${this.maxHeight.actual.toString()})} = ${this.initialVelocity.rounded.toString()}`)
                find += "Initial Velocity, "
                answer += ` - Initial Velocity (vi): \`${this.initialVelocity.actual.toString()}\` = \`${this.initialVelocity.rounded.toString()}\`\n`
            }
            // Now just do it simply (upward motion -> freefall)
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = -vi^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.initialVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                // Write formula into latex and store the answer
                this.equationInLatex.push(`d = \\frac{-{v_{i}}^{2}}{2g} \\implies \\frac{-(${this.initialVelocity.actual.toString()})^{2}}{2(-${gravity.toString()})} = ${this.maxHeight.rounded.toString()}`)
                find += "Height, "
                answer += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            } else { // Meaning it is defined then it would be given
                this.maxHeight.rounded = clone(this.maxHeight.actual)
                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
            }
            if (this.halfTime.actual == undefined) {
                // Apply the formula t = -vi/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.initialVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.equationInLatex.push(`t = \\frac{-v_{i}}{g} \\implies \\frac{-(${this.initialVelocity.actual.toString()})}{-${gravity.toString()}} = ${this.halfTime.rounded.toString()}`)
                find += "Half time, "
                answer += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            } else {
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Half time (t): \`${this.halfTime.actual.toString()}\` = \`${this.halfTime.rounded.toString()}\`\n`
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`t_{T} = ${this.halfTime.actual.toString()} \\times 2 = ${this.totalTime.rounded.toString()}`)
                find += "Total time, "
                answer += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            } else {
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Total time (tT): \`${this.totalTime.actual.toString()}\` = \`${this.totalTime.rounded.toString()}\`\n`
            }
            // Falling object -> g = vf/t
            if (this.finalVelocity.actual == undefined) {
                this.finalVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual)
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig)
                this.equationInLatex.push(`v_{f} = gt \\implies ${gravity.toString()}(${this.halfTime.actual.toString()}) = ${this.finalVelocity.rounded.toString()}`)
                find += "Final Velocity, "
                answer += ` - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n`
            } else {
                this.finalVelocity.rounded = clone(this.finalVelocity.actual)
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig);
                this.givenInfo += ` - Final Velocity (vf): \`${this.finalVelocity.actual.toString()}\` = \`${this.finalVelocity.rounded.toString()}\`\n`
            }

            
        }
        this.givenInfo += find + answer 
    }
};

class HorizontalProjection {
    // Vx = vi, Vy = gt, d = gt^2/2, R = vit
    constructor(vi, vy, vf, t, d, r, sf) {
        this.vi = { // Remember vi = vx
            actual: vi,
            rounded: null
        }
        this.vy = {
            actual: vy,
            rounded: null
        }
        this.vf = {
            actual: vf,
            rounded: null
        }
        this.t = {
            actual: t,
            rounded: null
        }
        this.d = {
            actual: d,
            rounded: null
        }
        this.r = {
            actual: r,
            rounded: null
        }
        this.sf = sf;
        this.givenInfo;
        this.equationInLatex = [];
        this.assignVariables()
        this.main()
    }

    assignVariables() {
        let given = '**Given:**\n'
        // Assign given variables
        if (this.vi.actual != undefined) { // Remember that vi = vx
            this.vi.actual = unit(this.vi.actual);
            this.vi.rounded = clone(this.vi.actual);
            this.vi.rounded.value = SigFig(this.vi.rounded.value, this.sf);
            given += ` - Initial Velocity (vi or vx): \`${this.vi.actual.toString()}\` = \`${this.vi.rounded.toString()}\`\n`
        } 
        if (this.vy.actual != undefined) {
            this.vy.actual = unit(this.vy.actual);
            this.vy.rounded = clone(this.vy.actual);
            this.vy.rounded.value = SigFig(this.vy.rounded.value, this.sf);
            given += ` - Vertical Velocity (vy): \`${this.vy.actual.toString()}\` = \`${this.vi.rounded.toString()}\`\n`
        } 
        if (this.vf.actual != undefined) {
            this.vf.actual = unit(this.vf.actual);
            this.vf.rounded = clone(this.vf.actual);
            this.vf.rounded.value = SigFig(this.vf.rounded.value, this.sf);
            given += ` - Final Velocity (vf): \`${this.vf.actual.toString()}\` = \`${this.vf.rounded.toString()}\`\n`
        }
        if (this.r.actual != undefined) {
            this.r.actual = unit(this.r.actual);
            this.r.rounded = clone(this.r.actual);
            this.r.rounded.value = SigFig(this.r.rounded.value, this.sf);
            given += ` - Range (R): \`${this.r.actual.toString()}\` = \`${this.r.rounded.toString()}\`\n`
        }
        if (this.t.actual != undefined) {
            // Assign the given time
            this.t.actual = unit(this.t.actual);
            this.t.rounded = clone(this.t.actual);
            this.t.rounded.value = SigFig(this.t.rounded.value, this.sf);
            given += ` - Time (t): \`${this.t.actual.toString()}\` = \`${this.t.rounded.toString()}\`\n`
        }
        if (this.d.actual != undefined) {
            // Assign the given time
            this.d.actual = unit(this.d.actual);
            this.d.rounded = clone(this.d.actual);
            this.d.rounded.value = SigFig(this.d.rounded.value, this.sf);
            given += ` - Distance (d): \`${this.d.actual.toString()}\` = \`${this.d.rounded.toString()}\`\n`
        }
        // Concatenate the given and what to find into the global string
        this.givenInfo = given;
    }

    main() {
        let find = "**Find:** ";
        let answer = "**Answer:** ";
        // If user has distance, only thing to have is to get is time
        if (this.d.actual != undefined) {
            if (this.t.actual == undefined) { // t = sqrt(2d/g)
                this.t.actual = sqrt(divide(multiply(2, this.d.actual), gravity))
                this.t.rounded = clone(this.t.actual);
                this.t.rounded.value = SigFig(this.t.rounded.value, this.sf);
                this.equationInLatex.push(`t = \\sqrt{\\frac{2d}{g}} \\implies \\sqrt{\\frac{2(${this.d.actual.toString()})}{${gravity.toString()}}} = ${this.t.rounded.toString()}`)
                find += "Time (t), "
                answer += ` - Time (t): \`${this.t.actual.toString()}\` = \`${this.t.rounded.toString()}\`\n` 
            }
        }
        // If the user has time, chances are... he's already gottem distance and vy
        if (this.t.actual != undefined) {
            if (this.vy.actual == undefined) { // vy = gt
                this.vy.actual = multiply(gravity, this.t.actual);
                this.vy.rounded = clone(this.vy.actual);
                this.vy.rounded.value = SigFig(this.vy.rounded.value, this.sf);
                this.equationInLatex.push(`v_{y} = gt \\implies ${gravity.toString()}(${this.t.actual.toString()}) = ${this.vy.rounded.toString()}`)
                find += "Vertical Velocity (vy), "
                answer += ` - Vertical Velocity (vy): \`${this.vy.actual.toString()}\` = \`${this.vy.rounded.toString()}\`\n`
            }
            if (this.d.actual == undefined) { // d = gt^2/2
                this.d.actual = divide(multiply(gravity, square(this.t.actual)), 2);
                this.d.rounded = clone(this.d.actual);
                this.d.rounded.value = SigFig(this.d.rounded.value, this.sf);
                this.equationInLatex.push(`d = \\frac{gt^{2}}{2} \\implies \\frac{(${gravity.toString()})(${this.t.actual.toString()})^{2}}{2} = ${this.d.rounded.toString()}`)
                find += "Distance (d), "
                answer += ` - Distance (d): \`${this.d.actual.toString()}\` = \`${this.d.rounded.toString()}\`\n`
            }
            if (this.r.actual != undefined && this.vi.actual == undefined) { // Find vi = R/t
                this.vi.actual = divide(this.r.actual, this.t.actual);
                this.vi.rounded = clone(this.vi.actual);
                this.vi.rounded.value = SigFig(this.vi.rounded.value, this.sf);
                this.equationInLatex.push(`v_{i} = \\frac{R}{t} \\implies \\frac{${this.r.actual.toString()}}{${this.t.actual.toString()}} = ${this.vi.rounded.toString()}`)
                find += "Initial Velocity (vi or vx), "
                answer += ` - Initial Velocity (vi or vx): \`${this.vi.actual.toString()}\` = \`${this.vi.rounded.toString()}\`\n`
            }
            if (this.vi.actual != undefined && this.r.actual == undefined) { // Find range R = vit
                this.r.actual = multiply(this.vi.actual, this.t.actual);
                this.r.rounded = clone(this.r.actual);
                this.r.rounded.value = SigFig(this.r.rounded.value, this.sf);
                this.equationInLatex.push(`R = v_{i}t \\implies ${this.vi.actual.toString()}(${this.t.actual.toString()}) = ${this.r.rounded.toString()}`)
                find += "Range (R), "
                answer += ` - Range (R): \`${this.r.actual.toString()}\` = \`${this.r.rounded.toString()}\`\n`
            }
        }

        // If the user has initial velocity as input, then find the other variables
        if (this.vi.actual != undefined) {
            if (this.t.actual != undefined && this.r.actual == undefined) { // Range (r = vxt)
                this.r.actual = multiply(this.vi.actual, this.t.actual);
                this.r.rounded = clone(this.r.actual);
                this.r.rounded.value = SigFig(this.r.rounded.value, this.sf);
                this.equationInLatex.push(`R = v_{x}t \\implies ${this.vi.actual.toString()}(${this.t.actual.toString()}) = ${this.r.rounded.toString()}`)
                find += "Range (R), "
                answer += ` - Range (R): \`${this.r.actual.toString()}\` = \`${this.r.rounded.toString()}\`\n`
            }
            if (this.r.actual != undefined && this.t.actual == undefined) { // Time (t = R/vx )
                this.t.actual = divide(this.r.actual, this.vi.actual);
                this.t.rounded = clone(this.t.actual);
                this.t.rounded.value = SigFig(this.t.rounded.value, this.sf);
                this.equationInLatex.push(`t = \\frac{R}{v_{x}} \\implies \\frac{${this.r.actual.toString()}}{${this.vi.actual.toString()}} = ${this.t.rounded.toString()}`)
                find += "Time (t), "
                answer += ` - Time (t): \`${this.t.actual.toString()}\` = \`${this.t.rounded.toString()}\`\n` 
            }
        }  

        if (this.vy.actual != undefined) {
            if (this.t.actual == undefined) { // Time (t = vy/g)
                this.t.actual = divide(this.vy.actual, gravity);
                this.t.rounded = clone(this.t.actual);
                this.t.rounded.value = SigFig(this.t.rounded.value, this.sf);
                this.equationInLatex.push(`t = \\frac{v_{y}}{g} \\implies \\frac{${this.vy.actual.toString()}}{${gravity.toString()}} = ${this.t.rounded.toString()}`)
                find += "Time (t), "
                answer += ` - Time (t): \`${this.t.actual.toString()}\` = \`${this.t.rounded.toString()}\`\n` 
            } else if (this.vf.actual != undefined && this.vi.actual == undefined) { // Initial velocity vi = sqrt(vf^2 - vy^2)
                this.vi.actual = sqrt(subtract(square(this.vf.actual), square(this.vy.actual)));
                this.vi.rounded = clone(this.vi.actual);
                this.vi.rounded.value = SigFig(this.vi.rounded.value, this.sf);
                this.equationInLatex.push(`v_{i} = \\sqrt{{v_{f}}^{2} - {v_{y}}^{2}} \\implies \\sqrt{(${this.vf.actual.toString()})^{2} - (${this.vy.actual.toString()})^{2}} = ${this.vi.rounded.toString()}`)
                find += "Initial Velocity (vi or vx), "
                answer += ` - Initial Velocity (vi or vx): \`${this.vi.actual.toString()}\` = \`${this.vi.rounded.toString()}\`\n`
            }
        }
        // Solve for final velocity lastly...
        if (this.vf.actual == undefined && this.vi.actual != undefined && this.vy.actual != undefined) {
            this.vf.actual = sqrt(add(square(this.vi.actual), square(this.vy.actual)));
            this.vf.rounded = clone(this.vf.actual);
            this.vf.rounded.value = SigFig(this.vf.rounded.value, this.sf);
            this.equationInLatex.push(`v_{f} = \\sqrt{v_{x}^{2} + v_{y}^{2}} \\implies \\sqrt{${this.vi.actual.toString()}^{2} + ${this.vy.actual.toString()}^{2}} = ${this.vf.rounded.toString()}`)
            find += "Final Velocity (vf), "
            answer += ` - Final Velocity (vf): \`${this.vf.actual.toString()}\` = \`${this.vf.rounded.toString()}\`\n`
        }
        this.givenInfo += find + "\n" + answer;
    }
}

class ProjectedAtAnAngle {
    constructor(vi, angle, vf, maxHeight, tT, r, sf) { // Initial velocity is required and angle
        // this.vi = { actual: unit(vi), rounded: unit(vi) }
        this.vi = unit(vi); // This is given so no need to do stuff with it
        this.angle = unit(angle, 'deg'); // Fix rounding off errors angles...
        this.sf = sf;
        this.vf = {
            actual: vf,
            rounded: null
        }
        this.tT = {
            actual: tT,
            rounded: null
        }
        this.maxHeight = {
            actual: maxHeight,
            rounded: null
        }
        this.r = {
            actual: r,
            rounded: null
        }
        this.vx = {
            actual: null,
            rounded: null
        }
        this.vy = {
            actual: null,
            rounded: null
        }
        this.givenInfo;
        this.equationInLatex = [];
        this.assignVariables()
        this.main()
    }

    assignVariables(){
        let given = '**Given:**\n'
        // Assign given variables, initial velocity and angle is already given
        given += ` - Initial Velocity (vi): \`${this.vi.toString()}\`\n - Angle: \`${this.angle}\`\n`;
        if (this.vf.actual != undefined) {
            this.vf.actual = unit(this.vf.actual);
            this.vf.rounded = clone(this.vf.actual);
            this.vf.rounded.value = SigFig(this.vf.rounded.value, this.sf);
            given += ` - Final Velocity (vf): \`${this.vf.actual.toString()}\` = \`${this.vf.rounded.toString()}\`\n`
        }
        if (this.r.actual != undefined) {
            this.r.actual = unit(this.r.actual);
            this.r.rounded = clone(this.r.actual);
            this.r.rounded.value = SigFig(this.r.rounded.value, this.sf);
            given += ` - Range (R): \`${this.r.actual.toString()}\` = \`${this.r.rounded.toString()}\`\n`
        }
        if (this.tT.actual != undefined) {
            // Assign the given time
            this.tT.actual = unit(this.tT.actual);
            this.tT.rounded = clone(this.tT.actual);
            this.tT.rounded.value = SigFig(this.tT.rounded.value, this.sf);
            given += ` - Total Time (tT): \`${this.tT.actual.toString()}\` = \`${this.tT.rounded.toString()}\`\n`
        }
        if (this.maxHeight.actual != undefined) {
            // Assign the given time
            this.maxHeight.actual = unit(this.maxHeight.actual);
            this.maxHeight.rounded = clone(this.maxHeight.actual);
            this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.sf);
            given += ` - Max Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
        }
        // Concatenate the given and what to find into the global string
        this.givenInfo = given;
    }

    main(){ 
        let find = "**Find:** ";
        let answer = "**Answer:**\n";
        // If user has distance, only thing to have is to get is time
        // First find vx and vy
        this.vx.actual = multiply(this.vi, cos(this.angle))
        this.vx.rounded = clone(this.vx.actual);
        this.vx.rounded.value = SigFig(this.vx.rounded.value, this.sf)
        this.equationInLatex.push(`v_{x} = v_{i}cos(\\theta) \\implies ${this.vi.toString()} \\cdot cos(${this.angle.toString()}) = ${this.vx.rounded.toString()}`)
        find += "Horizontal Velocity (vx), "
        answer += ` - Horizontal Velocity (vx): \`${this.vx.actual.toString()}\` = \`${this.vx.rounded.toString()}\`\n`

        this.vy.actual = multiply(this.vi, sin(this.angle))
        this.vy.rounded = clone(this.vy.actual);
        this.vy.rounded.value = SigFig(this.vy.rounded.value, this.sf)
        this.equationInLatex.push(`v_{y} = v_{i}sin(\\theta) \\implies ${this.vi.toString()} \\cdot sin(${this.angle.toString()}) = ${this.vy.rounded.toString()}`)
        find += "Vertical Velocity (vy), "
        answer += ` - Vertical Velocity (vy): \`${this.vy.actual.toString()}\` = \`${this.vy.rounded.toString()}\`\n`
        
        if (this.maxHeight.actual == undefined) {
            // dmax = -vy^2/2g (no need negative symbol)
            this.maxHeight.actual = divide(square(this.vy.actual), multiply(2, gravity));
            this.maxHeight.rounded = clone(this.maxHeight.actual);
            this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.sf)
            this.equationInLatex.push(`d_{max} = \\frac{-{v_{y}}^{2}}{2g} \\implies \\frac{-(${this.vy.actual.toString()})^{2}}{2(-${gravity.toString()})} = ${this.maxHeight.rounded.toString()}`)
            find += "Max Height (d), "
            answer += ` - Max Height (d): \`${this.maxHeight.actual.toString()}\` = \`${this.maxHeight.rounded.toString()}\`\n`
        }
        if (this.tT.actual == undefined) {
            // tT = -2vy/g (no need negative symbol)
            this.tT.actual = divide(multiply(2, this.vy.actual), gravity);
            this.tT.rounded = clone(this.tT.actual);
            this.tT.rounded.value = SigFig(this.tT.rounded.value, this.sf)
            this.equationInLatex.push(`t_{T} = \\frac{-2v_{y}}{g} \\implies \\frac{-2(${this.vy.actual.toString()})}{-${gravity.toString()}} = ${this.tT.rounded.toString()}`)
            find += "Total Time (tT), "
            answer += ` - Total Time (tT): \`${this.tT.actual.toString()}\` = \`${this.tT.rounded.toString()}\`\n`
        }
        if (this.r.actual == undefined) {
            // R = vx * tT
            this.r.actual = multiply(this.vx.actual, this.tT.actual);
            this.r.rounded = clone(this.r.actual);
            this.r.rounded.value = SigFig(this.r.rounded.value, this.sf)
            this.equationInLatex.push(`R = v_{x}t_{T} \\implies (${this.vx.actual.toString()})(${this.tT.actual.toString()})= ${this.r.rounded.toString()}`)
            find += "Range (R), "
            answer += ` - Range (R): \`${this.r.actual.toString()}\` = \`${this.r.rounded.toString()}\`\n`
        }
        if (this.vf.actual == undefined) {
            this.vf.actual = sqrt(add(square(this.vi), square(this.vy.actual)));
            this.vf.rounded = clone(this.vf.actual);
            this.vf.rounded.value = SigFig(this.vf.rounded.value, this.sf);
            this.equationInLatex.push(`v_{f} = \\sqrt{v_{x}^{2} + v_{y}^{2}} \\implies \\sqrt{${this.vi.toString()}^{2} + ${this.vy.actual.toString()}^{2}} = ${this.vf.rounded.toString()}`)
            find += "Final Velocity (vf), "
            answer += ` - Final Velocity (vf): \`${this.vf.actual.toString()}\` = \`${this.vf.rounded.toString()}\`\n`
        }
        this.givenInfo += find + "\n" + answer;
    }
}

const VerticallyDownwardCommand = {
    name: "downward-motion",
    description: "Solves vertically downward projectile motion problems",
    options: [{
        name: "round-to-sigfig",
        description: "Round to how many sig figs?",
        type: 4,
        required: true
    },{
        name: "initial-velocity",
        description: "Initial velocity of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false,
    },{
        name: "final-velocity",
        description: "Final velocity of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "height",
        description: "The starting height of the object e.g (55m, 21.02ft)",
        type: 3,
        required: false
    }, {
        name: "time",
        description: "The time it takes for the object to reach the ground e.g (1.25s, 0.03s)",
        type: 3,
        required: false
    }]
}

const VerticallyUpwardCommand ={
    name: "upward-motion",
    description: "Solves vertically upward projectile motion problems",
    options: [{
        name: "round-to-sigfig",
        description: "Round to how many sig figs?",
        type: 4,
        required: true
    },{
        name: "initial-velocity",
        description: "Initial velocity of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false,
    },{
        name: "final-velocity",
        description: "Final velocity of the object/velocity striking the ground e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "height",
        description: "The height of the object (peak) e.g (55m, 21.02ft)",
        type: 3,
        required: false
    }, {
        name: "time",
        description: "The time it takes for the object to reach the ground e.g (1.25s, 0.03s)",
        type: 3,
        required: false
    }, {
        name: "total-time",
        description: "The total time where the object is in motion/in the air e.g (2.3s, 1.25s)",
        type: 3,
        required: false
    }]
}

const HorizontalProjectionCommand = {
    name: "horizontal-motion",
    description: "Solves horizontal projectile motion problems",
    options: [{
        name: "round-to-sigfig",
        description: "Round to how many sig figs?",
        type: 4,
        required: true
    },{
        name: "initial-velocity",
        description: "Initial velocity of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false,
    },{
        name: "vertical-velocity",
        description: "Vertical velocity (vy) of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false,
    },{
        name: "final-velocity",
        description: "Final velocity of the object/velocity striking the ground e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "range",
        description: "The horizontal distance travelled by the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "height",
        description: "The height of the object (peak) e.g (55m, 21.02ft)",
        type: 3,
        required: false
    },{
        name: "time",
        description: "The time it takes for the object to reach the ground e.g (1.25s, 0.03s)",
        type: 3,
        required: false
    }]
} 

const ProjectedAtAnAngleCommand = {
    name: "projected-at-an-angle",
    description: "Solves the properties of an object projected at an angle",
    options: [{
        name: "initial-velocity",
        description: "Initial velocity of the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: true,
    },{
        name: "angle",
        description: "Projected angle of the object, must be between 0 and 90 degrees e.g (10, 80)",
        type: 4,
        required: true
    },{
        name: "round-to-sigfig",
        description: "Round to how many sig figs?",
        type: 4,
        required: true
    },{
        name: "final-velocity",
        description: "Final velocity of the object/velocity striking the ground e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "range",
        description: "The horizontal distance travelled by the object e.g (2.00m/s, 12ft/s)",
        type: 3,
        required: false
    },{
        name: "max-height",
        description: "The height of the object (peak) e.g (55m, 21.02ft)",
        type: 3,
        required: false
    },{
        name: "total-time",
        description: "The time it takes for the object to reach the ground e.g (1.25s, 0.03s)",
        type: 3,
        required: false
    }]
} 

module.exports = {VerticallyUpward, VerticallyUpwardCommand, VerticallyDownward, VerticallyDownwardCommand, HorizontalProjection, HorizontalProjectionCommand, ProjectedAtAnAngle, ProjectedAtAnAngleCommand};
