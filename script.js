
//compilador basico en js
const fs = require('fs');
const path = require('path');

function compileLYC(inputFile, outputFile) {
  try {
    const lycContent = fs.readFileSync(inputFile, 'utf-8');
    const cssContent = processLYC(lycContent);
    fs.writeFileSync(outputFile, cssContent);
    console.log(`Archivo CSS generado: ${outputFile}`);
  } catch (error) {
    console.error(`Error al compilar: ${error.message}`);
  }
}

function processLYC(lycContent) {
  let cssOutput = '';
  const globalVariables = {};

  // Eliminar comentarios
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // Procesar variables globales
  const globalVarMatch = lycContent.match(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm);
  if (globalVarMatch) {
    globalVarMatch.forEach(line => {
      const [key, value] = line.split(':').map(part => part.trim());
      globalVariables[key] = value.replace(';', '');
    });
    lycContent = lycContent.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, '').trim();
  }

  // Procesar bloques
  const blocks = lycContent.split(/(@layer\s+\w+\s*\{|\})/).filter(block => block.trim() !== '');

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();

    if (block.startsWith('@layer')) {
      const layerName = block.match(/@layer\s+(\w+)/)[1];
      const layerContent = blocks[++i].trim();
      cssOutput += processBlock(layerContent, globalVariables);
    } else {
      cssOutput += processBlock(block, globalVariables);
    }
  }

  return minifyCSS(cssOutput);
}

function processBlock(blockContent, variables) {
  const localVariables = {};
  blockContent = blockContent.replace(/--([a-zA-Z0-9-]+):\s*([^;]+);/g, (_, key, value) => {
    localVariables[`--${key}`] = value.trim();
    return '';
  });

  // Combinar variables locales y globales
  const combinedVariables = { ...variables, ...localVariables };

  // Reemplazar variables
  let processedBlock = blockContent;
  for (const [varName, varValue] of Object.entries(combinedVariables)) {
    processedBlock = processedBlock.replace(new RegExp(`var\\(${varName}\\)`, 'g'), varValue);
  }

  return processedBlock;
}

function minifyCSS(css) {
  return css.replace(/\s+/g, ' ').trim();
}

// Ejecutar el compilador
const inputFile = path.join(__dirname, '../examples/example1.lyc');
const outputFile = path.join(__dirname, '../examples/example1.css');
compileLYC(inputFile, outputFile);
