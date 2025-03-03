Complete Documentation for `.lyc` Compilers

1. Introduction

1.1. What is `.lyc`?
`.lyc` (LayerCSS) is a design language built on top of CSS that introduces advanced features such as 
*global and local variables*, nested blocks, layers (`@layer`), and dynamic theming. 
It is designed to simplify and modularize web design while adhering to the following core principles:

- *Modularity*: Breaks styles into reusable components and dynamic layers.
- *Simplicity*: Reduces verbosity with a cleaner and more structured syntax.
- *Dynamic Customization*: Allows real-time changes without modifying the root file.
- *Automatic Optimization*: Eliminates redundancies and loads only the necessary styles.
- *Versatility*: Adapts to various use cases, from small projects to large-scale applications.


2. Key Features of `.lyc`

2.1. Global and Local Variables
Variables are a cornerstone of `.lyc`, enabling **reusability** and **maintainability** across your project.


Global Variables
- Defined in the `@variables` block.
- Accessible throughout the entire project using the `$` symbol.
- Ideal for defining consistent values like colors, font sizes, spacing, etc.

Syntax

```lyc
@variables {
  primary-color: #3498db;
  secondary-color: #2ecc71;
  font-size-base: 1rem;
}
```

*Usage Example*

```lyc
@base {
  body {
    background-color: $primary-color;
    font-size: $font-size-base;
  }
}
```

Local Variables
- Defined within specific blocks (e.g., `@component`, `@layer`).
- Override global variables within their scope.
- Useful for creating localized styles without affecting the rest of the project.

*Example*

```lyc
@component button {
  --hover-color: #1abc9c; // Local variable
  background-color: $secondary-color;

  &:hover {
    background-color: var(--hover-color);
  }
}
```


2.2. Blocks in `.lyc`
Each block in `.lyc` serves a specific purpose, ensuring *modularity* and *organization*.

*@variables*
Defines *global variables* for reuse across the project.

*Features*
- Centralizes common values.
- Simplifies maintenance by reducing duplication.

*Example*

```lyc
@variables {
  spacing-unit: 16px;
}

@base {
  body {
    margin: $spacing-unit;
  }
}
```

*@base*
Contains *fundamental styles* applied globally.

*Features*
- Resets default browser styles.
- Defines typography, spacing, and other global configurations.

*Example*

```lyc
@base {
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }
}
```

*@component*
Defines *styles for reusable components* like buttons, cards, and forms.

*Features*
- Encapsulates styles to avoid conflicts.
- Supports inheritance with `@extend`.

*Example*

```lyc
@component button {
  padding: 10px 20px;
  background-color: $primary-color;
  border: none;
  color: white;

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

@component button-secondary {
  @extend .button;
  background-color: $secondary-color;
}
```

*@layer*
Loads styles dynamically under specific conditions, optimizing performance.

*Features*
- Reduces initial CSS file size.
- Organizes styles into logical layers (e.g., "home", "about").

*Example*

```lyc
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
```

*@theme*
Defines *pre-configured themes* for quick customization.

*Features*
- Supports light/dark modes.
- Automatically detects system preferences using `prefers-color-scheme`.

*Example*

```lyc
@theme light {
  primary-color: #3498db;
  secondary-color: #2ecc71;
}

@theme dark {
  primary-color: #2c3e50;
  secondary-color: #1abc9c;
}
```

*@custom*

Allows *dynamic customization* by end-users.

*Features*
- Enables real-time personalization.
- Integrates seamlessly with backend languages like PHP or Python.

*Example*

```lyc
@custom {
  primary-color: #ff5733; // Default value
}
```


3. Compiler Implementation

3.1. Compiler Workflow
The compiler transforms `.lyc` files into standard CSS by following these steps:
1. *Read the `.lyc` File*: Load the content of the `.lyc` file.
2. *Process Variables*: Replace global and local variables with their corresponding values.
3. *Process Blocks*: Convert each block (`@base`, `@component`, etc.) into standard CSS.
4. *Generate the CSS File*: Write the resulting CSS to an output file.

3.2. Example Compiler in Node.js
Here’s a basic implementation of the compiler in JavaScript (Node.js):

```javascript
const fs = require('fs');
const path = require('path');

function compileLYC(inputFile, outputFile) {
  const lycContent = fs.readFileSync(inputFile, 'utf-8');
  const cssContent = processLYC(lycContent);
  fs.writeFileSync(outputFile, cssContent);
  console.log(`CSS file generated: ${outputFile}`);
}

function processLYC(lycContent) {
  let cssOutput = '';
  const variables = {};

  const blocks = lycContent.split(/@(\w+)\s*\{/).filter(block => block.trim() !== '');

  for (let i = 0; i < blocks.length; i += 2) {
    const blockType = blocks[i].trim();
    const blockContent = blocks[i + 1].replace(/\}\s*$/, '').trim();

    switch (blockType) {
      case 'variables':
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
        const processedBlock = blockContent.replace(/\$(\w+)/g, (_, varName) => variables[varName] || '');
        cssOutput += `${processedBlock}\n`;
        break;

      default:
        console.warn(`Unknown block: @${blockType}`);
    }
  }

  return cssOutput;
}

const inputFile = path.join(__dirname, 'styles.lyc');
const outputFile = path.join(__dirname, 'styles.css');
compileLYC(inputFile, outputFile);
```


4. Philosophy of LayerCSS

LayerCSS adheres to the following principles:

1. *Modularity*: Styles are divided into reusable components and dynamic layers.
2. *Simplicity*: The syntax is concise and easy to understand, reducing complexity.
3. *Dynamic Customization*: Users can modify styles in real-time without altering the source file.
4. *Automatic Optimization*: Redundant styles are eliminated, and only necessary styles are loaded.
5. *Versatility*: Suitable for both small projects and large-scale applications.
