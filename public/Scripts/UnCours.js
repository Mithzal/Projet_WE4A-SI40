function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.main-content');
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

document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.querySelector('.main-content');
    const posts = Array.from(mainContent.querySelectorAll('section[data-date]'));

    // Trier les posts par date décroissante
    posts.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));

    // Supprimer tous les anciens posts
    posts.forEach(post => mainContent.removeChild(post));

    // Réinsérer les posts dans l'ordre trié
    posts.forEach(post => mainContent.appendChild(post));

    // Mettre à jour le menu latéral
    const sidebarList = document.querySelector('.sidebar ul');
    sidebarList.innerHTML = ''; // Vide la liste

    posts.forEach(post => {
        const id = post.id;
        const title = post.querySelector('h2')?.textContent || id;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = title;
        li.appendChild(a);
        sidebarList.appendChild(li);
    });
});
