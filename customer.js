// customer.js

// Load all data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedItems();
    loadReservations();
    loadPurchaseHistory();
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

// Load active reservations
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

    reservations.forEach((reservation, index) => {
        const itemInfo = allItems[reservation.itemName];
        if (!itemInfo) return;

        const card = document.createElement('div');
        card.className = 'customer-reservation-card';
        card.innerHTML = `
            <div class="item-image">
                <img src="${itemInfo.image}" alt="${reservation.itemName}" class="item-image-actual">
            </div>
            <div class="item-details">
                <h3>${reservation.itemName}</h3>
                <p class="item-meta">Size: ${itemInfo.size} | Reserved ${reservation.date}</p>
                <p class="store-info"><strong>${reservation.store}</strong> - ${reservation.distance}</p>
                <p class="expire-time">Hold expires: <strong>${reservation.expires}</strong></p>
                <p class="impact-text">Saves ${itemInfo.co2} lbs CO2 when purchased</p>
                <div class="item-actions">
                    <button class="btn-primary" onclick="viewDirections('${reservation.store}')">Get Directions</button>
                    <button class="btn-secondary" onclick="cancelReservation('${reservation.itemName.replace(/'/g, "\\'")}')">Cancel Hold</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Add tip text
    const tip = document.createElement('p');
    tip.className = 'tip-text';
    tip.textContent = 'Tip: Pick up reserved items within 24 hours or they\'ll return to inventory.';
    container.appendChild(tip);
}

// Load purchase history - ENHANCED VERSION
function loadPurchaseHistory() {
    const history = DataManager.getPurchaseHistory();
    
    // Update the Quick Actions button to show the purchase history page
    const purchaseHistoryBtn = document.querySelector('.action-btn[onclick*="Purchase History"]');
    if (purchaseHistoryBtn) {
        purchaseHistoryBtn.onclick = function() { showPurchaseHistoryPage(); };
    }
}

// NEW: Show purchase history in a detailed view
function showPurchaseHistoryPage() {
    const history = DataManager.getPurchaseHistory();
    const allItems = DataManager.getAllItems();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 85vh; overflow-y: auto;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Purchase History</h2>
            <p style="color: #666; margin-bottom: 25px;">Your sustainable shopping journey</p>
            
            ${history.length === 0 ? `
                <div class="no-items-message">
                    <p>No purchase history yet. <a href="browse.html">Start shopping</a> to build your sustainable wardrobe!</p>
                </div>
            ` : `
                <div class="saved-items-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                    ${history.map(purchase => {
                        const itemInfo = allItems[purchase.itemName];
                        if (!itemInfo) return '';
                        
                        return `
                            <div class="saved-item-card">
                                <div class="saved-item-image" style="height: 150px;">
                                    <img src="${itemInfo.image}" alt="${purchase.itemName}">
                                </div>
                                <div class="saved-item-details">
                                    <h4 style="font-size: 15px;">${purchase.itemName}</h4>
                                    <p class="item-meta" style="font-size: 12px;">${itemInfo.size}</p>
                                    <p class="item-price" style="font-size: 18px;">${itemInfo.priceDisplay}</p>
                                    <p style="font-size: 12px; color: #27ae60; margin-top: 5px;">Purchased ${purchase.date}</p>
                                    <p style="font-size: 11px; color: #666; margin-top: 5px;">Saved ${itemInfo.co2} lbs CO2</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 12px;">
                    <h3 style="margin-bottom: 10px;">Your Total Impact</h3>
                    <p style="font-size: 15px; color: #555;">
                        Through ${history.length} sustainable purchase${history.length !== 1 ? 's' : ''}, you've made a real difference!
                    </p>
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
    
    // Update the stat cards if they exist
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

    // Update achievements based on impact
    updateAchievements(impact);
}

// Update achievement status
function updateAchievements(impact) {
    const achievements = document.querySelectorAll('.achievement-card');
    
    achievements.forEach(card => {
        const title = card.querySelector('.achievement-title').textContent;
        
        // Unlock achievements based on criteria
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

// NEW: Edit shopping preferences
function editPreferences() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Edit Shopping Preferences</h2>
            <form onsubmit="savePreferences(event)">
                <label>Preferred Sizes (comma-separated)</label>
                <input type="text" id="pref-sizes" value="32x30, M, 9" placeholder="e.g., 32x32, L, 10">
                
                <label>Favorite Stores (comma-separated)</label>
                <input type="text" id="pref-stores" value="Goodwill Benton, Thrifty Village" placeholder="e.g., Goodwill, Salvation Army">
                
                <label>Interested Categories</label>
                <div style="display: flex; flex-direction: column; gap: 8px; margin: 10px 0;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" checked> Vintage
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" checked> Outdoor Gear
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" checked> Streetwear
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox"> Designer
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox"> Workwear
                    </label>
                </div>
                
                <button type="submit" class="btn-primary">Save Preferences</button>
            </form>
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

function savePreferences(event) {
    event.preventDefault();
    
    // Get values
    const sizes = document.getElementById('pref-sizes').value;
    const stores = document.getElementById('pref-stores').value;
    
    // Update display in settings box
    const settingBox = document.querySelector('.setting-box');
    if (settingBox) {
        settingBox.querySelector('p:nth-of-type(1)').innerHTML = `Preferred Sizes: <strong>${sizes}</strong>`;
        settingBox.querySelector('p:nth-of-type(2)').innerHTML = `Favorite Stores: <strong>${stores}</strong>`;
    }
    
    // Close modal and show success
    document.querySelector('.modal').remove();
    DataManager.showFeedback('Preferences updated successfully!', 'success');
}

// Settings functionality
function saveSettings() {
    DataManager.showFeedback('Settings saved successfully!', 'success');
}

// Show feedback (uses DataManager)
function showFeedback(message, type) {
    DataManager.showFeedback(message, type);
}