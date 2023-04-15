export class Bearing{
    constructor(angle) {
        this.angle = angle;
    }
    actualDirection() {
        // if angle is between 0 to 90 (not equal to 0 or 90) then actual direction is just the angle itself
        // Also the direction is always east of north...
        // TODO: Angles greater than 360 wont work... cant think for now 
        switch(this.angle) {
            case (this.angle == 0 || this.angle == 360):
                return "NORTH";
                break;
            case (this.angle == 90):
                return "EAST";
                break;
            case (this.angle == 180):
                return "SOUTH";
                break;
            case (this.angle == 270):
                return "WEST";
                break;
            default:
                // Angle is between 0 and 90
                if (this.angle > 0 && this.angle < 90) {
                    return this.angle + " DEGREES EAST OF NORTH";
                } else if (this.angle > 90 && this.angle < 180) {
                    return (this.angle - 90) + " DEGREES SOUTH OF EAST";
                } else if (this.angle > 180 && this.angle < 270) {
                    return (this.angle - 180) + " DEGREES WEST OF SOUTH";
                } else if (this.angle > 270 && this.angle < 360) {
                    return (this.angle - 270) + " DEGREES NORTH OF WEST";
                }
                break;
        }
    }
    
    // Pass in the actual direction as a string
    complementaryDirection(adString) {
        if (adString == "NORTH" || adString == "SOUTH") {
            return "WEST OR EAST";
        } else if (adString == "EAST" || adString == "WEST") {
            return "NORTH OR SOUTH";
        } else {
            let complementaryAngle = 90 - Number(adString.match(/\d+/g)[0]);
            let directions = adString.split(/\s/g);
            //console.log(complementaryAngle + " " + directions[4] + " OF " + directions[2]);
            return (complementaryAngle + " DEGREES " + directions[4] + " OF " + directions[2]);
        }

    }
}

export const BearingCommand = {
    name: 'bearing',
    description: 'Gives ACTUAL DIRECTION and COMPLEMENTARY DIRECTION based on bearing angle',
    options: [{
        name: 'angle',
        description: 'The known bearing angle',
        type: 4, // integer
        required: true
    }]
}

// module.exports = { Bearing, BearingCommand};
