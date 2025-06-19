# Store Locator Plugin para WordPress

**Versión: 1.3.0**  
Desarrollado por Samuel Esteban

## Descripción

Store Locator es un plugin avanzado y modular para WordPress que permite a tus visitantes encontrar tiendas cercanas usando Google Maps, autocompletado de ubicación y listado de tiendas personalizado. Todo el contenido es gestionado desde el admin, y el frontend ofrece una experiencia similar a grandes marcas internacionales.

## Características Principales

- **Mapa Google Maps** con estilo gris personalizado, solo muestra nombres de calles y lugares relevantes.
- **Listado de tiendas** en tarjetas (cards) junto al mapa, con logo, dirección, contacto y horario.
- **Input de búsqueda** con autocompletado de Google Places, para encontrar tiendas cercanas a una ubicación escrita.
- **Botón de geolocalización** que centra el mapa y lista las tiendas más cercanas al usuario, mostrando la dirección encontrada en el input.
- **Panel lateral de información**: muestra detalles ampliados de la tienda seleccionada (logo, nombre, dirección, contacto, web, redes).
- **Soporte para ícono de pin personalizado** (desde ajustes del plugin).
- **Soporte ACF**: toda la información de tiendas es gestionada por campos personalizados avanzados.
- **Adaptado para móviles** (diseño responsive).

## Instalación

1. **Sube la carpeta** del plugin a `/wp-content/plugins/store-locator`.
2. **Actívalo** desde el panel de administración de WordPress.
3. Ve a `Ajustes > Store Locator` para:
   - Pegar tu clave API de Google Maps.
   - (Opcional) Subir tu ícono de marcador personalizado.
4. **Configura las tiendas**: desde el CPT 'Tienda', añade cada ubicación con su información y logo.
5. **Agrega el shortcode** `[store_locator]` en la página donde quieras mostrar el buscador.

## Uso del Shortcode

```plaintext
[store_locator width="100%" height="500px"]
```

- `width` y `height` aceptan valores en `%` o `px`.
- El layout muestra el mapa y el listado de tiendas de manera lateral.

## Campos de la Tienda

Estos campos se gestionan mediante Advanced Custom Fields (ACF PRO) e incluyen:

- Dirección (campo Google Map)
- Teléfono
- Sitio Web
- Email
- Horario
- Logo/imagen
- Redes Sociales (Facebook, Instagram, etc.)

**El archivo JSON de ACF se incluye en `/acf-json/group_tienda.json` para importar fácilmente el grupo de campos.**

## Funcionalidades avanzadas

- **Búsqueda incremental:** Si no hay tiendas en el radio de 5km, amplía hasta encontrar una tienda cercana.
- **Panel lateral de info:** Muestra la información completa de la tienda seleccionada (logo, nombre, dirección, contacto, web, redes).
- **Selección sincronizada:** Al hacer click en un pin o card, se resalta en ambos.
- **UX mejorada:** Mensajes tipo toast y diseño moderno.
- **Responsive:** El plugin se adapta a móviles y tablets automáticamente.

## Personalización

Puedes ajustar los estilos modificando `/assets/css/styles.css`.
El script principal es `/assets/js/map.js` y viene comentado para facilitar su extensión.

## Requisitos

- WordPress 5.8+
- ACF PRO (requerido para los campos personalizados)
- Cuenta y clave de Google Maps API

## Actualización y cambios

## [1.3.0] - 2025-06-19

### Added

- Ahora sólo se muestran en el mapa los marcadores correspondientes a las tiendas visibles en el listado lateral (ya sea las 10 primeras por defecto o las más cercanas según búsqueda). Esto mejora el rendimiento y la experiencia de usuario, evitando saturar el mapa con demasiados marcadores.

### Changed

- Comportamiento inicial del listado: si el usuario no ha buscado ni permitido geolocalización, sólo aparecen 10 tiendas de la Región Metropolitana en el listado lateral y en el mapa.

### Fixed

- Sincronización dinámica entre el listado lateral y los marcadores del mapa.

### 1.2.0

- Nuevo diseño con listado lateral de tiendas en cards.
- Panel de información lateral (no sobre el pin).
- Integración de input con Google Places Autocomplete.
- Mejoras en UX (selección sincronizada, toasts).
- Control de geolocalización y reverse-geocoding.
- Soporte para logo, horario y redes sociales por tienda.
- Mejoras responsivas y optimización de estilos.
- Mejoras de seguridad en el shortcode (validación de atributos adicionales: vh).

### 1.1.0

- Mejoras de seguridad en el shortcode (validación de atributos).
- Botón de geolocalización.

### 1.0.0

- Primera versión.

## Créditos

Desarrollado por [Sam Esteban](https://samesteban.com/ "Sam Esteban").

## Licencia

Licencia MIT (puedes modificar, mejorar y usar libremente este plugin, dando créditos al autor original).
