import re
import os

def compile_lyc(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            lyc_content = file.read()
        css_content = process_lyc(lyc_content)
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(css_content)
        print(f"Archivo CSS generado: {output_file}")
    except Exception as e:
        print(f"Error al compilar: {e}")

def process_lyc(lyc_content):
    css_output = ""
    global_variables = {}

    # Eliminar comentarios
    lyc_content = re.sub(r'//.*|/\*[\s\S]*?\*/', '', lyc_content)

    # Procesar variables globales
    global_var_matches = re.findall(r'^--([a-zA-Z0-9-]+):\s*([^;]+);', lyc_content, re.MULTILINE)
    for var_name, var_value in global_var_matches:
        global_variables[var_name] = var_value.strip()
    lyc_content = re.sub(r'^--([a-zA-Z0-9-]+):\s*([^;]+);', '', lyc_content, flags=re.MULTILINE).strip()

    # Procesar bloques
    blocks = re.split(r'(@layer\s+\w+\s*\{|})', lyc_content)
    blocks = [block.strip() for block in blocks if block.strip()]

    i = 0
    while i < len(blocks):
        block = blocks[i]
        if block.startswith('@layer'):
            layer_name = re.match(r'@layer\s+(\w+)', block).group(1)
            layer_content = blocks[i + 1]
            css_output += process_block(layer_content, global_variables)
            i += 2
        else:
            css_output += process_block(block, global_variables)
            i += 1

    return minify_css(css_output)

def process_block(block_content, variables):
    local_variables = {}
    block_content = re.sub(r'--([a-zA-Z0-9-]+):\s*([^;]+);', lambda match: local_variables.update({match.group(1): match.group(2).strip()}) or '', block_content)

    # Combinar variables locales y globales
    combined_variables = {**variables, **local_variables}

    # Reemplazar variables
    for var_name, var_value in combined_variables.items():
        block_content = re.sub(rf'var\(--{var_name}\)', var_value, block_content)

    return block_content

def minify_css(css):
    return re.sub(r'\s+', ' ', css).strip()

# Ejecutar el compilador
input_file = os.path.join(os.path.dirname(__file__), '../examples/example1.lyc')
output_file = os.path.join(os.path.dirname(__file__), '../examples/example1.css')
compile_lyc(input_file, output_file)