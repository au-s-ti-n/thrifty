// manager.js

// Sample data for reservations
let storeReservations = [
    {
        customerName: "Emma Rodriguez",
        item: "Nike Air Max Shoes",
        price: 25,
        expires: "Today at 2:45 PM"
    },
    {
        customerName: "Marcus Chan",
        item: "Patagonia Fleece Pullover",
        price: 35,
        expires: "Tomorrow at 11:20 AM"
    }
];

// Load everything on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRecentListings();
    loadStoreReservations();
    updateDashboardStats();
});

function loadStoreReservations() {
    const container = document.getElementById('reservations-list');
    const countElement = document.getElementById('reservation-list-count');
    
    if (!container) return;
    
    countElement.textContent = storeReservations.length;
    document.getElementById('reservations-count').textContent = storeReservations.length;
    
    container.innerHTML = '';

    if (storeReservations.length === 0) {
        container.innerHTML = '<p class="no-items-message">No active reservations at this time.</p>';
        return;
    }

    storeReservations.forEach((reservation, index) => {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.innerHTML = `
            <div class="reservation-header">
                <h3>${reservation.customerName}</h3>
                <span class="reservation-status">Active</span>
            </div>
            <div class="reservation-details">
                <p><strong>Item:</strong> ${reservation.item}</p>
                <p><strong>Price:</strong> $${reservation.price}</p>
                <p><strong>Expires:</strong> ${reservation.expires}</p>
            </div>
            <div class="reservation-actions">
                <button class="btn-primary" onclick="completeReservation(${index})">Mark as Sold</button>
                <button class="btn-secondary" onclick="contactCustomer('${reservation.customerName}')">Contact Customer</button>
                <button class="btn-cancel" onclick="cancelStoreReservation(${index})">Cancel Hold</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadRecentListings() {
    const managerListings = DataManager.getManagerListings();
    const container = document.getElementById('recent-listings');
    
    if (!container) return;
    
    if (managerListings.length === 0) {
        container.innerHTML = '<p class="no-items-message">No items listed yet. Use "List New Item" to add your first item!</p>';
        return;
    }

    container.innerHTML = '';
    
    // Show most recent listings first
    const recentListings = [...managerListings].reverse().slice(0, 10);
    
    recentListings.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <div class="listing-info">
                <h4>${item.name}</h4>
                <p class="listing-meta">${item.category} | $${item.price} | Listed ${item.listedDate}</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-secondary btn-small" onclick="editListing('${item.id}')">Edit</button>
                <button class="btn-cancel btn-small" onclick="removeListing('${item.id}')">Remove</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateDashboardStats() {
    const listings = DataManager.getManagerListings();
    const currentCount = parseInt(document.getElementById('live-items-count').textContent);
    const newTotal = 10 + listings.length;
    document.getElementById('live-items-count').textContent = newTotal;
}

function completeReservation(index) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Mark as Sold</h3>
            <p>Complete the sale of ${storeReservations[index].item} to ${storeReservations[index].customerName}?</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Cancel</button>
                <button class="btn-primary" onclick="confirmSale(${index}); this.closest('.confirm-panel').remove();" style="flex: 1;">Complete Sale</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmSale(index) {
    const soldItem = storeReservations.splice(index, 1)[0];
    
    const reservationCount = Math.max(0, storeReservations.length);
    document.getElementById('reservations-count').textContent = reservationCount;
    
    const revenue = parseInt(document.getElementById('revenue-today').textContent.replace('$', ''));
    document.getElementById('revenue-today').textContent = '$' + (revenue + soldItem.price);
    
    loadStoreReservations();
    DataManager.showFeedback(`Sale completed! ${soldItem.item} sold for $${soldItem.price}`, 'success');
}

function contactCustomer(customerName) {
    const contactPanel = document.createElement('div');
    contactPanel.className = 'directions-panel';
    contactPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Contact ${customerName}</h3>
            <p style="margin-bottom: 15px;">Available contact methods:</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn-secondary" onclick="DataManager.showFeedback('SMS sent to ${customerName}', 'success'); this.closest('.directions-panel').remove();">Send SMS Reminder</button>
                <button class="btn-secondary" onclick="DataManager.showFeedback('Email sent to ${customerName}', 'success'); this.closest('.directions-panel').remove();">Send Email</button>
            </div>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(contactPanel);
}

function cancelStoreReservation(index) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Cancel Reservation?</h3>
            <p>Cancel the hold for ${storeReservations[index].customerName}? The item will return to available inventory.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Keep Hold</button>
                <button class="btn-cancel" onclick="confirmCancelStore(${index}); this.closest('.confirm-panel').remove();" style="flex: 1;">Cancel Hold</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmCancelStore(index) {
    storeReservations.splice(index, 1);
    loadStoreReservations();
    DataManager.showFeedback('Reservation cancelled. Item returned to available inventory.', 'info');
}

function showListItemModal() {
    document.getElementById('list-item-modal').style.display = 'flex';
}

function closeListItemModal() {
    document.getElementById('list-item-modal').style.display = 'none';
    document.getElementById('list-item-form').reset();
    // Clear photo preview if exists
    const preview = document.getElementById('photo-preview');
    if (preview) preview.innerHTML = '';
}

// ENHANCED: Handle photo uploads with preview
let uploadedPhotos = [];

document.getElementById('item-photos')?.addEventListener('change', function(e) {
    const files = e.target.files;
    uploadedPhotos = Array.from(files);
    
    // Create or get preview container
    let preview = document.getElementById('photo-preview');
    if (!preview) {
        preview = document.createElement('div');
        preview.id = 'photo-preview';
        preview.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; margin-top: 10px;';
        e.target.parentElement.appendChild(preview);
    }
    
    preview.innerHTML = '';
    
    uploadedPhotos.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const photoDiv = document.createElement('div');
            photoDiv.style.cssText = 'position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 2px solid #ddd;';
            photoDiv.innerHTML = `
                <img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                <button type="button" onclick="removePhoto(${index})" style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; padding: 0;">×</button>
            `;
            preview.appendChild(photoDiv);
        };
        reader.readAsDataURL(file);
    });
    
    DataManager.showFeedback(`${files.length} photo${files.length > 1 ? 's' : ''} ready to upload`, 'success');
});

function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    document.getElementById('item-photos').value = '';
    const preview = document.getElementById('photo-preview');
    if (preview) {
        const children = Array.from(preview.children);
        if (children[index]) children[index].remove();
    }
    DataManager.showFeedback('Photo removed', 'info');
}

function handleListItem(event) {
    event.preventDefault();
    
    const itemData = {
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        size: document.getElementById('item-size').value,
        brand: document.getElementById('item-brand').value,
        condition: document.getElementById('item-condition').value,
        price: parseFloat(document.getElementById('item-price').value),
        description: document.getElementById('item-description').value,
        photoCount: uploadedPhotos.length
    };
    
    // Add to manager listings
    const newItem = DataManager.addManagerListing(itemData);
    
    // Update counters
    const itemsListedCount = parseInt(document.getElementById('items-listed-count').textContent);
    document.getElementById('items-listed-count').textContent = itemsListedCount + 1;
    
    // Reload listings
    loadRecentListings();
    updateDashboardStats();
    
    // Clear photos
    uploadedPhotos = [];
    
    // Close modal and show success
    closeListItemModal();
    DataManager.showFeedback(`Success! ${itemData.name} listed for $${itemData.price}${itemData.photoCount > 0 ? ` with ${itemData.photoCount} photo(s)` : ''}. Now visible on browse page!`, 'success');
}

function editListing(id) {
    const listings = DataManager.getManagerListings();
    const item = listings.find(l => l.id === id);
    if (!item) return;
    
    const editPanel = document.createElement('div');
    editPanel.className = 'directions-panel';
    editPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Edit: ${item.name}</h3>
            <form onsubmit="saveEdit(event, '${id}')" style="margin-top: 20px;">
                <label style="display: block; margin: 10px 0 5px; font-weight: 600;">Price</label>
                <input type="number" id="edit-price" value="${item.price}" step="0.01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                
                <label style="display: block; margin: 15px 0 5px; font-weight: 600;">Description</label>
                <textarea id="edit-description" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; height: 80px;">${item.description}</textarea>
                
                <button type="submit" class="btn-primary" style="margin-top: 20px;">Save Changes</button>
            </form>
        </div>
    `;
    document.body.appendChild(editPanel);
}

function saveEdit(event, id) {
    event.preventDefault();
    const newPrice = parseFloat(document.getElementById('edit-price').value);
    const newDescription = document.getElementById('edit-description').value;
    
    DataManager.updateManagerListing(id, {
        price: newPrice,
        description: newDescription
    });
    
    loadRecentListings();
    document.querySelector('.directions-panel').remove();
    DataManager.showFeedback('Listing updated successfully!', 'success');
}

// ENHANCED: Remove listing with proper confirmation
function removeListing(id) {
    const listings = DataManager.getManagerListings();
    const item = listings.find(l => l.id === id);
    if (!item) return;
    
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Remove "${item.name}"?</h3>
            <p>This item will be removed from the browse page and no longer visible to shoppers.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Cancel</button>
                <button class="btn-cancel" onclick="confirmRemove('${id}'); this.closest('.confirm-panel').remove();" style="flex: 1;">Remove Listing</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmRemove(id) {
    DataManager.removeManagerListing(id);
    loadRecentListings();
    updateDashboardStats();
    DataManager.showFeedback('Listing removed from marketplace.', 'info');
}

function showAnalytics() {
    const listings = DataManager.getManagerListings();
    const analyticsPanel = document.createElement('div');
    analyticsPanel.className = 'directions-panel';
    analyticsPanel.innerHTML = `
        <div class="directions-content" style="max-width: 600px;">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Analytics Dashboard</h3>
            <div style="margin: 20px 0;">
                <div style="padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <strong>Total Items Listed:</strong> ${listings.length}
                </div>
                <div style="padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <strong>Average Price:</strong> $${listings.length > 0 ? (listings.reduce((sum, item) => sum + item.price, 0) / listings.length).toFixed(2) : '0.00'}
                </div>
                <div style="padding: 15px; background: #f9f9f9; border-radius: 8px;">
                    <strong>Recent Listings:</strong> ${listings.filter(item => {
                        const itemDate = new Date(item.timestamp);
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return itemDate > weekAgo;
                    }).length} in past week
                </div>
            </div>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(analyticsPanel);
}

// NEW: Separate pages for Start Listing and Live on Platform
function showLiveInventory() {
    const listings = DataManager.getManagerListings();
    const inventoryPanel = document.createElement('div');
    inventoryPanel.className = 'modal';
    inventoryPanel.style.display = 'flex';
    inventoryPanel.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">×</span>
            <h2>Live on Platform (${10 + listings.length} items)</h2>
            <p style="margin: 15px 0; color: #666;">Items currently visible to shoppers</p>
            
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 15px;">Your Listings (${listings.length})</h3>
                ${listings.length > 0 ? listings.map(item => `
                    <div style="padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${item.name}</strong><br>
                            <span style="color: #666; font-size: 14px;">${item.category} | ${item.size} | $${item.price}</span><br>
                            <span style="color: #999; font-size: 13px;">Listed: ${item.listedDate}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-secondary btn-small" onclick="editListing('${item.id}'); this.closest('.modal').remove();">Edit</button>
                            <button class="btn-cancel btn-small" onclick="removeListing('${item.id}'); this.closest('.modal').remove();">Remove</button>
                        </div>
                    </div>
                `).join('') : '<p style="color: #999;">No manager listings yet.</p>'}
            </div>
            
            <div style="padding: 20px; background: #e8f5e9; border-radius: 12px; margin-top: 20px;">
                <strong>Original Inventory:</strong> 10 items (Lee Jeans, Wrangler Jeans, etc.)
            </div>
        </div>
    `;
    document.body.appendChild(inventoryPanel);
    
    // Close on outside click
    inventoryPanel.addEventListener('click', function(e) {
        if (e.target === inventoryPanel) {
            inventoryPanel.remove();
        }
    });
}

// NEW: Store Settings Implementation
function showStoreSettings() {
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal';
    settingsModal.style.display = 'flex';
    settingsModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="modal-close" onclick="this.closest('.modal').remove()">×</span>
            <h2>Store Settings</h2>
            <p style="color: #666; margin-bottom: 25px;">Manage your store configuration</p>
            
            <form onsubmit="saveStoreSettings(event)">
                <h3 style="font-size: 18px; margin: 20px 0 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Store Information</h3>
                
                <label>Store Name</label>
                <input type="text" id="store-name" value="Goodwill - Benton Street" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <label>Store Hours</label>
                <input type="text" id="store-hours" value="Mon-Sat: 9AM-8PM, Sun: 10AM-6PM" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <label>Contact Phone</label>
                <input type="tel" id="store-phone" value="(408) 555-0123" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <h3 style="font-size: 18px; margin: 30px 0 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Pricing Rules</h3>
                
                <label>Auto-discount items after (days)</label>
                <input type="number" id="auto-discount-days" value="30" min="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px;">
                <p style="font-size: 13px; color: #666; margin-bottom: 15px;">Items will be automatically discounted after this many days</p>
                
                <label>Discount percentage (%)</label>
                <input type="number" id="discount-percent" value="20" min="0" max="100" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <h3 style="font-size: 18px; margin: 30px 0 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Notifications</h3>
                
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <input type="checkbox" checked> Email when new reservation is made
                </label>
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <input type="checkbox" checked> SMS alerts for expiring reservations
                </label>
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <input type="checkbox"> Daily inventory summary
                </label>
                
                <h3 style="font-size: 18px; margin: 30px 0 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Sustainability Goals</h3>
                
                <label>Monthly CO2 Savings Goal (lbs)</label>
                <input type="number" id="co2-goal" value="500" min="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px;">
                
                <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <input type="checkbox" checked> Display sustainability metrics to customers
                </label>
                
                <button type="submit" class="btn-primary" style="margin-top: 20px;">Save All Settings</button>
            </form>
        </div>
    `;
    document.body.appendChild(settingsModal);
    
    // Close on outside click
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            settingsModal.remove();
        }
    });
}

function saveStoreSettings(event) {
    event.preventDefault();
    
    const settings = {
        storeName: document.getElementById('store-name').value,
        hours: document.getElementById('store-hours').value,
        phone: document.getElementById('store-phone').value,
        autoDiscountDays: document.getElementById('auto-discount-days').value,
        discountPercent: document.getElementById('discount-percent').value,
        co2Goal: document.getElementById('co2-goal').value
    };
    
    // In production, this would save to a database
    sessionStorage.setItem('storeSettings', JSON.stringify(settings));
    
    document.querySelector('.modal').remove();
    DataManager.showFeedback('Store settings saved successfully!', 'success');
}

// Update quick actions to use new store settings
document.addEventListener('DOMContentLoaded', function() {
    const settingsBtn = document.querySelector('.btn-secondary[onclick*="Store Settings"]');
    if (settingsBtn) {
        settingsBtn.onclick = showStoreSettings;
    }
});

// Show feedback
function showFeedback(message, type) {
    DataManager.showFeedback(message, type);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('list-item-modal');
    if (event.target === modal) {
        closeListItemModal();
    }
}