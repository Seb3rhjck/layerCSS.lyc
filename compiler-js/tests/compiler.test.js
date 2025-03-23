// tests/compiler.test.js

const fs = require('fs');
const path = require('path');
const { compileLYC } = require('../src/compiler');

describe('Compilador LYC', () => {
  const inputFile = path.join(__dirname, '../examples/example1.lyc');
  const outputFile = path.join(__dirname, '../examples/example1.css');

  it('debería generar un archivo CSS válido', () => {
    // Ejecutar el compilador
    compileLYC(inputFile, outputFile);

    // Leer el archivo CSS generado
    const cssContent = fs.readFileSync(outputFile, 'utf-8');
    console.debug('CSS generado en la prueba:', cssContent);

    // Validar el contenido del archivo CSS
    expect(cssContent).toContain('body { margin: 0; padding: 0;');
    expect(cssContent).toContain('background: linear-gradient(135deg, #FF69B4, #8A2BE2);');
    expect(cssContent).toContain('.button-base { background: #FF69B4; color: white; }');
  });
});