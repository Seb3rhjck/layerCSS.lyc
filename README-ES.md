# **Documentación de LayerCSS**

[![Licencia: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. Introducción**

### **¿Qué es LayerCSS?**
LayerCSS es un lenguaje de diseño basado en CSS que introduce funciones avanzadas para facilitar la creación de estilos modulares, reutilizables y mantenibles. Está diseñado para superar las limitaciones del CSS tradicional al agregar soporte para variables globales y locales, bloques anidados, capas (`@layer`) y comentarios estructurados.

La filosofía detrás de LayerCSS es simple pero poderosa:
- **Modularidad**: Divide tus estilos en secciones lógicas.
- **Reutilización**: Define valores una vez y úsalos en varios lugares.
- **Facilidad de mantenimiento**: Cambia un valor en un solo lugar y afecta todo el proyecto.

---

## **2. Características Clave**

### **2.1. Variables Globales y Locales**

#### **Variables Globales**
Las variables globales están disponibles en todo el archivo `.lyc`. Son ideales para definir valores reutilizados, como colores, tamaños de fuente o espaciados.

```lyc
--primary-color: #FF69B4;
--font-size-base: 1rem;
```

Estas variables pueden usarse en cualquier parte del archivo:

```lyc
body {
  background: var(--primary-color);
  font-size: var(--font-size-base);
}
```

#### **Variables Locales**
Las variables locales se definen dentro de un bloque específico y solo están disponibles en ese ámbito. Esto es útil para valores relevantes solo en un contexto particular.

```lyc
button {
  --hover-color: #39FF14;
  background: var(--hover-color);
}
```

**Ventajas de las Variables Locales:**
- Evitan conflictos entre variables con el mismo nombre en diferentes bloques.
- Mejoran la encapsulación y legibilidad del código.

---

### **2.2. Bloques Anidados**

Los bloques anidados permiten escribir estilos jerárquicamente, mejorando la legibilidad y reduciendo la repetición de selectores.

```lyc
body {
  margin: 0;
  padding: 0;

  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

El CSS generado será:

```css
body {
  margin: 0;
  padding: 0;
}

body h1, body h2, body h3 {
  color: #FF69B4;
}
```

**Ventajas de los Bloques Anidados:**
- Simplifican la escritura de estilos complejos.
- Reducen la necesidad de repetir selectores.

---

### **2.3. Capas (`@layer`)**

Las capas permiten organizar estilos en secciones lógicas, como `base`, `componentes` o `utilidades`. Esto es especialmente útil para proyectos grandes.

```lyc
@layer base {
  body {
    background: var(--primary-color);
  }
}

@layer components {
  button {
    background: var(--secondary-color);
  }
}
```

El CSS generado será:

```css
@layer base {
  body {
    background: #FF69B4;
  }
}

@layer components {
  button {
    background: #8A2BE2;
  }
}
```

**Ventajas de las Capas:**
- Facilitan la organización de estilos en proyectos grandes.
- Permiten priorizar ciertos estilos sobre otros (por ejemplo, `base` antes que `componentes`).

---

### **2.4. Comentarios Estructurados**

LayerCSS admite comentarios de una línea (`//`) y de varias líneas (`/* ... */`), facilitando la documentación del código.

```lyc
// Este es un comentario de una línea

/*
  Este es un comentario de varias líneas.
  Puede extenderse en varias líneas.
*/
```

**Ventajas de los Comentarios:**
- Mejoran la legibilidad del código.
- Facilitan la colaboración en equipos.

---

### **2.5. Soporte para Animaciones y Keyframes**

Puedes definir animaciones y keyframes directamente en LayerCSS.

```lyc
@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animated-text {
  animation: fadeInOut 4s infinite;
}
```

**Ventajas de las Animaciones:**
- Simplifican la creación de efectos visuales dinámicos.
- Mantienen la coherencia en el diseño.

---

## **3. Comparación con Proyectos Similares**

| **Característica**        | **Sass** | **Less** | **PostCSS** | **LayerCSS** |
|--------------------------|---------|---------|------------|-------------|
| Variables               | Sí      | Sí      | Con plugins | Sí (global y local) |
| Bloques Anidados        | Sí      | Sí      | Con plugins | Sí         |
| Capas (`@layer`)        | No      | No      | Sí (con plugins) | Sí         |
| Comentarios            | Solo `/* ... */` | Solo `/* ... */` | Solo `/* ... */` | `//` y `/* ... */` |
| Animaciones y Keyframes | Sí      | Sí      | Sí          | Sí         |
| Curva de Aprendizaje   | Alta    | Media   | Media       | Baja        |

**Ventajas de LayerCSS sobre Sass/Less/PostCSS:**
- **Simplicidad**: Más fácil de aprender y usar que Sass o Less.
- **Ligero**: No requiere configuraciones complejas ni herramientas adicionales.
- **Compatibilidad**: El CSS generado es completamente compatible con navegadores modernos.

---

## **4. Conclusión**

LayerCSS es una herramienta poderosa que simplifica el desarrollo en CSS. Sus funciones avanzadas, como variables globales y locales, bloques anidados, capas y comentarios estructurados, lo convierten en una solución ideal para proyectos tanto pequeños como grandes.

Si quieres mejorar tu flujo de trabajo en diseño y crear estilos modulares, reutilizables y mantenibles, **LayerCSS es la solución perfecta!**

