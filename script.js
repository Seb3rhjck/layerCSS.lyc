// Variables globales
let currentLanguage = "es"; // Idioma predeterminado

// Función para cargar traducciones
async function loadTranslations(lang) {
  try {
    const response = await fetch(`i18n/${lang}.json`);
    const translations = await response.json();

    // Actualizar texto en la página
    document.getElementById("about-title").textContent = translations.aboutTitle;
    document.getElementById("about-description").textContent = translations.aboutDescription;
    document.getElementById("compiler-title").textContent = translations.compilerTitle;
    document.getElementById("examples-title").textContent = translations.examplesTitle;
    document.getElementById("compile-button").textContent = translations.compileButton;

    // Actualizar características clave
    const featuresList = document.querySelector("#about ul");
    featuresList.innerHTML = `
      <li><strong>${translations.features.globalVariables}</strong></li>
      <li><strong>${translations.features.nestedBlocks}</strong></li>
      <li><strong>${translations.features.layers}</strong></li>
      <li><strong>${translations.features.comments}</strong></li>
      <li><strong>${translations.features.animations}</strong></li>
    `;

    // Actualizar filosofía
    const philosophyList = document.querySelector("#about ul:nth-of-type(2)");
    philosophyList.innerHTML = `
      <li><strong>${translations.philosophy.modularity}</strong></li>
      <li><strong>${translations.philosophy.reusability}</strong></li>
      <li><strong>${translations.philosophy.maintainability}</strong></li>
    `;

    // Actualizar tabla de comparación
    const comparisonTable = document.querySelector("#about table tbody");
    comparisonTable.innerHTML = `
      <tr>
        <td>${translations.comparison.simplicity}</td>
        <td>Alta</td>
        <td>Media</td>
        <td>Media</td>
        <td>Baja</td>
      </tr>
      <tr>
        <td>${translations.comparison.lightweight}</td>
        <td>No</td>
        <td>No</td>
        <td>Sí (con plugins)</td>
        <td>Sí</td>
      </tr>
      <tr>
        <td>${translations.comparison.compatibility}</td>
        <td>Sí</td>
        <td>Sí</td>
        <td>Sí</td>
        <td>Sí</td>
      </tr>
    `;

    // Actualizar ejemplos
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

// Resto del código sin cambios...
