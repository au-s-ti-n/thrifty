// browse.js - Enhanced filtering and search functionality

(function() {
    const itemCards = document.querySelectorAll('.item-card');
    const categoryFilters = document.querySelectorAll('[data-category]');
    const sizeFilters = document.querySelectorAll('[data-size]');
    const distanceFilters = document.querySelectorAll('[data-distance]');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchInput = document.getElementById('search-input');

    // Check if user came from homepage with search term
    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    if (savedSearchTerm) {
        searchInput.value = savedSearchTerm;
        sessionStorage.removeItem('searchTerm'); // Clear it after use
        applyFilters(); // Apply the search immediately
    }

    function applyFilters() {
        // Get selected categories
        const selectedCategories = Array.from(categoryFilters)
            .filter(input => input.checked)
            .map(input => input.dataset.category);

        // Get selected sizes
        const selectedSizes = Array.from(sizeFilters)
            .filter(input => input.checked)
            .map(input => input.dataset.size);

        // Get selected distance
        const selectedDistance = document.querySelector('[name="distance"]:checked');
        const maxDistance = selectedDistance ? parseFloat(selectedDistance.value) : Infinity;

        // Get price range
        const minPrice = priceMinInput.value ? parseFloat(priceMinInput.value) : 0;
        const maxPrice = priceMaxInput.value ? parseFloat(priceMaxInput.value) : Infinity;

        // Get search term
        const searchTerm = searchInput.value.toLowerCase().trim();

        // Filter each item card
        let visibleCount = 0;
        itemCards.forEach(card => {
            const itemCategory = card.dataset.category;
            const itemSize = card.dataset.size;
            const itemPrice = parseFloat(card.dataset.price);
            const itemDistance = parseFloat(card.dataset.distance);
            const itemName = card.dataset.name ? card.dataset.name.toLowerCase() : '';
            const itemBrand = card.dataset.brand ? card.dataset.brand.toLowerCase() : '';
            const itemDescription = card.dataset.description ? card.dataset.description.toLowerCase() : '';

            let show = true;

            // Category filter (if any categories are selected)
            if (selectedCategories.length > 0 && !selectedCategories.includes(itemCategory)) {
                show = false;
            }

            // Size filter (if any sizes are selected)
            if (selectedSizes.length > 0 && !selectedSizes.includes(itemSize)) {
                show = false;
            }

            // Price filter
            if (itemPrice < minPrice || itemPrice > maxPrice) {
                show = false;
            }

            // Distance filter
            if (maxDistance !== Infinity && itemDistance > maxDistance) {
                show = false;
            }

            // Search filter
            if (searchTerm) {
                const matchesSearch = itemName.includes(searchTerm) || 
                                     itemBrand.includes(searchTerm) || 
                                     itemDescription.includes(searchTerm);
                if (!matchesSearch) {
                    show = false;
                }
            }

            // Show or hide the card
            if (show) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show no results message if needed
        updateResultsCount(visibleCount);
    }

    function updateResultsCount(count) {
        // Remove existing results message if it exists
        const existingMessage = document.querySelector('.results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add new results message
        const mainContent = document.querySelector('.main-content');
        const message = document.createElement('div');
        message.className = 'results-message';
        message.style.marginBottom = '20px';
        message.style.padding = '15px';
        message.style.background = '#f0f0f0';
        message.style.borderRadius = '8px';
        message.style.textAlign = 'center';
        
        if (count === 0) {
            message.innerHTML = '<strong>No items found.</strong> Try adjusting your filters or search terms.';
            message.style.background = '#fff3cd';
        } else {
            message.innerHTML = `<strong>${count} item${count !== 1 ? 's' : ''}</strong> found`;
            message.style.background = '#d4edda';
        }
        
        mainContent.insertBefore(message, mainContent.querySelector('.item-card'));
    }

    // Add event listeners to all filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    sizeFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    distanceFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    priceMinInput.addEventListener('input', applyFilters);
    priceMaxInput.addEventListener('input', applyFilters);

    // Real-time search as user types
    searchInput.addEventListener('input', applyFilters);

    // Clear all filters
    clearFiltersBtn.addEventListener('click', () => {
        // Uncheck all category filters
        categoryFilters.forEach(filter => {
            filter.checked = false;
        });

        // Uncheck all size filters
        sizeFilters.forEach(filter => {
            filter.checked = false;
        });

        // Reset distance to "Show All"
        const showAllDistance = document.querySelector('[data-distance="all"]');
        if (showAllDistance) {
            showAllDistance.checked = true;
        }

        // Clear price inputs
        priceMinInput.value = '';
        priceMaxInput.value = '';

        // Clear search
        searchInput.value = '';

        // Show all items
        itemCards.forEach(card => {
            card.classList.remove('hidden');
        });

        // Update results count
        updateResultsCount(itemCards.length);
    });

    // Make item cards clickable
    itemCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons or save button
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('save-btn')) {
                return;
            }
            
            // Get the "View Details" button and navigate to its href
            const viewDetailsBtn = this.querySelector('.btn-primary');
            if (viewDetailsBtn && viewDetailsBtn.onclick) {
                viewDetailsBtn.click();
            }
        });
    });

    // Initial results count on page load
    const visibleItems = Array.from(itemCards).filter(card => !card.classList.contains('hidden')).length;
    updateResultsCount(visibleItems);
})();

// Toggle save button functionality (global function used in HTML)
function toggleSave(btn) {
    if (btn.textContent === 'Save') {
        btn.textContent = '✓ Saved';
        btn.style.background = '#333';
        btn.style.color = 'white';
        
        // Optionally save to sessionStorage for persistence
        const itemName = btn.closest('.item-card').querySelector('h3').textContent;
        let savedItems = JSON.parse(sessionStorage.getItem('savedItems') || '[]');
        if (!savedItems.includes(itemName)) {
            savedItems.push(itemName);
            sessionStorage.setItem('savedItems', JSON.stringify(savedItems));
        }
    } else {
        btn.textContent = 'Save';
        btn.style.background = 'white';
        btn.style.color = 'black';
        
        // Remove from sessionStorage
        const itemName = btn.closest('.item-card').querySelector('h3').textContent;
        let savedItems = JSON.parse(sessionStorage.getItem('savedItems') || '[]');
        savedItems = savedItems.filter(name => name !== itemName);
        sessionStorage.setItem('savedItems', JSON.stringify(savedItems));
    }
}

// On page load, check if items are already saved and update UI
document.addEventListener('DOMContentLoaded', function() {
    const savedItems = JSON.parse(sessionStorage.getItem('savedItems') || '[]');
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
        const itemName = btn.closest('.item-card').querySelector('h3').textContent;
        if (savedItems.includes(itemName)) {
            btn.textContent = '✓ Saved';
            btn.style.background = '#333';
            btn.style.color = 'white';
        }
    });
});