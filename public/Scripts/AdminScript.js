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

    // Gestion des boutons de création
    document.getElementById("create-user").addEventListener("click", () => {
        showForm("user");
    });

    document.getElementById("create-ue").addEventListener("click", () => {
        showForm("ue");
    });

    function showForm(type) {
        const creationZone = document.getElementById("creation-zone");

        fetch(`/admin/create-${type}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement du formulaire.");
                }
                return response.text();
            })
            .then(html => {
                creationZone.innerHTML = html; // Charge directement le formulaire
            })
            .catch(error => {
                console.error("Erreur lors du chargement du formulaire :", error);
            });
    }

    // Suppression des utilisateurs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-user-button")) {
            const userId = event.target.getAttribute("data-id");

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
                        alert(data.message);
                        const userElement = document.querySelector(`#user-${userId}`);
                        if (userElement) {
                            userElement.remove();
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
            const ueId = event.target.getAttribute("data-id");

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
                        alert(data.message);
                        const ueElement = document.querySelector(`#ue-${ueId}`);
                        if (ueElement) {
                            ueElement.remove();
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
            const userId = event.target.getAttribute("data-id");
            const creationZone = document.getElementById("creation-zone");

            fetch(`/admin/edit-user/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur lors du chargement du formulaire.");
                    }
                    return response.text();
                })
                .then(html => {
                    creationZone.innerHTML = html; // Charge directement le formulaire
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du formulaire :", error);
                });
        }
    });

    // Modification des UEs via AJAX
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-ue-button")) {
            const ueId = event.target.getAttribute("data-id");
            const creationZone = document.getElementById("creation-zone");

            fetch(`/admin/edit-ue/${ueId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erreur lors du chargement du formulaire.");
                    }
                    return response.text();
                })
                .then(html => {
                    creationZone.innerHTML = html; // Charge directement le formulaire
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du formulaire :", error);
                });
        }
    });
});

// Fonction pour fermer un formulaire
function closeForm(button) {
    const formPopup = button.closest(".form-popup");
    if (formPopup) {
        formPopup.remove();
    }
}