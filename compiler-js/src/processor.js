// src/processor.js
class Processor {
  constructor(ast) {
    this.ast = ast;
    this.cssOutput = "";
    this.globalVariables = {};
    this.localVariablesStack = [];
    this.mixins = {};
  }

  generateCSS() {
    this.ast.body.forEach(node => {
      switch (node.type) {
        case "VariableDeclaration":
          this._processGlobalVariable(node);
          break;
        case "MixinDeclaration":
          this._storeMixin(node);
          break;
        case "Selector":
          this._processSelector(node);
          break;
        case "Keyframes":
          this._processKeyframes(node);
          break;
      }
    });
    return this.cssOutput.trim();
  }

  _processGlobalVariable(node) {
    this.globalVariables[node.name] = node.value;
  }

  _storeMixin(node) {
    this.mixins[node.name] = node.properties;
  }

  _processSelector(node) {
    this.localVariablesStack.push({});
    const properties = node.properties.map(prop => this._processProperty(prop)).join(" ");
    this.cssOutput += `${node.name} { ${properties} }\n`;
    this.localVariablesStack.pop();
  }

  _processKeyframes(node) {
    let keyframes = `@keyframes ${node.name} {\n`;
    node.steps.forEach(step => {
      keyframes += `${step.step} { ${step.properties.map(prop => this._processProperty(prop)).join(" ")} }\n`;
    });
    keyframes += "}\n";
    this.cssOutput += keyframes;
  }

  _processProperty(prop) {
    if (prop.type === "LocalVariable") {
      const value = this._resolveVariable(prop.value);
      this.localVariablesStack[this.localVariablesStack.length - 1][prop.name] = value;
      return "";
    } else if (prop.type === "MixinInclude") {
      const mixin = this.mixins[prop.name];
      if (!mixin) throw new Error(`Mixin '${prop.name}' no definido.`);
      return mixin.map(p => this._processProperty(p)).join(" ");
    } else if (prop.type === "Property") {
      const value = prop.value.replace(/var\(--([a-zA-Z0-9-]+)\)/g, (_, varName) =>
        this._resolveVariable(varName)
      );
      return `${prop.name}: ${value};`;
    }
  }

  _resolveVariable(varName) {
    for (let i = this.localVariablesStack.length - 1; i >= 0; i--) {
      if (this.localVariablesStack[i][varName]) return this.localVariablesStack[i][varName];
    }
    return this.globalVariables[varName] || `var(--${varName})`;
  }
}

module.exports = Processor;