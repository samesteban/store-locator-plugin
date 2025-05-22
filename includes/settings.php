<?php

// Página de ajustes para ingresar Google Maps API Key
add_action('admin_menu', function () {
    add_options_page(
        'Store Locator Ajustes',
        'Store Locator',
        'manage_options',
        'store-locator-settings',
        'slp_settings_page'
    );
});

function slp_settings_page() {
    ?>
<div class="wrap">
    <h1>Configuración del Store Locator</h1>
    <form method="post" action="options.php">
        <?php
            settings_fields('slp_settings');
            do_settings_sections('slp_settings');
            submit_button('Guardar API Key');
            ?>
    </form>
</div>
<hr>
<h2>Generador de Shortcode</h2>
<p>Completa los valores de alto y ancho y copia el shortcode generado para pegarlo donde necesites.</p>

<table class="form-table">
    <tr>
        <th scope="row"><label for="slp_width">Ancho</label></th>
        <td><input type="text" id="slp_width" value="100%" placeholder="Ej: 100%, 600px" class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><label for="slp_height">Alto</label></th>
        <td><input type="text" id="slp_height" value="400px" placeholder="Ej: 400px" class="regular-text"></td>
    </tr>
    <tr>
        <th scope="row"><label for="slp_shortcode">Shortcode</label></th>
        <td>
            <input type="text" id="slp_shortcode" readonly class="regular-text" style="background:#f0f0f0">
            <button type="button" class="button"
                onclick="navigator.clipboard.writeText(document.getElementById('slp_shortcode').value)">Copiar</button>
        </td>
    </tr>
</table>

<?php
}

add_action('admin_init', function () {
    register_setting('slp_settings', 'slp_google_maps_api');

    add_settings_section('slp_section', 'API Key', null, 'slp_settings');

    add_settings_field(
        'slp_google_maps_api',
        'Clave API de Google Maps',
        function () {
            $value = esc_attr(get_option('slp_google_maps_api'));
            echo "<input type='text' name='slp_google_maps_api' value='$value' class='regular-text' />";
        },
        'slp_settings',
        'slp_section'
    );
});

// Cargar script solo en esta página de ajustes
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'settings_page_store-locator-settings') {
        wp_enqueue_script(
            'slp-shortcode-generator',
            SLP_URL . 'assets/js/shortcode-generator.js',
            [],
            '1.0.0',
            true
        );
    }
});