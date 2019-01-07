// Creates a browser compatible version

const fs = require('fs');

const BUILD = './dist';
const TARGET = './dist/GroupReducer.js';

if (!fs.existsSync(BUILD)) (
    fs.mkdirSync(BUILD)
)

const src = fs.readFileSync('./GroupReducer.js');
const srcbr = src.slice(0, src.indexOf('// NODE'));
fs.writeFileSync(TARGET, srcbr);