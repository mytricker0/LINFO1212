function checkPassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let message = document.getElementById("message");
    let submitButton = document.getElementById('submitButton');

    if (password.length !== 0) {
        if (password === confirmPassword) {
            message.textContent = "Passwords match";
            message.style.backgroundColor = "#3ae374";
            submitButton.disabled = false;
            return true;
        } else {
            message.textContent = "Passwords don't match";
            message.style.backgroundColor = "#ff4d4d";
            submitButton.disabled = true;
            return false;
        }
    }

    // If the password is empty, reset the message and enable the submit button
    message.textContent = "";
    submitButton.disabled = false;
    return true;

}