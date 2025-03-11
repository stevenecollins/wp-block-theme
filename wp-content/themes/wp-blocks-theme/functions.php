<?php

// Add a server-side filter to ensure the sticky header class persists
function add_sticky_header_class_to_header($block_content, $block) {
  // Only target header template parts
  if ($block['blockName'] === 'core/template-part' && isset($block['attrs']['slug']) && $block['attrs']['slug'] === 'header') {
    // Check if sticky header is enabled for this header
    if (isset($block['attrs']['isSticky']) && $block['attrs']['isSticky'] === true) {
      // Add the class to the opening header tag, ensuring it's preserved on page load
      if (strpos($block_content, 'header class="') !== false) {
        $block_content = preg_replace(
          '/<header([^>]*)class="([^"]*)"/',
          '<header$1class="$2 has-sticky-header"',
          $block_content
        );
      } else if (strpos($block_content, '<header') !== false) {
        $block_content = str_replace('<header', '<header class="has-sticky-header"', $block_content);
      }
      
      // Also add the data attribute
      $block_content = str_replace('<header', '<header data-sticky-header="true"', $block_content);
    }
  }
  
  return $block_content;
}
add_filter('render_block', 'add_sticky_header_class_to_header', 10, 2);

function my_plugin_enqueue_block_editor_assets()
{
  // Main sticky header script for the editor
  wp_enqueue_script(
    'my-sticky-header',
    get_template_directory_uri() . '/assets/js/my-sticky-header.js',
    array('wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-hooks', 'wp-compose', 'wp-data'),
    filemtime(get_template_directory() . '/assets/js/my-sticky-header.js')
  );
  
  // We no longer need sticky-header-direct.js since we have a server-side filter
  // and the main editor script already handles the toggle functionality
}
add_action('enqueue_block_editor_assets', 'my_plugin_enqueue_block_editor_assets');

// Add frontend sticky header functionality
function my_plugin_enqueue_frontend_assets() {
  // Only add the CSS and JS for the sticky header effect on frontend
  if (is_admin()) {
    return;
  }
  
  // Enqueue the CSS for sticky header
  wp_enqueue_style(
    'my-sticky-header-styles',
    get_template_directory_uri() . '/assets/css/sticky-header.css',
    array(),
    filemtime(get_template_directory() . '/assets/css/sticky-header.css')
  );
  
  // Enqueue the frontend JavaScript for sticky header
  wp_enqueue_script(
    'my-sticky-header-frontend',
    get_template_directory_uri() . '/assets/js/sticky-header-frontend.js',
    array(),
    filemtime(get_template_directory() . '/assets/js/sticky-header-frontend.js'),
    true  // Load in footer
  );
  
  // We don't need to load sticky-header-direct.js twice
  // The frontend script handles this functionality
}
add_action('wp_enqueue_scripts', 'my_plugin_enqueue_frontend_assets');
