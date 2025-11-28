// itemDetail.js - Universal script for ALL item detail pages

// Get item name from the page
function getItemNameFromPage() {
    const h1 = document.querySelector('.details-section h1');
    return h1 ? h1.textContent.trim() : null;
}

// Track reservation state
let isReserved = false;
let expirationTime = '';

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    const itemName = getItemNameFromPage();
    if (!itemName) return;

    // Check if item is already reserved
    if (DataManager.isItemReserved(itemName)) {
        const reservations = DataManager.getReservations();
        const reservation = reservations.find(r => r.itemName === itemName);
        if (reservation) {
            isReserved = true;
            expirationTime = reservation.expires;
            updateReserveButton();
        }
    }

    // Check if item is already saved
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn && DataManager.isItemSaved(itemName)) {
        saveBtn.textContent = '✓ Saved';
        saveBtn.style.background = '#333';
        saveBtn.style.color = 'white';
    }

    // Add hover effect for reserved button
    const reserveBtn = document.getElementById('reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('mouseenter', function() {
            if (isReserved) {
                reserveBtn.textContent = 'Cancel Reservation';
                reserveBtn.style.background = '#dc3545';
            }
        });
        
        reserveBtn.addEventListener('mouseleave', function() {
            if (isReserved) {
                reserveBtn.textContent = `✓ Reserved (expires ${expirationTime})`;
                reserveBtn.style.background = '#4CAF50';
            }
        });
    }
});

// Update reserve button appearance
function updateReserveButton() {
    const btn = document.getElementById('reserve-btn');
    if (!btn) return;

    if (isReserved) {
        btn.textContent = `✓ Reserved (expires ${expirationTime})`;
        btn.style.background = '#4CAF50';
        btn.classList.add('reserved');
    } else {
        btn.textContent = 'Reserve Item (24 hr hold)';
        btn.style.background = 'black';
        btn.classList.remove('reserved');
    }
}

// Toggle reservation functionality
function toggleReservation() {
    const itemName = getItemNameFromPage();
    if (!itemName) return;

    // Check if logged in
    if (!DataManager.isLoggedIn()) {
        showLoginPrompt();
        return;
    }

    const btn = document.getElementById('reserve-btn');
    
    if (!isReserved) {
        // RESERVE the item
        const itemDatabase = DataManager.getItemDatabase();
        const itemData = itemDatabase[itemName];
        
        if (DataManager.addReservation(itemName, itemData || {})) {
            const now = new Date();
            now.setHours(now.getHours() + 24);
            expirationTime = now.toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            isReserved = true;
            updateReserveButton();
            DataManager.showFeedback('Item reserved! Check your profile to view.', 'success');
        }
    } else {
        // CANCEL reservation - show confirmation
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
}

// Confirm cancellation
function confirmCancelReservation(itemName) {
    DataManager.removeReservation(itemName);
    isReserved = false;
    expirationTime = '';
    updateReserveButton();
    DataManager.showFeedback('Reservation cancelled.', 'info');
}

// Save item functionality
function saveItem() {
    const itemName = getItemNameFromPage();
    if (!itemName) return;

    // Check if logged in
    if (!DataManager.isLoggedIn()) {
        showLoginPrompt();
        return;
    }

    const btn = document.getElementById('save-btn');
    
    if (btn.textContent === 'Save to List') {
        if (DataManager.addSavedItem(itemName)) {
            btn.textContent = '✓ Saved';
            btn.style.background = '#333';
            btn.style.color = 'white';
            DataManager.showFeedback('Added to saved items!', 'success');
        }
    } else {
        DataManager.removeSavedItem(itemName);
        btn.textContent = 'Save to List';
        btn.style.background = 'white';
        btn.style.color = 'black';
        DataManager.showFeedback('Removed from saved items.', 'info');
    }
}

// Show login prompt
function showLoginPrompt() {
    const loginPanel = document.createElement('div');
    loginPanel.className = 'confirm-panel';
    loginPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Login Required</h3>
            <p>You need to be logged in to save items and make reservations.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Cancel</button>
                <button class="btn-primary" onclick="window.location.href='login.html'" style="flex: 1;">Go to Login</button>
            </div>
        </div>
    `;
    document.body.appendChild(loginPanel);
}

// Thumbnail image switching (universal function)
function changeProductImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Remove active class from all thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    if (thumbnail) {
        thumbnail.classList.add('active');
    }
}

// Legacy function names for backwards compatibility
function changeImage(imageSrc, thumbnail) {
    changeProductImage(imageSrc, thumbnail);
}

function changeWranglerImage(imageSrc, thumbnail) {
    changeProductImage(imageSrc, thumbnail);
}