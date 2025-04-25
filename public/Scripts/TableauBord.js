let currentIndex = 0; // Tracks the starting index of the currently displayed courses
const maxCoursesToShow = 4; // Maximum number of courses to display at once

function updateShownCourse(direction) {
    const courses = document.querySelectorAll('.course-card');
    const totalCourses = courses.length;

    // Add the 'hidden' class to all courses initially
    courses.forEach(course => course.classList.add('hidden'));

    // Update the current index based on the direction
    if (direction === 'next') {
        currentIndex = (currentIndex + maxCoursesToShow) % totalCourses;
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - maxCoursesToShow + totalCourses) % totalCourses;
    }

    // Show the next set of courses
    for (let i = 0; i < maxCoursesToShow; i++) {
        const courseIndex = (currentIndex + i) % totalCourses;
        courses[courseIndex].classList.remove('hidden');
    }
}

// Attach event listeners to the buttons
document.querySelector('.prev').addEventListener('click', () => updateShownCourse('prev'));
document.querySelector('.next').addEventListener('click', () => updateShownCourse('next'));

// Initialize by showing the first set of courses
updateShownCourse('next');