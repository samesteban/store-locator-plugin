<?php
/**
 * Plugin Name: Store Locator Plugin
 * Description: Geolocalización de tiendas usando Google Maps y ACF.
 * Version: 1.0.0
 * Author: Samuel
 * Text Domain: store-locator
 */

defined('ABSPATH') || exit;

// Definir constantes
define('SLP_PATH', plugin_dir_path(__FILE__));
define('SLP_URL', plugin_dir_url(__FILE__));

// Incluir archivos
require_once SLP_PATH . 'includes/settings.php';
require_once SLP_PATH . 'includes/enqueue.php';
require_once SLP_PATH . 'includes/shortcode.php';
require_once SLP_PATH . 'cpt/register-tienda.php';

// Verifica si ACF está activo. Si no, muestra un aviso.
add_action('plugins_loaded', function () {
    if (!class_exists('ACF')) {
        if (file_exists(SLP_PATH . 'vendor/acf-pro/acf.php')) {
            include_once SLP_PATH . 'vendor/acf-pro/acf.php';
        } else {
            add_action('admin_notices', function () {
                echo '<div class="notice notice-error"><p><strong>ACF PRO no encontrado:</strong> asegúrate de que esté en <code>vendor/acf-pro/</code>.</p></div>';
            });
        }
    }
}, 5);

// Forzar la carga de campos ACF desde la carpeta local del plugin
add_filter('acf/settings/load_json', function ($paths) {
    unset($paths[0]);

    $paths[] = SLP_PATH . 'acf-json';

    return $paths;
});

// Forzar la clave de Google Maps API
add_filter('acf/settings/google_api_key', function($api) {
    $key = get_option('slp_google_maps_api');
    return $key ?: $api;
});

// Forzar que los campos se guarden también en la misma carpeta
add_filter('acf/settings/save_json', function ($path) {
    return SLP_PATH . 'acf-json';
});
