const texsvg = require('texsvg');
const sharp = require('sharp');

class Latex {
    constructor(latexString) {
        this.latexString = latexString;
        this.svgString;
        this.pngBuffer;
    }

    async stringToSvgSecondary() {
        let temp = await texsvg(this.latexString)
        // Only change the color, don't scale
        temp = temp.replace('<svg ', '<svg fill="#fff" transform="scale(1) translate(0, 0)" ');

        while(temp.includes('currentColor')) {
            temp = temp.replace('currentColor', "#fff");
        }
        
        // Save
        this.svgString = temp;
    }

    async stringToSvgMain() {
        let temp = await texsvg(this.latexString)
        temp = temp.replace('<svg ', '<svg fill="#fff" transform="scale(1) translate(0, 0)" ');

        while(temp.includes('currentColor')) {
            temp = temp.replace('currentColor', "#fff");
        }
        
        // Scale the svg
        let matches = [...temp.matchAll(/width=".*?ex"/gm)];


        for (let i = 0; i < matches.length; i++) {
          let match = matches[i][0];
          let values = [...match.match(/".*?"/gm)][0];
          let vs = values.split('"')[1].split('ex')[0];
          let v = parseFloat(vs, 10);

          temp = temp.replace(`${vs}ex`, `${v*2}ex`);
        }

        let matches2 = [...temp.matchAll(/height=".*?ex"/gm)];


        for (let i = 0; i < matches.length; i++) {
          let match = matches2[i][0];
          let values = [...match.match(/".*?"/gm)][0];
          let vs = values.split('"')[1].split('ex')[0];
          let v = parseFloat(vs, 10);

          temp = temp.replace(`${vs}ex`, `${v*2}ex`);
        }

        // Save
        this.svgString = temp;

    }

    async svgToPngBuffer() {
       this.pngBuffer = await sharp(Buffer.from(this.svgString)).png().toBuffer();
    }

    async main() {
        await this.stringToSvgMain()
        await this.svgToPngBuffer() 
    }

    async secondary() {
        await this.stringToSvgSecondary()
        await this.svgToPngBuffer()
    }
}

const LatexCommand = {
    name: 'latex',
    description: 'Write and output an equation into fancy LaTex',
    options: [{
        name: 'command',
        description: 'Write LaTex commands like \\pi, \\rightarrow, \\neq, etc...',
        type: 3, // string
        required: true
    }]
} 

module.exports = { Latex, LatexCommand }
