<?php

add_shortcode('store_locator', function ($atts) {
    $atts = shortcode_atts([
        'width' => '100%',
        'height' => '400px',
    ], $atts);

    // Obtener tiendas
    $tiendas = new WP_Query([
        'post_type' => 'tienda',
        'posts_per_page' => -1,
    ]);

    $locations = [];

    while ($tiendas->have_posts()) {
        $tiendas->the_post();
        $location = get_field('store_address');

        if ($location) {
            $locations[] = [
                'nombre' => get_the_title(),
                'direccion' => $location['address'],
                'lat' => $location['lat'],
                'lng' => $location['lng'],
                'telefono' => get_field('phone'),
                'sitio_web' => get_field('website'),
                'email' => get_field('email'),
                'redes' => get_field('social_links') ?: [],
            ];
        }
    }

    wp_reset_postdata();

    // REGISTRA el script si no ha sido registrado antes
    if (!wp_script_is('slp-map-script', 'enqueued')) {
        wp_register_script(
            'slp-map-script',
            SLP_URL . 'assets/js/map.js',
            [],
            '1.0.0',
            true
        );

        // PASAR datos
        wp_localize_script('slp-map-script', 'slpData', [
            'locations' => $locations,
        ]);

        // ENCOLAR el script ahora
        wp_enqueue_script('slp-map-script');
    }

    ob_start();
    ?>
<div id="slp-map" style="width: <?= esc_attr($atts['width']) ?>; height: <?= esc_attr($atts['height']) ?>;"></div>
<?php
    return ob_get_clean();
});