
/** form for users to sign up:
 * Validates first name
 * Validates last name
 * Validates email
 * Validates passwor
 * Validates confirm password
 */

document.getElementById("app-form").onsubmit = () => {

    clearErrors();

    let isValid = true;
    
    //Validate first name
    let fname = document.getElementById("fname").value.trim();
    if(!fname) {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    //Validate last name
    let lname = document.getElementById("lname").value.trim();
    if(!lname) {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }
    return isValid;
}
    //create an email 
    let email = document.getElementById("email").value.trim();
    if(!email) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    //create a password
    let password = document.getElementById("password").value.trim();
    if(!password) {
        document.getElementById("err-password").style.display = "block";
        isValid = false;
    }

    //confirm password
    let confirmPassword = document.getElementById("confirm-password").value.trim();
    if(password !== confirmPassword) {
        document.getElementById("err-confirm-password").style.display = "block";
        isValid = false;
    }

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}