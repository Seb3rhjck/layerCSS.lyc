# **Dokumentasyon ng LayerCSS**

[![Lisensya: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## **1. Introduksyon**

### **Ano ang LayerCSS?**
Ang **LayerCSS** ay isang lengguwahe ng disenyo batay sa CSS na nagpapakilala ng mga advanced na function upang gawing mas madali ang paglikha ng mga modular, reusable, at maintainable na estilo. Ito ay dinisenyo upang labanan ang mga limitasyon ng tradisyonal na CSS sa pamamagitan ng pagdaragdag ng suporta para sa global at lokal na variable, nested blocks, layers (`@layer`), at structured comments.

Ang pilosopiya sa likod ng LayerCSS ay simple pero makapangyarihan:
- **Modularity**: Hatiin ang iyong mga estilo sa lohikal na seksyon.
- **Reusability**: Tukuyin ang mga halaga isa lang beses at gamitin ito sa maraming lugar.
- **Maintainability**: Baguhin ang isang halaga sa iisang lugar at maapektuhan ang buong proyekto.

**May-akda**: Sebastian (Balthier) Ordoñez Arias, isang amateur na programmer na may pangunahing kaalaman sa web design at basic app development. Ang proyektong ito ay nagsimula bilang isang personal na eksplorasyon upang gawing mas simple ang CSS development at gawing mas accessible sa lahat [[1]].

---

## **2. Mga Pangunahing Katangian**

### **2.1. Global at Lokal na Variable**

#### **Global na Variable**
Ang mga global na variable ay magagamit sa buong `.lyc` file. Ang mga ito ay ideal para tukuyin ang mga reusable na halaga tulad ng kulay, font size, o padding.

```lyc
--primary-color: #FF69B4;
--font-size-base: 1rem;
```

Maaaring gamitin ang mga variable na ito sa anumang bahagi ng file:

```lyc
body {
  background: var(--primary-color);
  font-size: var(--font-size-base);
}
```

#### **Lokal na Variable**
Ang mga lokal na variable ay natutukoy sa loob ng isang partikular na block at magagamit lamang sa loob ng scope na iyon. Ito ay kapaki-pakinabang para sa mga halaga na may kaugnayan lamang sa isang tiyak na konteksto.

```lyc
button {
  --hover-color: #39FF14;
  background: var(--hover-color);
}
```

**Mga Kabutihang Dulot ng Lokal na Variable:**
- Pinipigilan ang mga conflict sa pagitan ng mga variable na may parehong pangalan sa iba't ibang block.
- Pinabubuti ang encapsulation at readability ng code.

---

### **2.2. Nested Blocks**

Ang mga nested block ay nagbibigay-daan sa pagsulat ng mga estilo nang hierarkikal, pinabubuti ang readability at binabawasan ang pag-uulit ng mga selector.

```lyc
body {
  margin: 0;
  padding: 0;

  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

Ang nabuong CSS ay magiging:

```css
body {
  margin: 0;
  padding: 0;
}

body h1, body h2, body h3 {
  color: #FF69B4;
}
```

**Mga Kabutihang Dulot ng Nested Blocks:**
- Pinapadali ang pagsulat ng mga komplikadong estilo.
- Binabawasan ang pangangailangan na ulitin ang mga selector.

---

### **2.3. Layers (`@layer`)**

Ang mga layer ay nagbibigay-daan sa pag-organisa ng mga estilo sa lohikal na seksyon tulad ng `base`, `components`, o `utilities`. Ito ay partikular na kapaki-pakinabang para sa malalaking proyekto.

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

Ang nabuong CSS ay magiging:

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

**Mga Kabutihang Dulot ng Layers:**
- Pinapadali ang pag-organisa ng mga estilo sa malalaking proyekto.
- Nagbibigay-daan na iprioridad ang ilang estilo kaysa sa iba (halimbawa, `base` bago ang `components`).

---

### **2.4. Structured Comments**

Ang LayerCSS ay sumusuporta sa one-line comments (`//`) at multi-line comments (`/* ... */`), na nagpapadali sa dokumentasyon ng code.

```lyc
// Ito ay isang one-line comment

/*
  Ito ay isang multi-line comment.
  Maaaring umabot sa maraming linya.
*/
```

**Mga Kabutihang Dulot ng Comments:**
- Pinabubuti ang readability ng code.
- Pinapadali ang kolaborasyon sa mga team.

---

### **2.5. Suporta para sa Animations at Keyframes**

Maaari mong tukuyin ang animations at keyframes direkta sa LayerCSS.

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

**Mga Kabutihang Dulot ng Animations:**
- Pinapadali ang paglikha ng dynamic na visual effects.
- Pinapanatili ang consistency sa disenyo.

---

## **3. Tunay na Halimbawa ng Paggamit**

Bagama't ang LayerCSS ay nasa paunang yugto pa rin at walang tunay na implementasyon, narito ang isang hypothetical na halimbawa na nagpapakita ng potensyal nito:

### **Proyekto: Corporate Website**
Ang isang corporate website ay nangangailangan ng consistent na estilo para sa maraming pahina. Gamit ang LayerCSS, maaari mong i-organisa ang mga estilo sa layers (`@layer`) upang ihiwalay ang base, components, at utilities:

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

Ang approach na ito ay modular, na nagbibigay-daan sa mga developer na magtrabaho sa iba't ibang bahagi ng proyekto nang hindi nakikipag-interfere sa isa't isa. Bukod dito, kung kinakailangan na baguhin ang isang kulay o global na estilo, sapat na baguhin ang isang variable sa halip na hanapin at palitan ang mga halaga sa maraming file.

---

## **4. Paghahambing sa Modernong Frameworks**

| **Katangian**        | **Tailwind CSS** | **Bootstrap** | **LayerCSS** |
|----------------------|-----------------|---------------|-------------|
| Modularity           | Mataas          | Katamtaman    | Mataas      |
| Reusability          | Katamtaman      | Mababa        | Mataas      |
| Ease of Use          | Katamtaman      | Mataas        | Mataas      |
| Learning Curve       | Katamtaman      | Mababa        | Mababa      |
| Customization        | Katamtaman      | Mababa        | Mataas      |

**Mga Kabutihang Dulot ng LayerCSS laban sa Tailwind CSS at Bootstrap:**
- **Simplicity**: Hindi nangangailangan ng pag-aaral ng specific classes o complex configurations.
- **Customization**: Nagbibigay ng mas malaking flexibility para i-adapt ang mga estilo sa pangangailangan ng proyekto.
- **Lightweight**: Hindi depende sa external frameworks, na binabawasan ang final size ng proyekto [[10]].

---

## **5. Lisensya ng Apache 2.0**

Ang LayerCSS ay ipinamamahagi sa ilalim ng **Apache License 2.0**, na nangangahulugan na maaari mong gamitin, baguhin, at ipamahagi ang software nang libre, hangga't kasama mo ang isang kopya ng lisensya at panatilihin ang mga orihinal na copyright notice [[1]]. Ang lisensyang ito ay ideal para sa open-source projects, dahil nagtutulak ng kolaborasyon at commercial use nang walang restrictions.

---

## **6. Konklusyon**

Ang LayerCSS ay isang makapangyarihang tool na nagpapasimple sa CSS development. Ang mga advanced na function nito, tulad ng global at lokal na variables, nested blocks, layers, at structured comments, ginagawang ideal na solusyon para sa maliliit hanggang malalaking proyekto.

Kung nais mong mapabuti ang iyong workflow sa disenyo at lumikha ng modular, reusable, at maintainable na estilo, **ang LayerCSS ay ang perpektong solusyon!**

---

**Tandaan ng May-akda**:  
Ang proyektong ito ay nasa paunang yugto, at ang aking layunin ay gawing universal na lengguwahe ang LayerCSS na maaaring i-integrate sa frameworks at web design projects sa PHP, JavaScript, TypeScript, Python, at Java. Kung nais mong suportahan ang proyektong ito, ang iyong kontribusyon ay mahalaga!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01BYKW9)
