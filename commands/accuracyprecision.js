class AccuracyPrecision {

    constructor(listOfValues, actualValue) {
        this.listOfAdValues = [];
        // Parse the list of values using regex from passed string
        this.listOfValues = listOfValues.match(/([0-9]+[.,]*)+/gm);
        // Convert every string value to float
        this.listOfValues = this.listOfValues.map(i => parseFloat(i));
        // Declare and define average, average absolute deviation, actual value, etc...
        this.actualValue = actualValue;
        this.average = 0;
        this.averageAd = 0;
        this.percentError = 0; // |av - xmean|/av * 100 for accuracy
        this.relativeDeviation = 0; // |aveAd|xmean * 100 for precision
        this.conclusion; // string
        this.data; // array (the one to send as a table)
    }

    getAverage() {
        let sum = 0;
        this.listOfValues.forEach(v => {
            sum += v
        })
        // 2 decimal places rounded always
        this.average = (sum/this.listOfValues.length).toFixed(2);
    }

    getAdValues() {
        this.listOfValues.forEach(v => {
            // Push values into the desired array
            this.listOfAdValues.push(Math.abs((v - this.average).toFixed(4)));
        })
    }

    getAverageAd() {
        let sum = 0;
        this.listOfAdValues.forEach(v => {
            sum += v;
        })
        // 2 decimal places
        this.averageAd = (sum/this.listOfValues.length).toFixed(2);
    }

    getPercentError() { // Accuracy (2 decimal places) results are already in percent
        this.percentError = ((Math.abs(this.actualValue - this.average)/this.actualValue) * 100).toFixed(2);
    }

    getRelativeDeviation() { // Precision (2 decimal places); already in percent
        this.relativeDeviation = ((Math.abs(this.averageAd)/this.average) * 100).toFixed(2);
    }

    conclude() {
        // Accuracy
        if (this.percentError <= 10) {
            this.conclusion = "Accurate and ";
        } else {
            this.conclusion = "Inaccurate and ";
        }
        // Precision
        if (this.relativeDeviation <= 10) {
            this.conclusion += "Precise";
        } else {
            this.conclusion += "Unprecise";
        }
    }

    finalSetup() {
        this.data = [
            ['Trials', 'x', 'AD'],
        ]
        // Add the list of values and ad values into the table...
        for (let i = 0; i < this.listOfValues.length; i++) {
            this.data.push([i + 1, this.listOfValues[i], this.listOfAdValues[i]]);
        }
        // Add average into table
        this.data.push([ "",`Ave. = ${this.average}`, `Ave. AD = ${this.averageAd}`]);
    }

    main() {
        this.getAverage()
        this.getAdValues()
        this.getAverageAd()
        this.getPercentError()
        this.getRelativeDeviation()
        this.conclude()
        this.finalSetup()
    }
}

const AccuracyPrecisionCommand = {
    name: 'acpc',
    description: 'Calculates the passed values based on the actual value if ACCURATE or PRECISE',
    options: [{
        name: 'list-of-values',
        description: 'The known list of values (decimal/number)',
        type: 3, // string
        required: true
    }, {
        name: 'actual-value',
        description: 'The actual value (decimal/number)',
        type: 10, // double
        required: true
    }]
} 

module.exports = { AccuracyPrecision, AccuracyPrecisionCommand }
