const { unit, sqrt, square, add, round, Unit, multiply, divide, subtract } = require('mathjs')
const gravity = unit("9.8m/s^2");

class VerticallyDownward { 
    // When vertically thrown downward automatically, it has vi (e.g. yoyo, bball)
    // Usually height, final velocity, and time are the only things to solve here...
    // Gravity (g) = 9.8m/s^2, 980cm/s^2, 32ft/s^2 and is positive (+)
    constructor(initialVelocity, finalVelocity, height, time) {
        this.initialVelocity = initialVelocity;
        this.finalVelocity = finalVelocity;
        this.height = height;
        this.time = time;
        // this.solveFor = solveFor;
        this.equationInLatex;
        // this.result;
        this.main();
    }
    main() {
        // Analyze the given, check what are the missing info that is needed to be solved...
        if (this.height == undefined && this.time == undefined) {

        } else if (this.finalVelocity == undefined && this.time == undefined) {
            // Convert the known units
            this.initialVelocity = unit(this.initialVelocity);
            this.height = unit(this.height)
            // First find final velocity (vf) where formula is: d = \frac{vf^{2} - vi^{2}}{2g}
            // Derived formula is: \sqrt{vi^{2} + 2gd} = vf
            this.finalVelocity = sqrt(add(square(this.initialVelocity), multiply(multiply(2, gravity), this.height)))
            
            // Next find the time (use the computed final velocity)
            // Apply the derived formula from g=vf-vf/t to t = \frac{vf - vi}{g}
            this.time = divide(subtract(this.finalVelocity, this.initialVelocity), gravity)
            // Convert to string
            this.initialVelocity = this.initialVelocity.toString()
            this.finalVelocity = this.finalVelocity.toString()
            this.height = this.height.toString()
            this.time = this.time.toString()
            // TODO: Check if values are correct
        } else if (this.finalVelocity == undefined && this.height == undefined) {

        }
    }

}

class VerticallyUpward {

}

class HorizontalProjection {

}

class ProjectedAtAnAngle {

}

module.exports = {VerticallyUpward, VerticallyDownward, HorizontalProjection, ProjectedAtAnAngle};
