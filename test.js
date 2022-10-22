// const { Bearing } = require('./bearing');
// const { AccuracyPrecision } = require('./commands/accuracyprecision')
// const { FoxyMethod } = require('./commands/foxy')
// const { Kinematics } = require('./commands/kinematics')
const { VerticallyDownward, VerticallyUpward, HorizontalProjection } = require('./commands/projectilemotion')
// const { Latex } = require('./commands/latex')
// const { Stoichiometry, StoichiometryPercentage } = require('./commands/stoichiometry')
const math = require('mathjs')
// const { WordToChem } = require('./commands/weq')
// const { Balancer } = require('./commands/balance')
// let st = new WordToChem('Arsenic Phosphite + Ferric Sulfite = Ferric Phosphite + Arsenic Sulfite')
// let st = new WordToChem('Plumbic Phosphite + Aluminum Chromate = Aluminum Phosphite + Plumbic Chromate')
// vi, vf, h, t
// let st = new VerticallyDownward("5.0m/s", undefined, "20m", undefined, 1) // WORKS (vi and h)
// let st = new VerticallyDownward("5.0m/s", "10m/s", undefined, undefined, 1) // WORKS (height and time)
// let st = new VerticallyDownward("5.0m/s", undefined, "3.83m", undefined, 1) // WORKS (final velocity and time)
// let st = new VerticallyDownward("5.0m/s", undefined, undefined, "0.51055s", 1) // WORKS (final velocity and height)
// let st = new VerticallyDownward(undefined, "10m/s", "3.83m", undefined, 1);
// let st = new VerticallyDownward(undefined, "10m/s", undefined, "0.51055s", 1);
// let st = new VerticallyDownward(undefined, undefined, "3.83m", "0.51055s", 1); // VERTICALLY UPWARD NOW WORKING
// vi, vf, d, t/2, t
// let st = new VerticallyUpward("3m/s", undefined, undefined, undefined, undefined, 1);
// let st = new VerticallyUpward(undefined, "3m/s", undefined, undefined, undefined, 1);
//
// let st = new VerticallyUpward(undefined, undefined, undefined, "0.3061s", undefined, 1) // Max height & halftime
// let st = new VerticallyUpward(undefined, undefined, "250m", undefined, undefined, 2) // Max height & halftime

// vi, vy, vf, t, d, r, sigfig
let st = new HorizontalProjection("3m/s", undefined, undefined, undefined, "50m", undefined, 2);
console.log(st)

// (async() => {
//     let formulas = [], attc = [], properEmbeds = [];
//     for (let i = 0; i < st.equationInLatex.length; i++) {
//         let info = new Latex(st.equationInLatex[i]);
//         await info.main()
//         formulas.push(info.pngBuffer)
//     }
//     console.log(formulas)
//     // let stuff = await Promise.all(formulas)
// })()
// console.log(st)

// console.log(calculateSigfig("0.001012300"))
// console.log(calculateSigfig("5.0"))

// let te = new Balancer("H2 + O2 = H2O")
// console.log(math.number(math.unit('2300ml'), 'l')) // THIS WORKS WTF?!?!?

// let into = new Bearing(179)
// let temp = new Kinematics("vf=20km/s vi=0km/s t = 8s", "a")

// const c = math.unit('2.1 km')
// const d = math.unit('500 m')
// console.log(math.number(math.subtract(c, d)))

// let st = new Stoichiometry("Mg + O2 = MgO", "25g of Mg", "mass of MgO")
// let st = new StoichiometryPercentage(undefined, "20g", "500g", "m/m");
// percent, solute, solution, method
// let st = new StoichiometryPercentage(undefined, "40g", "0.52l", "m/v");
// let st = new StoichiometryPercentage("7.69%", undefined, "520ml", "m/v");
// let st = new StoichiometryPercentage("7.69%", "40g", undefined, "m/v");
// let st = new StoichiometryPercentage("12.20%", "0.2kg", undefined, "m/m")
// console.log(st)
// let stuff = math.unit('0.04kg')
// console.log(stuff.toString())
// let temp = new Kinematics("vf = 20km/s vi=0km/s t = 8s", "a")
// console.log(temp)

// console.log(masterString)

// new FoxyMethod(["30N 20 Degrees East of West", "50N 10 DEGREES N of E", "203.12km/s 50 degrees W of E"])
// let temp = new FoxyMethod(["3m 30 Degrees N of West", "5m 45 degrees south of west"])
// console.log(temp)
// console.log(Ions[0])
// let s = new WordToChem("Glucose + oxygen = carbon dioxide + water")
// let s = new WordToChem("ammonium bicarbonate = carbon dioxide + water")

// let ad = into.actualDirection();
// console.log(ad);
// console.log(into.complementaryDirection(ad))

// let temp = new AccuracyPrecision("49.52, 50.65, 48.96, 51.43", 50);
// let temp = new AccuracyPrecision("820.2 844.5 898.28 899.99", 800);
// temp.main()

// console.log(temp.listOfValues)
// console.log(temp.average);
// console.log(temp.listOfAdValues);
// console.log(temp.averageAd)
// console.log(temp.percentError);
// console.log(temp.relativeDeviation);
// console.log(temp.conclusion);

// const { table } = require('table');

// const data = [
//     ['0A', '0B', '0C'],
//     ['1A', '1B', '1C'],
//     ['2A', '2B', '2C']
// ];

// console.log(table(data));
