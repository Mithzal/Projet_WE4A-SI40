function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');
    sidebar.classList.toggle('hidden');
    if (sidebar.classList.contains('hidden')) {
        content.style.marginLeft = '2%';
        toggleBtn.style.left = '0%';
    } else {
        content.style.marginLeft = '20%';
        toggleBtn.style.left = '18.2%';
    }
}