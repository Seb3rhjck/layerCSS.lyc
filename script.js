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

    // Cargar ejemplos tras actualizar las traducciones
    loadExamples(translations);

    // Actualizar idioma actual
    currentLanguage = lang;
  } catch (error) {
    console.error("Error al cargar las traducciones:", error);
  }
}

/**
 * Función para cargar ejemplos desde un archivo JSON.
 * @param {Object} translations - Objeto con las traducciones cargadas.
 */

/**
 * Evento para cambiar el idioma mediante el selector.
 */
document.getElementById("language-select").addEventListener("change", (event) => {
  const lang = event.target.value;
  loadTranslations(lang);
});

/**
 * Inicialización del script al cargar el DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations(currentLanguage);
});

/**
 * Función para compilar LYC a CSS.
 */
document.getElementById("compile-button").addEventListener("click", () => {
  const lycCode = document.getElementById("code-input").value;
  if (!lycCode.trim()) {
    alert("Por favor, ingresa código LYC.");
    return;
  }

  const startTime = performance.now();
  try {
    const cssCode = processLYC(lycCode);
    const endTime = performance.now();
    const compileTime = (endTime - startTime).toFixed(2);
    document.getElementById("output").textContent = cssCode;
    document.getElementById("compilation-time").textContent = `Tiempo de compilación: ${compileTime} ms`;
  } catch (error) {
    document.getElementById("output").textContent = `Error de compilación: ${error.message}`;
  }
});

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
  let globalVariables = {};
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

  // 6. Minificar resultado
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
