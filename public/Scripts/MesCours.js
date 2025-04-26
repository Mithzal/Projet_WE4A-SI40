document.addEventListener("DOMContentLoaded", function () {
    const newsfeed = document.querySelector(".newsfeed ul");
    const maxMessages = 10;

    function addNewsMessage(message) {
        if (newsfeed.children.length >= maxMessages) {
            newsfeed.removeChild(newsfeed.firstChild);
        }
        const li = document.createElement("li");
        li.textContent = message;
        newsfeed.appendChild(li);
    }

    // Fonctionnalité de recherche de cours
    const searchInput = document.getElementById("search-bar");
    const courseCards = document.querySelectorAll(".course-card");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        courseCards.forEach(card => {
            const courseName = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const courseContent = card.querySelector("p")?.textContent.toLowerCase() || "";
            if (courseName.includes(searchTerm) || courseContent.includes(searchTerm)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    const sortSelect = document.getElementById("sort-courses");
    const coursesContainer = document.querySelector(".courses");

    function sortCourses(criteria) {
        let sortedCourses = Array.from(courseCards);
        if (criteria === "name") {
            sortedCourses.sort((a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent));
        } else if (criteria === "date") {
            sortedCourses.sort((a, b) => parseInt(b.dataset.lastAccess) - parseInt(a.dataset.lastAccess));
        }
        sortedCourses.forEach(card => coursesContainer.appendChild(card));
    }

    sortSelect.addEventListener("change", function () {
        sortCourses(sortSelect.value);
    });

    // Trier par défaut par nom au chargement de la page
    sortCourses("name");

});