// manager.js - Fully integrated store manager dashboard

// Sample data for reservations
let reservations = [
    {
        customerName: "Emma Rodriguez",
        item: "Nike Air Max Shoes",
        price: 25,
        expires: "Today at 2:45 PM",
        expiresTimestamp: new Date().getTime() + (2 * 60 * 60 * 1000)
    },
    {
        customerName: "Marcus Chan",
        item: "Patagonia Fleece Pullover",
        price: 35,
        expires: "Tomorrow at 11:20 AM",
        expiresTimestamp: new Date().getTime() + (20 * 60 * 60 * 1000)
    },
    {
        customerName: "Sarah Johnson",
        item: "Vintage Levi's Jeans",
        price: 18,
        expires: "Tomorrow at 9:15 PM",
        expiresTimestamp: new Date().getTime() + (30 * 60 * 60 * 1000)
    }
];

// Sample data for recent listings
let recentListings = [
    { name: "Lee Regular Fit Jeans", category: "Jeans", price: 14, time: "2 hours ago" },
    { name: "Carhartt Work Jacket", category: "Outerwear", price: 48, time: "3 hours ago" },
    { name: "Vintage Band Tee", category: "Shirts", price: 12, time: "4 hours ago" }
];

// Load reservations on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
    loadRecentListings();
});

