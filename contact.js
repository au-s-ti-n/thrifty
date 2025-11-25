(function () {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");

    const fields = [
        { id: "firstName", min: 1, name: "First name" },
        { id: "lastName", min: 1, name: "Last name" },
        { id: "email", type: "email", name: "Email" },
        { id: "message", min: 10, name: "Message" }
    ];

    function clearErrors() {
        fields.forEach((f) => {
            const el = document.getElementById(f.id);
            const err = document.getElementById(f.id + "Error");
            if (err) err.textContent = "";
            el.removeAttribute("aria-invalid");
        });
        status.textContent = "";
    }

    function showError(id, msg) {
        const err = document.getElementById(id + "Error");
        const el = document.getElementById(id);
        if (err) err.textContent = msg;
        el.setAttribute("aria-invalid", "true");
    }

    function validate() {
        clearErrors();
        let ok = true;

        fields.forEach((f) => {
            const el = document.getElementById(f.id);
            const val = (el.value || "").trim();

            if (f.type === "email") {
                if (!val) {
                    showError(f.id, f.name + " is required.");
                    ok = false;
                    return;
                }
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(val)) {
                    showError(f.id, "Please enter a valid email address.");
                    ok = false;
                }
                return;
            }

            if (f.min && val.length < f.min) {
                showError(f.id, `${f.name} must be at least ${f.min} characters.`);
                ok = false;
            }
        });

        return ok;
    }

    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!validate()) return;

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Send message";
            form.reset();
        }, 1500);

        setTimeout(() => {
            Swal.fire({
                title: "Thanks for contacting us!",
                text: "Your message has been received. We will reply to you at the email provided.",
                icon: "success",
                confirmButtonText: "Got it!"
            });
        }, 1500);
    });

    fields.forEach((f) => {
        const el = document.getElementById(f.id);
        el.addEventListener("input", () => {
            const err = document.getElementById(f.id + "Error");
            if (err) err.textContent = "";
            el.removeAttribute("aria-invalid");
        });
    });

    form.addEventListener("reset", () => {
        setTimeout(() => {
            clearErrors();
        }, 0);
    });
})();