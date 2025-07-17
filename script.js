// Variables globales
let currentLanguage = "en"; // Idioma predeterminado

/**
 * Carga las traducciones desde un archivo JSON según el idioma seleccionado.
 * @param {string} lang - Código del idioma (ej. 'es', 'en')
 */
async function loadTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) throw new Error(`Error al cargar ${lang}.json`);

    const translations = await response.json();

    Object.keys(translations).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (typeof translations[key] === "object") {
          element.innerHTML = Object.values(translations[key]).join("<br>");
        } else {
          element.textContent = translations[key];
        }
      }
    });

    currentLanguage = lang;
  } catch (error) {
    console.error("Error cargando traducciones:", error);
  }
}

/**
 * Inicializa eventos al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language-select");
  const compileButton = document.getElementById("compile-button");
  const copyExampleButton = document.getElementById("copy-example-button");

  if (languageSelect) {
    languageSelect.addEventListener("change", (e) => {
      loadTranslations(e.target.value);
    });
  }

  if (compileButton) {
    compileButton.addEventListener("click", compileLYC);
  }

  if (copyExampleButton) {
    copyExampleButton.addEventListener("click", () => {
      const exampleCode = document.getElementById("example-lyc-code").textContent.trim();
      navigator.clipboard.writeText(exampleCode)
        .then(() => alert("✅ Código copiado al portapapeles"))
        .catch(err => console.error("❌ Error al copiar:", err));
    });
  }

  // Cargar traducciones iniciales
  loadTranslations(currentLanguage);
});

/**
 * Compila el código LYC ingresado por el usuario a CSS
 */
function compileLYC() {
  const codeInput = document.getElementById("code-input");
  const outputElement = document.getElementById("output");

  if (!codeInput || !codeInput.value.trim()) {
    outputElement.textContent = "⚠️ Por favor, ingresa código LYC.";
    return;
  }

  try {
    const cssCode = processLYC(codeInput.value);
    outputElement.textContent = cssCode;
  } catch (error) {
    outputElement.textContent = `❌ Error de compilación: ${error.message}`;
  }
}

/**
 * Procesa el código LYC y lo transforma en CSS válido
 * @param {string} lycContent - Código fuente LYC
 * @returns {string} - Código CSS procesado
 */
function processLYC(lycContent) {
  let globalVariables = {};
  let result = "";

  // Eliminar comentarios
  lycContent = lycContent.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

  // Extraer variables globales
  const globalVarRegex = /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm;
  let match;
  while ((match = globalVarRegex.exec(lycContent)) !== null) {
    globalVariables[match[1]] = match[2].trim();
  }
  lycContent = lycContent.replace(globalVarRegex, "");

  // Procesar mixins (@mixin / @include)
  const mixins = {};
  lycContent = lycContent.replace(/@mixin\s+([^{]+)\s*\{([^}]+)\}/g, (full, name, content) => {
    mixins[name.trim()] = content.trim();
    return "";
  });

  lycContent = lycContent.replace(/@include\s+([^{;]+)/g, (full, name) => {
    const key = name.trim();
    if (!mixins[key]) throw new Error(`Mixin '${key}' no definido`);
    return mixins[key];
  });

  // Procesar herencia (@extend)
  lycContent = lycContent.replace(/@extend\s+([^{ ]+)\s+to\s+([^{ ]+)/g, (full, source, target) => {
    const sourceRegex = new RegExp(`${source}\\s*\\{([^}]*)\\}`, "g");
    const sourceMatch = lycContent.match(sourceRegex);
    if (!sourceMatch) throw new Error(`Clase fuente '${source}' no encontrada`);
    return sourceMatch[0].replace(source, target);
  });

  // Reemplazar variables globales
  for (const [key, value] of Object.entries(globalVariables)) {
    const regex = new RegExp(`var\$--${key}\$`, "g");
    lycContent = lycContent.replace(regex, value);
  }

  // Evaluar expresiones en calc()
  lycContent = lycContent.replace(/calc\(([^)]+)\)/g, (full, expr) => {
    try {
      return evaluateExpression(expr);
    } catch (err) {
      throw new Error(`Error evaluando calc(${expr}): ${err.message}`);
    }
  });

  // Minificar CSS
  result = minifyCSS(lycContent);

  return result;
}

/**
 * Evalúa expresiones matemáticas simples dentro de calc()
 * @param {string} expr - Expresión matemática
 * @returns {number|string} - Resultado evaluado
 */
function evaluateExpression(expr) {
  const sanitized = expr.replace(/\s+/g, '');
  return Function('"use strict";return (' + sanitized + ')')();
}

/**
 * Minifica el CSS generado
 * @param {string} css - Código CSS sin minificar
 * @returns {string} - Código CSS minificado
 */
function minifyCSS(css) {
  return css.replace(/\s+/g, " ").trim();
}
