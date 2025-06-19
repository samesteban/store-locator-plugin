/**
 * Store Locator Map Module
 * -----------------------
 * - Renderiza un mapa Google Maps en escala de grises.
 * - Muestra tiendas desde slpData (inyectado por PHP).
 * - Incluye geolocalización, búsqueda, listado de tiendas y panel de detalles.
 * - Todo el UI se integra con el CSS externo.
 */

// --- Configuración de estilos del mapa (gris) ---
const mapStyle = [
  // Oculta TODO tipo de iconos (incluidos los de POIs)
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  // Oculta TODO tipo de puntos de interés (POI) y sus etiquetas
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  // Oculta hospitales y otros servicios
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  // Oculta todo lo que no sea etiquetas de calles o lugares geográficos relevantes
  {
    featureType: "poi.park",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
];

const kmRadius = 5; // Radio de búsqueda de tiendas cercanas (en km)

// --- Iconos Redes sociales ---
function getSocialIcon(platform, size = 32, color = "rgba(99,99,99,1)") {
  const icons = {
    instagram: `<svg aria-label="Instagram" title="Instagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"></path></svg>`,
    facebook: `<svg aria-label="Facebook" title="Facebook" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M15.4024 21V14.0344H17.7347L18.0838 11.3265H15.4024V9.59765C15.4024 8.81364 15.62 8.27934 16.7443 8.27934L18.1783 8.27867V5.85676C17.9302 5.82382 17.0791 5.75006 16.0888 5.75006C14.0213 5.75006 12.606 7.01198 12.606 9.32952V11.3265H10.2677V14.0344H12.606V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15.4024Z"></path></svg>`,
    whatsapp: `<svg aria-label="WhatsApp" title="WhatsApp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>`,
    tiktok: `<svg aria-label="TikTok" title="TikTok" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z"></path></svg>`,
    x: `<svg aria-label="X (Twitter)" title="X (Twitter)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path></svg>`,
    linkedin: `<svg aria-label="LinkedIn" title="LinkedIn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"></path></svg>`,
  };
  return icons[platform] || ""; // Devuelve vacío si no existe
}

// --- Utilidades básicas ---

/** Decodifica entidades HTML (&, á, etc.) en cadenas */
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/** Calcula la distancia entre dos coordenadas usando Haversine */
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

/** Muestra un toast flotante con un mensaje */
function showToast(message) {
  const toast = document.getElementById("slp-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.opacity = 1;
  setTimeout(() => {
    toast.style.opacity = 0;
  }, 4000);
}

/** Genera el HTML para la InfoWindow de una tienda */
function createInfoWindowContent(loc) {
  return `
    <div class="slp-infowindow" style="max-width: 250px">
      <strong>${loc.nombre}</strong><br>
      <p>${loc.direccion}</p>
      ${loc.telefono ? `<p>${loc.telefono}</p>` : ""}
      ${
        loc.email ? `<p><a href="mailto:${loc.email}">${loc.email}</a></p>` : ""
      }
      ${
        loc.sitio_web
          ? `<p><a href="${loc.sitio_web}" target="_blank">${loc.sitio_web}</a></p>`
          : ""
      }
      ${
        loc.redes && loc.redes.length
          ? loc.redes
              .map(
                (red) =>
                  `<p>🔗 <a href="${red.url}" target="_blank">${getSocialIcon(
                    red.platform
                  )}</a></p>`
              )
              .join("")
          : ""
      }
    </div>
  `;
}

// --- UTILIDADES DE FILTRADO ---
// Filtra tiendas cercanas a un punto, en un radio (km)
function getNearbyStores(centerLat, centerLng, radiusKm = 5) {
  return slpData.locations.filter((loc) => {
    const dist = getDistance(
      centerLat,
      centerLng,
      parseFloat(loc.lat),
      parseFloat(loc.lng)
    );
    return dist <= radiusKm;
  });
}

// Filtra las primeras 10 tiendas de la Región Metropolitana
function getDefaultStores(region = "Metropolitana") {
  const matches = slpData.locations.filter(
    (loc) =>
      loc.direccion &&
      loc.direccion.toLowerCase().includes(region.toLowerCase())
  );
  return matches.slice(0, 10);
}

// --- Geolocalización ---

/**
 * Si el usuario ya otorgó permiso, obtiene su ubicación y centra el mapa.
 * Si está en 'prompt', pide el permiso.
 */
function autoGeolocateIfAllowed(map) {
  if (!navigator.geolocation || !navigator.permissions) return;
  navigator.permissions
    .query({ name: "geolocation" })
    .then((permissionStatus) => {
      if (permissionStatus.state === "granted") {
        locateAndCenter(map); // Sin preguntar
      } else if (permissionStatus.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (position) => locateAndCenter(map, position),
          (error) => console.warn("Permiso no otorgado o cancelado:", error)
        );
      } else {
        // Denegado previamente
        console.log("Permiso de geolocalización denegado anteriormente.");
      }
    });
}

/**
 * Centra el mapa en las tiendas cercanas a la ubicación del usuario.
 * Si no encuentra, muestra toast.
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
        bounds.extend({ lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) });
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

/**
 * Busca tiendas en anillos de 5 km hasta encontrar al menos una.
 * Si no encuentra, muestra toast.
 */
function findNearbyStores(center, map) {
  let radius = kmRadius * 1000; // metros
  const maxIncrements = 5; // hasta +25 km
  for (let i = 0; i <= maxIncrements; i++) {
    const bounds = new google.maps.LatLngBounds();
    let count = 0;
    slpData.locations.forEach((loc) => {
      const dist =
        getDistance(
          center.lat(),
          center.lng(),
          parseFloat(loc.lat),
          parseFloat(loc.lng)
        ) * 1000;
      if (dist <= radius) {
        bounds.extend({ lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) });
        count++;
      }
    });
    if (count > 0) {
      map.fitBounds(bounds);
      return;
    }
    radius += kmRadius * 1000;
  }
  showToast(
    "No se encontraron tiendas en un radio de " +
      kmRadius * (maxIncrements + 1) +
      " km."
  );
}

