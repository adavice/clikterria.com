const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const openSidebarButton = document.getElementById('openSidebar');
const closeSidebarButton = document.getElementById('closeSidebar');

function openSidebar() {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

openSidebarButton.addEventListener('click', openSidebar);
closeSidebarButton.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.toggle-section').forEach(section => {
    const block = section.querySelector('.toggle-block');
    const chevron = section.querySelector('.toggle-chevron');
    const content = section.querySelector('.collapsible-content');

    block.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        content.classList.toggle('hidden');

        if (isOpen) {
            chevron.classList.remove('rotate-[360deg]');
        } else {
            chevron.classList.add('rotate-[360deg]');
        }
    });
});
