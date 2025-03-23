function parse(tokens) {
  const ast = [];
  let currentBlock = null;
  let pendingTokens = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'GLOBAL_VAR') {
      const [name, value] = token.value.split(':').map(part => part.trim());
      ast.push({ type: 'GLOBAL_VAR', name, value: value.replace(';', '') });

    } else if (token.type === 'MIXIN_DEF') {
      const mixinName = token.value.match(/@mixin\s+([a-zA-Z0-9-]+)/)[1];
      ast.push({ type: 'MIXIN_DEF', name: mixinName, content: [] });

    } if (token.type === 'PROPERTY' && i > 0 && tokens[i - 1].type !== 'SELECTOR') {
        console.log(`🚨 Corrección: Asignando SELECTOR a -> ${tokens[i - 1].value}`);
        tokens[i - 1].type = 'SELECTOR';
    }

      currentBlock = { type: 'BLOCK', selector: token.value.replace('{', '').trim(), declarations: [] };
      pendingTokens = [];

    } else if (currentBlock && token.type === 'PROPERTY' && tokens[i + 1]?.type === 'VALUE') {
      const property = token.value.replace(':', '').trim();
      const value = tokens[i + 1].value.trim();
      currentBlock.declarations.push({ property, value });
      pendingTokens.push(`${property}: ${value}`);
      i++;

    } else if (token.type === 'BLOCK_END') {
      if (currentBlock) {
        if (currentBlock.declarations.length > 0) {
          ast.push(currentBlock);
        } else {
          console.warn(`Bloque vacío detectado: ${currentBlock.selector}`);
        }
        currentBlock = null;
      }
    }
  }

  return ast;
}
module.exports = { parse };
