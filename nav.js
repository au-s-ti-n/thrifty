// handles opening dynamic menu button
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = sessionStorage.getItem("loggedIn");

    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutLink");

    if (loggedIn === "true") {
        // hide login + sign up
        loginLink.style.display = "none";
        signupLink.style.display = "none";

        // show logout
        logoutLink.style.display = "inline-block";
    } 
    else {
        // show login + sign up
        loginLink.style.display = "inline-block";
        signupLink.style.display = "inline-block";

        // hide logout
        logoutLink.style.display = "none";
    }

    logoutLink.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "index.html"; 
    });
});
