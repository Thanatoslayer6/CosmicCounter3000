const { unit, sqrt, square, add, Unit, multiply, divide, subtract } = require('mathjs')
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
        if (this.initialVelocity != undefined) { // If initial velocity is not missing
            this.initialVelocity = unit(this.initialVelocity);
            // Analyze the given, check what are the missing info that is needed to be solved...
            if (this.height == undefined && this.time == undefined) {
                this.finalVelocity = unit(this.finalVelocity);
                // First find the height using the formula d = vf^2 - vi^2 / 2g 
                this.height = divide(subtract(square(this.finalVelocity), square(this.initialVelocity)), multiply(2, gravity));
                // Find the time use the formula t = vf - vi / g
                this.time = divide(subtract(this.finalVelocity, this.initialVelocity), gravity);
            } else if (this.finalVelocity == undefined && this.time == undefined) {
                // Convert the known units
                this.height = unit(this.height)
                // First find final velocity (vf) where formula is: d = \frac{vf^{2} - vi^{2}}{2g}
                // Derived formula is: \sqrt{vi^{2} + 2gd} = vf
                this.finalVelocity = sqrt(add(square(this.initialVelocity), multiply(multiply(2, gravity), this.height)))

                // Next find the time (use the computed final velocity)
                // Apply the derived formula from g=vf-vf/t to t = \frac{vf - vi}{g}
                this.time = divide(subtract(this.finalVelocity, this.initialVelocity), gravity)
            } else if (this.finalVelocity == undefined && this.height == undefined) {
                this.time = unit(this.time);
                // Find the final velocity vf = gt + vi
                this.finalVelocity = add(multiply(gravity, this.time), this.initialVelocity);
                // Find the height d = vit + gt^2/2
                this.height = add(multiply(this.initialVelocity, this.time), divide(multiply(gravity, square(this.time)), 2))
            }
        } else if (this.initialVelocity == undefined) { // If initial velocity is missing (rare scenario)
            if (this.finalVelocity == undefined) {
                this.height = unit(this.height);
                this.time = unit(this.time);
                // Find vi using the derived formula (d - gt^2/2)/ t = vi
                this.initialVelocity = divide(subtract(this.height, divide(multiply(gravity, square(this.time)), 2)), this.time);
                // Use the formula vf = gt + vi
                this.finalVelocity = add(multiply(gravity, this.time), this.initialVelocity);
            } else if (this.height == undefined) {
                this.finalVelocity = unit(this.finalVelocity);
                this.time = unit(this.time);
                // Find vi using the derived formula vi = vf - gt
                this.initialVelocity = subtract(this.finalVelocity, multiply(gravity, this.time));
                // Just use d = vit + gt^2 / 2
                this.height = add(multiply(this.initialVelocity, this.time), divide(multiply(gravity, square(this.time)), 2)) 
            } else if (this.time == undefined) {
                this.finalVelocity = unit(this.finalVelocity);
                this.height = unit(this.height)
                // Find vi using the derived formula vi = sqrt(vf^2 - 2gd)
                this.initialVelocity = sqrt(subtract(square(this.finalVelocity), multiply(multiply(2, gravity), this.height)))
                // t = vf - vi /g
                this.time = divide(subtract(this.finalVelocity, this.initialVelocity), gravity)
            }
        }

        // Convert every unit into string
        this.initialVelocity = this.initialVelocity.toString()
        this.finalVelocity = this.finalVelocity.toString()
        this.height = this.height.toString()
        this.time = this.time.toString()
    }
}

class VerticallyUpward {
    // Again, when the object is thrown upward it means it has an initial velocity (vi), with gravity
    // as a factor, meaning that the value of it will be negative. as a result it would mean that the 
    // object will peak when its final velocity is vf = 0. Furthermore, the object will fall due to gravity 
    // VerticallyUpward (vi = +) -> Peak (vf = 0, vi = 0) -> VerticallyDownward/Freefall motion (vi = 0, vf = +) 
    constructor(initialVelocity, finalVelocity, maxHeight, halfTime, totalTime) {
        this.initialVelocity = initialVelocity; // Required
        this.finalVelocity = finalVelocity;
        this.maxHeight = maxHeight;
        this.time = time;
        // this.solveFor = solveFor;
        this.equationInLatex;
        // this.result;
        this.main();
    }
}

class HorizontalProjection {

}

class ProjectedAtAnAngle {

}

module.exports = {VerticallyUpward, VerticallyDownward, HorizontalProjection, ProjectedAtAnAngle};
