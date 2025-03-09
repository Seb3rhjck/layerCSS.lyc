// Cambio de idioma
const translations = {
  es: {
    aboutTitle: "Acerca de LayerCSS",
    aboutDescription: "LayerCSS es un lenguaje de programación diseñado para simplificar la creación de estilos CSS.",
    compilerTitle: "Compilador LYC a CSS",
    examplesTitle: "Ejemplos"
  },
  en: {
    aboutTitle: "About LayerCSS",
    aboutDescription: "LayerCSS is a programming language designed to simplify the creation of CSS styles.",
    compilerTitle: "LYC to CSS Compiler",
    examplesTitle: "Examples"
  },
  it: {
    aboutTitle: "Informazioni su LayerCSS",
    aboutDescription: "LayerCSS è un linguaggio di programmazione progettato per semplificare la creazione di stili CSS.",
    compilerTitle: "Compilatore LYC a CSS",
    examplesTitle: "Esempi"
  },
  zh: {
    aboutTitle: "关于 LayerCSS",
    aboutDescription: "LayerCSS 是一种旨在简化 CSS 样式创建的编程语言。",
    compilerTitle: "LYC 到 CSS 编译器",
    examplesTitle: "示例"
  },
  ru: {
    aboutTitle: "О LayerCSS",
    aboutDescription: "LayerCSS — это язык программирования, предназначенный для упрощения создания стилей CSS.",
    compilerTitle: "Компилятор LYC в CSS",
    examplesTitle: "Примеры"
  }
};

document.getElementById("language-selector").addEventListener("change", (event) => {
  const lang = event.target.value;
  document.getElementById("about-title").textContent = translations[lang].aboutTitle;
  document.getElementById("about-description").textContent = translations[lang].aboutDescription;
  document.getElementById("compiler-title").textContent = translations[lang].compilerTitle;
  document.getElementById("examples-title").textContent = translations[lang].examplesTitle;
});

// Compilador LYC a CSS
document.getElementById("compile-button").addEventListener("click", () => {
  const lycCode = document.getElementById("lyc-input").value;
  const startTime = performance.now();
  const cssCode = compileLYCtoCSS(lycCode);
  const endTime = performance.now();
  document.getElementById("css-output").textContent = cssCode;
  document.getElementById("compilation-time").textContent = `Tiempo de compilación: ${(endTime - startTime).toFixed(2)} ms`;
});

function compileLYCtoCSS(lycCode) {
  // Implementa aquí la lógica de compilación LYC a CSS
  // Por ahora, retornamos el mismo código como ejemplo
  return lycCode.replace(/lyc/g, "css");
}

// Ejemplo de configuración
const examples = [
  { title: "Ejemplo 1", code: "lyc { color: red; }" },
  { title: "Ejemplo 2", code: "lyc { background-color: blue; }" }
];

const exampleContainer = document.getElementById("example-container");
examples.forEach((example) => {
  const div = document.createElement("div");
  div.innerHTML = `<h3>${example.title}</h3><pre>${example.code}</pre>`;
  exampleContainer.appendChild(div);
});
