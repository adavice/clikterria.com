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

document.addEventListener("DOMContentLoaded", () => {
    const trigger1 = document.querySelector(".trigger1");
    const dropdown1 = document.querySelector(".dropdown1");
    const trigger2 = document.querySelector(".trigger2");
    const dropdown2 = document.querySelector(".dropdown2");

    trigger1.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown1.classList.toggle("opacity-0");
        dropdown1.classList.toggle("invisible");
        dropdown1.classList.toggle("opacity-100");
        dropdown1.classList.toggle("visible");
    });

    trigger2.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown2.classList.toggle("opacity-0");
        dropdown2.classList.toggle("invisible");
        dropdown2.classList.toggle("opacity-100");
        dropdown2.classList.toggle("visible");
    });

    document.addEventListener("click", (e) => {
        if (!trigger1.parentElement.contains(e.target)) {
            dropdown1.classList.add("opacity-0", "invisible");
            dropdown1.classList.remove("opacity-100", "visible");
        }

        if (!trigger2.parentElement.contains(e.target)) {
            dropdown2.classList.add("opacity-0", "invisible");
            dropdown2.classList.remove("opacity-100", "visible");
        }
    });
});