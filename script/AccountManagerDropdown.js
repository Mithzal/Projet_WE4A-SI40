function toggleDropdown() {
    var dropdown = document.getElementById("profileDropdown");
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

function setLoggin(value){//pas sur que ça fonctionne
    $_SESSION['loggedin'] = value;

}
