// browse.js - Handles filtering functionality on browse page

(function() {
    const itemCards = document.querySelectorAll('.item-card');
    const categoryFilters = document.querySelectorAll('[data-category]');
    const sizeFilters = document.querySelectorAll('[data-size]');
    const distanceFilters = document.querySelectorAll('[data-distance]');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const clearFiltersBtn = document.getElementById('clear-filters');

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

        // Filter each item card
        itemCards.forEach(card => {
            const itemCategory = card.dataset.category;
            const itemSize = card.dataset.size;
            const itemPrice = parseFloat(card.dataset.price);
            const itemDistance = parseFloat(card.dataset.distance);

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

            // Distance filter (skip if "Show All" is selected)
            if (maxDistance !== Infinity && itemDistance > maxDistance) {
                show = false;
            }

            // Show or hide the card
            if (show) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
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

        // Show all items
        itemCards.forEach(card => {
            card.classList.remove('hidden');
        });
    });

    // Make item cards clickable - SIMPLIFIED LOGIC
    itemCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons
            if (e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Get the "View Details" button and click it
            const viewDetailsBtn = this.querySelector('.btn-primary');
            if (viewDetailsBtn) {
                viewDetailsBtn.click();
            }
        });
    });
})();