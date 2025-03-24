// src/compiler.js
const fs = require('fs');
const path = require('path');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Processor = require('./processor');

function compileLYC(inputFile, outputFile) {
  try {
    console.log(`📖 Leyendo archivo: ${inputFile}`);
    let lycContent = fs.readFileSync(inputFile, 'utf-8');

    console.log("🔍 Tokenizando código...");
    const lexer = new Lexer(lycContent);
    const tokens = lexer.tokenize();

    console.log("🌳 Construyendo AST...");
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.debug("AST generado:", ast); // Mensaje de depuración

    console.log("⚙️ Procesando AST en CSS...");
    const processor = new Processor(ast);
    let cssOutput = processor.generateCSS();

    console.log("✂️ Minificando CSS...");
    cssOutput = minifyCSS(cssOutput);

    fs.writeFileSync(outputFile, cssOutput);
    console.log(`✅ Archivo CSS generado: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error al compilar: ${error.message}`);
    console.error(error.stack); // Mostrar detalles completos del error
  }
}

module.exports = { compileLYC };