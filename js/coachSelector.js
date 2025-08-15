// Attach modal triggers for nav and hero button
export function setupCoachSelectorTriggers() {
    initCoachSelectorModal();
    // Nav link
    const coachingLink = document.querySelector('coachingNavLink');
    if (coachingLink) {
        coachingLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCoachSelectorModal();
        });
    }
    // Hero CTA button
    const chooseCoachBtn = document.getElementById('chooseCoachBtn');
    if (chooseCoachBtn) {
        chooseCoachBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showCoachSelectorModal();
        });
    }
}
// coachSelector.js
// Renders and manages the game/coach selection modal for reuse on any page
// Usage: import { showCoachSelectorModal, initCoachSelectorModal } from './coachSelector.js';
// Then call initCoachSelectorModal() on page load, and showCoachSelectorModal() to open the modal

import { getCurrentUser, loadCoaches } from './clientApi.js';

const games = [
    { key: 'tft', name: 'Teamfight Tactics', genre: 'Auto Battler', img: 'img/game-tft.jpg' },
    { key: 'lol', name: 'League of Legends', genre: 'MOBA', img: 'img/game-lol.jpg' },
    { key: 'valorant', name: 'Valorant', genre: 'Tactical Shooter', img: 'img/game-valorant.jpg' },
    { key: 'fifa24', name: 'EA Sports FC 24', genre: 'Sports', img: 'img/game-fifa24.jpg' },
    { key: 'dota2', name: 'Dota 2', genre: 'MOBA', img: 'img/game-dota2.jpg' },
    { key: 'cs2', name: 'Counter-Strike 2', genre: 'Tactical Shooter', img: 'img/game-cs2.jpg' },
    { key: 'apex', name: 'Apex Legends', genre: 'Battle Royale', img: 'img/game-apex.jpg' },
    { key: 'fifa23', name: 'FIFA 23', genre: 'Sports', img: 'img/game-fifa23.jpg' }
];

function sortCoachesByRole(coaches) {
    return coaches.slice().sort((a, b) => {
        if (!a.role && !b.role) return 0;
        if (!a.role) return 1;
        if (!b.role) return -1;
        return a.role.localeCompare(b.role, undefined, { sensitivity: 'base' });
    });
}

function renderGamesList() {
    const gamesList = document.getElementById('gamesList');
    if (!gamesList) return;
    gamesList.innerHTML = games.map((game, idx) => `
        <button class="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${idx === 0 ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}" data-game="${game.key}">
            <img src="${game.img}" alt="${game.name}" width="50" height="50" class="rounded">
            <div>
                <h6 class="mb-0">${game.name}</h6>
                <small class="text-gray-500">${game.genre}</small>
            </div>
        </button>
    `).join('');
}

