
# **LayerCSS Documentation**


[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. Introduction**

### **What is LayerCSS?**
LayerCSS is a design language based on CSS that introduces advanced features to facilitate the creation of modular, reusable, and maintainable styles. It is designed to overcome the limitations of traditional CSS by adding support for global and local variables, nested blocks, layers (`@layer`), and structured comments.

The philosophy behind LayerCSS is simple yet powerful:
- **Modularity**: Divide your styles into logical sections.
- **Reusability**: Define values once and use them in multiple places.
- **Ease of Maintenance**: Change a value in one place, and it affects the entire project.

---

## **2. Key Features**

### **2.1. Global and Local Variables**

#### **Global Variables**
Global variables are accessible throughout the `.lyc` file. They are ideal for defining values that are used repeatedly, such as colors, font sizes, or spacing.

```lyc
--primary-color: #FF69B4;
--font-size-base: 1rem;
```

These variables can be used anywhere in the file:

```lyc
body {
  background: var(--primary-color);
  font-size: var(--font-size-base);
}
```

#### **Local Variables**
Local variables are defined within a specific block and are only available within that scope. This is useful for values that are only relevant in a particular context.

```lyc
button {
  --hover-color: #39FF14;
  background: var(--hover-color);
}
```

**Advantages of Local Variables:**
- Avoid conflicts between variables with the same name in different blocks.
- Improve encapsulation and code readability.

---

### **2.2. Nested Blocks**

Nested blocks allow you to write styles hierarchically, improving readability and reducing selector repetition.

```lyc
body {
  margin: 0;
  padding: 0;

  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

The generated CSS will be:

```css
body {
  margin: 0;
  padding: 0;
}

body h1, body h2, body h3 {
  color: #FF69B4;
}
```

**Advantages of Nested Blocks:**
- Simplify writing complex styles.
- Reduce the need to repeat selectors.

---

### **2.3. Layers (`@layer`)**

Layers allow you to organize styles into logical sections, such as `base`, `components`, or `utilities`. This is especially useful for large projects.

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

The generated CSS will be:

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

**Advantages of Layers:**
- Facilitate organizing styles in large projects.
- Allow prioritizing certain styles over others (e.g., `base` before `components`).

---

### **2.4. Structured Comments**

LayerCSS supports single-line comments (`//`) and multi-line comments (`/* ... */`), making it easier to document your code.

```lyc
// This is a single-line comment

/*
  This is a multi-line comment.
  It can span multiple lines.
*/
```

**Advantages of Comments:**
- Improve code readability.
- Facilitate collaboration in teams.

---

### **2.5. Support for Animations and Keyframes**

You can define animations and keyframes directly in LayerCSS.

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

The generated CSS will be:

```css
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

**Advantages of Animations:**
- Simplify creating dynamic visual effects.
- Maintain consistency in design.

---

### **2.6. Advanced Options**

#### **Variable Inheritance**
Local variables can temporarily override global variables within a block.

```lyc
--primary-color: #FF69B4;

body {
  background: var(--primary-color);

  .special-section {
    --primary-color: #8A2BE2;
    background: var(--primary-color); /* Will use #8A2BE2 */
  }
}
```

#### **Media Query Support**
LayerCSS allows you to define media queries cleanly and organized.

```lyc
@media (max-width: 768px) {
  body {
    font-size: 0.8rem;
  }
}
```

#### **Custom Functions**
Although LayerCSS does not have built-in functions like Sass, you can simulate similar behaviors using variables and nested blocks.

---

## **3. Comparison with Similar Projects**

| **Feature**              | **Sass**            | **Less**                | **PostCSS**              | **LayerCSS**              |
|--------------------------|---------------------|-------------------------|--------------------------|---------------------------|
| Variables                | Yes                 | Yes                     | With plugins             | Yes (global and local)    |
| Nested Blocks            | Yes                 | Yes                     | With plugins             | Yes                       |
| Layers (`@layer`)        | No                  | No                      | Yes (with plugins)       | Yes                       |
| Comments                 | Only `/* ... */`    | Only `/* ... */`        | Only `/* ... */`         | `//` and `/* ... */`      |
| Animations and Keyframes | Yes                 | Yes                     | Yes                      | Yes                       |
| Learning Curve           | High                | Medium                  | Medium                   | Low                       |

**Advantages of LayerCSS over Sass/Less/PostCSS:**
- **Simplicity**: LayerCSS is easier to learn and use than Sass or Less.
- **Lightweight**: No complex configurations or additional tools required.
- **Compatibility**: The generated CSS is fully compatible with modern browsers.

---

## **4. Versatility of LayerCSS**

### **4.1. Small Projects**
LayerCSS is ideal for small projects because:
- Reduces repetitive code.
- Facilitates quick implementation of changes.

### **4.2. Large Projects**
In large projects, LayerCSS shines thanks to:
- Layers (`@layer`) for organizing styles.
- Global and local variables for maintaining consistency.

### **4.3. Development Teams**
LayerCSS improves collaboration in teams because:
- Structured comments facilitate documentation.
- Modularity reduces code conflicts.

---

## **5. Why Use LayerCSS?**

### **5.1. Problems It Solves**
- **Code Repetition**: Variables eliminate the need to copy and paste values.
- **Disorganization**: Layers and nested blocks keep the code clean and structured.
- **Maintenance Difficulty**: Changes to a global variable affect the entire project.

### **5.2. Use Cases**
- **Responsive Design**: Use media queries and variables to adapt styles to different devices.
- **Dynamic Themes**: Change global variables to toggle between light and dark themes.
- **Animations**: Create consistent visual effects with keyframes.

---

## **6. Conclusion**

LayerCSS is a powerful tool that simplifies CSS development. Its advanced features, such as global and local variables, nested blocks, layers, and structured comments, make it an ideal solution for both small and large projects. Additionally, its compatibility with standard CSS ensures that the generated code works seamlessly in any modern browser.

If you want to improve your design workflow and create modular, reusable, and maintainable styles, **LayerCSS is the perfect solution!**

---

## **7. License**

This project is distributed under the **Apache License 2.0**. You can use, modify, and distribute the code as long as you comply with the terms of the license.

For more details, see the [LICENSE](LICENSE) file.

---

## **8. Contributing**

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch.
3. Submit a pull request with your changes.

Please ensure you follow the coding standards and include tests if applicable.

---

## **9. Support**

If you encounter any issues or have questions, feel free to open an issue in the [GitHub Issues](https://github.com/your-repo/issues) section.

