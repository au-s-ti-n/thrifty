// customer.js - Fully integrated customer dashboard

// Comprehensive item database matching all items in browse
const itemDatabase = {
    "Lee Regular Fit Jeans": {
        url: "lee_regular_fit_item1.html",
        image: "images/lee/lee_front.jpg",
        price: "$14",
        size: "34x32",
        store: "Goodwill Benton",
        co2: 18,
        water: 1800
    },
    "Wrangler Relaxed Fit Jeans": {
        url: "wranglers_relaxed_fit_item2.html",
        image: "images/wranglers/wranglers_main_image.jpg",
        price: "$16",
        size: "34x32",
        store: "Goodwill Benton",
        co2: 22,
        water: 1800
    },
    "Levi's 505 Regular Fit Jeans": {
        url: "item3.html",
        image: "images/levis/levi505_front.jpg",
        price: "$18",
        size: "32x32",
        store: "Thrifty Village",
        co2: 20,
        water: 1800
    },
    "Carhartt Work Jeans": {
        url: "item4.html",
        image: "images/carhartt/carhartt_front.jpg",
        price: "$17",
        size: "34x34",
        store: "Salvation Army",
        co2: 23,
        water: 1800
    },
    "The Clash Band T-Shirt": {
        url: "item5.html",
        image: "images/bandtee/bandtee_front.jpg",
        price: "$18",
        size: "L",
        store: "Thrifty Village",
        co2: 12,
        water: 700
    },
    "Patagonia Better Fleece Pullover": {
        url: "item6.html",
        image: "images/patagonia/patagonia_front.jpg",
        price: "$38",
        size: "L",
        store: "Goodwill Benton",
        co2: 25,
        water: 1200
    },
    "Buck Camp Flannel Shirt": {
        url: "item7.html",
        image: "images/legendarywhitetails/flannel_front.jpg",
        price: "$14",
        size: "L",
        store: "Salvation Army",
        co2: 15,
        water: 900
    },
    "North Face Thermoball Puffer": {
        url: "item8.html",
        image: "images/northface/northface_front.jpg",
        price: "$58",
        size: "M",
        store: "Thrifty Village",
        co2: 45,
        water: 2500
    },
    "Carhartt Duck Utility Jacket": {
        url: "item9.html",
        image: "images/carhartt_jacket/carhartt_jacket_front.jpg",
        price: "$48",
        size: "L",
        store: "Goodwill Benton",
        co2: 40,
        water: 2000
    },
    "Nike Flywire Running Shoes": {
        url: "item10.html",
        image: "images/nike/nike_side.jpg",
        price: "$24",
        size: "10",
        store: "Play It Again Sports",
        co2: 30,
        water: 1500
    }
};

// Load and display saved items
function loadSavedItems() {
    const savedItems = JSON.parse(sessionStorage.getItem('savedItems') || '[]');
    const container = document.getElementById('saved-items-container');
    const countElement = document.getElementById('saved-count');
    const noItemsMessage = document.getElementById('no-saved-message');
    
    if (!container) return;
    
    countElement.textContent = savedItems.length;

    if (savedItems.length === 0) {
        noItemsMessage.style.display = 'block';
        container.style.display = 'none';
        return;
    }

    noItemsMessage.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';

    savedItems.forEach(itemName => {
        const itemInfo = itemDatabase[itemName];
        if (!itemInfo) return;

        const card = document.createElement('div');
        card.className = 'saved-item-card';
        card.innerHTML = `
            <div class="saved-item-image" onclick="window.location.href='${itemInfo.url}'">
                <img src="${itemInfo.image}" alt="${itemName}">
            </div>
            <div class="saved-item-details">
                <h4>${itemName}</h4>
                <p class="item-meta">${itemInfo.size} | ${itemInfo.store}</p>
                <p class="item-price">${itemInfo.price}</p>
                <div class="saved-item-actions">
                    <button class="btn-primary" onclick="window.location.href='${itemInfo.url}'">View Item</button>
                    <button class="btn-secondary" onclick="removeSavedItem('${itemName.replace(/'/g, "\\'")}')">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load active reservations
function loadReservations() {
    const reservations = JSON.parse(sessionStorage.getItem('reservations') || '[]');
    const container = document.querySelector('.reservation-container');
    
    if (!container || reservations.length === 0) {
        if (container) {
            container.innerHTML = '<p class="no-items-message">No active reservations. <a href="browse.html">Browse items</a> to reserve something!</p>';
        }
        return;
    }

    container.innerHTML = '';
    
    reservations.forEach((reservation, index) => {
        const itemInfo = itemDatabase[reservation.itemName];
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
                <p class="store-info"><strong>${itemInfo.store}</strong> - ${reservation.distance}</p>
                <p class="expire-time">Hold expires: <strong>${reservation.expires}</strong></p>
                <p class="impact-text">Saves ${itemInfo.co2} lbs CO2 when purchased</p>
                <div class="item-actions">
                    <button class="btn-primary" onclick="viewDirections('${itemInfo.store}')">Get Directions</button>
                    <button class="btn-secondary" onclick="cancelReservation(${index})">Cancel Hold</button>
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

// Calculate total environmental impact
function calculateImpact() {
    const purchaseHistory = JSON.parse(sessionStorage.getItem('purchaseHistory') || '[]');
    let totalCO2 = 0;
    let totalWater = 0;

    purchaseHistory.forEach(itemName => {
        const item = itemDatabase[itemName];
        if (item) {
            totalCO2 += item.co2;
            totalWater += item.water;
        }
    });

    // Update display if elements exist
    const co2Element = document.querySelector('.stat-card h3');
    if (co2Element && co2Element.textContent.includes('lbs')) {
        co2Element.textContent = totalCO2 + ' lbs';
    }
}

// Remove item from saved items
function removeSavedItem(itemName) {
    let savedItems = JSON.parse(sessionStorage.getItem('savedItems') || '[]');
    savedItems = savedItems.filter(name => name !== itemName);
    sessionStorage.setItem('savedItems', JSON.stringify(savedItems));
    
    // Show feedback
    showFeedback('Item removed from saved list');
    
    loadSavedItems();
}

// View directions (no alert, visual feedback)
function viewDirections(storeName) {
    // Create a temporary modal-like element for directions
    const directionsPanel = document.createElement('div');
    directionsPanel.className = 'directions-panel';
    directionsPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Directions to ${storeName}</h3>
            <p>Opening in Google Maps...</p>
            <p style="color: #666; font-size: 14px; margin-top: 15px;">In a production app, this would open your device's maps application with directions to the store.</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(directionsPanel);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (directionsPanel.parentElement) {
            directionsPanel.remove();
        }
    }, 3000);
}

// Cancel reservation
function cancelReservation(index) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Cancel Reservation?</h3>
            <p>This item will be returned to available inventory for other shoppers.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Keep Reservation</button>
                <button class="btn-cancel" onclick="confirmCancelReservation(${index}); this.closest('.confirm-panel').remove();" style="flex: 1;">Cancel Hold</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmCancelReservation(index) {
    let reservations = JSON.parse(sessionStorage.getItem('reservations') || '[]');
    reservations.splice(index, 1);
    sessionStorage.setItem('reservations', JSON.stringify(reservations));
    
    showFeedback('Reservation cancelled. Item returned to inventory.');
    loadReservations();
}

// Show visual feedback (no alerts)
function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-toast';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 100);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Settings functionality
function saveSettings() {
    showFeedback('Settings saved successfully!');
}

function editPreferences() {
    showFeedback('Preference editing feature coming in next update');
}

// Load all data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedItems();
    loadReservations();
    calculateImpact();
});