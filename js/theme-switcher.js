async function compileCode() {
    const codeInput = document.getElementById("codeInput").value;
    const compilerSelect = document.getElementById("compilerSelect").value;
    const outputDiv = document.getElementById("output");
    
    if (!codeInput.trim()) {
        outputDiv.innerText = "Error: No LYC code provided.";
        return;
    }

    const startTime = performance.now();

    try {
        let compiledCSS = processLYC(codeInput);
        const endTime = performance.now();
        const compileTime = (endTime - startTime).toFixed(2);

        outputDiv.innerHTML = `<strong>Compiled CSS:</strong><pre>${compiledCSS}</pre>`;
        document.getElementById("speedChart").innerText = `Compilation time: ${compileTime}ms`;
    } catch (error) {
        outputDiv.innerText = `Compilation Error: ${error.message}`;
    }
}

function processLYC(lycCode) {
    let processedCode = lycCode;
    
    // Eliminar comentarios
    processedCode = processedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Procesar variables globales
    let globalVariables = {};
    processedCode = processedCode.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, (match, varName, varValue) => {
        globalVariables[varName] = varValue.trim();
        return '';
    });
    
    // Aplicar variables
    for (const [varName, varValue] of Object.entries(globalVariables)) {
        processedCode = processedCode.replace(new RegExp(`var\(--${varName}\)`, 'g'), varValue);
    }
    
    // Minificar CSS resultante
    return processedCode.replace(/\s+/g, ' ').trim();
}
