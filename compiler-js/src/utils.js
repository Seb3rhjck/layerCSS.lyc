// src/utils.js

const math = require('mathjs');

function evaluateCalc(expression, variables = {}) {
  try {
    return math.evaluate(expression, variables);
  } catch (error) {
    throw new Error(`Error al evaluar calc(): ${error.message}`);
  }
}

function minifyCSS(css) {
  return css.replace(/\s+/g, ' ').trim();
}

module.exports = { evaluateCalc, minifyCSS };