async function renderCoachesInModal(gameKey) {
    const coachesList = document.getElementById('coachesList');
    if (!coachesList) return;
    const user = getCurrentUser();
    if (!user || !user.username) {
        coachesList.innerHTML = `
            <div class="text-center py-4 w-full">
                <div class="mb-3 text-gray-500">Please log in to view the list of available coaches.</div>
                <a id="loginModalBtn" href="login.html" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Go to Login</a>
            </div>
        `;
        setTimeout(() => {
            const loginBtn = document.getElementById('loginModalBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
                    if (isIndex) {
                        // Just close the modal and scroll to login section
                        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('gameCoachModal'));
                        if (modalInstance) modalInstance.hide();
                        setTimeout(() => {
                            const loginEl = document.getElementById('login');
                            if (loginEl) {
                                loginEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }, 400);
                    } else {
                        // Redirect to login.html
                        window.location.href = 'login.html';
                    }
                });
            }
        }, 0);
        return;
    }
    coachesList.innerHTML = '<div class="text-gray-500">Loading coaches...</div>';
    try {
        const coaches = await loadCoaches();
        let genre = null;
        if (gameKey) {
            const game = games.find(g => g.key === gameKey);
            genre = game ? game.genre : null;
        }
        let filtered = Array.isArray(coaches)
            ? coaches.filter(coach =>
        !genre ||
        (coach.role && (coach.role.toLowerCase() === genre.toLowerCase() || coach.role.toLowerCase() === 'gaming'))
              )
            : [];
        filtered = sortCoachesByRole(filtered);
        if (filtered.length === 0) {
            coachesList.innerHTML = '<div class="text-gray-500">No coaches found for this game.</div>';
            return;
        }
        coachesList.innerHTML = filtered.map(coach => `
            <div class="w-full md:w-1/2 px-2 mb-4">
                <div class="coach-card border border-gray-300 p-3 rounded-lg flex gap-3 items-center coach-selectable hover:shadow-md transition-shadow cursor-pointer" data-coach-id="${coach.id}">
                    <img src="${coach.avatar || 'img/default-avatar.png'}" alt="${coach.name}" width="60" height="60" class="rounded-full">
                    <div>
                        <h6 class="mb-1">${coach.name}</h6>
                        <small class="text-gray-500">${coach.role || ''} expert</small>
                        <div class="mt-1">
                            <span class="inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs">${coach.status || 'online'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        coachesList.querySelectorAll('.coach-selectable').forEach(card => {
            card.addEventListener('click', function() {
                const coachId = this.getAttribute('data-coach-id');
                if (coachId) {
                    window.location.href = `chat.html?coach=${encodeURIComponent(coachId)}`;
                }
            });
        });
    } catch (err) {
        coachesList.innerHTML = '<div class="text-red-600">Failed to load coaches.</div>';
    }
}

function ensureModalHtml() {
    if (document.getElementById('gameCoachModal')) return;
    const modalHtml = `
    <div class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black bg-opacity-75" id="gameCoachModal" tabindex="-1">
        <div class="w-full max-w-5xl mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div class="flex flex-col">
                <div class="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                    <h5 class="text-lg font-semibold text-white">Select Game & Coach</h5>
                    <button type="button" class="text-white hover:text-gray-300 p-2 focus:outline-none" onclick="document.getElementById('gameCoachModal').classList.add('hidden')">&times;</button>
                </div>
                <div class="flex flex-row">
                    <div class="w-full md:w-1/3 border-r border-gray-700 bg-gray-800 min-h-[400px]">
                        <div class="flex flex-col" id="gamesList"></div>
                    </div>
                    <div class="w-full md:w-2/3 bg-gray-900">
                        <div class="p-6">
                            <div class="flex flex-wrap -mx-2" id="coachesList"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

export function showCoachSelectorModal() {
    ensureModalHtml();
    renderGamesList();
    const gamesList = document.getElementById('gamesList');
    const coachModal = document.getElementById('gameCoachModal');
    if (gamesList) {
        let activeBtn = gamesList.querySelector('button.bg-blue-600');
        let initialGame = activeBtn ? activeBtn.getAttribute('data-game') : null;
        renderCoachesInModal(initialGame);
        gamesList.addEventListener('click', e => {
            const btn = e.target.closest('button[data-game]');
            if (!btn) return;
            gamesList.querySelectorAll('button[data-game]').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
            btn.classList.add('bg-blue-600', 'text-white');
            renderCoachesInModal(btn.getAttribute('data-game'));
        }, { once: true });
    }
    coachModal.classList.remove('hidden');
}

export function initCoachSelectorModal() {
    ensureModalHtml();
    renderGamesList();
    const gamesList = document.getElementById('gamesList');
    if (gamesList) {
        let activeBtn = gamesList.querySelector('button.bg-blue-600');
        let initialGame = activeBtn ? activeBtn.getAttribute('data-game') : null;
        renderCoachesInModal(initialGame);
        gamesList.addEventListener('click', e => {
            const btn = e.target.closest('button[data-game]');
            if (!btn) return;
            gamesList.querySelectorAll('button[data-game]').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
            btn.classList.add('bg-blue-600', 'text-white');
            renderCoachesInModal(btn.getAttribute('data-game'));
        });
    }
}