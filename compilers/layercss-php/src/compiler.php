<?php

function compileLYC($inputFile, $outputFile) {
    try {
        $lycContent = file_get_contents($inputFile);
        $cssContent = processLYC($lycContent);
        file_put_contents($outputFile, $cssContent);
        echo "Archivo CSS generado: $outputFile\n";
    } catch (Exception $e) {
        echo "Error al compilar: " . $e->getMessage() . "\n";
    }
}

function processLYC($lycContent) {
    $cssOutput = "";
    $globalVariables = [];

    // Eliminar comentarios
    $lycContent = preg_replace('/\/\/.*|\/\*[\s\S]*?\*\//', '', $lycContent);

    // Procesar variables globales
    if (preg_match_all('/^--([a-zA-Z0-9-]+):\s*([^;]+);/m', $lycContent, $matches)) {
        foreach ($matches[1] as $index => $varName) {
            $globalVariables[$varName] = trim($matches[2][$index]);
        }
    }
    $lycContent = preg_replace('/^--([a-zA-Z0-9-]+):\s*([^;]+);/m', '', $lycContent);

    // Procesar bloques
    $blocks = preg_split('/(@layer\s+\w+\s*\{|})/', $lycContent, -1, PREG_SPLIT_DELIM_CAPTURE);
    $stack = [];
    $currentBlock = "";

    foreach ($blocks as $block) {
        $block = trim($block);
        if (empty($block)) continue;

        if ($block === "{") {
            // Inicio de un bloque
            $stack[] = $currentBlock;
            $currentBlock .= " {";
        } elseif ($block === "}") {
            // Fin de un bloque
            $currentBlock .= "}";
            if (count($stack) > 0) {
                $parentBlock = array_pop($stack);
                $currentBlock = $parentBlock . $currentBlock;
            }
            // Agregar el bloque completo al CSS de salida
            $cssOutput .= $currentBlock;
            $currentBlock = ""; // Reiniciar el bloque actual
        } else {
            // Bloque normal
            $currentBlock = processBlock($block, $globalVariables);
            $cssOutput .= $currentBlock;
        }
    }

    return minifyCSS($cssOutput);
}

function processBlock($blockContent, $variables) {
    $localVariables = [];

    // Procesar variables locales
    if (preg_match_all('/--([a-zA-Z0-9-]+):\s*([^;]+);/', $blockContent, $matches)) {
        foreach ($matches[1] as $index => $varName) {
            $localVariables[$varName] = trim($matches[2][$index]);
        }
    }
    $blockContent = preg_replace('/--([a-zAZ0-9-]+):\s*([^;]+);/', '', $blockContent);

    // Combinar variables locales y globales
    $combinedVariables = array_merge($variables, $localVariables);

    // Reemplazar variables
    foreach ($combinedVariables as $varName => $varValue) {
        $blockContent = preg_replace("/var\\(--$varName\\)/", $varValue, $blockContent);
    }

    return $blockContent;
}

function minifyCSS($css) {
    return preg_replace('/\s+/', ' ', trim($css));
}

// Ejecutar el compilador
$inputFile = __DIR__ . '/../examples/example1.lyc';
$outputFile = __DIR__ . '/../examples/example1.css';
compileLYC($inputFile, $outputFile);