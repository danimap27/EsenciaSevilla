const aptLocation = { lat: 37.39693638738496, lng: -5.97402177755067 };

const sitiosInteres = [
     {
       lat: 37.38626361919529,
       lng: -5.99261370342527,
       title: "La Giralda",
       info: "Campanario emblemático de la Catedral de Sevilla."
     },
     {
       lat: 37.383042269072796, 
       lng: -5.990242379770129,
       title: "Real Alcázar",
       info: "Palacios y jardines de arquitectura mudéjar."
     },
     {
       lat: 37.377058115652076, 
       lng: -5.987572973558896,
       title: "Plaza de España",
       info: "Lugar icónico con arquitectura regionalista."
     },
     {
       lat: 37.393278458738145, 
       lng: -5.991750083774865,
       title: "Metropol Parasol (Las Setas)",
       info: "Estructura de madera con vistas panorámicas."
     },
     {
       lat: 37.405581134962915, 
       lng: -5.999359602953497,
       title: "Isla Mágica",
       info: "Parque temático y de atracciones."
     },
     {
       lat: 37.3707775979847, 
       lng: -5.991078468989141,
       title: "Acuario de Sevilla",
       info: "Más de 400 especies marinas."
     },
     {
       lat: 37.37452090476336, 
       lng: -5.988328755051837,
       title: "Parque de María Luisa",
       info: "Extensos jardines para pasear."
     },
     {
       lat: 37.38572722162218, 
       lng: -6.003621632261038,
       title: "Mercado Lonja del Barranco",
       info: "Mercado gastronómico junto al río."
     },
     {
       lat: 37.38525722278703,
       lng: -6.000138057893377,
       title: "Mercado de Triana",
       info: "Bares de tapas y ambiente local."
     },
     {
       lat: 37.39661834267347, 
       lng: -5.9726490034248725,
       title: "Bar Cafetería Danubio",
       info: "Desayunos y tapas variadas."
     },
     {
       lat: 37.38759669686757, 
       lng: -5.991187413811612,
       title: "Museo de Bellas Artes",
       info: "Obras maestras de la pintura sevillana."
     },
     {
       lat: 37.38251254803848, 
       lng: -5.996312803425386,
       title: "Torre del Oro",
       info: "Antigua torre defensiva con museo naval."
     },
     {
       lat: 37.40262240412838, 
       lng: -5.989415912749865,
       title: "Basílica de la Macarena",
       info: "Templo con la famosa Virgen de la Esperanza."
     }
   ];

   let map;
   let directionsService;
   let directionsRenderer;

   function initMap() {
     map = new google.maps.Map(document.getElementById("map"), {
       zoom: 13,
       center: aptLocation,
     });

     const aptMarker = new google.maps.Marker({
       position: aptLocation,
       map,
       title: "Apartamento Sevilla",
       icon: {
         url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
         scaledSize: new google.maps.Size(40, 40),
       }
     });

     const aptInfoWindow = new google.maps.InfoWindow({
       content: "<h5>Apartamento Sevilla</h5><p>Tu punto de partida en la ciudad.</p>"
     });

     aptMarker.addListener("click", () => {
       aptInfoWindow.open(map, aptMarker);
     });

     directionsService = new google.maps.DirectionsService();
     directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

     sitiosInteres.forEach(sitio => {
       const marker = new google.maps.Marker({
         position: { lat: sitio.lat, lng: sitio.lng },
         map,
         title: sitio.title
       });

       marker.addListener("click", () => {
         mostrarRutaEnBus(sitio);
       });
     });
   }

   function mostrarRutaEnBus(sitio) {
     const request = {
       origin: aptLocation,
       destination: { lat: sitio.lat, lng: sitio.lng },
       travelMode: google.maps.TravelMode.TRANSIT,
       transitOptions: { modes: ['BUS'] },
       provideRouteAlternatives: false,
       unitSystem: google.maps.UnitSystem.METRIC
     };

     directionsService.route(request, (result, status) => {
       if (status === "OK") {
         directionsRenderer.setDirections(result);
         const route = result.routes[0];
         const pasosHTML = parseTransitSteps(route);
         document.getElementById("rutaInfo").innerHTML = `
           <h5>Ruta en Bus para: ${sitio.title}</h5>
           <p><strong>Descripción:</strong> ${sitio.info}</p>
           ${pasosHTML}
         `;
       } else {
         alert("No se pudo calcular la ruta en bus. Status: " + status);
       }
     });
   }

   function parseTransitSteps(route) {
     const legs = route.legs;
     if (!legs || legs.length === 0) return "<p>Sin detalles de ruta.</p>";

     const steps = legs[0].steps;
     let listItems = "";

     steps.forEach((step) => {
       if (step.travel_mode === "WALKING") {
         listItems += `<li>🚶 Camina ${step.distance.text} (${step.duration.text}) - ${step.instructions}</li>`;
       } else if (step.travel_mode === "TRANSIT") {
         const transit = step.transit;
         const linea = transit.line.short_name || transit.line.name;
         const salida = transit.departure_stop.name;
         const llegada = transit.arrival_stop.name;

         listItems += `
           <li>🚌 <strong>Bus ${linea}</strong>: ${step.distance.text} (${step.duration.text})<br>
           🚏 Paradas: ${salida} → ${llegada}
           </li>
         `;
       }
     });

     return `<ul>${listItems}</ul>`;
   }
   document.addEventListener("DOMContentLoaded", () => {
     const langSelect = document.getElementById("languageSwitcher");
     // Restaurar idioma guardado en localStorage (o 'es' por defecto)
     const savedLang = localStorage.getItem("preferredLang") || "es";
     langSelect.value = savedLang;
     changeLanguage(savedLang);

     langSelect.addEventListener("change", () => {
       const selectedLang = langSelect.value;
       changeLanguage(selectedLang);
       // Guardar selección en localStorage
       localStorage.setItem("preferredLang", selectedLang);
     });
   });