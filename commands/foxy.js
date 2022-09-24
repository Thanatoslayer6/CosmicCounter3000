const { sin, cos } = require('mathjs');

class FoxyMethod {
    // Pass in a string of vector array [ "30N 20 DEGREES W of N", "40N 10 D N of W" ]
    constructor(vectors) {
        // First split vectors by the comma
        this.vectors = [];
        this.summationOfX = 0;
        this.summationOfY = 0;
        let item, temp;
        // /([0-9]+[.,]*)+(.+)/gm
        for (let i = 0; i < vectors.length; i++) {
            item = vectors[i].split(' ');
            temp = item[0].split(/([a-zA-Z\/]+)/gm)
            this.vectors.push({
                magnitude: parseFloat(temp[0]),
                angle: parseFloat(item[1]),
                unit: temp[1],
                d1: item[3],
                d2: item[5] 
            })
        }
        console.log(this.vectors);
        
      // { magnitude: '30N', angle: '20', d1: 'East', d2: 'West' },
      // { magnitude: '50N', angle: '10', d1: 'N', d2: 'E' }
    }

    xComponent() {
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i].fcostheta = Math.abs(this.vectors[i].magnitude * Math.cos(this.vectors[i].angle));
            console.log(this.vectors[i].fcostheta)
            // if (this.vectors[i].d1.toLowerCase() == "east" || this.vectors[i].d1.toLowerCase() == "e") {
            //     // Then FcosTheta must be positive (take the absolute value)
            //     this.vectors[i].fcostheta = Math.abs(this.vectors[i].magnitude * Math.cos(this.vectors[i].angle));
            // } else 
            if (this.vectors[i].d1.toLowerCase() == "west" || this.vectors[i].d1.toLowerCase() == "w" ||
                this.vectors[i].d2.toLowerCase() == "west" || this.vectors[i].d2.toLowerCase() == "w") {
                // Then FcosTheta must be negative
                // this.fcostheta.push(-Math.abs(this.vectors[i].magnitude * Math.cos(this.vectors[i].angle)));
                this.vectors[i].fcostheta *= -1;
            }
        }
    }

    yComponent() {
        for (let i = 0; i < this.vectors.length; i++) {
            if (this.vectors[i].d2.toLowerCase() == "north" || this.vectors[i].d2.toLowerCase() == "n") {
                // FsinTheta must be positive (take the absolute value)
                this.vectors[i].fsintheta = Math.abs(this.vectors[i].magnitude * Math.cos(this.vectors[i].angle))
            } else if (this.vectors[i].d2.toLowerCase() == "south" || this.vectors[i].d2.toLowerCase() == "s") {
                // Then FcosTheta must be negative
                this.vectors[i].fcostheta = -Math.abs(this.vectors[i].magnitude * Math.cos(this.vectors[i].angle))
            }
        }
    }
}

module.exports = { FoxyMethod }
