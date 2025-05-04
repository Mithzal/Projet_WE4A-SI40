document.addEventListener("DOMContentLoaded", () => {
    // Gestion des onglets
    const tabButtons = document.querySelectorAll(".tab-button"); // Sélectionne tous les boutons d'onglets
    const tabContents = document.querySelectorAll(".tab-content"); // Sélectionne tous les contenus d'onglets

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab"); // Récupère l'onglet cible

            tabContents.forEach(content => {
                // Affiche uniquement le contenu correspondant à l'onglet sélectionné
                content.style.display = content.id === `${targetTab}-tab` ? "block" : "none";
            });
        });
    });

    // Gestion des boutons de création
    document.getElementById("create-user").addEventListener("click", () => {
        showForm("user"); // Affiche le formulaire de création d'utilisateur
    });

    document.getElementById("create-ue").addEventListener("click", () => {
        showForm("ue"); // Affiche le formulaire de création d'UE
    });

    // Fonction pour afficher un formulaire de création
    function showForm(type) {
        const creationZone = document.getElementById("creation-zone"); // Zone où le formulaire sera chargé

        fetch(`/admin/create-${type}`) // Requête pour récupérer le formulaire
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement du formulaire.");
                }
                return response.text();
            })
            .then(html => {
                creationZone.innerHTML = html; // Insère le formulaire dans la zone
            })
            .catch(error => {
                console.error("Erreur lors du chargement du formulaire :", error);
            });
    }

    // Suppression des utilisateurs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-user-button")) {
            const userId = event.target.getAttribute("data-id"); // Récupère l'ID de l'utilisateur

            if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
                fetch(`/admin/delete-user/${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || "Erreur lors de la suppression.");
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert(data.message); // Affiche un message de succès
                        const userElement = document.querySelector(`#user-${userId}`);
                        if (userElement) {
                            userElement.remove(); // Supprime l'élément utilisateur du DOM
                        }
                    })
                    .catch(error => {
                        console.error("Erreur AJAX :", error);
                        alert(error.message || "Une erreur est survenue.");
                    });
            }
        }
    });

    // Suppression des UEs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-ue-button")) {
            const ueId = event.target.getAttribute("data-id"); // Récupère l'ID de l'UE

            if (confirm("Voulez-vous vraiment supprimer cette UE ?")) {
                fetch(`/admin/delete-ue/${ueId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || "Erreur lors de la suppression.");
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert(data.message); // Affiche un message de succès
                        const ueElement = document.querySelector(`#ue-${ueId}`);
                        if (ueElement) {
                            ueElement.remove(); // Supprime l'élément UE du DOM
                        }
                    })
                    .catch(error => {
                        console.error("Erreur AJAX :", error);
                        alert(error.message || "Une erreur est survenue.");
                    });
            }
        }
    });

    // Modification des utilisateurs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-user-button")) {
            const userId = event.target.getAttribute("data-id"); // Récupère l'ID de l'utilisateur
            const creationZone = document.getElementById("creation-zone"); // Zone où le formulaire sera chargé

            fetch(`/admin/edit-user/${userId}`) // Requête pour récupérer le formulaire
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur lors du chargement du formulaire.");
                    }
                    return response.text();
                })
                .then(html => {
                    creationZone.innerHTML = html; // Insère le formulaire dans la zone
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du formulaire :", error);
                });
        }
    });

    // Gestion des boutons "Attribuer"
    document.querySelectorAll('.assign-ue-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const ueId = this.dataset.id; // Récupère l'ID de l'UE

            fetch(`/admin/assign-ue/${ueId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => response.text())
                .then(html => {
                    const creationZone = document.getElementById('creation-zone');
                    creationZone.innerHTML = html; // Charge le formulaire d'assignation
                    creationZone.style.display = 'block';
                })
                .catch(error => console.error('Erreur:', error));
        });
    });

    // Modification des UEs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-ue-button")) {
            const ueId = event.target.getAttribute("data-id"); // Récupère l'ID de l'UE
            const creationZone = document.getElementById("creation-zone"); // Zone où le formulaire sera chargé

            fetch(`/admin/edit-ue/${ueId}`) // Requête pour récupérer le formulaire
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur lors du chargement du formulaire.");
                    }
                    return response.text();
                })
                .then(html => {
                    creationZone.innerHTML = html; // Insère le formulaire dans la zone
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du formulaire :", error);
                });
        }
    });
});

// Fonction pour fermer un formulaire
function closeForm(button) {
    const formPopup = button.closest(".form-popup"); // Trouve le formulaire parent
    if (formPopup) {
        formPopup.remove(); // Supprime le formulaire du DOM
    }
}