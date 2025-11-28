// dataManager.js - Central data management for the entire web app

const DataManager = {
    // Check if user is logged in
    isLoggedIn() {
        return sessionStorage.getItem('loggedIn') === 'true';
    },

    // Get current user role
    getUserRole() {
        return sessionStorage.getItem('role');
    },

    // Get user email
    getUserEmail() {
        return sessionStorage.getItem('userEmail') || 'customer@example.com';
    },

    // Initialize data structures if they don't exist
    initializeData() {
        if (!sessionStorage.getItem('savedItems')) {
            sessionStorage.setItem('savedItems', JSON.stringify([]));
        }
        if (!sessionStorage.getItem('reservations')) {
            sessionStorage.setItem('reservations', JSON.stringify([]));
        }
        if (!sessionStorage.getItem('purchaseHistory')) {
            sessionStorage.setItem('purchaseHistory', JSON.stringify([]));
        }
        if (!sessionStorage.getItem('managerListings')) {
            sessionStorage.setItem('managerListings', JSON.stringify([]));
        }
    },

    // SAVED ITEMS
    getSavedItems() {
        return JSON.parse(sessionStorage.getItem('savedItems') || '[]');
    },

    addSavedItem(itemName) {
        const saved = this.getSavedItems();
        if (!saved.includes(itemName)) {
            saved.push(itemName);
            sessionStorage.setItem('savedItems', JSON.stringify(saved));
            return true;
        }
        return false;
    },

    removeSavedItem(itemName) {
        const saved = this.getSavedItems();
        const filtered = saved.filter(name => name !== itemName);
        sessionStorage.setItem('savedItems', JSON.stringify(filtered));
    },

    isItemSaved(itemName) {
        return this.getSavedItems().includes(itemName);
    },

    // RESERVATIONS
    getReservations() {
        return JSON.parse(sessionStorage.getItem('reservations') || '[]');
    },

    addReservation(itemName, itemData) {
        const reservations = this.getReservations();
        
        // Check if already reserved
        const exists = reservations.find(r => r.itemName === itemName);
        if (exists) return false;

        const now = new Date();
        const expiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        reservations.push({
            itemName: itemName,
            date: now.toLocaleDateString(),
            expires: expiresDate.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            expiresTimestamp: expiresDate.getTime(),
            distance: itemData.distance || '2.3 miles away',
            store: itemData.store || 'Goodwill Benton'
        });
        
        sessionStorage.setItem('reservations', JSON.stringify(reservations));
        return true;
    },

    removeReservation(itemName) {
        const reservations = this.getReservations();
        const filtered = reservations.filter(r => r.itemName !== itemName);
        sessionStorage.setItem('reservations', JSON.stringify(filtered));
    },

    isItemReserved(itemName) {
        return this.getReservations().some(r => r.itemName === itemName);
    },

    // PURCHASE HISTORY
    getPurchaseHistory() {
        return JSON.parse(sessionStorage.getItem('purchaseHistory') || '[]');
    },

    addPurchase(itemName) {
        const history = this.getPurchaseHistory();
        history.push({
            itemName: itemName,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        });
        sessionStorage.setItem('purchaseHistory', JSON.stringify(history));
    },

    // MANAGER LISTINGS
    getManagerListings() {
        return JSON.parse(sessionStorage.getItem('managerListings') || '[]');
    },

    addManagerListing(itemData) {
        const listings = this.getManagerListings();
        listings.push({
            ...itemData,
            id: 'listing_' + Date.now(),
            listedDate: new Date().toLocaleDateString(),
            timestamp: Date.now()
        });
        sessionStorage.setItem('managerListings', JSON.stringify(listings));
        return listings[listings.length - 1];
    },

    removeManagerListing(id) {
        const listings = this.getManagerListings();
        const filtered = listings.filter(item => item.id !== id);
        sessionStorage.setItem('managerListings', JSON.stringify(filtered));
    },

    updateManagerListing(id, updates) {
        const listings = this.getManagerListings();
        const index = listings.findIndex(item => item.id === id);
        if (index !== -1) {
            listings[index] = { ...listings[index], ...updates };
            sessionStorage.setItem('managerListings', JSON.stringify(listings));
            return true;
        }
        return false;
    },

    // IMPACT CALCULATION
    calculateTotalImpact() {
        const history = this.getPurchaseHistory();
        const itemDatabase = this.getItemDatabase();
        
        let totalCO2 = 0;
        let totalWater = 0;
        let totalWaste = 0;

        history.forEach(purchase => {
            const item = itemDatabase[purchase.itemName];
            if (item) {
                totalCO2 += item.co2 || 0;
                totalWater += item.water || 0;
                totalWaste += item.waste || 0;
            }
        });

        return { totalCO2, totalWater, totalWaste };
    },

    // ITEM DATABASE
    getItemDatabase() {
        return {
            "Lee Regular Fit Jeans": {
                url: "lee_regular_fit_item1.html",
                image: "images/lee/lee_front.jpg",
                price: 14,
                priceDisplay: "$14",
                retail: "$50",
                size: "34x32",
                category: "jeans",
                brand: "Lee",
                store: "Goodwill Benton",
                distance: "2.3 miles away",
                co2: 18,
                water: 1800,
                waste: 4.5,
                description: "Classic Lee jeans in medium wash. Comfortable regular fit with straight leg opening."
            },
            "Wrangler Relaxed Fit Jeans": {
                url: "wranglers_relaxed_fit_item2.html",
                image: "images/wranglers/wranglers_main_image.jpg",
                price: 16,
                priceDisplay: "$16",
                retail: "$65",
                size: "34x32",
                category: "jeans",
                brand: "Wrangler",
                store: "Goodwill Benton",
                distance: "2.3 miles away",
                co2: 22,
                water: 1800,
                waste: 5,
                description: "Relaxed fit jeans with signature W stitching. Medium-light wash with natural fading."
            },
            "Levi's 505 Regular Fit Jeans": {
                url: "item3.html",
                image: "images/levis/levi505_front.jpg",
                price: 18,
                priceDisplay: "$18",
                retail: "$70",
                size: "32x32",
                category: "jeans",
                brand: "Levi's",
                store: "Thrifty Village",
                distance: "3.5 miles away",
                co2: 20,
                water: 1800,
                waste: 5,
                description: "Iconic Levi's 505 with classic straight leg. Medium-dark wash with signature details."
            },
            "Carhartt Work Jeans": {
                url: "item4.html",
                image: "images/carhartt/carhartt_front.jpg",
                price: 17,
                priceDisplay: "$17",
                retail: "$55",
                size: "34x34",
                category: "jeans",
                brand: "Carhartt",
                store: "Salvation Army",
                distance: "4.2 miles away",
                co2: 23,
                water: 1800,
                waste: 5.5,
                description: "Heavy-duty carpenter jeans with tool pockets. Loose fit for workwear durability."
            },
            "The Clash Band T-Shirt": {
                url: "item5.html",
                image: "images/bandtee/bandtee_front.jpg",
                price: 18,
                priceDisplay: "$18",
                retail: "$35",
                size: "L",
                category: "shirts",
                brand: "Vintage",
                store: "Thrifty Village",
                distance: "3.5 miles away",
                co2: 12,
                water: 700,
                waste: 0.5,
                description: "Vintage concert tee featuring The Clash with bold black text graphics on white."
            },
            "Patagonia Better Fleece Pullover": {
                url: "item6.html",
                image: "images/patagonia/patagonia_front.jpg",
                price: 38,
                priceDisplay: "$38",
                retail: "$99",
                size: "L",
                category: "shirts",
                brand: "Patagonia",
                store: "Goodwill Benton",
                distance: "2.3 miles away",
                co2: 25,
                water: 1200,
                waste: 2,
                description: "Premium quarter-zip fleece in navy blue. Soft, warm, perfect for layering."
            },
            "Buck Camp Flannel Shirt": {
                url: "item7.html",
                image: "images/legendarywhitetails/flannel_front.jpg",
                price: 14,
                priceDisplay: "$14",
                retail: "$45",
                size: "L",
                category: "shirts",
                brand: "Legendary Whitetails",
                store: "Salvation Army",
                distance: "4.2 miles away",
                co2: 15,
                water: 900,
                waste: 1.5,
                description: "Classic outdoor flannel in orange/tan plaid. Warm, durable heavyweight cotton."
            },
            "North Face Thermoball Puffer": {
                url: "item8.html",
                image: "images/northface/northface_front.jpg",
                price: 58,
                priceDisplay: "$58",
                retail: "$199",
                size: "M",
                category: "outerwear",
                brand: "The North Face",
                store: "Thrifty Village",
                distance: "3.5 miles away",
                co2: 45,
                water: 2500,
                waste: 6,
                description: "Quilted puffer with Thermoball insulation. Lightweight, warm, packable black jacket."
            },
            "Carhartt Duck Utility Jacket": {
                url: "item9.html",
                image: "images/carhartt_jacket/carhartt_jacket_front.jpg",
                price: 48,
                priceDisplay: "$48",
                retail: "$120",
                size: "L",
                category: "outerwear",
                brand: "Carhartt",
                store: "Goodwill Benton",
                distance: "2.3 miles away",
                co2: 40,
                water: 2000,
                waste: 5.5,
                description: "Sherpa-lined canvas work jacket in moss green. Heavyweight, durable, warm."
            },
            "Nike Flywire Running Shoes": {
                url: "item10.html",
                image: "images/nike/nike_side.jpg",
                price: 24,
                priceDisplay: "$24",
                retail: "$85",
                size: "10",
                category: "shoes",
                brand: "Nike",
                store: "Play It Again Sports",
                distance: "5.8 miles away",
                co2: 30,
                water: 1500,
                waste: 5,
                description: "Flywire technology running shoes in vibrant red/orange. Breathable, cushioned."
            }
        };
    },

    // Get all items (original + manager listings)
    getAllItems() {
        const originalItems = this.getItemDatabase();
        const managerListings = this.getManagerListings();
        
        // Convert manager listings to same format
        const allItems = { ...originalItems };
        
        managerListings.forEach(listing => {
            allItems[listing.name] = {
                url: '#', // Manager listings don't have detail pages yet
                image: listing.image || 'images/placeholder.jpg',
                price: listing.price,
                priceDisplay: `$${listing.price}`,
                retail: listing.retail || '',
                size: listing.size,
                category: listing.category,
                brand: listing.brand,
                store: 'Goodwill Benton', // Default store
                distance: '2.3 miles away',
                co2: 20, // Estimate
                water: 1500, // Estimate
                waste: 4, // Estimate
                description: listing.description,
                isManagerListing: true,
                id: listing.id
            };
        });
        
        return allItems;
    },

    // Show feedback toast
    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-toast';
        if (type === 'success') feedback.style.background = '#27ae60';
        if (type === 'error') feedback.style.background = '#e74c3c';
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 100);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
};

// Initialize data when script loads
DataManager.initializeData();