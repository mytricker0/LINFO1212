function checkPassword(){
    let password = document.getElementById
    ("password").value;
    let confirmPassword = document.getElementById
    ("confirmPassword").value;
    console.log(password,confirmPassword);
    let message = document.getElementById
    ("message");

    if(password.length != 0){
        if(password == confirmPassword){
            message.textContent = "Passwords match";
            message.style.backgroundColor = "#3ae374";
            return true;
        }
        else{
            message.textContent = "Passwords don't match";
            message.style.backgroundColor = "#ff4d4d";
            return false;
        }
    }
    return true;
}