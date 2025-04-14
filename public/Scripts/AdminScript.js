document.addEventListener("DOMContentLoaded", () => {
    // Gestion des onglets
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");

            tabContents.forEach(content => {
                content.style.display = content.id === `${targetTab}-tab` ? "block" : "none";
            });
        });
    });

    // Suppression via AJAX avec confirmation
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-button")) {
            const id = event.target.getAttribute("data-id");
            const type = event.target.getAttribute("data-type"); // 'user' ou 'ue'

            if (confirm(`Voulez-vous vraiment supprimer cet élément (${type}) ?`)) {
                fetch(`/delete-${type}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                })
                    .then(response => {
                        if (response.ok) {
                            alert(`${type} supprimé avec succès.`);
                            // Supprimer l'élément de la liste sans recharger la page
                            document.querySelector(`#${type}-${id}`).remove();
                        } else {
                            alert(`Erreur lors de la suppression du ${type}.`);
                        }
                    })
                    .catch(error => {
                        console.error("Erreur AJAX :", error);
                        alert("Une erreur est survenue.");
                    });
            }
        }
    });

    // Affichage dynamique des formulaires
    document.getElementById("create-user").addEventListener("click", () => {
        showForm("user");
    });

    document.getElementById("create-ue").addEventListener("click", () => {
        showForm("ue");
    });

        function showForm(type) {
        const creationZone = document.getElementById("creation-zone");
    
        const formContainer = document.createElement("div");
        formContainer.classList.add("form-popup");
    
        // Générer un identifiant unique pour chaque formulaire
        const uniqueId = `${type}-form-${Date.now()}`;
        formContainer.innerHTML = `
            <form id="${uniqueId}">
                <h3>${type === "user" ? "Créer un utilisateur" : "Créer une UE"}</h3>
                ${type === "user" ? `
                    <div>
                        <label for="name-${uniqueId}">Nom :</label>
                        <input type="text" id="name-${uniqueId}" name="name" required>
                    </div>
                    <div>
                        <label for="email-${uniqueId}">Email :</label>
                        <input type="email" id="email-${uniqueId}" name="email" required>
                    </div>
                    <div>
                        <label for="role-${uniqueId}">Rôle :</label>
                        <select id="role-${uniqueId}" name="role">
                            <option value="admin">Admin</option>
                            <option value="prof">Prof</option>
                            <option value="admin-prof">Admin et Prof</option>
                            <option value="etudiant">Étudiant</option>
                        </select>
                    </div>
                ` : `
                    <div>
                        <label for="code-${uniqueId}">Code :</label>
                        <input type="text" id="code-${uniqueId}" name="code" required>
                    </div>
                    <div>
                        <label for="title-${uniqueId}">Intitulé :</label>
                        <input type="text" id="title-${uniqueId}" name="title" required>
                    </div>
                    <div>
                        <label for="image-${uniqueId}">Image :</label>
                        <input type="file" id="image-${uniqueId}" name="image">
                    </div>
                `}
                <div>
                    <button type="submit" class="sub-button">Enregistrer</button>
                    <button type="button" class="close-form">Annuler</button>
                </div>
            </form>
        `;
    
        creationZone.appendChild(formContainer);
    
        // Gestion de la fermeture du formulaire
        formContainer.querySelector(".close-form").addEventListener("click", () => {
            // Ajoutez la classe "closing" pour déclencher l'animation
            formContainer.classList.add("closing");
        
            // Supprimez l'élément après la durée de l'animation (300ms dans ce cas)
            setTimeout(() => {
                formContainer.remove();
            }, 300); // Correspond à la durée définie dans la transition CSS
        });
    
        // Gestion de l'envoi du formulaire via AJAX
        formContainer.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();
    
            const formData = new FormData(event.target);
    
            fetch(`/create-${type}`, {
                method: "POST",
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        alert(`${type === "user" ? "Utilisateur" : "UE"} créé avec succès.`);
                        formContainer.remove();
                        // Actualiser la liste dynamiquement si nécessaire
                    } else {
                        alert(`Erreur lors de la création du ${type}.`);
                    }
                })
                .catch(error => {
                    console.error("Erreur AJAX :", error);
                    alert("Une erreur est survenue.");
                });
        });
    }
});
