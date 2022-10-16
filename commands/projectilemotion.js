const { unit, clone, sqrt, square, add, Unit, multiply, divide, subtract } = require('mathjs')
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
        this.equationInLatex;
        this.main();
    }

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
                // Find the time use the formula t = vf - vi / g
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
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
                // Next find the time (use the computed final velocity)
                // Apply the derived formula from g=vf-vf/t to t = \frac{vf - vi}{g}
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity)
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
            } else if (this.finalVelocity.actual == undefined && this.height.actual == undefined) {
                this.time.actual = unit(this.time.actual);
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
                // Find the final velocity vf = gt + vi
                this.finalVelocity.actual = add(multiply(gravity, this.time.actual), this.initialVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
                // Find the height d = vit + gt^2/2
                this.height.actual = add(multiply(this.initialVelocity.actual, this.time.actual), divide(multiply(gravity, square(this.time.actual)), 2))
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
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
                // Use the formula vf = gt + vi
                this.finalVelocity.actual = add(multiply(gravity, this.time.actual), this.initialVelocity.actual);
                this.finalVelocity.rounded = clone(this.finalVelocity.actual);
                this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig) 
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
                // Just use d = vit + gt^2 / 2
                this.height.actual = add(multiply(this.initialVelocity.actual, this.time.actual), divide(multiply(gravity, square(this.time.actual)), 2)) 
                this.height.rounded = clone(this.height.actual);
                this.height.rounded.value = SigFig(this.height.rounded.value, this.roundToSigFig) 
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
                // t = vf - vi /g
                this.time.actual = divide(subtract(this.finalVelocity.actual, this.initialVelocity.actual), gravity)
                this.time.rounded = clone(this.time.actual);
                this.time.rounded.value = SigFig(this.time.rounded.value, this.roundToSigFig) 
            }
        }

        // Convert every unit into string
        this.initialVelocity.actual = this.initialVelocity.actual.toString()
        this.initialVelocity.rounded = this.initialVelocity.rounded.toString()
        this.finalVelocity.actual = this.finalVelocity.actual.toString()
        this.finalVelocity.rounded = this.finalVelocity.rounded.toString()
        this.height.actual = this.height.actual.toString()
        this.height.rounded = this.height.rounded.toString()
        this.time.actual = this.time.actual.toString()
        this.time.rounded = this.time.rounded.toString()
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
        // this.solveFor = solveFor;
        this.equationInLatex;
        // this.result;
        // this.main();
        this.main(this.identifyObjectPosition());
    }

    // Convert defined units and identify if the object is going up or going down.
    identifyObjectPosition() { 
        if (this.finalVelocity.actual == undefined && this.initialVelocity.actual != undefined) { // Means object will be thrown upwardly first
            this.initialVelocity.actual = unit(this.initialVelocity.actual);
            return "Upward";
        } else if (this.initialVelocity.actual == undefined && this.finalVelocity.actual != undefined) { // Means object is now falling
            this.finalVelocity.actual = unit(this.finalVelocity.actual);
            return "Downward";
        } else { // No initialVelocity and finalVelocity
            return "Unknown" 
        }
    }
    
    // Main method
    main(position) {
        if (position == "Upward") { // Remember that g = -negative
            // Solve for maximum height attained by object, based on its initial velocity
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = -vi^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.initialVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)

                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                    // parseFloat((this.maxHeight.rounded.value).toPrecision(this.roundToSigFig));
            }
            if (this.halfTime.actual == undefined) {
                // SMETHING ETWORNG WORHEURH
                // Apply the formula t = -vi/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.initialVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)

                // Test
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                    // parseFloat((this.halfTime.rounded.value).toPrecision(this.roundToSigFig))
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
            }
            // Falling object -> g = vf/t
            this.finalVelocity.actual = multiply(gravity, this.halfTime.actual);
            this.finalVelocity.rounded = clone(this.finalVelocity.actual)
            this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig)

        } else if (position == "Downward") { // Remember that g = +positive
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = -vi^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.finalVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)

                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
                    // parseFloat((this.maxHeight.rounded.value).toPrecision(this.roundToSigFig));
            }
            if (this.halfTime.actual == undefined) {
                // SMETHING ETWORNG WORHEURH
                // Apply the formula t = -vi/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.finalVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)

                // Test
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
                    // parseFloat((this.halfTime.rounded.value).toPrecision(this.roundToSigFig))
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
            }
            // Initial velocity, the upward velocity in the first place
            this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
            this.initialVelocity.rounded = clone(this.initialVelocity.actual)
            this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)

        } else if (position == "Unknown") { // Understand that vi = vf
            // Find initial velocity for now....
            if (this.halfTime.actual != undefined && this.initialVelocity.actual == undefined) { // We can find vf or vi
                this.halfTime.actual = unit(this.halfTime.actual)
                this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
            }
            if (this.totalTime.actual != undefined && this.initialVelocity.actual == undefined) {
                this.totalTime.actual = unit(this.totalTime.actual)
                // Get the half time, divide the total time by 2 round to its chosen sig fig
                this.halfTime.actual = divide(this.totalTime.actual, 2);
                this.halfTime.rounded = clone(this.halfTime.actual);
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig)
                // Get initial velocity 
                this.initialVelocity.actual = multiply(gravity, this.halfTime.actual);
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
            }
            if (this.maxHeight.actual != undefined && this.initialVelocity.actual == undefined) { // Same with having the max distance, we can find vf or vi
                this.maxHeight.actual = unit(this.maxHeight.actual)
                // Apply the derived formula vi or vf = sqrt(2gd), make sure to transform into unit
                this.initialVelocity.actual = sqrt(multiply(multiply(2, gravity), this.maxHeight.actual))
                this.initialVelocity.rounded = clone(this.initialVelocity.actual);
                this.initialVelocity.rounded.value = SigFig(this.initialVelocity.rounded.value, this.roundToSigFig)
            }
            // Now just do it simply (upward motion -> freefall)
            // Solve for maximum height attained by object, based on its initial velocity
            if (this.maxHeight.actual == undefined) { 
                // Apply the formula d = -vi^2/2g (actually don't need to follow the negative units, since both will cancel)
                this.maxHeight.actual = divide(square(this.initialVelocity.actual), multiply(2, gravity));
                this.maxHeight.rounded = clone(this.maxHeight.actual)

                this.maxHeight.rounded.value = SigFig(this.maxHeight.rounded.value, this.roundToSigFig);
            }
            if (this.halfTime.actual == undefined) {
                // Apply the formula t = -vi/g (again, no need to think about the negative sign)
                this.halfTime.actual = divide(this.initialVelocity.actual, gravity);
                this.halfTime.rounded = clone(this.halfTime.actual)
                this.halfTime.rounded.value = SigFig(this.halfTime.rounded.value, this.roundToSigFig);
            }
            if (this.totalTime.actual == undefined) {
                this.totalTime.actual = multiply(2, this.halfTime.actual)
                this.totalTime.rounded = clone(this.totalTime.actual)
                this.totalTime.rounded.value = SigFig(this.totalTime.rounded.value, this.roundToSigFig)
            }
            // Falling object -> g = vf/t
            this.finalVelocity.actual = multiply(gravity, this.halfTime.actual);
            this.finalVelocity.rounded = clone(this.finalVelocity.actual)
            this.finalVelocity.rounded.value = SigFig(this.finalVelocity.rounded.value, this.roundToSigFig)
        }
        // Convert everything as string
        this.initialVelocity.actual =  this.initialVelocity.actual.toString()
        if (this.initialVelocity.rounded != undefined) {
            this.initialVelocity.rounded = this.initialVelocity.rounded.toString()
        }
        this.finalVelocity.actual = this.finalVelocity.actual.toString()
        if (this.finalVelocity.rounded != undefined) {
            this.finalVelocity.rounded = this.finalVelocity.rounded.toString()
        }
        this.maxHeight.actual = this.maxHeight.actual.toString()
        if (this.maxHeight.rounded != undefined) {
            this.maxHeight.rounded = this.maxHeight.rounded.toString()
        }
        this.halfTime.actual = this.halfTime.actual.toString()
        if (this.halfTime.rounded != undefined) {
            this.halfTime.rounded = this.halfTime.rounded.toString()
        }
        this.totalTime.actual = this.totalTime.actual.toString()
        if (this.totalTime.rounded != undefined)  {
            this.totalTime.rounded = this.totalTime.rounded.toString()
        }
    }
}

class HorizontalProjection {

}

class ProjectedAtAnAngle {

}

module.exports = {VerticallyUpward, VerticallyDownward, HorizontalProjection, ProjectedAtAnAngle};
