/* ============================================
   Dashboard Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle for Mobile (if needed in future)
    // Currently CSS handles simple hiding, but we might want a hamburger menu

    // Active State Handling
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            e.currentTarget.classList.add('active');
        });
    });

    // Delete Button Confirmation
    const deleteBtns = document.querySelectorAll('.action-btn[title="Delete"]');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
                // Remove the card visually
                const card = e.target.closest('.resume-card');
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    updateStats();
                }, 300);
            }
        });
    });

    // Mock Search Functionality
    const searchInput = document.querySelector('.header-search input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.resume-card');

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    function updateStats() {
        // Mock function to update stats after deletion
        const countDisplay = document.querySelector('.stat-value'); // First stat is Total Resumes
        if (countDisplay) {
            let current = parseInt(countDisplay.textContent);
            countDisplay.textContent = Math.max(0, current - 1);
        }
    }

    // Live Market Feed Simulation
    initLiveFeed();
});

function initLiveFeed() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;

    // Create Feed Element
    const feedContainer = document.createElement('div');
    feedContainer.className = 'live-feed-ticker';
    feedContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.9);
        border-bottom: 1px solid var(--border-color);
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        z-index: 90;
    `;

    feedContainer.innerHTML = `
        <span style="color: #10b981; margin-right: 1rem; font-weight: 600; display: flex; align-items: center;">
            <span class="pulse-dot" style="background: #10b981; width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; box-shadow: 0 0 8px #10b981;"></span>
            LIVE MARKET
        </span>
        <div class="ticker-content" style="display: inline-block; animation: ticker 30s linear infinite;"></div>
    `;

    // Inject custom animation style if needed
    if (!document.getElementById('ticker-style')) {
        const style = document.createElement('style');
        style.id = 'ticker-style';
        style.textContent = `
            @keyframes ticker {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
        `;
        document.head.appendChild(style);
    }

    header.style.position = 'relative'; // Ensure positioning context
    header.appendChild(feedContainer);

    const tickerContent = feedContainer.querySelector('.ticker-content');
    const updates = [
        "🔥 New Job: Sr. React Developer needed in San Francisco ($160k+)",
        "⚡ User Sarah J. just improved ATS score by 45 points!",
        "💼 245 new Product Manager roles added in the last hour",
        "🚀 Trending: 'Kubernetes' demand up 14% this week",
        "🔥 New Job: Backend Engineer (Go/Rust) - Remote",
        "⚡ User Mike T. landed an interview at Google",
        "💼 Amazon is hiring 50+ Data Scientists globally"
    ];

    tickerContent.textContent = updates.join(" ••• ");
}
