# Store Locator Plugin for WordPress

**Geolocalización de tiendas fácil, rápida y personalizable, usando Google Maps y ACF.**

---

## 🚀 Características principales

- Muestra tiendas (CPT `tienda`) en un mapa Google Maps con estilo gris moderno.
- Compatible con **ACF PRO** para guardar dirección y datos extra de cada tienda.
- Soporte para marcador personalizado global.
- Botón de geolocalización: muestra las tiendas más cercanas al usuario.
- Shortcode fácil de usar y personalizable en tamaño.
- Incluye mensajes tipo toast para feedback amigable.
- Totalmente compatible con cualquier theme y estructura WordPress.

---

## 🧩 Requisitos

- WordPress 5.5 o superior
- **ACF PRO** (Advanced Custom Fields PRO) instalado y activo
- Clave de API de Google Maps habilitada para uso en JavaScript

---

## ⚡ Instalación rápida

1. **Sube** la carpeta del plugin a `/wp-content/plugins/store-locator/`
2. **Actívalo** desde el panel de Plugins en WordPress.
3. Asegúrate de tener **ACF PRO** activo.
4. Ve a **Ajustes > Store Locator** para:
   - Ingresar tu Google Maps API Key
   - (Opcional) Subir un ícono personalizado para el marcador

---

## 🛠️ Configuración

### Página de ajustes (`Ajustes > Store Locator`):

- **Google Maps API Key:**  
  Ingresa tu clave para que los mapas funcionen.
- **Ícono personalizado:**  
  Sube una imagen (PNG recomendado) para usar como pin global.
- **Generador de Shortcode:**  
  Genera el código `[store_locator]` con el tamaño que quieras copiar y pegar.

---

## 🏷️ Uso del Shortcode

Agrega el mapa en cualquier página o post usando:

```plaintext
[store_locator width="100%" height="400px"]
```

- Puedes personalizar el ancho y alto (ej: `width="600px"` `height="500px"`).

---

## ⚙️ Opciones de Configuración

| Opción                      | Descripción                      | Dónde se configura           |
| --------------------------- | -------------------------------- | ---------------------------- |
| Clave API Google Maps       | API key para Google Maps         | Ajustes del plugin           |
| Ícono personalizado del pin | Imagen para todos los marcadores | Ajustes del plugin           |
| Ancho/alto del mapa         | Personaliza el tamaño del mapa   | Shortcode o generador visual |

---

## 🧑‍💻 Campos personalizados ACF

Cada tienda debe tener el campo `store_address` de tipo **Google Map** y otros campos opcionales:

- Teléfono (`phone`)
- Sitio web (`website`)
- Email (`email`)
- Redes sociales (`social_links` - Repeater)

---

## 🗺️ Funciones inteligentes

- **Geolocalización automática**
  El usuario puede aceptar mostrar su ubicación; el mapa centra y destaca tiendas en un radio de 5 km.
- **Botón “Mostrar tiendas cercanas”**
  Siempre disponible para intentar de nuevo.
- **Zoom y InfoWindow amigable**
  Al hacer clic en un marcador, el mapa centra y muestra los datos completos de la tienda.

---

## 🎨 Personalización de estilos

- El mapa usa un estilo gris minimalista y elegante por defecto.
- Puedes ajustar el CSS del contenedor `#slp-map` o los toast desde tu theme si lo deseas.

---

## ❓ Preguntas frecuentes

**¿Por qué no aparecen tiendas en el mapa?**
Verifica que hayas creado tiendas (CPT `tienda`) y les hayas asignado dirección en el campo Google Map de ACF.

**¿Por qué no carga el mapa?**
Asegúrate de haber ingresado la Google Maps API Key correcta y que la facturación esté activa en Google Cloud.

**¿El shortcode funciona con cualquier theme?**
Sí, está diseñado para ser totalmente independiente de la estructura del theme.

**¿El plugin guarda los datos de los pins personalizados?**
Sí, el pin subido se usa para todas las tiendas, si está configurado.

---

## 🧑‍🔧 Para desarrolladores

- Puedes editar los estilos del mapa en `assets/js/map.js` (`mapStyle` array).
- El plugin es modular, fácil de extender y mantener.
- Scripts principales:

  - `map.js`: Lógica del mapa y geolocalización.
  - `shortcode-generator.js`: Generador visual para el admin.
  - `pin-upload.js`: Subida de íconos para marcadores.

- Todos los datos de tiendas se pasan a JS vía `wp_localize_script` para máxima compatibilidad.

---

## 👨‍💻 Créditos y soporte

Desarrollado por Sam Esteban.
Plugin a medida, consultoría, soporte y personalizaciones:
[https://samesteban.com](https://samesteban.com)
