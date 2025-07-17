// ===================
// 📘 CONFIGURACIÓN
// ===================

let currentLanguage = "en"; // Idioma por defecto

// ===================
// 🌐 Cargar traducciones desde i18n
// ===================
async function loadTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo JSON para el idioma ${lang}: ${response.status}`);
    }

    const translations = await response.json();

    Object.keys(translations).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        if (typeof translations[key] === "object") {
          element.innerHTML = Object.values(translations[key]).join("<br>");
        } else {
          element.innerHTML = translations[key];
        }
      } else {
        console.warn(`Elemento con ID '${key}' no encontrado en el DOM.`);
      }
    });

    currentLanguage = lang;
  } catch (error) {
    console.error("Error al cargar las traducciones:", error);
  }
}

// ===================
// 🧠 Inicialización
// ===================
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

  // Cargar traducción inicial
  loadTranslations(currentLanguage);

  // Botón compilar
  const compileButton = document.getElementById("compile-button");
  if (compileButton) {
    compileButton.addEventListener("click", compileLYC);
  } else {
    console.error("Elemento 'compile-button' no encontrado en el DOM.");
  }

  // Botón copiar ejemplo
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

// ===================
// 🔧 Compilar LYC
// ===================
function compileLYC() {
  const codeInput = document.getElementById("code-input");
  const outputElement = document.getElementById("output");

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

    if (outputElement) {
      outputElement.textContent = cssCode;
      console.log(`Compilado en ${compileTime} ms`);
    }
  } catch (error) {
    if (outputElement) {
      outputElement.textContent = `Error de compilación: ${error.message}`;
    }
    console.error("Error de compilación:", error);
  }
}

// ===================
// ⚙️ Procesador LYC
// ===================
function processLYC(lycContent) {
  let globalVariables = {};
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // === Variables globales
  const globalVarRegex = /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm;
  let match;
  while ((match = globalVarRegex.exec(lycContent)) !== null) {
    globalVariables[match[1]] = match[2].trim();
  }
  lycContent = lycContent.replace(globalVarRegex, '');

  // === Mixins
  const mixins = {};
  lycContent = lycContent.replace(/@mixin\s+([^{]+)\s*\{([^}]+)\}/g, (match, mixinName, mixinContent) => {
    mixins[mixinName.trim()] = mixinContent.trim();
    return "";
  });

  // === Includes
  lycContent = lycContent.replace(/@include\s+([^{;]+)/g, (match, mixinName) => {
    const trimmedMixinName = mixinName.trim();
    const content = mixins[trimmedMixinName];
    if (!content) throw new Error(`Mixin '${trimmedMixinName}' no definido.`);
    return content;
  });

  // === Herencia extend
  lycContent = lycContent.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (match, sourceClass, targetClass) => {
    const sourceStyles = lycContent.match(new RegExp(`${sourceClass}\\s*\\{([^}]+)\\}`, "g"));
    if (!sourceStyles) {
      throw new Error(`Clase '${sourceClass}' no encontrada para extender.`);
    }
    const styles = sourceStyles[0].replace(sourceClass, targetClass);
    return styles;
  });

  // === Procesamiento de bloques @layer
  const blocks = lycContent.split(/(@layer\s+\w+\s*\{|\})/).filter(Boolean);
  let result = '';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    if (block.startsWith('@layer')) {
      const layerName = block.match(/@layer\s+(\w+)/)[1];
      const layerContent = blocks[++i]?.trim() || '';
      result += `/* Layer: ${layerName} */\n`;
      result += processBlock(layerContent, globalVariables);
    } else if (block !== '}') {
      result += processBlock(block, globalVariables);
    }
  }

  // === calc()
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

// ===================
// 🔍 Procesar bloque individual
// ===================
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

// ===================
// 🔢 Evaluar expresiones matemáticas
// ===================
function evaluateExpression(expression) {
  const tokens = expression.split(/([+\-*/])/).map(t => t.trim()).filter(Boolean);
  let result = parseFloat(tokens[0]);
  let operator = null;

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (['+', '-', '*', '/'].includes(token)) {
      operator = token;
    } else {
      const value = parseFloat(token);
      if (isNaN(value)) throw new Error(`Valor inválido: ${token}`);

      switch (operator) {
        case '+': result += value; break;
        case '-': result -= value; break;
        case '*': result *= value; break;
        case '/':
          if (value === 0) throw new Error("División por cero.");
          result /= value;
          break;
      }
    }
  }

  return result;
}

// ===================
// 🔽 Minificar CSS
// ===================
function minifyCSS(css) {
  return css.replace(/\s+/g, ' ').trim();
}
