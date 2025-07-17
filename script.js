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
  // Limpiar comentarios
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // Capturar y eliminar todas las variables globales
  const globalVarRegex = /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm;
  let match;
  while ((match = globalVarRegex.exec(lycContent)) !== null) {
    globalVariables[match[1]] = match[2].trim();
  }
  lycContent = lycContent.replace(globalVarRegex, '').trim();

  // Procesar mixins
  const mixins = {};
  lycContent = lycContent.replace(/@mixin\s+([^{]+)\s*\{([^}]+)\}/g, (match, name, content) => {
    mixins[name.trim()] = content.trim();
    return "";
  });

  // Reemplazar @include
  lycContent = lycContent.replace(/@include\s+([^{;]+)/g, (match, name) => {
    const trimmedName = name.trim();
    if (!mixins[trimmedName]) throw new Error(`Mixin '${trimmedName}' no definido`);
    return mixins[trimmedName];
  });

  // Procesar herencia (@extend)
  lycContent = lycContent.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (match, source, target) => {
    const sourceRegex = new RegExp(`${source}\\s*\\{([^}]*)\\}`, 'g');
    const sourceMatch = lycContent.match(sourceRegex);
    if (!sourceMatch) throw new Error(`Clase fuente '${source}' no encontrada`);
    return sourceMatch[0].replace(source, target);
  });

  // Reemplazar variables
  for (const [key, value] of Object.entries(globalVariables)) {
    const regex = new RegExp(`var\$--${key}\$`, 'g');
    lycContent = lycContent.replace(regex, value);
  }

  // Evaluar calc()
  lycContent = lycContent.replace(/calc\(([^)]+)\)/g, (match, expr) => {
    try {
      return evaluateExpression(expr);
    } catch (e) {
      throw new Error(`Error en calc(${expr}): ${e.message}`);
    }
  });

  return minifyCSS(lycContent);
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