// --- Búsqueda con Autocomplete ---

/**
 * Inicializa el Autocomplete de Google Places en el input.
 * Centra el mapa y busca tiendas cercanas al seleccionar ubicación.
 */
function initAutocomplete(map) {
  const input = document.getElementById("slp-place-input");
  if (!input || !google.maps.places) return;
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setFields(["geometry"]);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      showToast("No se encontró esa ubicación.");
      return;
    }
    map.panTo(place.geometry.location);
    findNearbyStores(place.geometry.location, map);
  });
}

// --- Renderizado del listado de tiendas y panel info ---

/**
 * Renderiza las cards de tienda en el sidebar y las enlaza a los marcadores.
 * Al seleccionar, marca la card, el pin y muestra el panel lateral.
 */
function renderStoreList(map, markers, storesToShow) {
  const container = document.querySelector(".slp-locator-list");
  if (!container) return;

  // Mostrar sólo los marcadores de las tiendas en storesToShow
  markers.forEach((marker, idx) => {
    // Chequea si el marcador corresponde a una tienda del listado
    const visible = storesToShow.some(
      (loc) =>
        parseFloat(loc.lat) === marker.getPosition().lat() &&
        parseFloat(loc.lng) === marker.getPosition().lng()
    );
    marker.setVisible(visible);
  });

  container.innerHTML = "";

  if (!storesToShow.length) {
    container.innerHTML =
      '<div class="slp-empty">No hay tiendas para mostrar.</div>';
    return;
  }

  const cardNodes = [];
  let activeIndex = null;

  // Info panel y botón cerrar
  const infoPanel = document.getElementById("slp-info-panel");
  const panelContent = document.getElementById("slp-info-panel-content");
  const closeBtn = document.getElementById("slp-panel-close");

  function clearActive() {
    cardNodes.forEach((c) => c.classList.remove("active"));
    markers.forEach((marker, idx) => {
      if (marker.setIcon && slpData.customIcon) {
        marker.setIcon({
          url: slpData.customIcon,
          scaledSize: new google.maps.Size(32, 32),
        });
      } else if (marker.setIcon) {
        marker.setIcon(null);
      }
    });
    activeIndex = null;
    if (infoPanel) infoPanel.style.display = "none";
  }
  if (closeBtn) closeBtn.onclick = clearActive;

  // Relación entre storesToShow y slpData.locations (por índice)
  function getGlobalIndex(loc) {
    return slpData.locations.findIndex(
      (store) => store.lat === loc.lat && store.lng === loc.lng
    );
  }

  storesToShow.forEach((loc, idx) => {
    const card = document.createElement("div");
    card.className = "slp-store-card";

    // Logo
    if (loc.logo) {
      const logoArea = document.createElement("div");
      logoArea.className = "slp-store-logo-area";
      const img = document.createElement("img");
      img.src = loc.logo;
      img.className = "slp-store-logo";
      logoArea.appendChild(img);
      card.appendChild(logoArea);
    }

    // Info principal
    const info = document.createElement("div");
    info.className = "slp-store-card-info";
    info.innerHTML = `
      <strong>${loc.nombre}</strong><br>
      <small>${loc.direccion}</small><br>
      ${loc.telefono ? `<small>${loc.telefono}</small><br>` : ""}
      ${loc.schedule ? `<small>${loc.schedule}</small>` : ""}
    `;
    card.appendChild(info);

    cardNodes.push(card);
    container.appendChild(card);

    // Evento click en card
    card.addEventListener("click", () => {
      cardNodes.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const globalIndex = getGlobalIndex(loc);

      markers.forEach((marker, idx) => {
        if (marker.setIcon && slpData.customIcon) {
          marker.setIcon({
            url: slpData.customIcon,
            scaledSize: new google.maps.Size(
              idx === globalIndex ? 38 : 28,
              idx === globalIndex ? 38 : 28
            ),
          });
        } else if (marker.setIcon) {
          marker.setIcon(null);
        }
      });
      map.panTo(markers[globalIndex].getPosition());
      map.setZoom(16);

      // Panel lateral de info
      if (infoPanel && panelContent) {
        panelContent.innerHTML = `
          ${loc.logo ? `<img src="${loc.logo}" class="slp-panel-logo">` : ""}
          <strong>${loc.nombre}</strong>
          <small>${loc.direccion}</small>
          ${loc.telefono ? `<small>${loc.telefono}</small>` : ""}
          ${loc.schedule ? `<small>${loc.schedule}</small>` : ""}
          ${
            loc.redes && loc.redes.length
              ? `<div class="slp-local-rrss">${loc.redes
                  .map(
                    (r) =>
                      `<a href="${r.url}" target="_blank">${getSocialIcon(
                        r.platform
                      )}</a>`
                  )
                  .join("")}</div>`
              : ""
          }
          ${
            loc.email
              ? `<small><a href="mailto:${loc.email}">${loc.email}</a></small>`
              : ""
          }
          ${
            loc.sitio_web
              ? `<small><a href="${loc.sitio_web}" target="_blank">${loc.sitio_web}</a></small>`
              : ""
          }
        `;
        infoPanel.style.display = "block";
      }
      activeIndex = globalIndex;
    });
  });

  // Evento click en el pin
  markers.forEach((marker, globalIdx) => {
    google.maps.event.clearListeners(marker, "click");
    marker.addListener("click", () => {
      // Solo marcamos el pin y card si está en el listado actual
      const idx = storesToShow.findIndex(
        (loc) =>
          parseFloat(loc.lat) === marker.getPosition().lat() &&
          parseFloat(loc.lng) === marker.getPosition().lng()
      );
      if (idx === -1) return;

      cardNodes.forEach((c) => c.classList.remove("active"));
      cardNodes[idx].classList.add("active");
      markers.forEach((m, mi) => {
        if (m.setIcon && slpData.customIcon) {
          m.setIcon({
            url: slpData.customIcon,
            scaledSize: new google.maps.Size(
              mi === globalIdx ? 38 : 28,
              mi === globalIdx ? 38 : 28
            ),
          });
        } else if (m.setIcon) {
          m.setIcon(null);
        }
      });
      map.panTo(marker.getPosition());
      map.setZoom(18);

      // Panel info
      if (infoPanel && panelContent) {
        const loc = storesToShow[idx];
        panelContent.innerHTML = `
          ${loc.logo ? `<img src="${loc.logo}" class="slp-panel-logo">` : ""}
          <strong>${loc.nombre}</strong>
          <small>${loc.direccion}</small>
          ${loc.telefono ? `<small>${loc.telefono}</small>` : ""}
          ${loc.schedule ? `<small>${loc.schedule}</small>` : ""}
          ${
            loc.redes && loc.redes.length
              ? `<div class="slp-local-rrss">${loc.redes
                  .map(
                    (r) =>
                      `<a href="${r.url}" target="_blank">${getSocialIcon(
                        r.platform
                      )}</a>`
                  )
                  .join("")}</div>`
              : ""
          }
          ${
            loc.email
              ? `<small><a href="mailto:${loc.email}">${loc.email}</a></small>`
              : ""
          }
          ${
            loc.sitio_web
              ? `<small><a href="${loc.sitio_web}" target="_blank">${loc.sitio_web}</a></small>`
              : ""
          }
        `;
        infoPanel.style.display = "block";
      }
      activeIndex = globalIdx;
    });
  });
}

