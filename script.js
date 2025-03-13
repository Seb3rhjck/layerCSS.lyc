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
        // Si el valor es un objeto, concatenar sus propiedades
        if (typeof translations[key] === "object") {
          element.innerHTML = Object.values(translations[key]).join("<br>");
        } else {
          element.innerHTML = translations[key];
        }
      } else {
        console.warn(`Elemento con ID '${key}' no encontrado en el DOM.`);
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
document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language-select");
  if (languageSelect) {
    languageSelect.addEventListener("change", (event) => {
      const lang = event.target.value;
      loadTranslations(lang);
    });
  } else {
    console.error("Elemento 'language-select' no encontrado en el DOM.");
  }

  // Cargar traducciones iniciales
  loadTranslations(currentLanguage);

  // Asociar evento de compilación
  const compileButton = document.getElementById("compile-button");
  if (compileButton) {
    compileButton.addEventListener("click", compileLYC);
  } else {
    console.error("Elemento 'compile-button' no encontrado en el DOM.");
  }

  // Asociar evento de copiar ejemplo
  const copyExampleButton = document.getElementById("copy-example-button");
  if (copyExampleButton) {
    copyExampleButton.addEventListener("click", () => {
      const exampleCode = document.getElementById("example-lyc-code").textContent.trim();
      navigator.clipboard.writeText(exampleCode).then(() => {
        alert("Código LYC copiado al portapapeles.");
      }).catch((error) => {
        console.error("Error al copiar el código:", error);
        alert("No se pudo copiar el código. Por favor, inténtalo manualmente.");
      });
    });
  } else {
    console.error("Elemento 'copy-example-button' no encontrado en el DOM.");
  }
});

/**
 * Función principal para compilar LYC a CSS.
 */
function compileLYC() {
  const codeInput = document.getElementById("code-input");
  if (!codeInput || !codeInput.value.trim()) {
    alert("Por favor, ingresa código LYC.");
    return;
  }

  const lycCode = codeInput.value;
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
 * @param {string} lycContent - Código LYC a procesar.
 * @returns {string} Código CSS procesado.
 */
function processLYC(lycContent) {
  let globalVariables = {};
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // Procesar variables globales
  const globalVarRegex = /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm;
  let match;
  while ((match = globalVarRegex.exec(lycContent)) !== null) {
    globalVariables[match[1]] = match[2].trim();
  }
  lycContent = lycContent.replace(globalVarRegex, '');

  // Procesar mixins (@mixin)
  const mixins = {};
  lycContent = lycContent.replace(/@mixin\s+([^{]+)\s*\{([^}]+)\}/g, (match, mixinName, mixinContent) => {
    mixins[mixinName.trim()] = mixinContent.trim();
    return "";
  });

  // Reemplazar @include con el contenido del mixin
  lycContent = lycContent.replace(/@include\s+([^{;]+)/g, (match, mixinName) => {
    const trimmedMixinName = mixinName.trim();
    const content = mixins[trimmedMixinName];
    if (!content) {
      throw new Error(`Mixin '${trimmedMixinName}' no definido.`);
    }
    return content;
  });

  // Procesar herencia (@extend)
  lycContent = lycContent.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (match, sourceClass, targetClass) => {
    const sourceStyles = lycContent.match(new RegExp(`${sourceClass}\\s*\\{([^}]+)\\}`, "g"));
    if (!sourceStyles) {
      throw new Error(`Clase '${sourceClass}' no encontrada para extender.`);
    }
    const styles = sourceStyles[0].replace(sourceClass, targetClass);
    return styles;
  });

  // Procesar bloques anidados
  const blocks = lycContent.split(/(@layer\s+\w+\s*\{|})/).filter(Boolean);
  let stack = [];
  let result = ''; // Variable para almacenar el resultado final
  for (const block of blocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;
    if (trimmedBlock === "{") {
      stack.push(result);
      result += " {";
    } else if (trimmedBlock === "}") {
      result += "}";
      if (stack.length > 0) {
        const parentBlock = stack.pop();
        result = parentBlock + result;
      }
    } else {
      result += processBlock(trimmedBlock, globalVariables);
    }
  }

  // Procesar cálculos matemáticos (calc())
  result = result.replace(/calc\(([^)]+)\)/g, (match, expression) => {
    try {
      const evaluatedResult = evaluateExpression(expression);
      return evaluatedResult.toString();
    } catch (error) {
      throw new Error(`Error al evaluar calc(): ${error.message}`);
    }
  });

  return minifyCSS(result);
}

/**
 * Procesar un bloque individual.
 * @param {string} blockContent - Contenido del bloque.
 * @param {Object} variables - Variables globales.
 * @returns {string} Bloque procesado.
 */
function processBlock(blockContent, variables) {
  let localVariables = {};
  const localVarRegex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;
  let match;
  while ((match = localVarRegex.exec(blockContent)) !== null) {
    localVariables[match[1]] = match[2].trim();
  }
  blockContent = blockContent.replace(localVarRegex, '');
  const combinedVariables = { ...variables, ...localVariables };
  for (const [varName, varValue] of Object.entries(combinedVariables)) {
    blockContent = blockContent.replace(new RegExp(`var\\(--${varName}\\)`, 'g'), varValue);
  }
  return blockContent;
}

/**
 * Minificar CSS.
 * @param {string} css - Código CSS a minificar.
 * @returns {string} Código CSS minificado.
 */
function minifyCSS(css) {
  return css.replace(/\s+/g, ' ').trim();
}

/**
 * Evaluar expresiones matemáticas simples.
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
