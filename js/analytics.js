/**
 * ResumeAI - Live Analytics & Data Tracking Module
 * Provides live visitor counting, activity feed, and animated counters
 */

const Analytics = (function () {
    // Storage keys
    const STORAGE_KEYS = {
        VISITOR_COUNT: 'resumeai_visitors',
        ANALYSIS_COUNT: 'resumeai_analyses',
        SESSION_ID: 'resumeai_session',
        LAST_VISIT: 'resumeai_last_visit'
    };

    // Sample data for activity feed
    const sampleActivities = [
        { name: 'Alex M.', action: 'just analyzed their resume', score: 87 },
        { name: 'Sarah K.', action: 'built a new resume', template: 'Modern' },
        { name: 'James W.', action: 'improved their ATS score', improvement: '+15%' },
        { name: 'Emily R.', action: 'downloaded their resume', format: 'PDF' },
        { name: 'Michael D.', action: 'just analyzed their resume', score: 92 },
        { name: 'Jessica L.', action: 'built a new resume', template: 'Classic' },
        { name: 'David C.', action: 'improved their ATS score', improvement: '+22%' },
        { name: 'Amanda P.', action: 'just analyzed their resume', score: 78 },
        { name: 'Robert T.', action: 'downloaded their resume', format: 'PDF' },
        { name: 'Lisa M.', action: 'built a new resume', template: 'Elegant' }
    ];

    // Initialize analytics
    function init() {
        initSession();
        updateVisitorCount();
        initLiveStats();
        initActivityFeed();
        initScrollReveal();
        initAnimatedCounters();
    }

    // Initialize session tracking
    function initSession() {
        let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
            incrementVisitorCount();
        }
    }

    // Get/Set visitor count from localStorage
    function getVisitorCount() {
        const count = localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT);
        // Start with a realistic base number
        return count ? parseInt(count) : 52847;
    }

    function incrementVisitorCount() {
        const count = getVisitorCount() + 1;
        localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, count.toString());
        return count;
    }

    // Get/Set analysis count
    function getAnalysisCount() {
        const count = localStorage.getItem(STORAGE_KEYS.ANALYSIS_COUNT);
        return count ? parseInt(count) : 38429;
    }

    function incrementAnalysisCount() {
        const count = getAnalysisCount() + 1;
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_COUNT, count.toString());
        updateLiveStatValue('analysisCount', count);
        showActivityNotification();
        return count;
    }

    // Update visitor count display
    function updateVisitorCount() {
        const visitorEl = document.getElementById('liveVisitorCount');
        if (visitorEl) {
            animateCounter(visitorEl, getVisitorCount());
        }
    }

    // Initialize live stats dashboard
    function initLiveStats() {
        const statsContainer = document.getElementById('liveStatsDashboard');
        if (!statsContainer) return;

        // Update stats periodically
        setInterval(() => {
            const activeUsers = Math.floor(Math.random() * 50) + 120;
            updateLiveStatValue('activeUsers', activeUsers);
        }, 5000);

        // Occasionally increment analysis count (simulated)
        setInterval(() => {
            if (Math.random() > 0.7) {
                incrementAnalysisCount();
            }
        }, 8000);
    }

    // Update a live stat value
    function updateLiveStatValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            animateCounter(el, value);
        }
    }

    // Animate counter from current to target value
    function animateCounter(element, targetValue, duration = 1000) {
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;

        element.classList.add('counting');

        const timer = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) ||
                (increment < 0 && currentValue <= targetValue)) {
                currentValue = targetValue;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            element.textContent = formatNumber(Math.round(currentValue));
        }, 16);
    }

    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Initialize activity feed
    function initActivityFeed() {
        // Show activity notification periodically
        setInterval(() => {
            if (Math.random() > 0.6) {
                showActivityNotification();
            }
        }, 12000);

        // Show initial notification after a delay
        setTimeout(showActivityNotification, 3000);
    }

    // Show activity notification
    function showActivityNotification() {
        const container = document.getElementById('socialProof');
        if (!container) return;

        const activity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];

        const avatar = container.querySelector('.social-proof-avatar');
        const title = container.querySelector('.social-proof-title');
        const text = container.querySelector('.social-proof-text');

        if (avatar) avatar.textContent = activity.name.charAt(0);
        if (title) title.textContent = activity.name + ' ' + activity.action;

        let subtext = 'Just now';
        if (activity.score) subtext = `ATS Score: ${activity.score}/100`;
        if (activity.template) subtext = `Template: ${activity.template}`;
        if (activity.improvement) subtext = `Score improved by ${activity.improvement}`;
        if (text) text.textContent = subtext;

        container.classList.add('show');

        setTimeout(() => {
            container.classList.remove('show');
        }, 5000);
    }

    // Initialize scroll reveal animations
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // Initialize animated counters in hero stats
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    animateCounter(entry.target, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    // Initialize FAQ accordion
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all items
                    faqItems.forEach(i => i.classList.remove('active'));

                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Trigger confetti effect
    function triggerConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s ease-out forwards`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    }

    // Get time-based greeting
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    // Public API
    return {
        init,
        incrementAnalysisCount,
        getVisitorCount,
        getAnalysisCount,
        formatNumber,
        initFaqAccordion,
        triggerConfetti,
        getGreeting,
        animateCounter
    };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
    Analytics.initFaqAccordion();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Analytics = Analytics;
}