function loadReservations() {
    const container = document.getElementById('reservations-list');
    const countElement = document.getElementById('reservation-list-count');
    
    if (!container) return;
    
    countElement.textContent = reservations.length;
    // Also update the top stat
    document.getElementById('reservations-count').textContent = reservations.length;
    
    container.innerHTML = '';

    if (reservations.length === 0) {
        container.innerHTML = '<p class="no-items-message">No active reservations at this time.</p>';
        return;
    }

    reservations.forEach((reservation, index) => {
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
                <button class="btn-cancel" onclick="cancelReservation(${index})">Cancel Hold</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadRecentListings() {
    const container = document.getElementById('recent-listings');
    
    if (!container) return;
    
    if (recentListings.length === 0) {
        container.innerHTML = '<p class="no-items-message">No recent listings.</p>';
        return;
    }

    container.innerHTML = '';
    recentListings.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <div class="listing-info">
                <h4>${item.name}</h4>
                <p class="listing-meta">${item.category} | $${item.price} | Listed ${item.time}</p>
            </div>
            <button class="btn-secondary btn-small" onclick="editListing(${index})">Edit</button>
        `;
        container.appendChild(card);
    });
}

function completeReservation(index) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Mark as Sold</h3>
            <p>Complete the sale of ${reservations[index].item} to ${reservations[index].customerName}?</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Cancel</button>
                <button class="btn-primary" onclick="confirmSale(${index}); this.closest('.confirm-panel').remove();" style="flex: 1;">Complete Sale</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmSale(index) {
    const soldItem = reservations.splice(index, 1)[0];
    
    // Update counters
    const reservationCount = parseInt(document.getElementById('reservations-count').textContent);
    document.getElementById('reservations-count').textContent = Math.max(0, reservationCount - 1);
    
    const revenue = parseInt(document.getElementById('revenue-today').textContent.replace('$', ''));
    document.getElementById('revenue-today').textContent = '$' + (revenue + soldItem.price);
    
    // Reload reservations
    loadReservations();
    
    showFeedback(`Sale completed! ${soldItem.item} sold for $${soldItem.price}`);
}

function contactCustomer(customerName) {
    const contactPanel = document.createElement('div');
    contactPanel.className = 'directions-panel';
    contactPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Contact ${customerName}</h3>
            <p style="margin-bottom: 15px;">In production, this would:</p>
            <ul style="text-align: left; margin-left: 20px; color: #666;">
                <li>Send SMS notification</li>
                <li>Send email reminder</li>
                <li>Open in-app chat</li>
                <li>Show customer contact info</li>
            </ul>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(contactPanel);
}

function cancelReservation(index) {
    const confirmPanel = document.createElement('div');
    confirmPanel.className = 'confirm-panel';
    confirmPanel.innerHTML = `
        <div class="confirm-content">
            <h3>Cancel Reservation?</h3>
            <p>Cancel the hold for ${reservations[index].customerName}? The item will return to available inventory.</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn-secondary" onclick="this.closest('.confirm-panel').remove()" style="flex: 1;">Keep Hold</button>
                <button class="btn-cancel" onclick="confirmCancel(${index}); this.closest('.confirm-panel').remove();" style="flex: 1;">Cancel Hold</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPanel);
}

function confirmCancel(index) {
    reservations.splice(index, 1);
    
    // Update counter
    const reservationCount = parseInt(document.getElementById('reservations-count').textContent);
    document.getElementById('reservations-count').textContent = Math.max(0, reservationCount - 1);
    
    loadReservations();
    
    showFeedback('Reservation cancelled. Item returned to available inventory.');
}

function showListItemModal() {
    document.getElementById('list-item-modal').style.display = 'flex';
}

function closeListItemModal() {
    document.getElementById('list-item-modal').style.display = 'none';
    document.getElementById('list-item-form').reset();
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
        time: "Just now"
    };
    
    // Add to recent listings
    recentListings.unshift(itemData);
    if (recentListings.length > 10) {
        recentListings = recentListings.slice(0, 10);
    }
    
    // Update counters
    const itemsListedCount = parseInt(document.getElementById('items-listed-count').textContent);
    document.getElementById('items-listed-count').textContent = itemsListedCount + 1;
    
    const liveItemsCount = parseInt(document.getElementById('live-items-count').textContent);
    document.getElementById('live-items-count').textContent = liveItemsCount + 1;
    
    // Reload listings
    loadRecentListings();
    
    // Close modal and show success
    closeListItemModal();
    showFeedback(`Success! ${itemData.name} listed for $${itemData.price}. Now visible to shoppers.`);
}

function editListing(index) {
    const item = recentListings[index];
    const editPanel = document.createElement('div');
    editPanel.className = 'directions-panel';
    editPanel.innerHTML = `
        <div class="directions-content">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Edit: ${item.name}</h3>
            <p style="margin-bottom: 15px;">Available actions:</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn-secondary" onclick="showFeedback('Price update feature coming soon')">Update Price</button>
                <button class="btn-secondary" onclick="showFeedback('Description editor coming soon')">Edit Description</button>
                <button class="btn-secondary" onclick="showFeedback('Photo manager coming soon')">Change Photos</button>
                <button class="btn-primary" onclick="markAsSold(${index}); this.parentElement.parentElement.parentElement.remove();">Mark as Sold</button>
                <button class="btn-cancel" onclick="removeListing(${index}); this.parentElement.parentElement.parentElement.remove();">Remove Listing</button>
            </div>
        </div>
    `;
    document.body.appendChild(editPanel);
}

function markAsSold(index) {
    const item = recentListings[index];
    recentListings.splice(index, 1);
    loadRecentListings();
    
    // Update revenue
    const revenue = parseInt(document.getElementById('revenue-today').textContent.replace('$', ''));
    document.getElementById('revenue-today').textContent = '$' + (revenue + item.price);
    
    showFeedback(`${item.name} marked as sold!`);
}

function removeListing(index) {
    const item = recentListings[index];
    recentListings.splice(index, 1);
    loadRecentListings();
    
    const liveItemsCount = parseInt(document.getElementById('live-items-count').textContent);
    document.getElementById('live-items-count').textContent = Math.max(0, liveItemsCount - 1);
    
    showFeedback(`${item.name} removed from listings.`);
}

function showAnalytics() {
    const analyticsPanel = document.createElement('div');
    analyticsPanel.className = 'directions-panel';
    analyticsPanel.innerHTML = `
        <div class="directions-content" style="max-width: 600px;">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Analytics Dashboard</h3>
            <p style="margin-bottom: 15px;">Comprehensive insights (coming soon):</p>
            <ul style="text-align: left; margin-left: 20px; color: #666; line-height: 1.8;">
                <li>Sales trends over time</li>
                <li>Popular categories</li>
                <li>Peak shopping hours</li>
                <li>Customer demographics</li>
                <li>Inventory turnover rate</li>
                <li>Revenue projections</li>
            </ul>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(analyticsPanel);
}

function showLiveInventory() {
    const inventoryPanel = document.createElement('div');
    inventoryPanel.className = 'directions-panel';
    inventoryPanel.innerHTML = `
        <div class="directions-content" style="max-width: 600px;">
            <button class="close-directions" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3>Live Inventory</h3>
            <p style="margin-bottom: 15px;">Full inventory management (coming soon):</p>
            <ul style="text-align: left; margin-left: 20px; color: #666; line-height: 1.8;">
                <li>All ${document.getElementById('live-items-count').textContent} items currently listed</li>
                <li>Sort by category, price, date</li>
                <li>Quick edit/remove options</li>
                <li>View count for each item</li>
                <li>Number of times saved by shoppers</li>
            </ul>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px;">Close</button>
        </div>
    `;
    document.body.appendChild(inventoryPanel);
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('list-item-modal');
    if (event.target === modal) {
        closeListItemModal();
    }
}