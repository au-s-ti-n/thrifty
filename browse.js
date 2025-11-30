(function() {
    if (typeof DataManager === 'undefined') {
        console.error('DataManager not loaded!');
        return;
    }

    const categoryFilters = document.querySelectorAll('[data-category]');
    const sizeFilters = document.querySelectorAll('[data-size]');
    const distanceFilters = document.querySelectorAll('[data-distance]');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchInput = document.getElementById('search-input');

    addManagerListingsToBrowse();

    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    if (savedSearchTerm && searchInput) {
        searchInput.value = savedSearchTerm;
        sessionStorage.removeItem('searchTerm');
        applyFilters();
    }

    updateAllSaveButtons();

    function addManagerListingsToBrowse() {
        const managerListings = DataManager.getManagerListings();
        if (managerListings.length === 0) return;

        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        managerListings.forEach(listing => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.dataset.category = listing.category;
            card.dataset.size = listing.size;
            card.dataset.price = listing.price;
            card.dataset.distance = '2.3';
            card.dataset.name = listing.name;
            card.dataset.brand = listing.brand;
            card.dataset.description = listing.description;
            
            card.innerHTML = `
                <div class="item-image">
                    <div style="width: 100%; height: 180px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                        ${listing.name}
                    </div>
                </div>
                <div class="item-details">
                    <h3>${listing.name}</h3>
                    <p class="item-meta">Size: ${listing.size} | Brand: ${listing.brand}</p>
                    <div class="item-price">$${listing.price}</div>
                    <div class="item-description">
                        ${listing.description}
                    </div>
                    <div class="item-store">
                        <strong>Goodwill - Benton Street</strong> - 2.3 miles away<br>
                        <span style="color: #666; font-size: 13px;">Open until 8pm today</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn-primary" onclick="DataManager.showFeedback('Detail page coming soon for new listings', 'info')">View Details</button>
                        <button class="btn-secondary save-btn" onclick="event.stopPropagation(); toggleSave(this, '${listing.name.replace(/'/g, "\\'")}')">Save</button>
                    </div>
                </div>
            `;
            
            const firstCard = mainContent.querySelector('.item-card');
            if (firstCard) {
                mainContent.insertBefore(card, firstCard);
            } else {
                mainContent.appendChild(card);
            }
        });

        // After inserting manager listings, ensure save buttons reflect state
        updateAllSaveButtons();
    }

    function updateAllSaveButtons() {
        const saveButtons = document.querySelectorAll('.save-btn');
        saveButtons.forEach(btn => {
            const card = btn.closest('.item-card');
            if (!card) return;
            const itemName = card.dataset.name || card.querySelector('h3')?.textContent;
            if (itemName && DataManager.isItemSaved(itemName)) {
                btn.textContent = '✓ Saved';
                btn.style.background = '#333';
                btn.style.color = 'white';
            } else {
                btn.textContent = 'Save';
                btn.style.background = 'white';
                btn.style.color = 'black';
            }
        });
    }

    function applyFilters() {
        const itemCards = document.querySelectorAll('.item-card');
        
        const selectedCategories = Array.from(categoryFilters)
            .filter(input => input.checked)
            .map(input => input.dataset.category);

        const selectedSizes = Array.from(sizeFilters)
            .filter(input => input.checked)
            .map(input => input.dataset.size);

        const selectedDistance = document.querySelector('[name="distance"]:checked');
        const maxDistance = selectedDistance ? parseFloat(selectedDistance.value) : Infinity;

        const minPrice = priceMinInput ? (priceMinInput.value ? parseFloat(priceMinInput.value) : 0) : 0;
        const maxPrice = priceMaxInput ? (priceMaxInput.value ? parseFloat(priceMaxInput.value) : Infinity) : Infinity;

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

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

            if (selectedCategories.length > 0 && !selectedCategories.includes(itemCategory)) show = false;
            if (selectedSizes.length > 0 && !selectedSizes.includes(itemSize)) show = false;
            if (itemPrice < minPrice || itemPrice > maxPrice) show = false;
            if (maxDistance !== Infinity && itemDistance > maxDistance) show = false;

            if (searchTerm) {
                const matchesSearch =
                    itemName.includes(searchTerm) ||
                    itemBrand.includes(searchTerm) ||
                    itemDescription.includes(searchTerm);
                if (!matchesSearch) show = false;
            }

            if (show) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        updateResultsCount(visibleCount);
    }

    function updateResultsCount(count) {
        const existingMessage = document.querySelector('.results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
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
        
        const firstElement = mainContent.querySelector('.item-card') || mainContent.firstElementChild;
        if (firstElement) {
            mainContent.insertBefore(message, firstElement);
        } else {
            mainContent.appendChild(message);
        }
    }

    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }

    if (sizeFilters.length > 0) {
        sizeFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }

    if (distanceFilters.length > 0) {
        distanceFilters.forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }

    if (priceMinInput) priceMinInput.addEventListener('input', applyFilters);
    if (priceMaxInput) priceMaxInput.addEventListener('input', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            categoryFilters.forEach(filter => filter.checked = false);
            sizeFilters.forEach(filter => filter.checked = false);
            
            const showAllDistance = document.querySelector('[data-distance="all"]');
            if (showAllDistance) showAllDistance.checked = true;
            
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
            if (searchInput) searchInput.value = '';

            document.querySelectorAll('.item-card').forEach(card => {
                card.classList.remove('hidden');
            });

            updateResultsCount(document.querySelectorAll('.item-card').length);
        });
    }

    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('save-btn')) {
                return;
            }
            
            const viewDetailsBtn = this.querySelector('.btn-primary');
            if (viewDetailsBtn && viewDetailsBtn.onclick) {
                viewDetailsBtn.click();
            }
        });
    });

    const visibleItems = Array.from(document.querySelectorAll('.item-card')).filter(card => !card.classList.contains('hidden')).length;
    updateResultsCount(visibleItems);
})();

function toggleSave(btn, itemName) {
    if (!DataManager.isLoggedIn()) {
        const loginPanel = document.createElement('div');
        loginPanel.className = 'confirm-panel';
        loginPanel.innerHTML = `
            <div class="confirm-content">
                <h3>Login Required</h3>
                <p>You need to be logged in to save items.</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Cancel</button>
                    <button class="btn-primary" onclick="window.location.href='login.html'" style="flex: 1;">Go to Login</button>
                </div>
            </div>
        `;
        document.body.appendChild(loginPanel);
        return;
    }

    if (!itemName) {
        const card = btn.closest('.item-card');
        itemName = card.dataset.name || card.querySelector('h3')?.textContent;
    }

    if (!itemName) return;

    const isCurrentlySaved = DataManager.isItemSaved(itemName);

    if (!isCurrentlySaved) {
        if (DataManager.addSavedItem(itemName)) {
            btn.textContent = '✓ Saved';
            btn.style.background = '#333';
            btn.style.color = 'white';
            DataManager.showFeedback('Added to saved items!', 'success');
        }
    } else {
        DataManager.removeSavedItem(itemName);
        btn.textContent = 'Save';
        btn.style.background = 'white';
        btn.style.color = 'black';
        DataManager.showFeedback('Removed from saved items.', 'info');
    }
}