// --- Inicialización del mapa principal ---

/**
 * Crea el mapa, los marcadores y todo el UI asociado.
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
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  });

  // --- Marca todos los pins (pero el listado lateral solo los filtrados) ---
  const markers = [];
  const infoWindows = [];

  slpData.locations.forEach((loc) => {
    const position = {
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lng),
    };
    const markerOptions = {
      position,
      map,
      title: decodeHTML(loc.nombre),
      visible: false,
    };
    if (slpData.customIcon) {
      markerOptions.icon = {
        url: slpData.customIcon,
        scaledSize: new google.maps.Size(38, 38),
      };
    }
    const marker = new google.maps.Marker(markerOptions);

    // InfoWindow por compatibilidad
    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(loc),
    });

    if (!window.slpOpenInfoWindow) window.slpOpenInfoWindow = null;
    marker.addListener("click", () => {
      if (window.slpOpenInfoWindow) window.slpOpenInfoWindow.close();
      map.panTo(marker.getPosition());
      map.setZoom(18);
      infoWindow.open(map, marker);
      window.slpOpenInfoWindow = infoWindow;
    });

    bounds.extend(position);
    markers.push(marker);
    infoWindows.push(infoWindow);
  });

  map.fitBounds(bounds);

  // --- Al cargar, sólo muestra las primeras 10 de la RM ---
  renderStoreList(map, markers, getDefaultStores("Metropolitana"));

  autoGeolocateIfAllowed(map);

  // Búsqueda autocomplete
  function customInitAutocomplete() {
    const input = document.getElementById("slp-place-input");
    if (!input || !google.maps.places) return;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        showToast("No se encontró esa ubicación.");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const nearbyStores = getNearbyStores(lat, lng, kmRadius);
      renderStoreList(map, markers, nearbyStores);
      map.panTo(place.geometry.location);
      findNearbyStores(place.geometry.location, map);
    });
  }
  customInitAutocomplete();

  // Botón "Mostrar tiendas cercanas"
  const geolocateButton = document.getElementById("slp-geolocate-btn");
  if (geolocateButton) {
    geolocateButton.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("La geolocalización no está disponible en este navegador.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          // Actualiza listado con las cercanas
          const nearbyStores = getNearbyStores(userLat, userLng, kmRadius);
          renderStoreList(map, markers, nearbyStores);

          // Reverse geocode para el input
          const geocoder = new google.maps.Geocoder();
          const latlng = { lat: userLat, lng: userLng };
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK" && results[0]) {
              const input = document.getElementById("slp-place-input");
              if (input) input.value = results[0].formatted_address;
            }
          });

          // Encuentra tiendas cercanas en el mapa (visual)
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

// --- Espera a que la API de Google Maps esté lista antes de inicializar ---
function waitForGoogleMaps() {
  if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
    initMap();
  } else {
    setTimeout(waitForGoogleMaps, 300);
  }
}

// --- Inicializa el mapa cuando el DOM esté listo ---
document.addEventListener("DOMContentLoaded", waitForGoogleMaps);
