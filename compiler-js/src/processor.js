function processAST(ast) {
  const output = [];
  ast.forEach(node => {
    if (node.type === 'BLOCK') {
      if (node.declarations.length === 0) {
        console.warn(`Bloque sin propiedades, ignorado: ${node.selector}`);
      } else {
        const declarations = node.declarations.map(({ property, value }) => `${property}: ${value}`).join('; ');
        console.log(`Generando CSS para ${node.selector}`);
        output.push(`${node.selector} { ${declarations} }`);
      }
    }
  });

  return output.join('\n');
}

module.exports = { processAST };
