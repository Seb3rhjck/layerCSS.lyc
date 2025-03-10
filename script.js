// Variables globales
let currentLanguage = "es"; // Idioma predeterminado

// Función para cargar traducciones
async function loadTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    const translations = await response.json();
    document.getElementById("about-title").textContent = translations.aboutTitle;
    document.getElementById("about-description").textContent = translations.aboutDescription;
    document.getElementById("compiler-title").textContent = translations.compilerTitle;
    document.getElementById("examples-title").textContent = translations.examplesTitle;
    document.getElementById("compile-button").textContent = translations.compileButton;

    // Actualizar texto de los ejemplos
    loadExamples(translations);
    currentLanguage = lang;
  } catch (error) {
    console.error("Error al cargar las traducciones:", error);
  }
}

// Función para cargar ejemplos
async function loadExamples(translations) {
  try {
    const response = await fetch("examples/examples.json");
    const examples = await response.json();
    const container = document.getElementById("example-container");
    container.innerHTML = ""; // Limpiar contenedor

    examples.forEach(async (example) => {
      const lycResponse = await fetch(example.lycFile);
      const cssResponse = await fetch(example.cssFile);
      const lycCode = await lycResponse.text();
      const cssCode = await cssResponse.text();

      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${translations[example.titleKey]}</h3>
        <p>${translations[example.descriptionKey]}</p>
        <pre><strong>LYC:</strong>\n${lycCode}</pre>
        <pre><strong>CSS:</strong>\n${cssCode}</pre>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar los ejemplos:", error);
  }
}

// Función para compilar LYC a CSS
document.getElementById("compile-button").addEventListener("click", () => {
  const lycCode = document.getElementById("lyc-input").value;
  if (!lycCode.trim()) {
    alert("Por favor, ingresa código LYC.");
    return;
  }

  const startTime = performance.now();
  try {
    const cssCode = processLYC(lycCode);
    const endTime = performance.now();
    const compileTime = (endTime - startTime).toFixed(2);

    document.getElementById("css-output").textContent = cssCode;
    document.getElementById("compilation-time").textContent = `Tiempo de compilación: ${compileTime} ms`;
  } catch (error) {
    document.getElementById("css-output").textContent = `Error de compilación: ${error.message}`;
  }
});

// Compilador LYC a CSS
function processLYC(lycCode) {
  let processedCode = lycCode;

  // 1. Eliminar comentarios
  processedCode = processedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

  // 2. Procesar variables globales
  let globalVariables = {};
  processedCode = processedCode.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, (match, varName, varValue) => {
    globalVariables[varName] = varValue.trim();
    return '';
  });

  // 3. Aplicar variables globales
  for (const [varName, varValue] of Object.entries(globalVariables)) {
    processedCode = processedCode.replace(new RegExp(`var\\(--${varName}\\)`, 'g'), varValue);
  }

  // 4. Procesar bloques anidados
  processedCode = processNestedBlocks(processedCode);

  // 5. Procesar capas (@layer)
  processedCode = processLayers(processedCode);

  // 6. Minificar resultado
  return processedCode.replace(/\s+/g, ' ').trim();
}

// Función para procesar bloques anidados
function processNestedBlocks(code) {
  const nestedBlockRegex = /([^{]+)\{([^}]+)\}/g;
  let result = code;
  let match;

  while ((match = nestedBlockRegex.exec(code)) !== null) {
    const parentSelector = match[1].trim();
    const childContent = match[2].trim();

    // Buscar selectores hijos dentro del bloque
    const childSelectors = childContent.split(';').map(line => line.trim()).filter(line => line);
    const processedChildren = childSelectors.map(selectorLine => {
      const [childSelector, ...styles] = selectorLine.split('{');
      if (!childSelector) return '';

      const fullSelector = `${parentSelector} ${childSelector.trim()}`;
      const styleContent = styles.join('{').replace(/}/g, '');
      return `${fullSelector} { ${styleContent} }`;
    }).join(' ');

    // Reemplazar el bloque original con el procesado
    result = result.replace(match[0], processedChildren);
  }

  return result;
}

// Función para procesar capas (@layer)
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

// Evento para cambiar idioma
document.getElementById("language-selector").addEventListener("change", (event) => {
  const lang = event.target.value;
  loadTranslations(lang);
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations(currentLanguage);
});
