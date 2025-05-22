/**
 * Módulo principal de mapa del plugin Store Locator
 * -------------------------------------------------
 * - Renderiza un mapa de Google Maps con estilo gris personalizado
 * - Muestra tiendas cargadas desde ACF (vía PHP → slpData)
 * - Permite geolocalizar al usuario y mostrar las tiendas más cercanas
 * - Muestra infowindows personalizadas y control de zoom
 * - Incluye mensajes tipo toast para mejorar la UX
 */

// Estilo personalizado en escala de grises para el mapa
const mapStyle = [
  // Oculta íconos de etiquetas
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  // Oculta bordes administrativos
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  // Estilo para zonas verdes y urbanas
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#e0e0e0" }],
  },
  // Oculta puntos de interés (colegios, restaurantes, etc.)
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  // Calles principales con bordes más oscuros
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#b0b0b0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#9a9a9a" }, { weight: 1 }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#c8c8c8" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b8b8b8" }, { weight: 0.6 }],
  },
  // Calles locales más suaves
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#cdcdcd" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d5d5d5" }],
  },
  // Etiquetas de calles
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#666666" }],
  },
  // Oculta transporte público
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  // Agua y sus etiquetas
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#d2d2d2" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#888888" }],
  },
  // Relieve natural más claro
  {
    featureType: "landscape.natural.terrain",
    elementType: "geometry.fill",
    stylers: [{ color: "#f2f2f2" }],
  },
  // Ajuste de texto y borde en etiquetas de calles
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#555555" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { weight: 1.5 }],
  },
];

// Distancia máxima (en km) para considerar una tienda como cercana
const kmRadius = 5;

/**
 * Genera el contenido HTML del InfoWindow para cada tienda
 */
function createInfoWindowContent(loc) {
  return `
    <div class="slp-infowindow" style="max-width: 250px">
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
  `;
}

/**
 * Muestra un mensaje flotante tipo toast
 */
function showToast(message) {
  const toast = document.getElementById("slp-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 4000);
}

/**
 * Decodifica entidades HTML en nombres con caracteres especiales (&, á, etc.)
 */
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Intenta obtener ubicación automáticamente si el usuario lo permite
 */
function autoGeolocateIfAllowed(map) {
  if (!navigator.geolocation || !navigator.permissions) return;

  navigator.permissions
    .query({ name: "geolocation" })
    .then((permissionStatus) => {
      if (permissionStatus.state === "granted") {
        locateAndCenter(map); // Ya tiene permiso
      } else if (permissionStatus.state === "prompt") {
        // Pregunta al usuario la primera vez
        navigator.geolocation.getCurrentPosition(
          (position) => {
            locateAndCenter(map, position);
          },
          (error) => {
            console.warn("Permiso no otorgado o cancelado:", error);
          }
        );
      } else {
        // Denegado previamente
        console.log("Permiso de geolocalización denegado anteriormente.");
      }
    });
}

/**
 * Inicializa el mapa, crea marcadores e InfoWindows
 */
function initMap() {
  const container = document.getElementById("slp-map");
  if (!container || typeof slpData === "undefined" || !slpData.locations.length)
    return;

  const bounds = new google.maps.LatLngBounds();

  const map = new google.maps.Map(container, {
    zoom: 12,
    center: {
      lat: parseFloat(slpData.locations[0].lat),
      lng: parseFloat(slpData.locations[0].lng),
    },
    styles: mapStyle,
    disableDefaultUI: true,
  });

  // Recorre todas las tiendas para generar sus marcadores
  slpData.locations.forEach((loc) => {
    const position = {
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lng),
    };

    const markerOptions = {
      position,
      map,
      title: decodeHTML(loc.nombre),
    };

    // Si hay ícono personalizado
    if (slpData.customIcon) {
      markerOptions.icon = {
        url: slpData.customIcon,
        scaledSize: new google.maps.Size(36, 36),
      };
    }

    const marker = new google.maps.Marker(markerOptions);

    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(loc),
    });

    // Cierra otros InfoWindows abiertos al hacer clic
    if (!window.slpOpenInfoWindow) {
      window.slpOpenInfoWindow = null;
    }

    marker.addListener("click", () => {
      if (window.slpOpenInfoWindow) {
        window.slpOpenInfoWindow.close();
      }
      map.panTo(marker.getPosition());
      map.setZoom(18);
      infoWindow.open(map, marker);
      window.slpOpenInfoWindow = infoWindow;
    });

    bounds.extend(position);
  });

  map.fitBounds(bounds); // Centra el mapa mostrando todos los marcadores

  autoGeolocateIfAllowed(map); // Intenta ubicar al usuario automáticamente

  // Funcionalidad del botón "Mostrar tiendas cercanas"
  const geolocateButton = document.getElementById("slp-geolocate-btn");

  if (geolocateButton) {
    geolocateButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("La geolocalización no está disponible en este navegador.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const nearbyBounds = new google.maps.LatLngBounds();

          slpData.locations.forEach((loc) => {
            const distance = getDistance(
              userLat,
              userLng,
              parseFloat(loc.lat),
              parseFloat(loc.lng)
            );
            if (distance <= kmRadius) {
              nearbyBounds.extend({
                lat: parseFloat(loc.lat),
                lng: parseFloat(loc.lng),
              });
            }
          });

          if (!nearbyBounds.isEmpty()) {
            map.fitBounds(nearbyBounds);
          } else {
            showToast("No hay tiendas cercanas en un radio de 5 km.");
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            showToast(
              "La ubicación está bloqueada. Actívala en los permisos del navegador."
            );
          } else {
            showToast("No pudimos obtener tu ubicación.");
          }
          console.error(error);
        }
      );
    });
  }
}

/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 */
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Centra el mapa en las tiendas cercanas a la ubicación del usuario
 */
function locateAndCenter(map, position = null) {
  const success = (coords) => {
    const userLat = coords.latitude;
    const userLng = coords.longitude;

    const bounds = new google.maps.LatLngBounds();
    let tiendasCercanas = 0;

    slpData.locations.forEach((loc) => {
      const distance = getDistance(
        userLat,
        userLng,
        parseFloat(loc.lat),
        parseFloat(loc.lng)
      );
      if (distance <= kmRadius) {
        bounds.extend({
          lat: parseFloat(loc.lat),
          lng: parseFloat(loc.lng),
        });
        tiendasCercanas++;
      }
    });

    if (tiendasCercanas > 0) {
      map.fitBounds(bounds);
    } else {
      showToast("No hay tiendas cercanas en un radio de 5 km.");
    }
  };

  if (position) {
    success(position.coords);
  } else {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos.coords),
      (err) => console.warn("No se pudo obtener la ubicación:", err)
    );
  }
}

// Espera a que la API de Google Maps esté lista antes de inicializar
function waitForGoogleMaps() {
  if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
    initMap();
  } else {
    setTimeout(waitForGoogleMaps, 300);
  }
}

// Inicializa el mapa cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", waitForGoogleMaps);
