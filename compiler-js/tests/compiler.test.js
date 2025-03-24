// tests/compiler.test.js
const fs = require('fs');
const path = require('path');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Processor = require('../src/processor');

describe('Compilador LYC', () => {
  const inputFile = path.join(__dirname, '../examples/example1.lyc');
  const lycContent = fs.readFileSync(inputFile, 'utf-8');

  test('Lexer genera tokens correctamente', () => {
    const lexer = new Lexer(lycContent);
    const tokens = lexer.tokenize();
    expect(tokens).toHaveLength(expect.any(Number));
  });

  test('Parser construye AST correctamente', () => {
    const lexer = new Lexer(lycContent);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    expect(ast).toHaveProperty('type', 'Root');
    expect(ast.body).toHaveLength(expect.any(Number));
  });

  test('Processor genera CSS válido', () => {
    const lexer = new Lexer(lycContent);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const processor = new Processor(ast);
    const css = processor.generateCSS();
    expect(css).toContain(':root');
  });
});