// src/parser.js
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  parse() {
    const ast = { type: "Root", body: [] };
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index];
      if (!token) {
        throw new Error(`Token indefinido en índice ${this.index}`);
      }

      try {
        if (token.type === "GLOBAL_VAR") {
          ast.body.push(this._parseVariable(token));
        } else if (token.type === "MIXIN_DEF") {
          ast.body.push(this._parseMixin(token));
        } else if (token.type === "SELECTOR") {
          ast.body.push(this._parseSelector(token));
        } else if (token.type === "KEYFRAMES") {
          ast.body.push(this._parseKeyframes(token));
        } else {
          // Ignorar comentarios y otros tokens irrelevantes
          this.index++;
        }
      } catch (error) {
        console.error(`Error al procesar token ${this.index}:`, token);
        throw error;
      }
    }
    return ast;
  }

  _parseVariable(token) {
    const [name, value] = token.value.split(":").map(s => s.trim());
    return { type: "VariableDeclaration", name, value };
  }

  _parseMixin(token) {
    const name = token.value.match(/@mixin\s+([a-zA-Z0-9-]+)/)[1];
    this.index++; // Saltar al contenido del mixin
    const properties = this._parseProperties();
    return { type: "MixinDeclaration", name, properties };
  }

  _parseSelector(token) {
    const name = token.value.replace("{", "").trim();
    this.index++; // Saltar al contenido del selector
    const properties = this._parseProperties();
    return { type: "Selector", name, properties };
  }

  _parseKeyframes(token) {
    const name = token.value.match(/@keyframes\s+([a-zA-Z0-9-]+)/)[1];
    this.index++; // Saltar al contenido de @keyframes
    const steps = this._parseSteps();
    return { type: "Keyframes", name, steps };
  }

  _parseProperties() {
    const properties = [];
    while (this.tokens[this.index]?.type !== "BLOCK_END") {
      const token = this.tokens[this.index];
      if (!token) {
        throw new Error(`Token indefinido en índice ${this.index}`);
      }

      if (token.type === "PROPERTY") {
        const [name, value] = token.value.split(":").map(s => s.trim());
        properties.push({ type: "Property", name, value });
      } else if (token.type === "LOCAL_VAR") {
        const [name, value] = token.value.split(":").map(s => s.trim());
        properties.push({ type: "LocalVariable", name, value });
      } else if (token.type === "MIXIN_INCLUDE") {
        const name = token.value.match(/@include\s+([a-zA-Z0-9-]+)/)[1];
        properties.push({ type: "MixinInclude", name });
      } else {
        throw new Error(`Token inesperado en índice ${this.index}: ${token.type}`);
      }
      this.index++;
    }
    this.index++; // Saltar el bloque de cierre
    return properties;
  }

  _parseSteps() {
    const steps = [];
    while (this.tokens[this.index]?.type !== "BLOCK_END") {
      const step = this.tokens[this.index].value;
      this.index++; // Saltar al contenido del paso
      const properties = this._parseProperties();
      steps.push({ step, properties });
    }
    this.index++; // Saltar el bloque de cierre
    return steps;
  }
}

module.exports = Parser;