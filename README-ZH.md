# **LayerCSS 文档**

[![许可证: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. 简介**

### **什么是 LayerCSS？**
LayerCSS 是一种基于 CSS 的设计语言，引入了高级功能以简化模块化、可重用和可维护样式的创建。它旨在通过添加对全局和局部变量、嵌套块、层（`@layer`）和结构化注释的支持来克服传统 CSS 的限制。

LayerCSS 背后的理念简单而强大：
- **模块化**：将样式划分为逻辑部分。
- **可重用性**：定义一次值并在多个地方使用。
- **易维护性**：更改一个地方的值即可影响整个项目。

**创作者**：Sebastian (Balthier) Ordoñez Arias，一位具有基本网页设计和应用程序开发知识的业余程序员。该项目作为个人探索的一部分诞生，旨在简化 CSS 开发并使其对所有人更易访问。

---

## **2. 主要特性**

### **2.1. 全局和局部变量**

#### **全局变量**
全局变量在整个 `.lyc` 文件中可用。它们非常适合定义重复使用的值，例如颜色、字体大小或间距。

```lyc
--primary-color: #FF69B4;
--font-size-base: 1rem;
```

这些变量可以在文件的任何地方使用：

```lyc
body {
  background: var(--primary-color);
  font-size: var(--font-size-base);
}
```

#### **局部变量**
局部变量在特定块内定义，并且仅在该范围内可用。这对于仅在特定上下文中相关的值非常有用。

```lyc
button {
  --hover-color: #39FF14;
  background: var(--hover-color);
}
```

**局部变量的优势：**
- 避免不同块中同名变量之间的冲突。
- 提高代码的封装性和可读性。

---

### **2.2. 嵌套块**

嵌套块允许以分层方式编写样式，提高可读性并减少选择器的重复。

```lyc
body {
  margin: 0;
  padding: 0;

  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

生成的 CSS 将是：

```css
body {
  margin: 0;
  padding: 0;
}

body h1, body h2, body h3 {
  color: #FF69B4;
}
```

**嵌套块的优势：**
- 简化复杂样式的编写。
- 减少重复选择器的需求。

---

### **2.3. 层（`@layer`）**

层允许将样式组织到逻辑部分中，例如 `base`、`components` 或 `utilities`。这对于大型项目特别有用。

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

生成的 CSS 将是：

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

**层的优势：**
- 有助于在大型项目中组织样式。
- 允许优先考虑某些样式（例如，`base` 在 `components` 之前）。

---

### **2.4. 结构化注释**

LayerCSS 支持单行注释（`//`）和多行注释（`/* ... */`），便于代码文档化。

```lyc
// 这是一个单行注释

/*
  这是一个多行注释。
  可以跨越多行。
*/
```

**注释的优势：**
- 提高代码的可读性。
- 促进团队协作。

---

### **2.5. 动画和关键帧支持**

你可以直接在 LayerCSS 中定义动画和关键帧。

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

**动画的优势：**
- 简化动态视觉效果的创建。
- 保持设计的一致性。

---

## **3. 实际用例**

尽管 LayerCSS 仍在开发中，尚未有实际测试实现，但这里有一个展示其潜力的假设用例：

### **项目：企业网站**
企业网站需要为多页面提供一致的样式。使用 LayerCSS，你可以将样式组织到层（`@layer`）中，以分离基础、组件和实用程序：

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

这种模块化方法允许开发人员在项目的不同部分工作而不会相互干扰。此外，如果需要更改全局颜色或样式，只需修改一个变量，而无需在多个文件中查找和替换值。

---

## **4. 与现代框架的比较**

| **特性**        | **Tailwind CSS** | **Bootstrap** | **LayerCSS** |
|----------------|-----------------|---------------|-------------|
| 模块化         | 高              | 中            | 高          |
| 可重用性       | 中              | 低            | 高          |
| 易用性         | 中              | 高            | 高          |
| 学习曲线       | 中              | 低            | 低          |
| 自定义         | 中              | 低            | 高          |

**LayerCSS 相较于 Tailwind CSS 和 Bootstrap 的优势：**
- **简洁性**：LayerCSS 不需要学习特定类或复杂配置。
- **自定义**：提供更大的灵活性以适应项目需求。
- **轻量级**：不依赖外部框架，从而减少了项目的最终大小。

---

## **5. 与类似项目的比较**

| **特性**        | **Sass** | **Less** | **PostCSS** | **LayerCSS** |
|----------------|---------|---------|------------|-------------|
| 变量           | 是      | 是      | 使用插件   | 是（全局和局部） |
| 嵌套块         | 是      | 是      | 使用插件   | 是          |
| 层（`@layer`） | 否      | 否      | 使用插件   | 是          |
| 注释           | 仅 `/* ... */` | 仅 `/* ... */` | 仅 `/* ... */` | `//` 和 `/* ... */` |
| 动画和关键帧   | 是      | 是      | 是         | 是          |
| 学习曲线       | 高      | 中      | 中         | 低          |

**LayerCSS 相较于 Sass/Less/PostCSS 的优势：**
- **简洁性**：比 Sass 或 Less 更容易学习和使用。
- **轻量级**：不需要复杂配置或额外工具。
- **兼容性**：生成的 CSS 完全兼容现代浏览器 [[10]]。

---

## **6. Apache 2.0 许可证**

LayerCSS 在 **Apache 2.0 许可证** 下分发，这意味着您可以自由使用、修改和分发软件，只要您包含许可证副本并保留原始版权声明 [[1]]。此许可证非常适合开源项目，因为它鼓励协作和商业用途，没有任何限制。

---

## **7. 结论**

LayerCSS 是一款强大的工具，简化了 CSS 开发。其高级功能，如全局和局部变量、嵌套块、层和结构化注释，使其成为小型和大型项目的理想解决方案。

如果您想改进设计工作流程并创建模块化、可重用和可维护的样式，**LayerCSS 是完美的解决方案！**

---

**创作者备注**：  
该项目处于早期阶段，我的目标是使 LayerCSS 成为一种通用语言，能够与 PHP、JavaScript、TypeScript、Python 和 Java 中的框架和网页设计项目集成。如果您想支持该项目，您的贡献将是无价的！

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01BYKW9)
