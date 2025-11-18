// animation for placeholder text on home page search bar
const phrases = [
    "vintage jeans",
    "Nike shoes",
    "swim shorts",
    "party costumes",
    "streetwear",
    "Uniqlo hoodies",
    "formal suits",
    "Patagonia jackets",
    "button-ups",
    "Christmas socks"
]; // could randomize first phrase upon refresh in the future

const input = document.getElementById("search-input");

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function updatePlaceholder() {
    const current = phrases[phraseIndex];

    if (!deleting) {
        // typing
        input.placeholder = "Search for " + current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
            deleting = true;
            setTimeout(updatePlaceholder, 2500); // pause before deleting
            return;
        }
    } else {
        // deleting
        input.placeholder = "Search for " + current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    setTimeout(updatePlaceholder, deleting ? 60 : 60);
}

updatePlaceholder();