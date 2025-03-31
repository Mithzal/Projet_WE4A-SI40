function toggleDropdown() {
    var dropdown = document.getElementById("profileDropdown");
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

function setLoggin(value){//pas sur que ça fonctionne
    $_SESSION['loggedin'] = value;

}



$(document).ready(function() {//je pense que ce bout de code n'est plus utile
    $('#profile').click(function(e) {
        e.preventDefault();
        $('#content').load('profile.php');
    });

    $('#settings').click(function(e) {
        e.preventDefault();
        $('#content').load('settings.php');
    });

    $('#logout').click(function(e) {
        e.preventDefault();
        $('#content').load('logout.php');
    });
});