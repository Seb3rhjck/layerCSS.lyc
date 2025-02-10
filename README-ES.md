 **1. Bloques Principales de `.lyc`**

Cada bloque en `.lyc` tiene un propósito específico y sigue una estructura clara. A continuación, profundizamos en cada uno:


-- **1.1. @variables**
Este bloque define **variables globales** que pueden ser reutilizadas en todo el proyecto. Las variables son útiles para valores como colores, tamaños de fuente, espaciado, etc.

**Sintaxis**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@variables {
  nombre-variable: valor;
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Características**
- **Reutilización**: Las variables se pueden usar en cualquier otro bloque mediante el símbolo `$`.
- **Modularidad**: Centraliza los valores comunes, facilitando su mantenimiento.
- **Tipos de Valores**:
  - Colores (`#hex`, `rgb`, `rgba`, `hsl`).
  - Unidades (`px`, `rem`, `%`, etc.).
  - Cadenas de texto (`'Arial', sans-serif`).

-- **Ejemplo Completo**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@variables {
  primary-color: #3498db;
  secondary-color: #2ecc71;
  font-size-base: 1rem;
  spacing-unit: 16px;
}

@base {
  body {
    background-color: $primary-color;
    font-size: $font-size-base;
    margin: $spacing-unit;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Casos de Uso**
- Definir paletas de colores consistentes.
- Establecer tamaños de fuente y espaciado estándar.
- Facilitar cambios globales sin modificar múltiples archivos.



-- **1.2. @base**
Este bloque contiene **estilos fundamentales** que se aplican globalmente al proyecto. Es ideal para definir estilos básicos del documento, como reseteos, tipografía y configuraciones generales.

-- **Sintaxis**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@base {
  selector {
    propiedad: valor;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Características**
- **Globalidad**: Los estilos definidos aquí afectan a todo el proyecto.
- **Optimización**: Reduce la necesidad de repetir estilos básicos en otros bloques.
- **Responsive Design**: Puedes incluir media queries dentro de este bloque.

-- **Ejemplo Completo**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@base {
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (min-width: 1200px) {
      font-size: 1.2rem;
    }
  }

  h1, h2, h3 {
    margin: 0;
    color: $primary-color;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Casos de Uso**
- Resetear estilos predeterminados del navegador.
- Definir tipografía y colores base.
- Configurar estilos globales para elementos HTML.


-- **1.3. @component**
Este bloque define **estilos específicos para componentes reutilizables**, como botones, tarjetas, formularios, etc. Es ideal para modularizar el diseño.


-- **Sintaxis**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@component nombre-componente {
  selector {
    propiedad: valor;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Características**
- **Modularidad**: Cada componente tiene sus propios estilos encapsulados.
- **Reutilización**: Los componentes pueden usarse en diferentes partes del proyecto.
- **Extensión**: Permite extender estilos de otros componentes.


-- **Ejemplo Completo**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@component button {
  padding: 10px 20px;
  background-color: $primary-color;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

@component button-secondary {
  @extend .button;
  background-color: $secondary-color;
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Casos de Uso**
- Crear botones, tarjetas, menús y otros componentes reutilizables.
- Encapsular estilos específicos para evitar conflictos.
- Facilitar la creación de interfaces consistentes.



-- **1.4. @layer**
Este bloque define **capas dinámicas** que cargan estilos bajo demanda. Es útil para optimizar el rendimiento al cargar solo los estilos necesarios.


-- **Sintaxis**
.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@layer nombre-capa {
  selector {
    propiedad: valor;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Características**
- **Carga Dinámica**: Los estilos se cargan solo cuando son necesarios.
- **Optimización**: Reduce el tamaño del archivo CSS inicial.
- **Organización**: Divide los estilos en capas lógicas (por ejemplo, "home", "about").


-- **Ejemplo Completo**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@layer home {
  .hero-section {
    background-color: $primary-color;
    padding: 50px;
    text-align: center;
  }
}

@layer about {
  .about-section {
    background-color: $secondary-color;
    padding: 30px;
    font-size: 1.2rem;
  }
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Carga Dinámica en JavaScript**

javascript
-----------------------------------------------------------------------------------------------------------------------------------
function loadLayer(layerName) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/styles/layers/${layerName}.css`;
  document.head.appendChild(link);
}

// Cargar la capa "about" cuando el usuario navega a la página "Acerca de"
document.getElementById('about-link').addEventListener('click', () => {
  loadLayer('about');
});
-----------------------------------------------------------------------------------------------------------------------------------


-- **Casos de Uso**
- Optimizar proyectos grandes con múltiples páginas.
- Reducir el tiempo de carga inicial.
- Organizar estilos por secciones o funcionalidades.


 **1.5. @theme**
Este bloque define **temas preconfigurados** para personalización rápida. Es útil para implementar modos como "claro" y "oscuro".

#### **Sintaxis**
.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@theme nombre-tema {
  nombre-variable: valor;
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Características**
- **Personalización**: Cambia rápidamente entre temas predefinidos.
- **Automatización**: Usa `prefers-color-scheme` para detectar el modo del sistema operativo.
- **Flexibilidad**: Los temas pueden ser seleccionados manualmente o automáticamente.

-- **Ejemplo Completo**
.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@theme light {
  primary-color: #3498db;
  secondary-color: #2ecc71;
}

@theme dark {
  primary-color: #2c3e50;
  secondary-color: #1abc9c;
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Selección de Tema en JavaScript**

javascript
-----------------------------------------------------------------------------------------------------------------------------------
function changeTheme(themeName) {
  const theme = themes[themeName];
  document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
  document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Casos de Uso**
- Implementar modos claro/oscuro.
- Personalizar la apariencia según las preferencias del usuario.
- Adaptar el diseño a diferentes contextos.


-- **1.6. @custom**
Este bloque permite **personalización dinámica** por parte del usuario final. Es útil para permitir cambios en tiempo real sin modificar el archivo raíz.

 **Sintaxis**

.lyc
-----------------------------------------------------------------------------------------------------------------------------------
@custom {
  nombre-variable: valor-predeterminado;
}
-----------------------------------------------------------------------------------------------------------------------------------

 **Características**
- **Flexibilidad**: Los usuarios pueden cambiar valores sin editar el archivo `.lyc`.
- **Interactividad**: Ideal para herramientas de diseño en tiempo real.
- **Integración**: Funciona bien con lenguajes backend como PHP o Python.

-- **Ejemplo Completo**
.lyc
----------------------------------------------------------------------------------------------------------------------------------
@custom {
  primary-color: #ff5733; // Valor predeterminado
}
-----------------------------------------------------------------------------------------------------------------------------------

-- **Personalización en PHP**

.php
----------------------------------------------------------------------------------------------------------------------------------
<?php
$theme = $_GET['theme'] ?? 'light';
$primaryColor = ($theme === 'dark') ? '#2c3e50' : '#3498db';
header('Content-Type: text/css');
echo ":root { --primary-color: $primaryColor; }";
?>
----------------------------------------------------------------------------------------------------------------------------------


-- **Casos de Uso**
- Permitir a los usuarios personalizar colores, fuentes, etc.
- Crear herramientas de diseño interactivas.
- Adaptar el diseño a diferentes usuarios o clientes.



-- **2. Resumen de Bloques**

| **Bloque**      |  **Propósito**                                  | **Ejemplo de Uso**                             |
|-----------------|-------------------------------------------------|------------------------------------------------|
| `@variables`    | Define valores globales reutilizables.          | Colores, tamaños de fuente, espaciado.         |
| `@base`         | Estilos fundamentales aplicados globalmente.    | Tipografía, reseteo de estilos.                |
| `@component`    | Estilos específicos para componentes.           | Botones, tarjetas, formularios.                |
| `@layer`        | Capas dinámicas que cargan estilos bajo demanda.| Optimización de proyectos grandes.             |
| `@theme`        | Define temas preconfigurados.                   | Modos claro/oscuro, temas personalizados.      |
| `@custom`       | Permite personalización dinámica.               | Herramientas de diseño en tiempo real.         |
|-----------------|-------------------------------------------------|------------------------------------------------|


-------------------------------------------- COMPILACION DE CODIGO ----------------------------------------------------------------
                                              Node.js - JavaScript
-- **1. Estructura del Compilador**

El compilador seguirá estos pasos:

1. **Leer el archivo `.lyc`**:
   - Leer el contenido del archivo `.lyc` desde el sistema de archivos.

2. **Procesar las variables globales (`@variables`)**:
   - Identificar y reemplazar las variables definidas en `@variables` con sus valores correspondientes.

3. **Procesar los bloques (`@base`, `@component`, etc.)**:
   - Convertir cada bloque en CSS estándar.

4. **Generar el archivo CSS**:
   - Escribir el CSS resultante en un archivo `.css`.


-- **2. Configuración Inicial**

Antes de comenzar, asegúrate de tener instalado **Node.js** en tu sistema. Si no lo tienes, puedes descargarlo desde [https://nodejs.org](https://nodejs.org).



-- **Pasos Iniciales**
1. Crea una carpeta para tu proyecto:
   bash
   mkdir lyc-compiler
   cd lyc-compiler
   

2. Inicializa un proyecto Node.js:
   bash
   npm init -y
   

3. Instala las dependencias necesarias:
   bash
   npm install fs path
   


-- **3. Implementación del Compilador**

Aquí tienes un ejemplo básico de cómo implementar el compilador en Node.js.

 **Código del Compilador**
Guarda el siguiente código en un archivo llamado `compiler.js`:

-javascript
----------------------------------------------------------------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');

// Función principal del compilador
function compileLYC(inputFile, outputFile) {
  // Leer el archivo .lyc
  const lycContent = fs.readFileSync(inputFile, 'utf-8');

  // Procesar el contenido
  const cssContent = processLYC(lycContent);

  // Escribir el archivo CSS resultante
  fs.writeFileSync(outputFile, cssContent);
  console.log(`Archivo CSS generado: ${outputFile}`);
}

// Procesar el contenido .lyc
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
        // Procesar variables
        blockContent.split(';').forEach(line => {
          const [key, value] = line.split(':').map(part => part.trim());
          if (key && value) variables[key] = value;
        });
        break;

      case 'base':
      case 'component':
      case 'layer':
      case 'theme':
      case 'custom':
        // Procesar bloques de estilos
        const processedBlock = blockContent.replace(/\$(\w+)/g, (_, varName) => variables[varName] || '');
        cssOutput += `${processedBlock}\n`;
        break;

      default:
        console.warn(`Bloque desconocido: @${blockType}`);
    }
  }

  return cssOutput;
}

// Ejecutar el compilador
const inputFile = path.join(__dirname, 'styles.lyc'); // Archivo de entrada
const outputFile = path.join(__dirname, 'styles.css'); // Archivo de salida

compileLYC(inputFile, outputFile);

-------------------------------------------------------------------------------------------------------------------------------

-- **4. Ejemplo de Uso**

-- **Archivo `.lyc` de Entrada**
Crea un archivo llamado `styles.lyc` con el siguiente contenido:

.lyc
----------------------------------------------------------------------------------------------------------------------------------
@variables {
  primary-color: #3498db;
  secondary-color: #2ecc71;
  font-size-base: 1rem;
}

@base {
  body {
    background-color: $primary-color;
    font-size: $font-size-base;
    margin: 0;
  }
}

@component button {
  padding: 10px 20px;
  background-color: $secondary-color;
  border: none;
  color: white;
}
-------------------------------------------------------------------------------------------------------------------------------

-- **Ejecutar el Compilador**
Ejecuta el compilador con Node.js:

bash
node compiler.js


Esto generará un archivo `styles.css` con el siguiente contenido:

.css
----------------------------------------------------------------------------------------------------------------------------------
body {
  background-color: #3498db;
  font-size: 1rem;
  margin: 0;
}

button {
  padding: 10px 20px;
  background-color: #2ecc71;
  border: none;
  color: white;
}
----------------------------------------------------------------------------------------------------------------------------------


-- **5. Explicación del Código**

1. **Lectura del Archivo**:
   - Usamos `fs.readFileSync` para leer el contenido del archivo `.lyc`.

2. **Procesamiento de Variables**:
   - Extraemos las variables definidas en `@variables` y las almacenamos en un objeto (`variables`).
   - Reemplazamos todas las referencias a variables (`$nombre-variable`) con sus valores correspondientes.

3. **Procesamiento de Bloques**:
   - Dividimos el contenido en bloques usando expresiones regulares.
   - Procesamos cada bloque según su tipo (`@base`, `@component`, etc.) y generamos el CSS correspondiente.

4. **Escritura del Archivo CSS**:
   - Usamos `fs.writeFileSync` para escribir el CSS resultante en un archivo.
