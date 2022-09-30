const Ions = [
    ["Sodium", "Na", "+1" ], 
    ["Potassium", "K", "+1"],
    ["Lithium", "Li", "+1" ],
    ["Silver", "Ag", "+1"], 
    ["Ammonium", "NH4", "+1"],
    ["Rubidium", "Rb", "+1"],
    ["Cesium", "Cs", "+1" ],
    ["Magnesium", "Mg", "+2"],
    ["Calcium", "Ca", "+2"], 
    ["Zinc", "Zn", "+2"], 
    ["Barium", "Ba", "+2"],
    ["Aluminum", "Al", "+3"],
    // Metals with variable oxidation numbers...
    ["Cuprous", "Cu", "+1"],
    ["Cupric", "Cu", "+2"], 
    ["Mercurous", "Hg", "+1"], 
    ["Mercuric", "Hg", "+2"], 
    ["Aurous", "Au", "+1"], 
    ["Auric", "Au", "+3"], 
    ["Thallous", "Tl", "+1"], 
    ["Thallic", "Tl", "+3"], 
    ["Platinous", "Pt", "+1"], 
    ["Platinic", "Pt", "+4"], 
    ["Cobaltous", "Co", "+2"], 
    ["Cobaltic", "Co", "+3"], 
    ["Nickelous", "Ni", "+2"], 
    ["Nickelic", "Ni", "+3"], 
    ["Manganous", "Mn", "+2"], 
    ["Manganic", "Mn", "+3"], 
    ["Ferrous", "Fe", "+2"], 
    ["Ferric", "Fe", "+3"], 
    ["Chromous", "Cr", "+2"],
    ["Chromic", "Cr", "+3"],
    ["Plumbous", "Pb", "+2"], 
    ["Plumbic", "Pb", "+4"], 	
    ["Stannous", "Sn", "+2"], 
    ["Stannic", "Sn", "+4"], 	
    ["Arsenous", "As", "+3"], 	
    ["Arsenic", "As", "+5"], 	
    ["Antimonous", "Sb", "+3"], 	
    ["Antimonic", "Sb", "+5"], 
    // Non-metals -1
    ["Chloride", "Cl", "-1"],
    ["Bicarbonate", "HCO3", "-1"],
    ["Hypochlorite", "ClO", "-1"],
    ["Bisulfate", "HSO4", "-1"],
    ["Chlorite",  "ClO2", "-1"],
    ["Bisulfite", "HSO3", "-1"],
    ["Chlorate", "ClO3",  "-1"],
    ["Hydride", "H", "-1"],
    ["Perchlorate", "ClO4", "-1"],
    ["Dihydrogen phosphate", "H2PO4", "-1"],
    ["Bromide",  "Br", "-1"],   
    ["Dihydrogen phosphite",  "H2PO3", "-1"],
    ["Hypobromite", "BrO", "-1"],
    ["Acetate", "C2H3O2", "-1"],
    ["Bromite", "BrO2",  "-1"],
    ["Nitrite", "NO2", "-1"],
    ["Bromate", "BrO3", "-1"],
    ["Nitrate", "NO3", "-1"],
    ["Perbromate", "BrO4", "-1"],
    ["Fluoride", "F", "-1"],
    ["Iodide", "I", "-1"],
    ["Hydroxide", "(OH)", "-1"],
    ["Hypoiodite",  "IO", "-1"],
    ["Iodite",  "IO2", "-1"],
    ["Iodate", "IO3", "-1"],
    ["Periodate", "IO4", "-1"],
    // Non-metals -2
    ["Sulfite",  "SO3", "-2"],
    ["Sulfate", "SO4", "-2"],
    ["Carbonate", "CO3", "-2"],
    ["Chromate", "CrO4", "-2"],
    ["Dichromate", "Cr2O7", "-2"],
    ["Oxalate", "Cr2O4", "-2"],
    ["Sulfide", "S", "-2"],
    ["Oxide", "O", "-2"],
    // Non-metals -3
    ["Borate", "BO3", "-3"],
    ["Phospite", "PO3", "-3"],
    ["Phosphate", "PO4", "-3"],
    ["Phospide", "P", "-3"],
    ["Nitride", "N", "-3"],
    // -4
    ["Silicate", "SiO4", "-4"],
    // Others GEN-INE or Have No Fear Of Ice Cold Beer (7 Diatomic Elements)
    ["Hydrogen", "H2", "0"],
    ["Nitrogen", "N2", "0"],
    ["Fluorine", "F2", "0"],
    ["Oxygen", "O2", "0"],
    ["Iodine", "I2", "0"],
    ["Chlorine", "Cl2", "0"],
    ["Bromine", "Br2", "0"],
    // Technical
    ["Carbon dioxide", "CO2", "0"],
    ["Water", "H2O", "0"],
    ["Dihydrogen monoxide", "H2O", "0"],
    ["Glucose", "C6H12O6", "0"],
    // Acids (add more just in case)
    ["Hydrochloric acid", "HCl", "0"],
    // Hydrocarbons (Alkane) - CnH2n+2
    ["Methane", "CH4", "0"],
    ["Ethane", "C2H6", "0"],
    ["Propane", "C3H8", "0"],
    ["Butane", "C4H10", "0"],
    ["Pentane", "C5H12", "0"],
    ["Hexane", "C6H14", "0"],	
    ["Heptane", "C7H16", "0"],
    ["Octane", "C8H18", "0"],
    ["Nonane", "C9H20", "0"],	
    ["Decane", "C10H22", "0"],
    // Hydrocarbons (Alkene) - CnH2n
    ["Ethene", "C2H4", "0"],
    ["Propene", "C3H6", "0"],
    ["Butene", "C4H8", "0"],
    ["Pentene", "C5H10", "0"],
    ["Hexene", "C6H12", "0"],	
    ["Heptene", "C7H14", "0"],
    ["Octene", "C8H16", "0"],
    ["Nonene", "C9H18", "0"],	
    ["Decene", "C10H20", "0"],
    // Hydrocarbons (Alkyne) - CnH2n-2
    ["Ethene", "C2H2", "0"],
    ["Propene", "C3H4", "0"],
    ["Butene", "C4H6", "0"],
    ["Pentene", "C5H8", "0"],
    ["Hexene", "C6H10", "0"],	
    ["Heptene", "C7H12", "0"],
    ["Octene", "C8H14", "0"],
    ["Nonene", "C9H16", "0"],	
    ["Decene", "C10H18", "0"],
];

