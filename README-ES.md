----------------------------------------------------------------------- LayerCSS (`.lyc`) ------------------------------------------------------------------------------------------

1. Filosofía de LayerCSS

LayerCSS (`.lyc`) está diseñado con una filosofía clara que guía su estructura y funcionalidades:

- Modularidad: Divide los estilos en componentes reutilizables y capas dinámicas, facilitando la organización y mantenimiento.
- Simplicidad: Reduce la verbosidad de CSS estándar con una sintaxis limpia y estructurada.
- Personalización Dinámica: Permite cambios en tiempo real sin modificar el archivo raíz, adaptándose a las necesidades del usuario final.
- Optimización Automática: Elimina redundancias y carga solo los estilos necesarios, mejorando el rendimiento.
- Versatilidad: Compatible con múltiples lenguajes de compilación (TypeScript, Java, PHP, Python) y adaptable a diferentes entornos.


2. Variables Globales y Locales

Las variables son una parte esencial de `.lyc`, ya que permiten centralizar valores comunes y reutilizarlos en todo el proyecto. Esto se alinea perfectamente con la *modularidad* y la *optimización automática*.

2.1. Variables Globales
Definidas en el bloque `@variables`, estas variables son accesibles en todo el archivo `.lyc`.

  -- Sintaxis

-------------------------------------------------------------------------------------
.lyc
@variables {
  primary-color: #3498db;
  font-size-base: 1rem;
}
---------------------------------------------------------------------------------------

  -- Características
- *Reutilización*: Las variables globales se pueden usar en cualquier bloque mediante el símbolo `$`.
- *Centralización*: Facilita cambios globales sin modificar múltiples archivos.
- *Tipos de Valores*: Colores (`#hex`, `rgb`, `rgba`, `hsl`), unidades (`px`, `rem`, `%`, etc.), cadenas de texto.

  -- Ejemplo Completo

--------------------------------------------------------------------------------------------
lyc
@variables {
  primary-color: #3498db;
  spacing-unit: 16px;
}

@base {
  body {
    background-color: $primary-color;
    margin: $spacing-unit;
  }
}
-----------------------------------------------------------------------------------------------


2.2. Variables Locales
Las variables locales se definen dentro de bloques específicos (como `@component` o `@layer`) y solo están disponibles en ese ámbito. Esto promueve la *versatilidad* y la *personalización dinámica*.

  -- Sintaxis

-------------------------------------------------------------------------------------------------
lyc
@component button {
  --hover-color: #1abc9c;
  background-color: $primary-color;

  &:hover {
    background-color: var(--hover-color);
  }
}
---------------------------------------------------------------------------------------------------

  -- Características
- *Alcance Limitado*: Solo afectan al bloque donde se declaran.
- *Personalización*: Ideal para ajustes específicos dentro de componentes o capas.
- *Flexibilidad*: Combinable con variables globales para un diseño modular.


3. Bloques Principales de `.lyc`

Cada bloque en `.lyc` tiene un propósito específico y sigue la filosofía de LayerCSS. A continuación, profundizamos en cada uno:

3.1. @variables
Define valores globales reutilizables. Este bloque es clave para la *modularidad* y la *optimización automática*.

  -- Casos de Uso
- Definir paletas de colores consistentes.
- Establecer tamaños de fuente y espaciado estándar.
- Facilitar cambios globales sin modificar múltiples archivos.


3.2. @base
Contiene estilos fundamentales aplicados globalmente. Es ideal para definir estilos básicos como reseteos, tipografía y configuraciones generales.

  -- Características
- *Globalidad*: Los estilos definidos aquí afectan a todo el proyecto.
- *Responsive Design*: Puedes incluir media queries dentro de este bloque.

  -- Ejemplo Completo

-----------------------------------------------------------------------------------------
lyc
@base {
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
}
-------------------------------------------------------------------------------------------



3.3. @component
Define estilos específicos para componentes reutilizables, como botones, tarjetas, formularios, etc. Este bloque promueve la **modularidad** y la **reutilización**.

  -- Características
- *Encapsulamiento*: Cada componente tiene sus propios estilos encapsulados.
- *Extensión*: Permite extender estilos de otros componentes.

  -- Ejemplo Completo

