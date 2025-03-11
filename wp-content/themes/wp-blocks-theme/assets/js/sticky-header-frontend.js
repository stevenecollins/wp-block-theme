/**
 * Sticky Header Frontend Script
 */
(function() {
    // Check if the sticky header should be enabled
    function shouldEnableStickyHeader() {
        // Check for header with data attribute (set by PHP filter)
        if (document.querySelector('[data-sticky-header="true"]')) {
            return true;
        }
        
        // Check for elements with the sticky class (set by PHP filter)
        if (document.querySelector('.has-sticky-header')) {
            return true;
        }
        
        return false;
    }
    
    // Find the header element
    function findHeaderElement() {
        try {
            // First try WordPress template part header
            const headerElement = document.querySelector('header.wp-block-template-part');
            
            // Fallback to any header element
            return headerElement || document.querySelector('header');
        } catch (e) {
            return null;
        }
    }
    
    // Add scroll event to add/remove additional class for scroll styling
    function handleScroll() {
        const headers = document.querySelectorAll('.has-sticky-header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        headers.forEach(header => {
            if (scrollTop > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }
    
    // Initialize sticky header functionality
    function initializeStickyHeader() {
        if (!shouldEnableStickyHeader()) {
            return;
        }
        
        const headerElement = findHeaderElement();
        if (!headerElement) {
            return;
        }
        
        // Apply sticky class if needed
        if (!headerElement.classList.contains('has-sticky-header')) {
            headerElement.classList.add('has-sticky-header');
        }
        
        // Set data attribute
        headerElement.setAttribute('data-sticky-header', 'true');
        
        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
    }
    
    // Initialize with a clean approach
    
    // Run immediately
    initializeStickyHeader();
    
    // Run when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeStickyHeader);
    
    // Run if DOM is already complete
    if (document.readyState === 'complete') {
        initializeStickyHeader();
    }
})();