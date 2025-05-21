<?php

// Cargar scripts y estilos necesarios
add_action('wp_enqueue_scripts', function () {
    $api_key = get_option('slp_google_maps_api');
    if (!$api_key) return;

    wp_enqueue_script('google-maps', "https://maps.googleapis.com/maps/api/js?key=$api_key", [], null, true);
    wp_enqueue_script('store-locator-js', SLP_URL . 'assets/js/store-locator.js', ['google-maps'], '1.0', true);
});