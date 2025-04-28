// public/Scripts/RechercheCours.js

document.addEventListener("DOMContentLoaded", function() {
    const sortSelect = document.getElementById("sort-courses");
    const courseTable = document.getElementById("table-row");


    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", function() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = courseTable.querySelectorAll("tr");

        rows.forEach(row => {
            const courseName = row.querySelector("td:nth-child(2)").textContent.toLowerCase() || "";
            const courseCode = row.querySelector("td:nth-child(1)").textContent.toLowerCase() || "";

            if (courseName.includes(searchTerm) || courseCode.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    function sortCourses(criteria) {
        let sortedCourses = Array.from(courseTable.querySelectorAll("tr"));
        const rows = Array.from(courseTable.querySelectorAll("tr"));

        if (criteria === "name") {
            sortedCourses.sort((a, b) => {
                const aName = a.querySelector("td:nth-child(2)").textContent.toLowerCase();
                const bName = b.querySelector("td:nth-child(2)").textContent.toLowerCase();
                return aName.localeCompare(bName);
            });
        }
        else if (criteria === "code") {
            sortedCourses.sort((a, b) => {
                const aCode = a.querySelector("td:nth-child(1)").textContent.toLowerCase();
                const bCode = b.querySelector("td:nth-child(1)").textContent.toLowerCase();
                return aCode.localeCompare(bCode);
            });
        }
        // Re-append sorted rows to the table
        rows.forEach(row => courseTable.appendChild(row));
    }

    sortSelect.addEventListener("change", function () {
        sortCourses(sortSelect.value);
    });

    // Trier par défaut par nom au chargement de la page
    sortCourses("name");
});