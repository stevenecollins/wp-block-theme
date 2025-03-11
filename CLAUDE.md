# CLAUDE.md - WordPress Block Theme Guidelines

## Build Commands
- Activate theme: Use WordPress admin under Appearance > Themes
- View site: Visit http://localhost or configured local URL
- PHP validation: `php -l wp-content/themes/wp-blocks-theme/functions.php`

## Code Style Guidelines
- **PHP**: Follow WordPress coding standards (4 space indentation)
- **CSS**: Class names should use kebab-case (e.g., `sticky-header`)
- **JS**: Use vanilla JavaScript with proper commenting
- **Script Loading**: Enqueue scripts/styles via functions.php with appropriate dependencies
- **Block Theme Structure**: 
  - parts/ - Reusable template parts (header.html, footer.html)
  - templates/ - Page templates (index.html)
  - assets/ - Contains CSS, JS, and font files
  - theme.json - Theme configuration using WordPress block editor settings

## Error Handling
- PHP: Use wp_die() for critical errors
- JS: Use try/catch for error handling in JavaScript