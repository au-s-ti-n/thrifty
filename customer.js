// customer.js

// Load all data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedItems();
    loadReservations();
    updatePurchaseHistoryButton();
    calculateAndDisplayImpact();
});

// Load and display saved items
function loadSavedItems() {
    const savedItemNames = DataManager.getSavedItems();
    const allItems = DataManager.getAllItems();
    const container = document.getElementById('saved-items-container');
    const countElement = document.getElementById('saved-count');
    const noItemsMessage = document.getElementById('no-saved-message');
    
    if (!container) return;
    
    countElement.textContent = savedItemNames.length;

    if (savedItemNames.length === 0) {
        noItemsMessage.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    noItemsMessage.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';

    savedItemNames.forEach(itemName => {
        const itemInfo = allItems[itemName];
        if (!itemInfo) return;

        const card = document.createElement('div');
        card.className = 'saved-item-card';
        card.innerHTML = `
            <div class="saved-item-image" onclick="${itemInfo.url !== '#' ? `window.location.href='${itemInfo.url}'` : 'DataManager.showFeedback(\'Detail page coming soon\', \'info\')'}">
                <img src="${itemInfo.image}" alt="${itemName}">
            </div>
            <div class="saved-item-details">
                <h4>${itemName}</h4>
                <p class="item-meta">${itemInfo.size} | ${itemInfo.store}</p>
                <p class="item-price">${itemInfo.priceDisplay}</p>
                <div class="saved-item-actions">
                    ${itemInfo.url !== '#' ? `<button class="btn-primary" onclick="window.location.href='${itemInfo.url}'">View Item</button>` : '<button class="btn-primary" onclick="DataManager.showFeedback(\'Detail page coming soon\', \'info\')">View Item</button>'}
                    <button class="btn-secondary" onclick="removeSavedItem('${itemName.replace(/'/g, "\\'")}')">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// FIXED: Load active reservations with SAME styling as saved items
function loadReservations() {
    const reservations = DataManager.getReservations();
    const allItems = DataManager.getAllItems();
    const container = document.querySelector('.reservation-container');
    
    if (!container) return;

    container.innerHTML = '';
    
    if (reservations.length === 0) {
        container.innerHTML = '<p class="no-items-message">No active reservations. <a href="browse.html">Browse items</a> to reserve something!</p>';
        return;
    }

    // Create grid container with same class as saved items
    const gridContainer = document.createElement('div');
    gridContainer.className = 'saved-items-grid';
    
    reservations.forEach((reservation) => {
        const itemInfo = allItems[reservation.itemName];
        if (!itemInfo) return;

        const card = document.createElement('div');
        card.className = 'saved-item-card';
        card.style.border = '2px solid #27ae60'; // Green border for reserved items
        card.innerHTML = `
            <div class="saved-item-image">
                <img src="${itemInfo.image}" alt="${reservation.itemName}">
                <div style="position: absolute; top: 8px; right: 8px; background: #27ae60; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">
                    RESERVED
                </div>
            </div>
            <div class="saved-item-details">
                <h4>${reservation.itemName}</h4>
                <p class="item-meta">${itemInfo.size} | ${itemInfo.store}</p>
                <p class="item-price">${itemInfo.priceDisplay}</p>
                <p style="color: #e67e22; font-size: 12px; margin: 5px 0; font-weight: 600;">
                    ⏰ Expires: ${reservation.expires}
                </p>
                <p style="color: #27ae60; font-size: 12px; margin: 5px 0;">
                    🌍 Saves ${itemInfo.co2} lbs CO2
                </p>
                <div class="saved-item-actions">
                    <button class="btn-primary" onclick="viewDirections('${reservation.store}')">Get Directions</button>
                    <button class="btn-secondary" onclick="cancelReservation('${reservation.itemName.replace(/'/g, "\\'")}')">Cancel Hold</button>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
    
    container.appendChild(gridContainer);

    // Add tip text
    const tip = document.createElement('p');
    tip.className = 'tip-text';
    tip.textContent = 'Tip: Pick up reserved items within 24 hours or they\'ll return to inventory.';
    container.appendChild(tip);
}

// Update purchase history button to open modal
function updatePurchaseHistoryButton() {
    const purchaseHistoryBtns = document.querySelectorAll('.action-btn');
    purchaseHistoryBtns.forEach(btn => {
        if (btn.textContent.includes('Purchase History')) {
            btn.onclick = function() { openPurchaseHistoryPage(); };
        }
    });
}

// WORKING Purchase History Page
function openPurchaseHistoryPage() {
    const history = DataManager.getPurchaseHistory();
    const allItems = DataManager.getAllItems();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 85vh; overflow-y: auto;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Purchase History</h2>
            <p style="color: #666; margin-bottom: 25px;">Your sustainable shopping journey</p>
            
            ${history.length === 0 ? `
                <div class="no-items-message">
                    <p>No purchase history yet. <a href="browse.html">Start shopping</a> to build your sustainable wardrobe!</p>
                </div>
            ` : `
                <div class="saved-items-grid">
                    ${history.map(purchase => {
                        const itemInfo = allItems[purchase.itemName];
                        if (!itemInfo) return '';
                        
                        return `
                            <div class="saved-item-card">
                                <div class="saved-item-image" style="cursor: default;">
                                    <img src="${itemInfo.image}" alt="${purchase.itemName}">
                                </div>
                                <div class="saved-item-details">
                                    <h4>${purchase.itemName}</h4>
                                    <p class="item-meta">${itemInfo.size}</p>
                                    <p class="item-price">${itemInfo.priceDisplay}</p>
                                    <p style="font-size: 12px; color: #27ae60; margin-top: 8px; font-weight: 600;">
                                        ✓ Purchased ${purchase.date}
                                    </p>
                                    <p style="font-size: 11px; color: #666; margin-top: 5px;">
                                        Saved ${itemInfo.co2} lbs CO2, ${itemInfo.water} gal water
                                    </p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 12px;">
                    <h3 style="margin-bottom: 15px; font-size: 20px;">🌍 Your Total Environmental Impact</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div>
                            <p style="font-size: 28px; font-weight: 700; color: #2e7d32; margin-bottom: 5px;">
                                ${history.reduce((sum, p) => sum + (allItems[p.itemName]?.co2 || 0), 0)} lbs
                            </p>
                            <p style="font-size: 14px; color: #555;">CO2 Saved</p>
                        </div>
                        <div>
                            <p style="font-size: 28px; font-weight: 700; color: #1976d2; margin-bottom: 5px;">
                                ${history.reduce((sum, p) => sum + (allItems[p.itemName]?.water || 0), 0).toLocaleString()} gal
                            </p>
                            <p style="font-size: 14px; color: #555;">Water Saved</p>
                        </div>
                        <div>
                            <p style="font-size: 28px; font-weight: 700; color: #f57c00; margin-bottom: 5px;">
                                ${history.length}
                            </p>
                            <p style="font-size: 14px; color: #555;">Items Purchased</p>
                        </div>
                    </div>
                </div>
            `}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Calculate and display environmental impact
function calculateAndDisplayImpact() {
    const impact = DataManager.calculateTotalImpact();
    
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
        // CO2 card
        statCards[0].querySelector('h3').textContent = impact.totalCO2 + ' lbs';
        const co2Progress = Math.min((impact.totalCO2 / 100) * 100, 100);
        const co2Fill = statCards[0].querySelector('.progress-fill');
        if (co2Fill) co2Fill.style.width = co2Progress + '%';
        const co2Text = statCards[0].querySelector('.progress-text');
        if (co2Text) co2Text.textContent = `${Math.round(co2Progress)}% to Eco Warrior badge`;

        // Water card
        statCards[1].querySelector('h3').textContent = impact.totalWater.toLocaleString() + ' gal';
        const waterProgress = Math.min((impact.totalWater / 5000) * 100, 100);
        const waterFill = statCards[1].querySelector('.progress-fill');
        if (waterFill) waterFill.style.width = waterProgress + '%';
        const waterText = statCards[1].querySelector('.progress-text');
        if (waterText) waterText.textContent = `${Math.round(waterProgress)}% to Water Saver badge`;

        // Waste card
        statCards[2].querySelector('h3').textContent = impact.totalWaste.toFixed(1) + ' lbs';
        const wasteProgress = Math.min((impact.totalWaste / 50) * 100, 100);
        const wasteFill = statCards[2].querySelector('.progress-fill');
        if (wasteFill) wasteFill.style.width = wasteProgress + '%';
        const wasteText = statCards[2].querySelector('.progress-text');
        if (wasteText) wasteText.textContent = `${Math.round(wasteProgress)}% to Waste Reducer badge`;
    }

    updateAchievements(impact);
}

// Update achievement status
function updateAchievements(impact) {
    const achievements = document.querySelectorAll('.achievement-card');
    
    achievements.forEach(card => {
        const title = card.querySelector('.achievement-title').textContent;
        
        if (title === 'Green Shopper' && impact.totalCO2 >= 25) {
            card.classList.add('unlocked');
            card.classList.remove('locked');
            card.querySelector('.badge-status').textContent = 'Unlocked!';
        }
        
        if (title === 'Eco Warrior' && impact.totalCO2 >= 100) {
            card.classList.add('unlocked');
            card.classList.remove('locked');
            card.querySelector('.badge-status').textContent = 'Unlocked!';
        }
        
        if (title === 'Water Saver' && impact.totalWater >= 5000) {
            card.classList.add('unlocked');
            card.classList.remove('locked');
            card.querySelector('.badge-status').textContent = 'Unlocked!';
        }
    });
}

// Remove item from saved items
function removeSavedItem(itemName) {
    DataManager.removeSavedItem(itemName);
    DataManager.showFeedback('Item removed from saved list', 'info');
    loadSavedItems();
}

// View directions
function viewDirections(storeName) {
    const directionsPanel = document.createElement('div');
    directionsPanel.className = 'directions-panel';
    directionsPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Directions to ${storeName}</h3>
            <p>Opening in Google Maps...</p>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">In production, this would open your device's maps application with directions to the store.</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(directionsPanel);
    
    setTimeout(() => {
        if (directionsPanel.parentElement) {
            directionsPanel.remove();
        }
    }, 3000);
}

// Cancel reservation
function cancelReservation(itemName) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Cancel Reservation?</h3>
            <p>This item will be returned to available inventory for other shoppers.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Keep Reservation</button>
                <button class="btn-cancel" onclick="confirmCancelReservation('${itemName.replace(/'/g, "\\'")}'); this.closest('.confirm-panel').remove();" style="flex: 1;">Cancel Hold</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmCancelReservation(itemName) {
    DataManager.removeReservation(itemName);
    DataManager.showFeedback('Reservation cancelled. Item returned to inventory.', 'info');
    loadReservations();
}

// FIXED: Edit Preferences - now opens in properly centered modal
function editPreferences() {
    // Get current preferences or defaults
    const currentPrefs = JSON.parse(sessionStorage.getItem('customerPreferences') || '{"sizes":"32x30, M, 9","stores":"Goodwill Benton, Thrifty Village","categories":["Vintage","Outdoor Gear","Streetwear"]}');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Edit Shopping Preferences</h2>
            <form onsubmit="savePreferences(event)">
                <label>Preferred Sizes (comma-separated)</label>
                <input type="text" id="pref-sizes" value="${currentPrefs.sizes}" placeholder="e.g., 32x32, L, 10" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <label>Favorite Stores (comma-separated)</label>
                <input type="text" id="pref-stores" value="${currentPrefs.stores}" placeholder="e.g., Goodwill, Salvation Army" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <label>Interested Categories</label>
                <div style="display: flex; flex-direction: column; gap: 8px; margin: 10px 0;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" value="Vintage" ${currentPrefs.categories.includes('Vintage') ? 'checked' : ''}> Vintage
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" value="Outdoor Gear" ${currentPrefs.categories.includes('Outdoor Gear') ? 'checked' : ''}> Outdoor Gear
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" value="Streetwear" ${currentPrefs.categories.includes('Streetwear') ? 'checked' : ''}> Streetwear
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" value="Designer" ${currentPrefs.categories.includes('Designer') ? 'checked' : ''}> Designer
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" value="Workwear" ${currentPrefs.categories.includes('Workwear') ? 'checked' : ''}> Workwear
                    </label>
                </div>
                
                <button type="submit" class="btn-primary">Save Preferences</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function savePreferences(event) {
    event.preventDefault();
    
    const sizes = document.getElementById('pref-sizes').value;
    const stores = document.getElementById('pref-stores').value;
    
    // Get selected categories
    const categories = [];
    document.querySelectorAll('.modal input[type="checkbox"]:checked').forEach(cb => {
        categories.push(cb.value);
    });
    
    // Save to session storage
    sessionStorage.setItem('customerPreferences', JSON.stringify({
        sizes: sizes,
        stores: stores,
        categories: categories
    }));
    
    // Update display in the settings box
    const settingBoxes = document.querySelectorAll('.setting-box');
    settingBoxes.forEach(box => {
        if (box.querySelector('h4').textContent === 'Shopping Preferences') {
            const categoryText = categories.length > 0 ? categories.join(', ') : 'None selected';
            box.innerHTML = `
                <h4>Shopping Preferences</h4>
                <p>Preferred Sizes: <strong>${sizes}</strong></p>
                <p>Favorite Stores: <strong>${stores}</strong></p>
                <p>Interested In: <strong>${categoryText}</strong></p>
                <button class="btn-secondary" onclick="editPreferences()">Edit Preferences</button>
            `;
        }
    });
    
    document.querySelector('.modal').remove();
    DataManager.showFeedback('Preferences updated successfully!', 'success');
}

// Settings functionality
function saveSettings() {
    DataManager.showFeedback('Settings saved successfully!', 'success');
}

// Show feedback
function showFeedback(message, type) {
    DataManager.showFeedback(message, type);
}