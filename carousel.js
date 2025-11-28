// carousel.js - Circular carousel that moves one item at a time

let currentIndex = 0;
let itemsToShow = 3;
let autoPlayInterval;
let isTransitioning = false;

function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track) return;
    
    const items = Array.from(track.querySelectorAll('.carousel-item'));
    const totalItems = items.length;
    
    // Determine items to show based on screen width
    updateItemsToShow();
    
    // Clone first and last items for seamless infinite loop
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[totalItems - 1].cloneNode(true);
    
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);
    
    // Adjust starting position to account for the prepended clone
    currentIndex = 1;
    
    // Create dots (only for original items, not clones)
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i + 1); // +1 to account for prepended clone
        dotsContainer.appendChild(dot);
    }
    
    // Update carousel on window resize
    window.addEventListener('resize', () => {
        const oldItemsToShow = itemsToShow;
        updateItemsToShow();
        if (oldItemsToShow !== itemsToShow) {
            updateCarousel(false);
        }
    });
    
    // Start autoplay
    startAutoPlay();
    
    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize position
    updateCarousel(false);
}

function updateItemsToShow() {
    const width = window.innerWidth;
    if (width < 768) {
        itemsToShow = 1;
    } else if (width < 1024) {
        itemsToShow = 2;
    } else {
        itemsToShow = 3;
    }
}

function moveCarousel(direction) {
    if (isTransitioning) return;
    
    const track = document.getElementById('carousel-track');
    const allItems = track.querySelectorAll('.carousel-item');
    const totalItems = allItems.length;
    
    currentIndex += direction;
    
    updateCarousel(true);
    
    // Handle infinite loop
    setTimeout(() => {
        // If we're at a clone, jump to the real item without animation
        if (currentIndex === 0) {
            // We're at the last clone, jump to the real last item
            currentIndex = totalItems - 2;
            updateCarousel(false);
        } else if (currentIndex === totalItems - 1) {
            // We're at the first clone, jump to the real first item
            currentIndex = 1;
            updateCarousel(false);
        }
    }, 500); // Match transition duration
    
    // Reset autoplay
    stopAutoPlay();
    startAutoPlay();
}

function goToSlide(index) {
    if (isTransitioning) return;
    currentIndex = index;
    updateCarousel(true);
    
    // Reset autoplay
    stopAutoPlay();
    startAutoPlay();
}

function updateCarousel(animate = true) {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const allItems = track.querySelectorAll('.carousel-item');
    const totalItems = allItems.length;
    
    if (!track) return;
    
    if (animate) {
        isTransitioning = true;
        track.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    } else {
        track.style.transition = 'none';
    }
    
    // Calculate offset - move one item at a time
    const itemWidth = 100 / itemsToShow;
    const offset = -(currentIndex * itemWidth);
    
    track.style.transform = `translateX(${offset}%)`;
    
    // Update dots (account for the prepended clone)
    const realIndex = currentIndex - 1;
    const actualDotsIndex = realIndex % (totalItems - 2);
    
    dots.forEach((dot, index) => {
        if (index === actualDotsIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Set item widths
    allItems.forEach(item => {
        item.style.flex = `0 0 ${itemWidth}%`;
    });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 4000); // Change slide every 4 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', initCarousel);