//src/index.js
const path = require('path');
const { compileLYC } = require('./compiler');

const inputFile = path.join(__dirname, '../examples/example1.lyc');
const outputFile = path.join(__dirname, '../examples/example1.css');

compileLYC(inputFile, outputFile);
