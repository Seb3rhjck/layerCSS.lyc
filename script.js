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
// ---------- NEW processLYC (drop-in) ----------
function processLYC(lycContent) {
  let css = '';

  // 1. Strip comments
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // 2. Global variables
  const globalVars = {};
  lycContent = lycContent.replace(/^--([a-zA-Z0-9-]+)\s*:\s*([^;]+);?/gm, (_, k, v) => {
    globalVars[k] = v.trim();
    return '';
  });

  // 3. Mixins
  const mixins = {};
  lycContent = lycContent.replace(/@mixin\s+([^{]+)\s*\{([^}]*)\}/g, (_, name, body) => {
    mixins[name.trim()] = body.trim();
    return '';
  });

  // 4. Replace @include
  lycContent = lycContent.replace(/@include\s+([^;{]+)/g, (_, name) => {
    const key = name.trim();
    if (!mixins[key]) throw new Error(`Mixin '${key}' no definido.`);
    return mixins[key];
  });

  // 5. Replace variables
  const vars = { ...globalVars };
  const replacer = str => str.replace(/var\(--([a-zA-Z0-9-]+)\)/g, (_, k) => vars[k] || `var(--${k})`);

  // 6. @extend
  const extendMap = new Map();
  lycContent = lycContent.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (_, src, dst) => {
    extendMap.set(dst.trim(), src.trim());
    return '';
  });

  // 7. Split into blocks and build CSS
  const blocks = lycContent.split(/(@layer\s+\w+\s*\{|})/).filter(Boolean);
  const stack = [];
  let result = '';

  for (const block of blocks) {
    const t = block.trim();
    if (t === '{') {
      stack.push(result);
      result += ' {';
    } else if (t === '}') {
      result += '}';
      if (stack.length) result = stack.pop() + result;
    } else if (t.startsWith('@layer')) {
      result += t.replace(/@layer\s+(\w+)/, '/* @layer $1 */');
    } else {
      // resolve variables & calc
      let cssBlock = replacer(t);
      // delegate calc to browser
      const style = document.createElement('div').style;
      style.cssText = cssBlock.replace(/calc\([^)]+\)/g, m => {
        style.cssText = `width:${m}`;
        return style.width;
      });
      result += cssBlock;
    }
  }

  // 8. Apply @extend by copying rules
  extendMap.forEach((src, dst) => {
    const re = new RegExp(`([^{}]+)${src}\\s*\\{([^}]*)\\}`, 'g');
    let m;
    while ((m = re.exec(result)) !== null) {
      result += `${m[1]}${dst}{${m[2]}}`;
    }
  });

  // 9. Minify
  return result
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .trim();
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
