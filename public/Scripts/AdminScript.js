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

    document.addEventListener("submit", (event) => {
        if (event.target.tagName === "FORM") {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        alert("Formulaire soumis avec succès !");
                        document.getElementById("creation-zone").innerHTML = ""; // Vide la zone de création
                    } else {
                        alert("Erreur lors de la soumission du formulaire.");
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la soumission :", error);
                    alert("Une erreur est survenue.");
                });
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

        fetch(`/admin/create-${type}`)
            .then(response => response.text())
            .then(html => {
                creationZone.innerHTML = html;

                // Ajoutez un bouton pour fermer le formulaire
                const closeButton = document.createElement("button");
                closeButton.textContent = "Annuler";
                closeButton.classList.add("close-form");
                closeButton.addEventListener("click", () => {
                    creationZone.innerHTML = ""; // Vide la zone de création
                });
                creationZone.appendChild(closeButton);
            })
            .catch(error => {
                console.error("Erreur lors du chargement du formulaire :", error);
            });
    }
});
