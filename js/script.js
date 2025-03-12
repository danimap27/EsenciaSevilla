document.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("languageSwitcher");

    const savedLang = localStorage.getItem("preferredLang") || "es";
    langSelect.value = savedLang;
    changeLanguage(savedLang);

    langSelect.addEventListener("change", () => {
      const selectedLang = langSelect.value;
      changeLanguage(selectedLang);
      localStorage.setItem("preferredLang", selectedLang);
    });
  
    // Oculta el precio en celdas ocupadas
    document.querySelectorAll("#calendar td.ocupado .precio").forEach(function(el) {
      el.style.display = "none";
    });
    
    // Para cada celda ocupada, añade un span con la clase "estado" y data-key "calendario_ocupado"
    document.querySelectorAll("#calendar td.ocupado").forEach(function(cell) {
      if (!cell.querySelector(".estado")) {
        var estadoSpan = document.createElement("span");
        estadoSpan.className = "estado";
        estadoSpan.setAttribute("data-key", "calendario_ocupado");
        cell.appendChild(estadoSpan);
      }
    });
  
    // Vuelve a actualizar las traducciones para los nuevos elementos añadidos
    changeLanguage(savedLang);
  });