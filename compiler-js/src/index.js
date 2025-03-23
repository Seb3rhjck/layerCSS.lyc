const fs = require('fs');
const path = require('path');

// Función principal para compilar un archivo .lyc en un archivo .css
function compileLYC(inputFile, outputFile) {
  try {
    // Leer el contenido del archivo .lyc
    const lycContent = fs.readFileSync(inputFile, 'utf-8');

    // Procesar el contenido LYC y generar CSS
    const cssContent = processLYC(lycContent, inputFile);

    // Escribir el CSS generado en el archivo de salida
    fs.writeFileSync(outputFile, cssContent);

    console.log(`Archivo CSS generado: ${outputFile}`);
  } catch (error) {
    console.error(`Error al compilar: ${error.message}`);
  }
}

// Función para procesar el contenido LYC
function processLYC(lycContent, fileName) {
  let cssOutput = '';
  const globalVariables = {};
  const mixins = {};
  const extendRules = [];

  // Dividir el contenido en líneas para facilitar el debugging
  const lines = lycContent.split('\n');

  // Eliminar comentarios
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // Procesar variables globales
  const globalVarMatch = lycContent.match(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm);
  if (globalVarMatch) {
    globalVarMatch.forEach((line, index) => {
      const lineNumber = findLineNumber(lines, line);
      try {
        const [key, value] = line.split(':').map(part => part.trim());
        if (!key || !value) {
          throw new Error(`Variable mal formada en la línea ${lineNumber}: "${line}"`);
        }
        globalVariables[key] = value.replace(';', '');
      } catch (error) {
        throw new Error(`Error en la variable global (${fileName}:${lineNumber}): ${error.message}`);
      }
    });
    lycContent = lycContent.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, '').trim();
  }

  // Procesar mixins (@mixin)
  const mixinMatch = lycContent.match(/@mixin\s+(\w+)\s*\{([\s\S]*?)\}/g);
  if (mixinMatch) {
    mixinMatch.forEach(mixin => {
      const lineNumber = findLineNumber(lines, mixin);
      try {
        const [, name, content] = mixin.match(/@mixin\s+(\w+)\s*\{([\s\S]*?)\}/);
        if (!name || !content) {
          throw new Error(`Mixin mal formado en la línea ${lineNumber}: "${mixin}"`);
        }
        mixins[name] = content.trim();
      } catch (error) {
        throw new Error(`Error en el mixin (${fileName}:${lineNumber}): ${error.message}`);
      }
    });
    lycContent = lycContent.replace(/@mixin\s+\w+\s*\{[\s\S]*?\}/g, '').trim();
  }

  // Detectar reglas @extend
  const extendMatch = lycContent.match(/@extend\s+(\w+);/g);
  if (extendMatch) {
    extendMatch.forEach(rule => {
      const lineNumber = findLineNumber(lines, rule);
      try {
        const target = rule.match(/@extend\s+(\w+);/)[1];
        if (!target) {
          throw new Error(`Regla @extend mal formada en la línea ${lineNumber}: "${rule}"`);
        }
        extendRules.push(target);
      } catch (error) {
        throw new Error(`Error en la regla @extend (${fileName}:${lineNumber}): ${error.message}`);
      }
    });
    lycContent = lycContent.replace(/@extend\s+\w+;/g, '').trim();
  }

  // Procesar bloques
  const blocks = lycContent.split(/(@layer\s+\w+\s*\{|\})/).filter(block => block.trim() !== '');

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();

    if (block.startsWith('@layer')) {
      const layerName = block.match(/@layer\s+(\w+)/)[1];
      const layerContent = blocks[++i].trim();
      cssOutput += processBlock(layerContent, globalVariables, mixins, extendRules, lines, fileName);
    } else {
      cssOutput += processBlock(block, globalVariables, mixins, extendRules, lines, fileName);
    }
  }

  // Minificar el CSS final antes de devolverlo
  return minifyCSS(cssOutput);
}

// Función para procesar un bloque de contenido LYC
function processBlock(blockContent, variables, mixins, extendRules, lines, fileName) {
  const localVariables = {};

  // Procesar variables locales
  blockContent = blockContent.replace(/--([a-zA-Z0-9-]+):\s*([^;]+);/g, (_, key, value, offset) => {
    const lineNumber = findLineNumber(lines, blockContent, offset);
    try {
      if (!key || !value) {
        throw new Error(`Variable local mal formada en la línea ${lineNumber}: "--${key}: ${value};"`);
      }
      localVariables[`--${key}`] = value.trim();
    } catch (error) {
      throw new Error(`Error en la variable local (${fileName}:${lineNumber}): ${error.message}`);
    }
    return '';
  });

  // Combinar variables locales y globales
  const combinedVariables = { ...variables, ...localVariables };

  // Reemplazar variables
  let processedBlock = blockContent;
  for (const [varName, varValue] of Object.entries(combinedVariables)) {
    processedBlock = processedBlock.replace(new RegExp(`var\\(${varName}\\)`, 'g'), varValue);
  }

  // Verificar si hay referencias a variables no definidas
  processedBlock = processedBlock.replace(/var\(--[a-zA-Z0-9-]+\)/g, (match, offset) => {
    const lineNumber = findLineNumber(lines, processedBlock, offset);
    throw new Error(`Variable no definida en la línea ${lineNumber}: "${match}"`);
  });

  // Reemplazar mixins (@include)
  for (const [mixinName, mixinContent] of Object.entries(mixins)) {
    processedBlock = processedBlock.replace(
      new RegExp(`@include\\s+${mixinName};`, 'g'),
      mixinContent
    );
  }

  // Aplicar herencia (@extend)
  extendRules.forEach(target => {
    processedBlock = processedBlock.replace(
      new RegExp(`${target}\\s*\\{`, 'g'),
      `${target}, .extended-${target} {`
    );
  });

  return processedBlock;
}

// Función para minificar el CSS
function minifyCSS(css) {
  // Eliminar comentarios multilínea y de una sola línea
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // Comentarios multilínea
  css = css.replace(/\/\/.*$/gm, '');        // Comentarios de una sola línea

  // Eliminar espacios innecesarios alrededor de símbolos
  css = css.replace(/\s*([{}:;,])\s*/g, '$1');

  // Reducir múltiples espacios a uno solo
  css = css.replace(/\s+/g, ' ').trim();

  return css;
}

// Función auxiliar para encontrar el número de línea
function findLineNumber(lines, content, offset = 0) {
  let cumulativeLength = 0;
  for (let i = 0; i < lines.length; i++) {
    cumulativeLength += lines[i].length + 1; // +1 por el salto de línea
    if (cumulativeLength > offset) {
      return i + 1; // Línea base-1
    }
  }
  return lines.length; // Si no se encuentra, devuelve la última línea
}

// Ejecutar el compilador
const inputFile = path.join(__dirname, '../examples/example1.lyc');
const outputFile = path.join(__dirname, '../examples/example1.css');
compileLYC(inputFile, outputFile);