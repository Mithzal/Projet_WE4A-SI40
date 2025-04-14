document.addEventListener('DOMContentLoaded', function() {
    const courses = [
        { name: 'Cours 1', date: '2023-01-01' },
        { name: 'Cours 2', date: '2023-02-01' },
        { name: 'Cours 3', date: '2023-03-01' },
        { name: 'Cours 4', date: '2023-04-01' },
        { name: 'Cours 5', date: '2023-05-01' },
        { name: 'Cours 6', date: '2023-06-01' },
        { name: 'Cours 7', date: '2023-07-01' },
        { name: 'Cours 8', date: '2023-08-01' },
        { name: 'Cours 9', date: '2023-09-01' },
        { name: 'Cours 10', date: '2023-10-01' }
    ];

    const courseList = document.getElementById('course-list');
    const searchBar = document.getElementById('search-bar');
    const sortCourses = document.getElementById('sort-courses');

    function displayCourses(courses) {
        courseList.innerHTML = '';
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                        <h3>${course.name}</h3>
                        <p>Date: ${course.date}</p>
                    `;
            courseList.appendChild(courseCard);
        });
    }

    function sortAndFilterCourses() {
        const searchTerm = searchBar.value.toLowerCase();
        const sortBy = sortCourses.value;

        let filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm)
        );

        if (sortBy === 'name') {
            filteredCourses.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'date') {
            filteredCourses.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        displayCourses(filteredCourses);
    }

    searchBar.addEventListener('input', sortAndFilterCourses);
    sortCourses.addEventListener('change', sortAndFilterCourses);

    displayCourses(courses);
});