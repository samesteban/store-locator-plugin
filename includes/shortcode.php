<?php
/**
 * Shortcode: [store_locator]
 * --------------------------
 * Renderiza un mapa con las tiendas cargadas desde el CPT 'tienda'.
 * Acepta atributos de ancho y alto personalizables.
 * Carga automáticamente los datos de las tiendas y el script JS del mapa.
 */

add_shortcode('store_locator', function ($atts) {
    // Atributos por defecto del shortcode
    $atts = shortcode_atts([
        'width' => '100%',         // Ancho del mapa (ej: 100%, 600px)
        'height' => '400px',       // Alto del mapa (ej: 400px)
    ], $atts);

    /**
     * 1. Consulta las tiendas registradas como Custom Post Type
     */
    $tiendas = new WP_Query([
        'post_type' => 'tienda',
        'posts_per_page' => -1,    // Sin límite de resultados
    ]);

    $locations = [];

    // Iterar sobre cada tienda y construir el array de ubicaciones
    while ($tiendas->have_posts()) {
        $tiendas->the_post();

        $location = get_field('store_address');

        if ($location) {
            $locations[] = [
                'nombre'     => get_the_title(),
                'direccion'  => $location['address'],
                'lat'        => $location['lat'],
                'lng'        => $location['lng'],
                'telefono'   => get_field('phone'),
                'sitio_web'  => get_field('website'),
                'email'      => get_field('email'),
                'redes'      => get_field('social_links') ?: [],
            ];
        }
    }

    wp_reset_postdata(); // Restaurar el loop global

    /**
     * 2. Registrar y pasar los datos al script JS del mapa
     */

    // Registra el script principal (solo si no ha sido registrado antes)
    wp_register_script(
        'slp-map-script',
        SLP_URL . 'assets/js/map.js',
        [],
        '1.0.0',
        true
    );

    // Localiza los datos de las tiendas + ícono personalizado para JS
    wp_localize_script('slp-map-script', 'slpData', [
        'locations'   => $locations,
        'customIcon'  => get_option('slp_custom_pin_url'),
    ]);

    // Encola el script solo si no está ya encolado
    if (!wp_script_is('slp-map-script', 'enqueued')) {
        wp_enqueue_script('slp-map-script');
    }

    /**
     * 3. Renderizar el contenedor del mapa + botón + toast
     */

    ob_start(); // Inicia el buffer para devolver HTML limpio
    ?>
<div style="position:relative;margin-bottom:1rem;">

    <!-- Contenedor del mapa con atributos personalizados -->
    <div id="slp-map" style="width: <?= esc_attr($atts['width']) ?>; height: <?= esc_attr($atts['height']) ?>;"></div>

    <!-- Toast: mensajes informativos flotantes -->
    <div id="slp-toast"
        style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:10px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s ease;z-index:9999;font-size:14px;">
    </div>

    <!-- Botón de geolocalización -->
    <button id="slp-geolocate-btn" class="slp-button-geolocate"
        style="margin: 1rem 0; display: block; background: #fff; color: #000; border: 1px solid #cccccc; padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer;">
        Mostrar tiendas cercanas
    </button>

</div>
<?php

    // Devuelve el HTML generado para insertarlo donde se use el shortcode
    return ob_get_clean();
});