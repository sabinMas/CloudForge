/** @author: Aaron
 * 
 * form for users to sign in:
 * Validates email
 * Validates password
 */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("app-form").onsubmit = (e) => {
        clearErrors();
        let isValid = true;

    

        // Validate email --> use emailPattern
        let email = document.getElementById("email").value.trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            showError("err-email", "email", "Email is required.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            showError("err-email", "email", "Please enter a valid email address.");
            isValid = false;
        }

        // Validate password
        let password = document.getElementById("password").value;
        if (!password) {
            showError("err-password", "password");
            isValid = false;
        }

        if (!isValid) e.preventDefault();
    };

    document.getElementById("email").oninput = () => clearFieldError("email", "err-email");
    document.getElementById("password").oninput = () => clearFieldError("password", "err-password");


});

// Show an inline error message and highlight the input field
function showError(errorId, fieldId, message) {
    let errorEl = document.getElementById(errorId);
    let fieldEl = document.getElementById(fieldId);
    if (errorEl) {
        if (message) errorEl.textContent = message;
        errorEl.style.display = "block";
    }
    if (fieldEl) fieldEl.classList.add("input-error");
}

// Clear the error for a single field once its value is non-empty
function clearFieldError(fieldId, errorId) {
    let value = document.getElementById(fieldId).value.trim();
    if (value) {
        document.getElementById(errorId).style.display = "none";
        document.getElementById(fieldId).classList.remove("input-error");
    }
}

// Hide all error messages and remove all input-error highlights
function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
    let errorInputs = document.getElementsByClassName("input-error");
    while (errorInputs.length > 0) {
        errorInputs[0].classList.remove("input-error");
    }
}