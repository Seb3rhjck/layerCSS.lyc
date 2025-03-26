# **Documentazione di LayerCSS**

[![Licenza: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-20)

## **1. Introduzione**

### **Cos'è LayerCSS?**
LayerCSS è un linguaggio di design basato su CSS che introduce funzionalità avanzate per facilitare la creazione di stili modulari, riutilizzabili e manutenibili. È progettato per superare i limiti del CSS tradizionale aggiungendo supporto per variabili globali e locali, blocchi nidificati, strati (`@layer`) e commenti strutturati.

La filosofia dietro LayerCSS è semplice ma potente:
- **Modularità**: Dividi i tuoi stili in sezioni logiche.
- **Riutilizzo**: Definisci valori una volta e usali in più luoghi.
- **Facilità di manutenzione**: Cambia un valore in un punto e influenzerai tutto il progetto.

**Creatore**: Sebastian (Balthier) Ordoñez Arias, un programmatore amatoriale con conoscenze di base in web design e sviluppo di applicazioni. Questo progetto è nato come esplorazione personale per semplificare lo sviluppo in CSS e renderlo accessibile a tutti.

---

## **2. Caratteristiche Principali**

### **2.1. Variabili Globali e Locali**

#### **Variabili Globali**
Le variabili globali sono disponibili in tutto il file `.lyc`. Sono ideali per definire valori riutilizzabili, come colori, dimensioni del carattere o spaziature.

```lyc
--primary-color: #FF69B4;
--font-size-base: 1rem;
```

Queste variabili possono essere utilizzate ovunque nel file:

```lyc
body {
  background: var(--primary-color);
  font-size: var(--font-size-base);
}
```

#### **Variabili Locali**
Le variabili locali sono definite all'interno di un blocco specifico e sono disponibili solo in quel contesto. Questo è utile per valori rilevanti solo in un determinato ambito.

```lyc
button {
  --hover-color: #39FF14;
  background: var(--hover-color);
}
```

**Vantaggi delle Variabili Locali:**
- Evitano conflitti tra variabili con lo stesso nome in blocchi diversi.
- Migliorano l'incapsulamento e la leggibilità del codice.

---

### **2.2. Blocchi Nidificati**

I blocchi nidificati permettono di scrivere stili gerarchicamente, migliorando la leggibilità e riducendo la ripetizione dei selettori.

```lyc
body {
  margin: 0;
  padding: 0;

  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

Il CSS generato sarà:

```css
body {
  margin: 0;
  padding: 0;
}

body h1, body h2, body h3 {
  color: #FF69B4;
}
```

**Vantaggi dei Blocchi Nidificati:**
- Semplificano la scrittura di stili complessi.
- Riducono la necessità di ripetere selettori.

---

### **2.3. Strati (`@layer`)**

Gli strati permettono di organizzare gli stili in sezioni logiche, come `base`, `componenti` o `utilità`. Questo è particolarmente utile per progetti grandi.

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

Il CSS generato sarà:

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

**Vantaggi degli Strati:**
- Facilitano l'organizzazione degli stili in progetti grandi.
- Permettono di dare priorità a certi stili rispetto ad altri (ad esempio, `base` prima di `componenti`).

---

### **2.4. Commenti Strutturati**

LayerCSS supporta commenti su una riga (`//`) e su più righe (`/* ... */`), facilitando la documentazione del codice.

```lyc
// Questo è un commento su una riga

/*
  Questo è un commento su più righe.
  Può estendersi su più righe.
*/
```

**Vantaggi dei Commenti:**
- Migliorano la leggibilità del codice.
- Facilitano la collaborazione nei team.

---

### **2.5. Supporto per Animazioni e Keyframes**

Puoi definire animazioni e keyframes direttamente in LayerCSS.

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

**Vantaggi delle Animazioni:**
- Semplificano la creazione di effetti visivi dinamici.
- Mantengono la coerenza nel design.

---

## **3. Caso d'Uso Reale**

Anche se LayerCSS è ancora in fase di sviluppo e non ci sono implementazioni reali, ecco un caso d'uso ipotetico che dimostra il suo potenziale:

### **Progetto: Sito Web Aziendale**
Un sito web aziendale richiede stili coerenti per più pagine. Con LayerCSS, puoi organizzare gli stili in strati (`@layer`) per separare la base, i componenti e le utilità:

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

Questo approccio modulare permette agli sviluppatori di lavorare su diverse parti del progetto senza interferire tra loro. Inoltre, se è necessario cambiare un colore o uno stile globale, basta modificare una variabile invece di cercare e sostituire valori in più file.

---

## **4. Confronto con Framework Moderni**

| **Caratteristica**        | **Tailwind CSS** | **Bootstrap** | **LayerCSS** |
|--------------------------|-----------------|---------------|-------------|
| Modularità              | Alta            | Media         | Alta        |
| Riutilizzo              | Media           | Bassa         | Alta        |
| Facilità d'Uso          | Media           | Alta          | Alta        |
| Curva di Apprendimento  | Media           | Bassa         | Bassa       |
| Personalizzazione       | Media           | Bassa         | Alta        |

**Vantaggi di LayerCSS rispetto a Tailwind CSS e Bootstrap:**
- **Semplicità**: LayerCSS non richiede di imparare classi specifiche o configurazioni complesse.
- **Personalizzazione**: Offre maggiore flessibilità per adattare gli stili alle esigenze del progetto.
- **Leggerezza**: Non dipende da framework esterni, riducendo le dimensioni finali del progetto.

---

## **5. Confronto con Progetti Simili**

| **Caratteristica**        | **Sass** | **Less** | **PostCSS** | **LayerCSS** |
|--------------------------|---------|---------|------------|-------------|
| Variabili               | Sì      | Sì      | Con plugin | Sì (globale e locale) |
| Blocchi Nidificati      | Sì      | Sì      | Con plugin | Sì         |
| Strati (`@layer`)       | No      | No      | Sì (con plugin) | Sì         |
| Commenti                | Solo `/* ... */` | Solo `/* ... */` | Solo `/* ... */` | `//` e `/* ... */` |
| Animazioni e Keyframes  | Sì      | Sì      | Sì          | Sì         |
| Curva di Apprendimento  | Alta    | Media   | Media       | Bassa        |

**Vantaggi di LayerCSS rispetto a Sass/Less/PostCSS:**
- **Semplicità**: Più facile da imparare e usare rispetto a Sass o Less.
- **Leggero**: Non richiede configurazioni complesse o strumenti aggiuntivi.
- **Compatibilità**: Il CSS generato è completamente compatibile con i browser moderni [[10]].

---

## **6. Licenza Apache 2.0**

LayerCSS è distribuito sotto la **Licenza Apache 2.0**, il che significa che puoi usare, modificare e distribuire il software liberamente, purché includi una copia della licenza e mantieni gli avvisi di copyright originali [[1]]. Questa licenza è ideale per progetti open source, poiché incoraggia la collaborazione e l'uso commerciale senza restrizioni.

---

## **7. Conclusione**

LayerCSS è uno strumento potente che semplifica lo sviluppo in CSS. Le sue funzionalità avanzate, come variabili globali e locali, blocchi nidificati, strati e commenti strutturati, lo rendono una soluzione ideale per progetti sia piccoli che grandi.

Se vuoi migliorare il tuo flusso di lavoro di design e creare stili modulari, riutilizzabili e manutenibili, **LayerCSS è la soluzione perfetta!**

---

**Nota del Creatore**:  
Questo progetto è nelle sue prime fasi, e il mio obiettivo è che LayerCSS diventi un linguaggio universale che possa integrarsi con framework e progetti di design web in PHP, JavaScript, TypeScript, Python e Java. Se desideri supportare questo progetto, il tuo contributo sarà inestimabile!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01BYKW9)
