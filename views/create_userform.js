
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

    //create an email 

    //create a password

    //confirm password
}

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++) {
        errors[i].style.display = "none";
    }
}