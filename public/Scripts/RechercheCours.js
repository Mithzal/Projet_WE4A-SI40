document.addEventListener('DOMContentLoaded', function() {
    const courseList = document.getElementById('course-list');
    const searchBar = document.getElementById('search-bar');
    const sortCourses = document.getElementById('sort-courses');

    // Fonction pour récupérer les cours via l'API
    function fetchCourses(query) {
        fetch(`/rechercheCoursAjax?query=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors de la récupération des cours');
                }
                return response.json();
            })
            .then(courses => {
                if (Array.isArray(courses)) {
                    sortAndDisplayCourses(courses);
                } else {
                    console.error('Format de données inattendu :', courses);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des cours :', error));
    }

    // Fonction pour afficher les cours
    function displayCourses(courses) {
        courseList.innerHTML = '';
        courses.forEach(course => {
            const { titre, description, code } = course;
            if (titre && description && code) {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.innerHTML = `
                    <h3>${titre}</h3>
                    <p>Description : ${description}</p>
                    <p>Code: ${code}</p>
                `;
                courseList.appendChild(courseCard);
            } else {
                console.warn('Données de cours incomplètes :', course);
            }
        });
    }

    // Fonction pour trier et afficher les cours
    function sortAndDisplayCourses(courses) {
        const sortBy = sortCourses.value;

        if (sortBy === 'name') {
            courses.sort((a, b) => a.titre.localeCompare(b.titre));
        } else if (sortBy === 'code') {
            courses.sort((a, b) => a.code.localeCompare(b.code));
        }

        displayCourses(courses);
    }

    // Gestion des événements
    searchBar.addEventListener('input', function() {
        const query = searchBar.value;
        fetchCourses(query);
    });

    sortCourses.addEventListener('change', function() {
        const query = searchBar.value;
        fetchCourses(query);
    });

    // Chargement initial (vide)
    fetchCourses('');
});