
/** @author: Kelley Castillo
 * 
 * form for users to sign up:
 * Validates first name
 * Validates last name
 * Validates email
 * Validates password
 * Validates confirm password
 */

/** create_userform.js
 * Author: Jessica Hebert
 * Description: Form validation for the sign-up page.
 * Validates first name, last name, email, password, and confirm password.
 * Errors appear on submit and clear in real-time as the user corrects each field.
 */

document.getElementById("app-form").onsubmit = (e) => {
    clearErrors();
    let isValid = true;

    // Validate first name
    let fname = document.getElementById("fname").value.trim();
    if (!fname) {
        showError("err-fname", "fname");
        isValid = false;
    }

    // Validate last name
    let lname = document.getElementById("lname").value.trim();
    if (!lname) {
        showError("err-lname", "lname");
        isValid = false;
    }

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

    // Validate confirm password
    let confirmPassword = document.getElementById("confirm-password").value;
    if (password && confirmPassword !== password) {
        showError("err-confirm-password", "confirm-password");
        isValid = false;
    }

    if (!isValid) e.preventDefault();
    return isValid;
}

// Clear errors when user types correctly
document.getElementById("fname").oninput = () => clearFieldError("fname", "err-fname");
document.getElementById("lname").oninput = () => clearFieldError("lname", "err-lname");
document.getElementById("email").oninput = () => clearFieldError("email", "err-email");
document.getElementById("password").oninput = () => clearFieldError("password", "err-password");
document.getElementById("confirm-password").oninput = () => {
    let pw = document.getElementById("password").value; //pw = password
    let cpw = document.getElementById("confirm-password").value; //cpw = confirm password
    if (cpw === pw) {
        document.getElementById("err-confirm-password").style.display = "none";
        document.getElementById("confirm-password").classList.remove("input-error");
    }
};

// Show an inline error message and highlight the input field
function showError(errorId, fieldId, message) {
    let errorEl = document.getElementById(errorId); //errorEl = error element
    let fieldEl = document.getElementById(fieldId); //fieldEl = field element
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