<?php
// Registrar CPT "Tienda"
function slp_register_store_cpt() {
    $labels = [
        'name' => 'Tiendas',
        'singular_name' => 'Tienda',
        'menu_name' => 'Tiendas',
        'name_admin_bar' => 'Tienda',
        'add_new' => 'Agregar Nueva',
        'add_new_item' => 'Agregar Nueva Tienda',
        'new_item' => 'Nueva Tienda',
        'edit_item' => 'Editar Tienda',
        'view_item' => 'Ver Tienda',
        'all_items' => 'Todas las Tiendas',
        'search_items' => 'Buscar Tiendas',
        'not_found' => 'No se encontraron tiendas',
        'not_found_in_trash' => 'No hay tiendas en la papelera',
    ];

    $args = [
        'labels' => $labels,
        'public' => true,
        'menu_icon' => 'dashicons-store',
        'supports' => ['title'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'tiendas'],
        'show_in_rest' => true,
    ];

    register_post_type('tienda', $args);
}
add_action('init', 'slp_register_store_cpt');