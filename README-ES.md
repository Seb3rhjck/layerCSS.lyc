# **Documentación de LayerCSS**

[![Licencia: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. Introducción**

### **¿Qué es LayerCSS?**
LayerCSS es un lenguaje de diseño basado en CSS que introduce funciones avanzadas para facilitar la creación de estilos modulares, reutilizables y mantenibles. Está diseñado para superar las limitaciones del CSS tradicional al agregar soporte para variables globales y locales, bloques anidados, capas (`@layer`) y comentarios estructurados.

La filosofía detrás de LayerCSS es simple pero poderosa:
- **Modularidad**: Divide tus estilos en secciones lógicas.
- **Reutilización**: Define valores una vez y úsalos en varios lugares.
- **Facilidad de mantenimiento**: Cambia un valor en un solo lugar y afecta todo el proyecto.

**Creador**: Sebastian (Balthier) Ordoñez Arias, un programador amateur con conocimientos básicos en diseño web y desarrollo de aplicaciones. Este proyecto nació como una exploración personal para simplificar el desarrollo en CSS y hacerlo accesible para todos.

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

## **3. Caso de Uso Real**

Aunque LayerCSS aún está en desarrollo y no hay pruebas reales implementadas, aquí tienes un caso de uso hipotético que demuestra su potencial:

### **Proyecto: Sitio Web Corporativo**
Un sitio web corporativo requiere estilos consistentes para múltiples páginas. Con LayerCSS, puedes organizar los estilos en capas (`@layer`) para separar la base, componentes y utilidades:

```lyc
@layer base {
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
}

@layer components {
  .header {
    background: var(--primary-color);
    color: white;
  }

  .button {
    background: var(--secondary-color);
    border: none;
    padding: 10px 20px;
  }
}

@layer utilities {
  .hidden {
    display: none;
  }

  .visible {
    display: block;
  }
}
```

Este enfoque modular permite que los desarrolladores trabajen en diferentes partes del proyecto sin interferir entre sí. Además, si se necesita cambiar un color o estilo global, basta con modificar una variable en lugar de buscar y reemplazar valores en múltiples archivos.

---

## **4. Comparación con Frameworks Modernos**

| **Característica**        | **Tailwind CSS** | **Bootstrap** | **LayerCSS** |
|--------------------------|-----------------|---------------|-------------|
| Modularidad              | Alta            | Media         | Alta        |
| Reutilización            | Media           | Baja          | Alta        |
| Facilidad de Uso         | Media           | Alta          | Alta        |
| Curva de Aprendizaje     | Media           | Baja          | Baja        |
| Personalización          | Media           | Baja          | Alta        |

**Ventajas de LayerCSS sobre Tailwind CSS y Bootstrap:**
- **Simplicidad**: LayerCSS no requiere aprender clases específicas ni configuraciones complejas.
- **Personalización**: Ofrece mayor flexibilidad para adaptar estilos a las necesidades del proyecto.
- **Ligereza**: No depende de frameworks externos, lo que reduce el tamaño final del proyecto.

---

## **5. Comparación con Proyectos Similares**

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
- **Compatibilidad**: El CSS generado es completamente compatible con navegadores modernos [[10]].

---

## **6. Licencia Apache 2.0**

LayerCSS se distribuye bajo la **Licencia Apache 2.0**, lo que significa que puedes usar, modificar y distribuir el software libremente, siempre que incluyas una copia de la licencia y mantengas los avisos de derechos de autor originales [[1]]. Esta licencia es ideal para proyectos de código abierto, ya que fomenta la colaboración y el uso comercial sin restricciones.

---

## **7. Conclusión**

LayerCSS es una herramienta poderosa que simplifica el desarrollo en CSS. Sus funciones avanzadas, como variables globales y locales, bloques anidados, capas y comentarios estructurados, lo convierten en una solución ideal para proyectos tanto pequeños como grandes.

Si quieres mejorar tu flujo de trabajo en diseño y crear estilos modulares, reutilizables y mantenibles, **LayerCSS es la solución perfecta!**

---

**Nota del Creador**:  
Este proyecto está en sus primeras etapas, y mi objetivo es que LayerCSS se convierta en un lenguaje universal que pueda integrarse con frameworks y proyectos de diseño web en PHP, JavaScript, TypeScript, Python y Java. Si deseas apoyar este proyecto, ¡tu contribución será invaluable!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01BYKW9)
