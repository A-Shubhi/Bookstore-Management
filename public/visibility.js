
function toggleVisibility() {  
    let getPassword = document.getElementById("pword");  
    if (getPassword.type === "password") {  
        getPassword.type = "text";  
    } else {  
        getPassword.type = "password";  
    }  
}  

function ctoggleVisibility() {  
    let getPassword = document.getElementById("cpword");  
    if (getPassword.type === "password") {  
        getPassword.type = "text";  
    } else {  
        getPassword.type = "password";  
        }  
}  