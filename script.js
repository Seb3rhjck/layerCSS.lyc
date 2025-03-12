// Variables globales
let currentLanguage = "en"; // Idioma predeterminado

/**
 * Función para cargar traducciones según el idioma seleccionado.
 * @param {string} lang - Código del idioma (ej. "es", "en").
 */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo JSON para el idioma ${lang}: ${response.status}`);
    }
    const translations = await response.json();

    // Actualizar elementos del DOM con las traducciones
    Object.keys(translations).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.innerHTML = translations[key];
      }
    });

    // Actualizar idioma actual
    currentLanguage = lang;
  } catch (error) {
    console.error("Error al cargar las traducciones:", error);
  }
}

/**
 * Evento para cambiar el idioma mediante el selector.
 */
document.getElementById("language-select")?.addEventListener("change", (event) => {
  const lang = event.target.value;
  loadTranslations(lang);
});

/**
 * Inicialización del script al cargar el DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations(currentLanguage);

  // Asociar evento de compilación
  document.getElementById("compile-button")?.addEventListener("click", compileLYC);
});

/**
 * Función principal para compilar LYC a CSS.
 */
function compileLYC() {
  const lycCode = document.getElementById("code-input")?.value;
  if (!lycCode || !lycCode.trim()) {
    alert("Por favor, ingresa código LYC.");
    return;
  }

  const startTime = performance.now();
  try {
    const cssCode = processLYC(lycCode);
    const endTime = performance.now();
    const compileTime = (endTime - startTime).toFixed(2);

    // Mostrar resultados
    const outputElement = document.getElementById("output");
    if (outputElement) {
      outputElement.textContent = cssCode;
    } else {
      console.error("Elemento 'output' no encontrado en el DOM.");
    }
  } catch (error) {
    const outputElement = document.getElementById("output");
    if (outputElement) {
      outputElement.textContent = `Error de compilación: ${error.message}`;
    } else {
      console.error("Elemento 'output' no encontrado en el DOM.");
    }
  }
}

/**
 * Compilador LYC a CSS.
 * @param {string} lycCode - Código LYC a procesar.
 * @returns {string} Código CSS procesado.
 */
function processLYC(lycCode) {
  let processedCode = lycCode;

  // 1. Eliminar comentarios
  processedCode = processedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

  // 2. Procesar variables globales
  const globalVariables = {};
  processedCode = processedCode.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, (match, varName, varValue) => {
    globalVariables[varName] = varValue.trim();
    return "";
  });

  // 3. Aplicar variables globales
  for (const [varName, varValue] of Object.entries(globalVariables)) {
    processedCode = processedCode.replace(new RegExp(`var\\(--${varName}\\)`, "g"), varValue);
  }

  // 4. Procesar bloques anidados
  processedCode = processNestedBlocks(processedCode);

  // 5. Procesar capas (@layer)
  processedCode = processLayers(processedCode);

  // 6. Procesar mixins (@mixin y @include)
  processedCode = processMixins(processedCode);

  // 7. Procesar herencia (@extend)
  processedCode = processExtend(processedCode);

  // 8. Procesar cálculos matemáticos (calc())
  processedCode = processCalc(processedCode);

  // 9. Minificar resultado
  return processedCode.replace(/\s+/g, " ").trim();
}

/**
 * Función para procesar bloques anidados.
 * @param {string} code - Código LYC a procesar.
 * @returns {string} Código procesado con bloques anidados.
 */
function processNestedBlocks(code) {
  const nestedBlockRegex = /([^{]+)\{([^}]+)\}/g;
  let result = code;
  let match;

  while ((match = nestedBlockRegex.exec(code)) !== null) {
    const parentSelector = match[1].trim();
    const childContent = match[2].trim();

    // Buscar selectores hijos dentro del bloque
    const childSelectors = childContent.split(";").map((line) => line.trim()).filter((line) => line);
    const processedChildren = childSelectors
      .map((selectorLine) => {
        const [childSelector, ...styles] = selectorLine.split("{");
        if (!childSelector) return "";
        const fullSelector = `${parentSelector} ${childSelector.trim()}`;
        const styleContent = styles.join("{").replace(/}/g, "");
        return `${fullSelector} { ${styleContent} }`;
      })
      .join(" ");

    // Reemplazar el bloque original con el procesado
    result = result.replace(match[0], processedChildren);
  }

  return result;
}

/**
 * Función para procesar capas (@layer).
 * @param {string} code - Código LYC a procesar.
 * @returns {string} Código procesado con capas.
 */
function processLayers(code) {
  const layerRegex = /@layer\s+([^{]+)\s*\{([^}]+)\}/g;
  let result = code;
  let match;

  while ((match = layerRegex.exec(code)) !== null) {
    const layerName = match[1].trim();
    const layerContent = match[2].trim();

    // Mantener la estructura de la capa
    const processedLayer = `@layer ${layerName} { ${layerContent} }`;
    result = result.replace(match[0], processedLayer);
  }

  return result;
}

/**
 * Función para procesar mixins (@mixin y @include).
 * @param {string} code - Código LYC a procesar.
 * @returns {string} Código procesado con mixins.
 */
function processMixins(code) {
  const mixins = {};

  // Extraer definiciones de mixins
  code = code.replace(/@mixin\s+([^{]+)\s*\{([^}]+)\}/g, (match, mixinName, mixinContent) => {
    mixins[mixinName.trim()] = mixinContent.trim();
    return "";
  });

  // Reemplazar @include con el contenido del mixin
  return code.replace(/@include\s+([^{;]+)/g, (match, mixinName) => {
    const content = mixins[mixinName.trim()];
    if (!content) {
      throw new Error(`Mixin '${mixinName}' no definido.`);
    }
    return content;
  });
}

/**
 * Función para procesar herencia (@extend).
 * @param {string} code - Código LYC a procesar.
 * @returns {string} Código procesado con herencia.
 */
function processExtend(code) {
  return code.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (match, sourceClass, targetClass) => {
    const sourceStyles = code.match(new RegExp(`${sourceClass}\\s*\\{([^}]+)\\}`, "g"));
    if (!sourceStyles) {
      throw new Error(`Clase '${sourceClass}' no encontrada para extender.`);
    }
    const styles = sourceStyles[0].replace(sourceClass, targetClass);
    return styles;
  });
}

/**
 * Función para procesar cálculos matemáticos (calc()).
 * @param {string} code - Código LYC a procesar.
 * @returns {string} Código procesado con cálculos.
 */
function processCalc(code) {
  return code.replace(/calc\(([^)]+)\)/g, (match, expression) => {
    try {
      // Evaluar la expresión matemática
      const result = evaluateExpression(expression);
      return result.toString();
    } catch (error) {
      throw new Error(`Error al evaluar calc(): ${error.message}`);
    }
  });
}

/**
 * Función para evaluar expresiones matemáticas simples.
 * @param {string} expression - Expresión matemática.
 * @returns {number} Resultado de la evaluación.
 */
function evaluateExpression(expression) {
  const operators = ["+", "-", "*", "/"];
  let result = parseFloat(expression);
  let operator = "+";

  const tokens = expression.split(/([+\-*/])/).map((token) => token.trim());

  for (const token of tokens) {
    if (operators.includes(token)) {
      operator = token;
    } else if (!isNaN(parseFloat(token))) {
      const value = parseFloat(token);
      switch (operator) {
        case "+":
          result += value;
          break;
        case "-":
          result -= value;
          break;
        case "*":
          result *= value;
          break;
        case "/":
          if (value === 0) throw new Error("División por cero.");
          result /= value;
          break;
      }
    }
  }

  return result;
}
