// const { sin, cos, atan, isNegative, abs, pi, sqrt, square } = require('mathjs');
import { sin, cos, atan, isNegative, abs, pi, sqrt, square } from 'mathjs';

export class FoxyMethod {
    // Pass in a string of vector array [ "30N 20 DEGREES W of N", "40N 10 D N of W" ]
    constructor(vectors) {
        // First split vectors by the comma
        this.vectors = [];
        this.summationOfX = 0;
        this.summationOfY = 0;
        this.rv = [];
        this.re = [];
        this.theta1 = 0;
        this.theta2 = 0;
        this.data; // array (the one to send as a table)
        this.parseValues(vectors) // Pass in the array
    }

    parseValues(vt) {
        // Parse the values first, initialize 2 random variables
        // store in vectors array output will look something like below...
        // { magnitude: '30N', angle: '20', d1: 'East', d2: 'West' },
        // { magnitude: '50N', angle: '10', d1: 'N', d2: 'E' }
        let item, temp;
        for (let i = 0; i < vt.length; i++) {
            item = vt[i].split(' ');
            // Regex to split the string like "50km/s" -> [ '50', 'km/s']
            temp = item[0].split(/([a-zA-Z\/]+)/gm) 
            this.vectors.push({
                magnitude: parseFloat(temp[0]),
                angle: parseFloat(item[1]),
                unit: temp[1],
                d1: item[3],
                d2: item[5] 
            })
        }
    }

    // Pass an angle get the result
    angleSin(angle) {
        return sin(angle * pi/180);
    }

    angleCos(angle) {
        return cos(angle * pi/180);
    }

    xComponent() {
        for (let i = 0; i < this.vectors.length; i++) {
            // Calculate and round to 2 decimal places and parse as float
            this.vectors[i].fcostheta = parseFloat(abs(this.vectors[i].magnitude * this.angleCos(this.vectors[i].angle)).toFixed(2));

            // Check if d1 or d2 is west, if yes then answer must be negative according to the cartesian plane
            if (this.vectors[i].d1.toLowerCase() == "west" || this.vectors[i].d1.toLowerCase() == "w" ||
                this.vectors[i].d2.toLowerCase() == "west" || this.vectors[i].d2.toLowerCase() == "w") {
                // Then FcosTheta must be negative
                this.vectors[i].fcostheta *= -1;
            }

            //console.log(this.vectors[i].fcostheta)
        }
    }

    yComponent() {
        for (let i = 0; i < this.vectors.length; i++) {
            // Calculate and round to 2 decimal places and parse as float
            this.vectors[i].fsintheta = parseFloat(abs(this.vectors[i].magnitude * this.angleSin(this.vectors[i].angle)).toFixed(2));
            
            if (this.vectors[i].d1.toLowerCase() == "south" || this.vectors[i].d1.toLowerCase() == "s" || 
                this.vectors[i].d2.toLowerCase() == "south" || this.vectors[i].d2.toLowerCase() == "s") {
                // Then FsinTheta must be negative
                this.vectors[i].fsintheta *= -1;
            }
        }
    }

    summation() { // Get the summation of X and Y
        for (let i = 0; i < this.vectors.length; i++) {
            this.summationOfX += this.vectors[i].fcostheta;
            this.summationOfY += this.vectors[i].fsintheta;
        }
        // Round to two decimal places and parse as float...
        this.summationOfX = parseFloat(this.summationOfX.toFixed(2))
        this.summationOfY = parseFloat(this.summationOfY.toFixed(2))
    }

    theta() { // Make sure its in degrees.... multiply by 180/pi to make it in degree form
        this.theta1 = `${abs(atan(this.summationOfX/this.summationOfY) * 180/pi).toFixed(2)}°`;
        this.theta2 = `${abs(atan(this.summationOfY/this.summationOfX) * 180/pi).toFixed(2)}°`;
    }

    resultantVectorAndEquilibriumVector() {
        let dirs = []; // 4 items in the array dirs[2] and dirs[4] are for re
        // if x component is negative then west
        if (isNegative(this.summationOfX)) {
            dirs[0] = "W"
            dirs[2] = "E"
        } else {
            dirs[0] = "E"
            dirs[2] = "W"
        }
        // y component
        if (isNegative(this.summationOfY)) {
            dirs[1] = "S"
            dirs[3] = "N"
        } else {
            dirs[1] = "N"
            dirs[3] = "S"
        }
        // Sqrt(summationOfY^2 + summationOfX^2) 2 decimal places just take any unit from the array
        let ans = `${sqrt(square(this.summationOfX) + square(this.summationOfY)).toFixed(2)}${this.vectors[0].unit}`
        this.rv[0] = `${ans}, ${this.theta1} ${dirs[0]} of ${dirs[1]}`;
        this.rv[1] = `${ans}, ${this.theta2} ${dirs[1]} of ${dirs[0]}`;
        // Resultant equilibrium vector
        this.re[0] = `${ans}, ${this.theta1} ${dirs[2]} of ${dirs[3]}`
        this.re[1] = `${ans}, ${this.theta2} ${dirs[3]} of ${dirs[2]}`
    }

    finalSetup() {
        this.data = [
            ['F', 'θ', 'Fcosθ (x)', 'Fsinθ (y)'],
        ]
        // Add the vectors info into the table
        for (let i = 0; i < this.vectors.length; i++) {
            this.data.push([`${this.vectors[i].magnitude}${this.vectors[i].unit}`, this.vectors[i].angle, this.vectors[i].fcostheta, this.vectors[i].fsintheta]);
        }
        // Add average into table
        this.data.push([ "", "", `∑x = ${this.summationOfX}`, `∑y = ${this.summationOfY}`]);
    }

    main() {
        this.xComponent()
        this.yComponent()
        this.summation()
        this.theta()
        this.resultantVectorAndEquilibriumVector()
        this.finalSetup()
    }
}
export const FoxyMethodCommand = {
    name: 'foxy',
    description: 'Solves for the RESULTANT VECTOR and EQUILIBRIUM VECTOR',
    options: [{
        name: 'v1',
        description: 'The first vector e.g format (35N 30 W of N)',
        type: 3, // string
        required: true
    }, {
        name: 'v2',
        description: 'The second vector e.g format (10N 20 Degrees West of South)',
        type: 3, // string
        required: true
    }, {
        name: 'v3',
        description: 'The third vector',
        type: 3, // string
    }, {
        name: 'v4',
        description: 'The fourth vector',
        type: 3, // string
    }, {
        name: 'v5',
        description: 'The fifth vector',
        type: 3, // string
    }]
} 

// module.exports = { FoxyMethod, FoxyMethodCommand }
