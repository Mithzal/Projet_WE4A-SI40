function initializeForm() {
// Sélectionner les éléments nécessaires
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const form = document.getElementById('formulaire_login');
    const errorMessage = document.getElementById('errorMessage');

// Basculer la visibilité du mot de passe
    togglePassword.addEventListener('click', function () {
        // Vérifier le type actuel du champ
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Modifier l'icône
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });

// Empêcher l'envoi si les champs sont vides
    form.addEventListener('submit', function (event) {
        const username = document.getElementById('username').value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            event.preventDefault();
            errorMessage.textContent = 'Tous les champs doivent être remplis.';
        } else {
            errorMessage.textContent = '';
        }
    });
}

// Appeler la fonction d'initialisation
initializeForm();
