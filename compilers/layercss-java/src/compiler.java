import java.io.*;
import java.util.HashMap;
import java.util.regex.*;

public class Compiler {
    public static void main(String[] args) {
        String inputFile = "examples/example1.lyc";
        String outputFile = "examples/example1.css";
        compileLYC(inputFile, outputFile);
    }

    public static void compileLYC(String inputFile, String outputFile) {
        try {
            String lycContent = readFile(inputFile);
            String cssContent = processLYC(lycContent);
            writeFile(outputFile, cssContent);
            System.out.println("Archivo CSS generado: " + outputFile);
        } catch (Exception e) {
            System.err.println("Error al compilar: " + e.getMessage());
        }
    }

    private static String processLYC(String lycContent) {
        StringBuilder cssOutput = new StringBuilder();
        HashMap<String, String> globalVariables = new HashMap<>();

        // Eliminar comentarios
        lycContent = lycContent.replaceAll("//.*|/\\*[^*]*\\*/", "");

        // Procesar variables globales
        Pattern globalVarPattern = Pattern.compile("^--([a-zA-Z0-9-]+):\\s*([^;]+);", Pattern.MULTILINE);
        Matcher globalVarMatcher = globalVarPattern.matcher(lycContent);
        while (globalVarMatcher.find()) {
            globalVariables.put(globalVarMatcher.group(1), globalVarMatcher.group(2));
        }
        lycContent = lycContent.replaceAll("^--([a-zA-Z0-9-]+):\\s*([^;]+);", "").trim();

        // Procesar bloques
        String[] blocks = lycContent.split("@layer\\s+\\w+\\s*\\{|\\}");
        for (String block : blocks) {
            if (!block.trim().isEmpty()) {
                cssOutput.append(processBlock(block.trim(), globalVariables));
            }
        }

        return minifyCSS(cssOutput.toString());
    }

    private static String processBlock(String blockContent, HashMap<String, String> variables) {
    HashMap<String, String> localVariables = new HashMap<>();

    // Procesar variables locales
    Pattern localVarPattern = Pattern.compile("--([a-zA-Z0-9-]+):\\s*([^;]+);");
    Matcher localVarMatcher = localVarPattern.matcher(blockContent);
    while (localVarMatcher.find()) {
        localVariables.put(localVarMatcher.group(1), localVarMatcher.group(2).trim());
    }
    blockContent = blockContent.replaceAll("--([a-zA-Z0-9-]+):\\s*([^;]+);", "");

    // Combinar variables locales y globales
    HashMap<String, String> combinedVariables = new HashMap<>(variables);
    combinedVariables.putAll(localVariables);

    // Reemplazar variables
    for (String varName : combinedVariables.keySet()) {
        String varValue = combinedVariables.get(varName); // Obtener el valor de la variable
        blockContent = blockContent.replaceAll("var\\(--" + varName + "\\)", varValue); // Asegurarse de que coincida con el formato `--nombre-variable`
    }

    return blockContent;
}

    private static String minifyCSS(String css) {
        return css.replaceAll("\\s+", " ").trim();
    }

    private static String readFile(String filePath) throws IOException {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }
        return content.toString();
    }

    private static void writeFile(String filePath, String content) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write(content);
        }
    }
}