"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function compileLYC(inputFile, outputFile) {
    try {
        const lycContent = fs.readFileSync(inputFile, 'utf-8');
        validateLYC(lycContent);
        const cssContent = processLYC(lycContent);
        fs.writeFileSync(outputFile, cssContent);
        console.log(`Archivo CSS generado: ${outputFile}`);
    }
    catch (error) {
        console.error(`Error al compilar: ${error.message}`);
    }
}
function processLYC(lycContent) {
    let cssOutput = '';
    const variables = {};
    // Dividir el contenido en bloques
    const blocks = lycContent.split(/@(\w+)\s*\{/).filter(block => block.trim() !== '');
    for (let i = 0; i < blocks.length; i += 2) {
        const blockType = blocks[i].trim();
        const blockContent = blocks[i + 1].replace(/\}\s*$/, '').trim();
        switch (blockType) {
            case 'variables':
                blockContent.split(';').forEach(line => {
                    const [key, value] = line.split(':').map(part => part.trim());
                    if (key && value)
                        variables[key] = value;
                });
                break;
            case 'base':
            case 'component':
            case 'layer':
            case 'theme':
            case 'custom':
                let processedBlock = blockContent.replace(/\$(\w+)/g, (_, varName) => variables[varName] || '');
                processedBlock = processMediaQueries(processedBlock);
                cssOutput += `${processedBlock}\n`;
                break;
            default:
                console.warn(`Bloque desconocido: @${blockType}`);
        }
    }
    return minifyCSS(cssOutput);
}
function processMediaQueries(blockContent) {
    return blockContent.replace(/@media\s*\((.*?)\)\s*\{(.*?)\}/gs, (_, query, styles) => {
        return `@media (${query}) { ${styles.trim()} }`;
    });
}
function minifyCSS(css) {
    return css.replace(/\s+/g, ' ').trim();
}
function validateLYC(lycContent) {
    if (!/@variables\s*\{/.test(lycContent)) {
        throw new Error("El archivo .lyc debe contener un bloque @variables.");
    }
}
// Ejecutar el compilador
const inputFile = path.join(__dirname, '../examples/example1.lyc');
const outputFile = path.join(__dirname, '../examples/example1.css');
compileLYC(inputFile, outputFile);
