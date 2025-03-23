const fs = require('fs');
const path = require('path');
const { tokenize } = require('./lexer');
const { parse } = require('./parser');
const { processAST } = require('./processor');

function logDebugInfo(filename, content) {
  fs.writeFileSync(filename, content);
}

function compileLYC(inputFile, outputFile) {
  try {
    console.log('Leyendo archivo de entrada...');
    const lycContent = fs.readFileSync(inputFile, 'utf-8');
    console.log('Contenido del archivo LYC:\n', lycContent);

    if (!lycContent.trim()) {
      throw new Error('El archivo LYC está vacío.');
    }

    console.log('Tokenizando el contenido...');
    const tokens = tokenize(lycContent);
    console.log('Tokens generados:', JSON.stringify(tokens, null, 2));

    if (!tokens.length) {
      throw new Error('No se generaron tokens válidos.');
    }

    console.log('Parseando los tokens...');
    const ast = parse(tokens);
    console.log('AST generado:', JSON.stringify(ast, null, 2));

    // Guardar tokens y AST en un archivo debug.log para revisión
    logDebugInfo('debug.log', `Tokens:\n${JSON.stringify(tokens, null, 2)}\n\nAST:\n${JSON.stringify(ast, null, 2)}`);

    const validBlocks = ast.filter(node => node.type === 'BLOCK' && node.declarations.length > 0);
    console.log(`Resumen del AST: 
      - Variables globales: ${ast.filter(n => n.type === 'GLOBAL_VAR').length}
      - Mixins: ${ast.filter(n => n.type === 'MIXIN_DEF').length}
      - Selectores detectados en tokens: ${tokens.filter(n => n.type === 'SELECTOR').length}
      - Bloques detectados en AST: ${ast.filter(n => n.type === 'BLOCK').length}
      - Bloques con propiedades en AST: ${validBlocks.length}
    `);

    if (validBlocks.length === 0) {
      throw new Error('El AST no contiene bloques válidos con propiedades.');
    }

    console.log('Procesando el AST...');
    const cssContent = processAST(ast);
    console.log('CSS generado:\n', cssContent);

    if (!cssContent.trim()) {
      throw new Error('El CSS generado está vacío.');
    }

    console.log('Escribiendo el archivo CSS...');
    fs.writeFileSync(outputFile, cssContent);
    console.log(`Archivo CSS generado con éxito: ${outputFile}`);
  } catch (error) {
    console.error('Error al compilar:', error.message);
  }
}

module.exports = { compileLYC };

if (require.main === module) {
  const inputFile = path.join(__dirname, '../examples/example1.lyc');
  const outputFile = path.join(__dirname, '../examples/example1.css');
  compileLYC(inputFile, outputFile);
}
