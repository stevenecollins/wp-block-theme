( function( wp ) {
  const { addFilter } = wp.hooks;
  const { createElement, Fragment } = wp.element;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, ToggleControl } = wp.components;
  const { createHigherOrderComponent } = wp.compose;

  // 1. Add a new attribute "isSticky" to template parts
  const addStickyHeaderAttribute = ( settings, name ) => {
      if ( name === 'core/template-part' ) {
          settings.attributes = {
              ...settings.attributes,
              isSticky: {
                  type: 'boolean',
                  default: false,
              },
          };
      }
      return settings;
  };
  addFilter(
      'blocks.registerBlockType',
      'my-plugin/sticky-header-attribute',
      addStickyHeaderAttribute
  );

  // Function to apply the sticky class to the header in the editor
  function applyStickyHeaderClass(isSticky) {
      try {
          // Target WordPress header template part
          const headerElement = document.querySelector('header.wp-block-template-part');
          
          // If not found, try any header element
          const headerFound = headerElement || document.querySelector('header');
          
          // If found, apply or remove class
          if (headerFound) {
              if (isSticky) {
                  headerFound.classList.add('has-sticky-header');
                  headerFound.setAttribute('data-sticky-header', 'true');
              } else {
                  headerFound.classList.remove('has-sticky-header');
                  headerFound.setAttribute('data-sticky-header', 'false');
              }
          }
      } catch (e) {
          // Silent error handling
      }
  }

  // 2. Add an Inspector Control for the header template part
  const withStickyHeaderControl = createHigherOrderComponent( ( BlockEdit ) => {
      return ( props ) => {
          const { name, attributes, setAttributes } = props;

          // Check if this is a template part with slug "header"
          if ( name === 'core/template-part' && attributes.slug === 'header' ) {
              // Apply class based on current attribute state with retry mechanism
              applyStickyHeaderClass(!!attributes.isSticky);
              
              // Try every 500ms for a total of 3 seconds to ensure it catches the header
              for (let delay = 500; delay <= 3000; delay += 500) {
                  setTimeout(() => {
                      applyStickyHeaderClass(!!attributes.isSticky);
                  }, delay);
              }
              
              return createElement(
                  Fragment,
                  null,
                  createElement(BlockEdit, props),
                  createElement(
                      InspectorControls,
                      null,
                      createElement(
                          PanelBody,
                          { title: "Header Options", initialOpen: true },
                          createElement(ToggleControl, {
                              label: "Enable Sticky Header",
                              checked: !!attributes.isSticky,
                              className: "sticky-header-toggle",
                              onChange: (value) => {
                                  setAttributes({ isSticky: value });
                                  
                                  // Apply class directly for immediate visual feedback
                                  applyStickyHeaderClass(value);
                                  
                                  // Also try after a short delay in case DOM updates
                                  setTimeout(() => {
                                      applyStickyHeaderClass(value);
                                  }, 200);
                              },
                              help: attributes.isSticky ? 'The header will stick to the top when scrolling.' : 'The header will scroll with the page.'
                          })
                      )
                  )
              );
          }
          return createElement(BlockEdit, props);
      };
  }, 'withStickyHeaderControl' );
  
  addFilter(
      'editor.BlockEdit',
      'my-plugin/sticky-header-control',
      withStickyHeaderControl,
      100
  );

  // 3. Add the sticky class to block attributes when isSticky is true
  addFilter(
      'blocks.getSaveContent.extraProps',
      'my-plugin/add-sticky-header-class',
      ( extraProps, blockType, attributes ) => {
          if ( 
              blockType.name === 'core/template-part' && 
              attributes.slug === 'header'
          ) {
              // Add a data attribute for our JavaScript to detect
              extraProps['data-sticky-header'] = attributes.isSticky ? 'true' : 'false';
              
              // Only add the class if isSticky is true
              if (attributes.isSticky) {
                  extraProps.className = ( extraProps.className ? extraProps.className + ' ' : '' ) + 'has-sticky-header';
              }
          }
          return extraProps;
      }
  );

  // 4. Data subscription with throttling to update UI when blocks change
  try {
      if (typeof wp.data !== 'undefined' && wp.data.subscribe) {
          let lastUpdate = 0;
          const throttleTime = 500; // ms
          
          wp.data.subscribe(function() {
              try {
                  const now = Date.now();
                  if (now - lastUpdate < throttleTime) {
                      return; // Skip if last update was too recent
                  }
                  
                  const editor = wp.data.select('core/block-editor');
                  if (!editor) return;
                  
                  const selectedBlock = editor.getSelectedBlock();
                  if (!selectedBlock) return;
                  
                  // Only process if it's a header template part
                  if (selectedBlock.name === 'core/template-part' && 
                      selectedBlock.attributes.slug === 'header') {
                      
                      // Update last processed time
                      lastUpdate = now;
                      
                      // Apply class
                      applyStickyHeaderClass(!!selectedBlock.attributes.isSticky);
                  }
              } catch (e) {
                  // Silent error handling
              }
          });
      }
  } catch (e) {
      // Silent error handling
  }

} )( window.wp );