----------------------------------------------------------------------------------------------
lyc
@component button {
  padding: 10px 20px;
  background-color: $primary-color;
  border: none;
  color: white;

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}
----------------------------------------------------------------------------------------------



3.4. @layer
Define capas dinámicas que cargan estilos bajo demanda. Este bloque es esencial para la *optimización automática* y la *versatilidad*.

  -- Características
- *Carga Dinámica*: Los estilos se cargan solo cuando son necesarios.
- *Organización*: Divide los estilos en capas lógicas (por ejemplo, "home", "about").

  -- Ejemplo Completo

------------------------------------------------------------------------------------------------
lyc
@layer home {
  .hero-section {
    background-color: $primary-color;
    padding: 50px;
    text-align: center;
  }
}
--------------------------------------------------------------------------------------------------



3.5. @theme
Define temas preconfigurados para personalización rápida. Este bloque apoya la *personalización dinámica* y la *adaptabilidad*.

  -- Características
- *Automatización*: Usa `prefers-color-scheme` para detectar el modo del sistema operativo.
- *Flexibilidad*: Cambia rápidamente entre temas predefinidos.

  -- Ejemplo Completo

-----------------------------------------------------------------------------------------------------
lyc
@theme light {
  primary-color: #3498db;
}

@theme dark {
  primary-color: #2c3e50;
}
------------------------------------------------------------------------------------------------------


3.6. @custom
Permite personalización dinámica por parte del usuario final. Este bloque es clave para la *versatilidad* y la *interactividad*.

  -- Características
- *Flexibilidad*: Los usuarios pueden cambiar valores sin editar el archivo `.lyc`.
- *Integración*: Funciona bien con lenguajes backend como PHP o Python.

  -- Ejemplo Completo

--------------------------------------------------------------------------------------------------------
lyc
@custom {
  primary-color: #ff5733; // Valor predeterminado
}
---------------------------------------------------------------------------------------------------------



4. Resumen de Bloques

| *Bloque*        | *Propósito*                                     |  *Filosofía Aplicada*            |
|-----------------|-------------------------------------------------|----------------------------------|
| `@variables`    | Define valores globales reutilizables.          | Modularidad, Optimización        |
| `@base`         | Estilos fundamentales aplicados globalmente.    | Simplicidad, Modularidad         |
| `@component`    | Estilos específicos para componentes.           | Modularidad, Reutilización       |
| `@layer`        | Capas dinámicas que cargan estilos bajo demanda.| Optimización, Versatilidad       |
| `@theme`        | Define temas preconfigurados.                   | Personalización, Adaptabilidad   |
| `@custom`       | Permite personalización dinámica.               | Versatilidad, Interactividad     |


5. Compiladores

Los compiladores transforman archivos `.lyc` en CSS estándar, siguiendo los principios de *simplicidad* y *versatilidad*. Cada compilador está implementado en un lenguaje específico para adaptarse a diferentes entornos.

5.1. Estructura del Compilador
El compilador sigue estos pasos:
1. Leer el archivo `.lyc`.
2. Procesar las variables globales y locales.
3. Convertir cada bloque en CSS estándar.
4. Generar el archivo CSS.

5.2. Ejemplo de Uso
*Archivo `.lyc` de Entrada*

---------------------------------------------------------------------------------------------
lyc
@variables {
  primary-color: #3498db;
  font-size-base: 1rem;
}

@base {
  body {
    background-color: $primary-color;
    font-size: $font-size-base;
  }
}
----------------------------------------------------------------------------------------------

  -- Archivo CSS Generado
----------------------------------------------------------------------------------------------
css
body {
  background-color: #3498db;
  font-size: 1rem;
}
------------------------------------------------------------------------------------------------


6. Conclusión

La filosofía de LayerCSS (`Modularidad, Simplicidad, Personalización Dinámica, Optimización Automática, Versatilidad`) se refleja en cada aspecto del lenguaje, desde las variables globales y locales hasta los bloques principales como `@base`, `@component` y `@layer`. Con esta estructura, `.lyc` ofrece una solución moderna y eficiente para el diseño web, adaptable a diversos entornos y necesidades.

