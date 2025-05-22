<?php

add_action('wp_enqueue_scripts', function () {
    $api_key = get_option('slp_google_maps_api');
    if (!$api_key) return;

    // Registrar script del mapa
    wp_register_script(
        'slp-map-script',
        SLP_URL . 'assets/js/map.js',
        [],
        '1.0.0',
        true
    );

    // Encolar y pasar datos
    wp_enqueue_script('slp-map-script');

    wp_enqueue_script(
        'google-maps-api',
        'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($api_key) . '&language=es',
        [],
        null,
        true
    );
});