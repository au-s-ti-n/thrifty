
// handles customer and store manager profile routing logic
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    // TEMPORARY USER DATABASE
    const mockUsers = {
        "customer@example.com": { role: "customer" },
        "store@example.com": { role: "store_manager" }
    };

    const user = mockUsers[email];

    if (!user) {
        alert("Invalid login");
        return;
    }

    localStorage.setItem("role", user.role);

    if (user.role === "customer") {
        window.location.href = "customer.html";
    } else if (user.role === "store_manager") {
        window.location.href = "manager.html";
    }
});