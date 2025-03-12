const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const mensajeInput = document.getElementById('mensajeInput');

chatForm.addEventListener('submit', function(e) {
e.preventDefault();
const mensajeUsuario = mensajeInput.value;
const messages = [
    {
        role: "system",
        content: "Eres el asistente del Apartamento Turístico Esencia Sevilla, ubicado cerca de la estacion Santa Justa, Sevilla. Tu función es ayudar a los clientes recomendando sitios, actividades y lugares de interés en Sevilla. No digas nada de tiempo para llegar al sitio ni distancias. Contesta en el idioma del cliente."
    },
    { role: "user", content: mensajeUsuario }
];
agregarMensaje('usuario', mensajeUsuario);
mensajeInput.value = '';

fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo", // Cambiar a "gpt-4o" para mejorar la respuesta
        messages: messages,
        max_tokens: 500,
        stop: ["\n", "Usuario:", "IA:"]

    })
})
.then(response => response.json())
.then(data => {
    const respuesta = data.choices[0].message.content.trim();
    agregarMensaje('ia', respuesta);
})
.catch(error => {
    console.error('Error:', error);
    agregarMensaje('ia', 'Lo siento, hubo un error al procesar tu mensaje.');
});
});


function agregarMensaje(remitente, texto) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje', remitente);
    mensajeDiv.innerHTML = marked.parse(texto);
    chatBox.appendChild(mensajeDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
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
});