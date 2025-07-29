<?php
/**
 * Shortcode: [store_locator]
 * --------------------------
 * Renderiza un mapa con las tiendas cargadas desde el CPT 'tienda'.
 * Acepta atributos de ancho y alto personalizables y valida los valores.
 * Muestra un listado de tiendas en cards al costado del mapa.
 */

add_shortcode('store_locator', function ($atts) {
    // Atributos por defecto del shortcode
    $defaults = [
        'width'  => '100%',   // Ancho del mapa (ej: 100%, 600px)
        'height' => '400px',  // Alto del mapa (ej: 400px)
    ];

    // Fusionar atributos con valores por defecto
    $atts = shortcode_atts($defaults, $atts);

    // Patrón válido: dígitos seguidos de 'px' o '%' o 'vh'
    $pattern = '/^\d+(px|%|vh)$/';

    // Validar ancho
    if (! preg_match($pattern, $atts['width'])) {
        $atts['width'] = $defaults['width'];
    }
    // Validar alto
    if (! preg_match($pattern, $atts['height'])) {
        $atts['height'] = $defaults['height'];
    }

    /**
     * 1. Consulta las tiendas registradas como Custom Post Type 'tienda'
     */
    $tiendas = new WP_Query([
        'post_type'      => 'tienda',
        'posts_per_page' => -1,   // Sin límite de resultados
    ]);

    $locations = [];

    // Iterar sobre cada tienda y construir el array de ubicaciones
    while ($tiendas->have_posts()) {
        $tiendas->the_post();

        $location = get_field('store_address');
        if (! $location) {
            continue;
        }

        // Obtener logo (campo de tipo imagen en ACF)
        $logo_field = get_field('logo');
        $logo_url   = $logo_field ? esc_url($logo_field['url']) : '';

        // Obtener horario (campo de texto en ACF)
        $schedule = get_field('schedule');

        $locations[] = [
            'nombre'     => get_the_title(),
            'direccion'  => $location['address'],
            'lat'        => $location['lat'],
            'lng'        => $location['lng'],
            'telefono'   => get_field('phone'),
            'sitio_web'  => get_field('website'),
            'email'      => get_field('email'),
            'redes'      => get_field('social_links') ?: [],
            'logo'       => $logo_url,
            'schedule'   => $schedule,
        ];
    }
    wp_reset_postdata(); // Restaurar el loop global

    /**
     * 2. Registrar y pasar los datos al script JS del mapa
     */
    wp_register_script(
        'slp-map-script',
        SLP_URL . 'assets/js/map.js',
        [],
        '1.0.0',
        true
    );

    // Localiza los datos de tiendas (incluye logo, horario) y el ícono personalizado
    wp_localize_script('slp-map-script', 'slpData', [
        'locations'  => $locations,
        'customIcon' => get_option('slp_custom_pin_url'),
        'accentColor' => get_option('slp_accent_color', '24,144,255'),
    ]);

    // Encolar el script solo si no está ya encolado
    if (! wp_script_is('slp-map-script', 'enqueued')) {
        wp_enqueue_script('slp-map-script');
    }

    /**
     * 3. Renderizar el layout con mapa y listado de tiendas en cards
     */
    ob_start();
    ?>
<div class="slp-store-locator" style="height: <?= esc_attr($atts['height']) ?>;">

    <!-- Listado de tiendas en cards -->
    <div class="slp-list-area">
        <div class="slp-input-search-area">
            <!-- Input de búsqueda de ubicación (Autocomplete) -->
            <input id="slp-place-input" type="text" placeholder="Ingresa tu ubicación…" />
            <!-- Botón geolocalización -->
            <button id="slp-geolocate-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
                    fill="rgba(14,14,14,1)">
                    <path
                        d="M13 1L13.001 4.06201C16.6192 4.51365 19.4869 7.38163 19.9381 11L23 11V13L19.938 13.001C19.4864 16.6189 16.6189 19.4864 13.001 19.938L13 23H11L11 19.9381C7.38163 19.4869 4.51365 16.6192 4.06201 13.001L1 13V11L4.06189 11C4.51312 7.38129 7.38129 4.51312 11 4.06189L11 1H13ZM12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z">
                    </path>
                </svg>
            </button>
        </div>
        <div class="slp-locator-list">
            <!-- Las cards se renderizan dinámicamente vía JS -->
        </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="slp-locator-map">

        <div id="slp-info-panel" class="slp-info-panel" style="display:none;">
            <button id="slp-panel-close" class="slp-panel-close" type="button">&times;</button>
            <div id="slp-info-panel-content"></div>
        </div>

        <!-- Mapa -->
        <div id="slp-map"></div>

        <!-- Toast -->
        <div id="slp-toast"></div>

    </div>

</div>
<?php
    return ob_get_clean();
});