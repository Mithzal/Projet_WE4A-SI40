document.addEventListener("click", (event) => {
    // Gestion du bouton de suppression
    if (event.target.classList.contains("delete-content-button")) {
        const contentId = event.target.getAttribute("data-id");

        if (confirm("Voulez-vous vraiment supprimer ce contenu ?")) {
            fetch(`/content/delete/${contentId}`, {
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
                    const contentElement = document.querySelector(`#contenu-${contentId}`);
                    if (contentElement) {
                        contentElement.remove();
                    }
                })
                .catch(error => {
                    console.error("Erreur AJAX :", error);
                    alert(error.message || "Une erreur est survenue.");
                });
        }
    }

    // Gestion du bouton d'édition
    if (event.target.classList.contains("edit-content-button")) {
        const contentId = event.target.getAttribute("data-id");
        window.location.href = `/content/edit/${contentId}`;
    }
});