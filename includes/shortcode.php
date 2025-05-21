<?php

// Shortcode: [tiendas_cercanas ancho="100%" alto="400px"]
add_shortcode('tiendas_cercanas', function ($atts) {
    $atts = shortcode_atts([
        'ancho' => '100%',
        'alto'  => '400px'
    ], $atts);

    // Limpieza básica
    $width = esc_attr($atts['ancho']);
    $height = esc_attr($atts['alto']);

    ob_start();
    ?>
<div id="map" style="width: <?php echo $width; ?>; height: <?php echo $height; ?>; margin-bottom: 20px;"></div>
<ul id="store-list"></ul>
<?php
    return ob_get_clean();
});