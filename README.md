
# **LayerCSS Documentation**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. Introduction**

### **What is LayerCSS?**
LayerCSS is a design language based on CSS that introduces advanced features to facilitate the creation of modular, reusable, and maintainable styles. It is designed to overcome the limitations of traditional CSS by adding support for global and local variables, nested blocks, layers (`@layer`), and structured comments.

The philosophy behind LayerCSS is simple but powerful:
- **Modularity**: Divide your styles into logical sections.
- **Reusability**: Define values once and use them in multiple places.
- **Ease of Maintenance**: Change a value in one place and affect the entire project.

**Creator**: Sebastian (Balthier) Ordoñez Arias, an amateur programmer with basic knowledge in web design and application development. This project was born as a personal exploration to simplify CSS development and make it accessible to everyone.

---

## **2. Key Features**

### **2.1. Global and Local Variables**

#### **Global Variables**
Global variables are available throughout the `.lyc` file. They are ideal for defining reusable values such as colors, font sizes, or spacing.

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
Local variables are defined within a specific block and are only available within that scope. This is useful for values relevant only in a particular context.

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
- Allow prioritizing certain styles over others (e.g., `base` before `components`) [[5]].

---

### **2.4. Structured Comments**

LayerCSS supports single-line comments (`//`) and multi-line comments (`/* ... */`), making it easier to document your code.

```lyc
// This is a single-line comment

/*
  This is a multi-line comment.
  It can span across multiple lines.
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

**Advantages of Animations:**
- Simplify creating dynamic visual effects.
- Maintain consistency in design.

---

## **3. Real-World Use Case**

Although LayerCSS is still under development and there are no real-world implementations yet, here’s a hypothetical use case that demonstrates its potential:

### **Project: Corporate Website**
A corporate website requires consistent styles across multiple pages. With LayerCSS, you can organize styles into layers (`@layer`) to separate the base, components, and utilities:

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

This modular approach allows developers to work on different parts of the project without interfering with each other. Additionally, if you need to change a global color or style, you only need to modify a variable instead of searching and replacing values in multiple files.

---

## **4. Comparison with Modern Frameworks**

| **Feature**        | **Tailwind CSS** | **Bootstrap** | **LayerCSS** |
|---------------------|-----------------|---------------|-------------|
| Modularity          | High            | Medium        | High        |
| Reusability         | Medium          | Low           | High        |
| Ease of Use         | Medium          | High          | High        |
| Learning Curve      | Medium          | Low           | Low         |
| Customization       | Medium          | Low           | High        |

**Advantages of LayerCSS over Tailwind CSS and Bootstrap:**
- **Simplicity**: LayerCSS does not require learning specific classes or complex configurations.
- **Customization**: Offers greater flexibility to adapt styles to project needs.
- **Lightweight**: Does not depend on external frameworks, reducing the final project size.

---

## **5. Comparison with Similar Projects**

| **Feature**        | **Sass** | **Less** | **PostCSS** | **LayerCSS** |
|---------------------|----------|----------|-------------|--------------|
| Variables           | Yes      | Yes      | With plugins | Yes (global and local) |
| Nested Blocks       | Yes      | Yes      | With plugins | Yes          |
| Layers (`@layer`)   | No       | No       | Yes (with plugins) | Yes          |
| Comments            | Only `/* ... */` | Only `/* ... */` | Only `/* ... */` | `//` and `/* ... */` |
| Animations and Keyframes | Yes   | Yes      | Yes         | Yes          |
| Learning Curve      | High     | Medium   | Medium      | Low          |

**Advantages of LayerCSS over Sass/Less/PostCSS:**
- **Simplicity**: Easier to learn and use than Sass or Less.
- **Lightweight**: No complex configurations or additional tools required.
- **Compatibility**: The generated CSS is fully compatible with modern browsers [[10]].

---

## **6. Apache 2.0 License**

LayerCSS is distributed under the **Apache 2.0 License**, meaning you can use, modify, and distribute the software freely, provided you include a copy of the license and retain the original copyright notices [[1]]. This license is ideal for open-source projects as it encourages collaboration and commercial use without restrictions.

---

## **7. Conclusion**

LayerCSS is a powerful tool that simplifies CSS development. Its advanced features, such as global and local variables, nested blocks, layers, and structured comments, make it an ideal solution for both small and large projects.

If you want to improve your design workflow and create modular, reusable, and maintainable styles, **LayerCSS is the perfect solution!**

---

**Note from the Creator**:  
This project is in its early stages, and my goal is for LayerCSS to become a universal language that can integrate with frameworks and web design projects in PHP, JavaScript, TypeScript, Python, and Java. If you’d like to support this project, your contribution will be invaluable!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01BYKW9)
