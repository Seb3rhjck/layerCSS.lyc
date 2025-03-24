// src/lexer.js
class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = [];
    this.currentPosition = 0;
  }

  tokenize() {
    const patterns = [
      { type: "COMMENT", regex: /\/\*[\s\S]*?\*\//g }, // Comentarios multilínea
      { type: "GLOBAL_VAR", regex: /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm }, // Variables globales
      { type: "LOCAL_VAR", regex: /^--([a-zA-Z0-9-]+):\s*([^;]+);/gm }, // Variables locales
      { type: "MIXIN_DEF", regex: /^@mixin\s+([a-zA-Z0-9-]+)\s*\{/gm }, // Definición de mixin
      { type: "MIXIN_INCLUDE", regex: /^@include\s+([a-zA-Z0-9-]+)/gm }, // Inclusión de mixin
      { type: "EXTEND", regex: /^@extend\s+([a-zA-Z0-9-.]+)/gm }, // Herencia
      { type: "LAYER", regex: /^@layer\s+([a-zA-Z0-9-]+)\s*\{/gm }, // Capas
      { type: "KEYFRAMES", regex: /^@keyframes\s+([a-zA-Z0-9-]+)\s*\{/gm }, // Animaciones
      { type: "BLOCK_START", regex: /\{/g }, // Bloque de inicio
      { type: "BLOCK_END", regex: /\}/g }, // Bloque de fin
      { type: "PROPERTY", regex: /^[a-zA-Z-]+\s*:\s*[^;]+;/gm }, // Propiedades CSS
      { type: "SELECTOR", regex: /^[a-zA-Z0-9-_\.\#\[\]:, ]+\s*\{/gm }, // Selectores
    ];

    let remainingInput = this.input.trim();
    while (remainingInput.length > 0) {
      let matched = false;
      for (const { type, regex } of patterns) {
        const match = remainingInput.match(regex);
        if (match) {
          this.tokens.push({ type, value: match[0].trim() });
          remainingInput = remainingInput.slice(match[0].length).trim();
          matched = true;
          break;
        }
      }
      if (!matched) {
        throw new Error(`Error de sintaxis cerca de: ${remainingInput.slice(0, 10)}...`);
      }
    }

    console.debug("Tokens generados:", this.tokens);
    return this.tokens;
  }
}

module.exports = Lexer;