class WordToChem {
    constructor(stringWordEq) {
        this.stringWordEq = stringWordEq;
        this.equation = "";
        this.parseString(stringWordEq);
    }

    // Tries to get all info from the string
    parseString(stringEq) {
        // First split the equation into two (reactant, product)
        let temp = stringEq.split(/\s\=\s/g)
        // Validate 
        if (temp.length != 2) {
            console.log("errror no equal sign or something")
        }
        let rt = temp[0].split(/\s\+\s/g); // Reactant side
        let pt = temp[1].split(/\s\+\s/g); // Product side

        let Info = {
            Reactant: rt.map(k => {
                return this.getIonIndex(k)
            }),
            Product: pt.map(k => {
                return this.getIonIndex(k)
            })
        }
        // Reactant
		for (let i = 0; i < Info.Reactant.length; i++) {
			this.equation += Info.Reactant[i].symbol;
			if (i < Info.Reactant.length - 1) {
				this.equation += " + ";
			}
		}
		// Add equal sign
		this.equation += " = ";
		// Product
		for (let i = 0; i < Info.Product.length; i++) {
			this.equation += Info.Product[i].symbol;
			if (i < Info.Product.length - 1) {
				this.equation += " + ";
			}
		}

    }
    
    getIonIndex(s) {
        let t = Ions.find(i => {
            return i[0].toLowerCase() == s.toLowerCase();
        })
        if (t == undefined) {
            let t1 = s.split(/\s/g) // "Sodium Chloride" -> ["Sodium", "Chloride"]
            let t2 = t1.map(k => {
                return this.getIonIndex(k) // Recursive
            })
            return {
                name: s,
                symbol: this.crissCross(t2),
                charge: 0 // Just make this neutral
            }
        } else {
            return {
                name: t[0],
                symbol: t[1],
                charge: t[2]
            }
        }
    }
    // Get the gcd/hcf of two numbers
    getGcd(num1, num2) {
        let gcd = 1;
        // looping from 1 to number1 and number2
        for (let i = 1; i <= num1 && i <= num2; i++) {
            // check if is factor of both integers
            if( num1 % i == 0 && num2 % i == 0) {
                gcd = i;
            }
        }
        return gcd
    }
    // Criss-cross method
    crissCross(i) {
        // Crisscross method
        let leftIonCharge = Number(i[0].charge);
        let rightIonCharge = Math.abs(Number(i[1].charge));

        let gcd = this.getGcd(leftIonCharge, rightIonCharge);
        // Divide the gcd by the left and right charges
        leftIonCharge /= gcd;
        rightIonCharge /= gcd;
        // Check if ions end with a number
        // let leftIonEndsWithNum = Character.isDigit(leftIon.charAt(leftIon.length() - 1));
        let leftIonEndsWithNum = /\d$/.test(i[0].symbol)
        // let rightIonEndsWithNum = Character.isDigit(rightIon.charAt(rightIon.length() - 1));
        let rightIonEndsWithNum = /\d$/.test(i[1].symbol)

        if (rightIonCharge == 1 && leftIonCharge == 1) {
            return `${i[0].symbol}${i[1].symbol}`
        } else if (rightIonCharge == 1 && leftIonCharge != 1) {
            if (rightIonEndsWithNum) {
                // leftIon + "(" + rightIon + ")" + leftIonCharge;
                return `${i[0].symbol}(${i[1].symbol})${leftIonCharge}`
            } else {
                // side[i] = leftIon + rightIon + leftIonCharge;
                return `${i[0].symbol}${i[1].symbol}${leftIonCharge}`
            }
        } else if (leftIonCharge == 1 && rightIonCharge != 1) {	
            if (leftIonEndsWithNum) {
                // side[i] = "(" + leftIon + ")" + rightIonCharge + rightIon;
                return `(${i[0].symbol})${rightIonCharge}${i[1].symbol}`
            } else {
                // side[i] = leftIon + rightIonCharge + rightIon;
                return `${i[0].symbol}${rightIonCharge}${i[1].symbol}`
            }
        } else { 
            if (leftIonEndsWithNum && rightIonEndsWithNum) {
                // If for example the two ions have charges > 1 like Sb2Cr2O75
                // side[i] = "(" + leftIon + ")" + rightIonCharge + "(" + rightIon + ")" + leftIonCharge;
                return `(${i[0].symbol})${rightIonCharge}(${i[1].symbol})${leftIonCharge}`
            } else if (leftIonEndsWithNum && !rightIonEndsWithNum) {
                // side[i] = "(" + leftIon + ")" + rightIonCharge +  rightIon + leftIonCharge;
                return `(${i[0].symbol})${rightIonCharge}${i[1].symbol}${leftIonCharge}`
            } else if (!leftIonEndsWithNum && rightIonEndsWithNum) {
                // side[i] = leftIon + rightIonCharge + "(" +  rightIon + ")" + leftIonCharge;
                return `${i[0].symbol}${rightIonCharge}(${i[1].symbol})${leftIonCharge}`
            } else {
                // side[i] = leftIon + rightIonCharge + rightIon + leftIonCharge;
                return `${i[0].symbol}${rightIonCharge}${i[1].symbol}${leftIonCharge}`
            }
        }	
    }
}

module.exports = { Ions, WordToChem };
