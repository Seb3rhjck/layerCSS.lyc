function tokenize(input) {
    const tokens = [];
    let remaining = input;

const patterns = [
    { type: 'COMMENT', regex: /^\/\*[\s\S]*?\*\// },
    { type: 'GLOBAL_VAR', regex: /^--([a-zA-Z0-9-_]+):\s*([^;]+);/ },
    { type: 'MIXIN_DEF', regex: /^@mixin\s+([a-zA-Z0-9-_]+)\s*\{/ },
    { type: 'MIXIN_INCLUDE', regex: /^@include\s+([a-zA-Z0-9-_]+);/ },
    { type: 'EXTEND', regex: /^@extend\s+([a-zA-Z0-9-_]+);/ },
    { type: 'LAYER', regex: /^@layer\s+([a-zA-Z0-9-_]+)\s*\{/ },

    // 📌 Agregamos una regla clara para detectar selectores
    { type: 'SELECTOR', regex: /^([.#]?[a-zA-Z_][a-zA-Z0-9-_,\s]*)\s*\{/ },

    { type: 'PROPERTY', regex: /^([a-zA-Z-]+)\s*:/ },
    { type: 'VALUE', regex: /^([^;]+);/ },
    { type: 'BLOCK_END', regex: /^\}/ }
];

    while (remaining.length > 0) {
        remaining = remaining.trim();
        let matched = false;

        for (const pattern of patterns) {
            const match = remaining.match(pattern.regex);
            if (match) {
                tokens.push({ type: pattern.type, value: match[0].trim() });

                console.log(`🟢 Token detectado: ${pattern.type} -> ${match[0].trim()}`); // 🛠 Depuración en vivo

                remaining = remaining.slice(match[0].length);
                matched = true;
                break;
            }
        }

        if (!matched) {
            throw new Error(`❌ Token no reconocido: "${remaining.substring(0, 20)}..."`);
        }
    }

    // 🔍 Comprobación de `SELECTOR`
    const hasSelector = tokens.some(t => t.type === 'SELECTOR');
    if (!hasSelector) {
        console.error("🚨 No se detectaron `SELECTOR`. Tokens actuales:");
        tokens.forEach(token => console.log(`   - ${token.type}: ${token.value}`));
        throw new Error('❌ No se detectaron selectores en los tokens. Verifica la sintaxis del código LYC.');
    }

    return tokens;
}

module.exports = { tokenize };
