---
title: "Mastering LayerCSS: Writing a Valid .lyc File"
seoTitle: "layercss-sintaxys"
seoDescription: "LayerCSS introduces a structured way to manage styles with layers, variables, and advanced features like mixins and inheritance. To write a valid `.lyc` fil"
datePublished: Fri Mar 28 2025 02:28:09 GMT+0000 (Coordinated Universal Time)
cuid: cm8s5xnfr000l09l202ne6hmg
slug: mastering-layercss-writing-a-valid-lyc-file
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1743127943604/95e15604-1cea-4263-840b-32ad99d80a3f.png
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1743128782692/65d8491b-3631-47c2-8eda-51d6b971d4dd.png
tags: css, js, web-development, html

---

LayerCSS introduces a structured way to manage styles with layers, variables, and advanced features like mixins and inheritance. To write a valid `.lyc` file, you must follow specific syntax rules to ensure correct processing by the compiler or preprocessor.

This guide outlines the core rules and best practices for writing `.lyc` files.

---

## **1\. General Structure**

* A `.lyc` file follows a structured hierarchy with:
    
    * Global variables.
        
    * CSS rules.
        
    * Special directives (`@layer`, `@mixin`, `@include`, `@extend`).
        

---

## **2\. Comments**

LayerCSS supports JavaScript and CSS-style comments:

* **Single-line comments:** `// This is a comment`
    
* **Multi-line comments:**
    

```plaintext
/* This is a 
   multi-line comment */
```

---

## **3\. Global Variables**

Global variables help maintain consistency and can be used throughout the stylesheet.

**Syntax:**

```plaintext
--primary-color: #FF69B4;
--font-size: 16px;
```

Use `var(--variable-name)` to reference them:

```plaintext
body {
    background: var(--primary-color);
    font-size: var(--font-size);
}
```

---

## \*\*4. Layer Blocks (`@layer`)

Layer blocks organize styles into logical sections.

**Syntax:**

```plaintext
@layer base {
    body {
        background: var(--primary-color);
    }
}
```

---

## **5\. CSS Rules**

LayerCSS follows standard CSS syntax:

```plaintext
div {
    color: blue;
}
```

Supports variable usage:

```plaintext
div {
    color: var(--primary-color);
}
```

---

## **6\. Nested Selectors**

Selectors can be nested for better readability and structure.

```plaintext
div {
    color: blue;
    
    span {
        color: red;
    }
}
```

---

## **7\. Special Directives**

### **a)** `@mixin` (Reusable Code Blocks)

```plaintext
@mixin button-style {
    border: none;
    padding: 10px;
}
```

### **b)** `@include` (Applying Mixins)

```plaintext
.button {
    @include button-style;
    background: var(--primary-color);
}
```

### **c)** `@extend` (Inheritance)

```plaintext
.alert-button {
    @extend .button;
    color: white;
}
```

---

## **8\. Syntax Validation**

Ensure all blocks are balanced with `{}`:

❌ Incorrect:

```plaintext
@layer base 
    body {
        background: var(--primary-color);
    }
```

✅ Correct:

```plaintext
@layer base {
    body {
        background: var(--primary-color);
    }
}
```

---

## **9\. Invalid Characters**

* Non-printable or invalid characters are removed during preprocessing.
    

---

## **10\. Full Example of a Valid** `.lyc` File

```plaintext
--primary-color: #FF69B4;
--font-size: 16px;

@layer base {
    body {
        background: var(--primary-color);
        font-size: var(--font-size);
    }

    div {
        color: blue;

        span {
            color: red;
        }
    }
}

@mixin button-style {
    border: none;
    padding: 10px;
}

.button {
    @include button-style;
    background: var(--primary-color);
}

.alert-button {
    @extend .button;
    color: white;
}
```

---

## **Conclusion**

By following these rules, you can write structured and maintainable `.lyc` files that integrate seamlessly with LayerCSS's preprocessor and compiler. Start experimenting today and elevate your CSS workflow with LayerCSS! 🚀

---

💡 **Join the Community!**

* Follow LayerCSS on [GitHub](https://github.com/Seb3rhjck/lyc-compiler-js) 🔗
    
* Stay updated on [Twitter/X](https://x.com/LayerCss) 🐦
    
* Website [LayerCSS](https://seb3rhjck.github.io/layerCSS.lyc/)
    
* [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg align="left")](https://ko-fi.com/Y8Y01BYKW9)
    

Have questions or feedback? Drop a comment below! 🚀