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
