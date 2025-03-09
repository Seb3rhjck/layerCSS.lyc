async function compileCode() {
    const codeInput = document.getElementById("codeInput").value;
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
        outputDiv.innerHTML += `<p>Compilation time: ${compileTime}ms</p>`;
    } catch (error) {
        outputDiv.innerText = `Compilation Error: ${error.message}`;
    }
}

function processLYC(lycCode) {
    let processedCode = lycCode;
    
    // Remove comments
    processedCode = processedCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    // Process global variables
    let globalVariables = {};
    processedCode = processedCode.replace(/^--([a-zA-Z0-9-]+):\s*([^;]+);/gm, (match, varName, varValue) => {
        globalVariables[varName] = varValue.trim();
        return '';
    });
    
    // Apply variables
    for (const [varName, varValue] of Object.entries(globalVariables)) {
        processedCode = processedCode.replace(new RegExp(`var\(--${varName}\)`, 'g'), varValue);
    }
    
    // Minify result
    return processedCode.replace(/\s+/g, ' ').trim();
}
