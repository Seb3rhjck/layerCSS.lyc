const themes = {
    "vaporwave-light": "styles/vaporwave-light.lyc",
    "vaporwave-dark": "styles/vaporwave-dark.lyc",
    "cyberpunk-light": "styles/cyberpunk-light.lyc",
    "cyberpunk-dark": "styles/cyberpunk-dark.lyc"
};

function switchTheme() {
    const themeStyle = document.getElementById("theme-style");
    const currentTheme = themeStyle.getAttribute("href");
    
    let newTheme = "vaporwave-dark"; // Default next theme
    if (currentTheme.includes("vaporwave-dark")) newTheme = "cyberpunk-dark";
    else if (currentTheme.includes("cyberpunk-dark")) newTheme = "cyberpunk-light";
    else if (currentTheme.includes("cyberpunk-light")) newTheme = "vaporwave-light";
    
    themeStyle.setAttribute("href", themes[newTheme]);
    localStorage.setItem("selectedTheme", newTheme);
}

// Cargar el último tema seleccionado
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || "vaporwave-dark";
    document.getElementById("theme-style").setAttribute("href", themes[savedTheme]);
});
