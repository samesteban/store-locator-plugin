/* function initMap() {
  const container = document.getElementById("slp-map");
  if (!container || typeof slpData === "undefined" || !slpData.locations.length)
    return;

  const map = new google.maps.Map(container, {
    zoom: 12,
    center: {
      lat: parseFloat(slpData.locations[0].lat),
      lng: parseFloat(slpData.locations[0].lng),
    },
  });

  slpData.locations.forEach((loc) => {
    const marker = new google.maps.Marker({
      position: { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) },
      map,
      title: loc.nombre,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
                <div style="max-width: 250px">
                    <strong>${loc.nombre}</strong><br>
                    <p>${loc.direccion}</p>
                    ${loc.telefono ? `<p>📞 ${loc.telefono}</p>` : ""}
                    ${
                      loc.email
                        ? `<p>📧 <a href="mailto:${loc.email}">${loc.email}</a></p>`
                        : ""
                    }
                    ${
                      loc.sitio_web
                        ? `<p>🌐 <a href="${loc.sitio_web}" target="_blank">${loc.sitio_web}</a></p>`
                        : ""
                    }
                </div>
            `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
} */

function initMap() {
  console.log("initMap se está ejecutando");

  if (typeof slpData === "undefined") {
    console.log("slpData no existe");
    return;
  }

  if (!slpData.locations.length) {
    console.log("No hay tiendas cargadas");
    return;
  }

  const container = document.getElementById("slp-map");
  if (!container) {
    console.log("Contenedor #slp-map no encontrado");
    return;
  }

  console.log("Todo listo, creando mapa");

  const map = new google.maps.Map(container, {
    zoom: 17,
    center: {
      lat: parseFloat(slpData.locations[0].lat),
      lng: parseFloat(slpData.locations[0].lng),
    },
  });

  // marcador de prueba
  new google.maps.Marker({
    position: {
      lat: parseFloat(slpData.locations[0].lat),
      lng: parseFloat(slpData.locations[0].lng),
    },
    map,
    title: slpData.locations[0].nombre,
  });
}

// Esperar a que Google Maps esté listo
function waitForGoogleMaps() {
  if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
    initMap();
  } else {
    setTimeout(waitForGoogleMaps, 300);
  }
}

document.addEventListener("DOMContentLoaded", waitForGoogleMaps);
