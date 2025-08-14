<?php
/**
 * Archivo: settings.php
 * ---------------------------------------
 * Página de configuración del plugin Store Locator.
 * Permite ingresar:
 * - Clave de API de Google Maps
 * - Ícono personalizado para los pines del mapa
 * También incluye un generador de shortcode con tamaño personalizado.
 */

// Agrega la página al menú de ajustes en el admin
add_action('admin_menu', function () {
    add_options_page(
        'Store Locator Ajustes',        // Título de la página
        'Store Locator',                // Nombre en el menú
        'manage_options',               // Permisos necesarios
        'store-locator-settings',      // Slug único
        'slp_settings_page'            // Función de renderizado
    );
});

// Renderizado del contenido de la página de ajustes
function slp_settings_page() {
    ?>
<div class="wrap">
    <h1>Configuración del Store Locator</h1>

    <!-- Formulario para guardar las opciones del plugin -->
    <form method="post" action="options.php">
        <?php
                settings_fields('slp_settings');      // Registra los ajustes
                do_settings_sections('slp_settings'); // Muestra los campos registrados
                submit_button('Guardar');
            ?>
    </form>

    <hr>
    <!-- Generador de shortcode visual -->
    <h2>Generador de Shortcode</h2>
    <p>Completa los valores de alto y ancho y copia el shortcode generado para pegarlo donde necesites.</p>

    <table class="form-table">
        <tr>
            <th scope="row"><label for="slp_width">Ancho</label></th>
            <td>
                <input type="text" id="slp_width" value="100%" placeholder="Ej: 100%, 600px" class="regular-text">
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="slp_height">Alto</label></th>
            <td>
                <input type="text" id="slp_height" value="400px" placeholder="Ej: 400px" class="regular-text">
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="slp_shortcode">Shortcode</label></th>
            <td>
                <input type="text" id="slp_shortcode" readonly class="regular-text" style="background:#f0f0f0">
                <button type="button" class="button"
                    onclick="navigator.clipboard.writeText(document.getElementById('slp_shortcode').value)">
                    Copiar
                </button>
            </td>
        </tr>
    </table>
</div>
<?php
}

// Registro de los campos de configuración
add_action('admin_init', function () {
    // Campo: Clave API de Google Maps
    register_setting('slp_settings', 'slp_google_maps_api', [ 'sanitize_callback' => 'sanitize_text_field' ]);

    add_settings_section(
        'slp_section',                 // ID
        'Requerimientos del mapa',                     // Título de la sección
        null,                          // Callback opcional
        'slp_settings'                 // Página donde se muestra
    );

    add_settings_field(
        'slp_google_maps_api',        // ID del campo
        'Clave API de Google Maps',   // Etiqueta
        function () {
            $value = esc_attr(get_option('slp_google_maps_api'));
            echo "<input type='text' name='slp_google_maps_api' value='$value' class='regular-text' />";
        },
        'slp_settings',
        'slp_section'
    );

    // Campo: Ícono personalizado para los marcadores
    register_setting('slp_settings', 'slp_custom_pin_url', [ 'sanitize_callback' => 'esc_url_raw' ]);

    add_settings_field(
        'slp_custom_pin_url',
        'Ícono personalizado del marcador',
        function () {
            $image_url = esc_attr(get_option('slp_custom_pin_url'));

            echo '<input type="text" id="slp_custom_pin_url" name="slp_custom_pin_url" value="' . esc_url($image_url) . '" class="regular-text" />';
            echo '<button type="button" class="button" id="upload_pin">Subir imagen</button>';

            // Vista previa del ícono y botón para remover
            if ($image_url) {
                echo '<br><img id="slp_pin_preview" src="' . esc_url($image_url) . '" style="max-width:60px;margin-top:10px;" />';
                echo '<br><button type="button" class="button" id="remove_pin">Quitar imagen</button>';
            } else {
                echo '<br><img id="slp_pin_preview" src="" style="display:none;max-width:60px;margin-top:10px;" />';
                echo '<br><button type="button" class="button" id="remove_pin" style="display:none;">Quitar imagen</button>';
            }
        },
        'slp_settings',
        'slp_section'
    );

    register_setting('slp_settings', 'slp_accent_color', [
        'sanitize_callback' => function($color) {
            // Acepta solo HEX y convierte a rgb(r,g,b)
            if (preg_match('/^#([a-f0-9]{6})$/i', $color, $matches)) {
                $hex = $matches[1];
                $r = hexdec(substr($hex, 0, 2));
                $g = hexdec(substr($hex, 2, 2));
                $b = hexdec(substr($hex, 4, 2));
                return "$r,$g,$b"; // formato: "25,144,255"
            }
            // Default: azul #1890ff
            return "24,144,255";
        }
    ]);

    add_settings_field(
        'slp_accent_color',
        'Color de acento',
        function () {
            // Al mostrar el input, convierte RGB a HEX para el value:
            $rgb = get_option('slp_accent_color', '24,144,255');
            $parts = explode(',', $rgb);
            $hex = sprintf("#%02x%02x%02x", $parts[0], $parts[1], $parts[2]);
            echo "<input type='color' name='slp_accent_color' value='$hex' />";
            echo "<span style='margin-left:8px;'>$hex</span>";
            echo "<p class='description'>Usado para resaltar la card activa y los links en los popups.</p>";
        },
        'slp_settings',
        'slp_section'
    );

    register_setting('slp_settings', 'slp_user_location_icon', ['sanitize_callback' => 'esc_url_raw']);

    add_settings_field(
        'slp_user_location_icon',
        'Ícono de ubicación del usuario',
        function () {
            $image_url = esc_attr(get_option('slp_user_location_icon'));
            echo '<input type="text" id="slp_user_location_icon" name="slp_user_location_icon" value="' . esc_url($image_url) . '" class="regular-text" />';
            echo '<button type="button" class="button" id="upload_user_location_icon">Subir imagen</button>';

            // Vista previa del ícono y botón para remover
            if ($image_url) {
                echo '<br><img id="slp_user_icon_preview" src="' . esc_url($image_url) . '" style="max-width:60px;margin-top:10px;" />';
                echo '<br><button type="button" class="button" id="remove_user_icon">Quitar imagen</button>';
            } else {
                echo '<br><img id="slp_user_icon_preview" src="" style="display:none;max-width:60px;margin-top:10px;" />';
                echo '<br><button type="button" class="button" id="remove_user_icon" style="display:none;">Quitar imagen</button>';
            }
        },
        'slp_settings',
        'slp_section'
    );

});

// Encola los scripts necesarios solo en la página de ajustes del plugin
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'settings_page_store-locator-settings') {
        // Script del generador de shortcodes (altura/ancho)
        wp_enqueue_script(
            'slp-shortcode-generator',
            SLP_URL . 'assets/js/shortcode-generator.js',
            [],
            '1.0.0',
            true
        );

        // Habilita el selector de medios de WordPress
        wp_enqueue_media();

        // Script para subir y quitar ícono del marcador
        wp_enqueue_script(
            'slp-pin-upload',
            SLP_URL . 'assets/js/pin-upload.js',
            ['jquery'],
            '1.0.0',
            true
        );
    }
});