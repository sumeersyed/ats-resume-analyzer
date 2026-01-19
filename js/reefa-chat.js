/**
 * Reefa - The Friendly Resume Assistant
 * Handles chatbot logic, suggestions, and donation prompt
 */

const ReefaChat = (function () {
    const config = {
        name: 'Reefa',
        avatar: 'assets/logo.png', // Use site logo or custom avatar
        suggestions: [
            "How do I improve my ATS score?",
            "What keywords should I include?",
            "Can you review my summary?",
            "How does the donation help?"
        ],
        donationMessage: "I hope I've been helpful! ❤️ ResumeRadar is a free tool maintained by a small team. If you secured an interview or just love the app, a small donation of $5 would mean the world to us. It keeps the servers running and updates coming! Check the Support section below.",
    };

    let isOpen = false;
    let hasWelcomed = false;

    function init() {
        injectHTML();
        attachEvents();

        // Auto-welcome after delay
        setTimeout(() => {
            if (!hasWelcomed && !isOpen) {
                document.getElementById('reefaBadge').style.display = 'flex';
                playNotificationSound();
            }
        }, 5000);
    }

    function injectHTML() {
        const div = document.createElement('div');
        div.className = 'reefa-chat-widget';
        div.innerHTML = `
            <div class="reefa-chat-window" id="reefaWindow">
                <div class="reefa-header">
                    <div class="reefa-bot-info">
                        <div class="reefa-avatar">
                            <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                        </div>
                        <div>
                            <div class="reefa-name">${config.name}</div>
                            <div class="reefa-status">Online • AI Assistant</div>
                        </div>
                    </div>
                    <button class="reefa-close" id="reefaClose">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="reefa-messages" id="reefaMessages"></div>
                <div class="reefa-input-area">
                    <input type="text" class="reefa-input" id="reefaInput" placeholder="Ask Reefa anything...">
                    <button class="reefa-send" id="reefaSend">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="reefa-toggle-btn" id="reefaToggle">
                <span class="reefa-notification-badge" id="reefaBadge" style="display: none">1</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        `;
        document.body.appendChild(div);
    }

    function attachEvents() {
        const toggleBtn = document.getElementById('reefaToggle');
        const closeBtn = document.getElementById('reefaClose');
        const sendBtn = document.getElementById('reefaSend');
        const input = document.getElementById('reefaInput');

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    function toggleChat() {
        const window = document.getElementById('reefaWindow');
        const badge = document.getElementById('reefaBadge');

        isOpen = !isOpen;
        window.classList.toggle('active', isOpen);

        if (isOpen) {
            badge.style.display = 'none';
            if (!hasWelcomed) {
                addMessage("bot", "Hi! I'm Reefa. I can help you optimize your resume, fix ATS issues, or answer questions. What's on your mind?");
                showSuggestions();
                hasWelcomed = true;
            }
            document.getElementById('reefaInput').focus();
        }
    }

    function handleSend() {
        const input = document.getElementById('reefaInput');
        const text = input.value.trim();

        if (!text) return;

        addMessage('user', text);
        input.value = '';

        showTyping();

        // Simulating AI delay
        setTimeout(() => {
            removeTyping();
            const response = generateResponse(text);
            addMessage('bot', response);

            // Randomly ask for donation at end of helpful conversation
            if (isConversationEnding(text) || Math.random() > 0.8) {
                setTimeout(() => {
                    addMessage('bot', config.donationMessage);
                }, 1000);
            }
        }, 1500);
    }

    function addMessage(type, text) {
        const container = document.getElementById('reefaMessages');
        const div = document.createElement('div');
        div.className = `reefa-message ${type}`;
        div.innerHTML = text; // Allow HTML for links
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        const container = document.getElementById('reefaMessages');
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'reefaTyping';
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping() {
        const el = document.getElementById('reefaTyping');
        if (el) el.remove();
    }

    function showSuggestions() {
        const container = document.getElementById('reefaMessages');
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexWrap = 'wrap';
        div.style.gap = '8px';
        div.style.marginTop = '8px';

        config.suggestions.forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-glass btn-sm';
            btn.style.fontSize = '0.8rem';
            btn.textContent = s;
            btn.onclick = () => {
                document.getElementById('reefaInput').value = s;
                handleSend();
                div.remove();
            };
            div.appendChild(btn);
        });

        container.appendChild(div);
    }

    function generateResponse(input) {
        input = input.toLowerCase();

        if (input.includes('ats') || input.includes('score')) {
            return "To boost your ATS score, focus on: <br>1. Standard headings (Experience, Education) <br>2. No tables or columns <br>3. Keywords from the job description.";
        }
        if (input.includes('keyword')) {
            return "Look at the job posting's 'Responsibilities' section. Words used frequently there (like 'Agile', 'Python', 'Project Management') are your keywords!";
        }
        if (input.includes('summary')) {
            return "Keep your summary to 3-4 lines. State your role, years of experience, and 2-3 key achievements. Avoid generic buzzwords like 'hard worker'.";
        }
        if (input.includes('donation') || input.includes('free') || input.includes('pay')) {
            return "ResumeRadar is 100% free! But we rely on community support. Ideally, a $5-10 donation helps us keep the lights on.";
        }
        if (input.includes('thank') || input.includes('bye')) {
            return "You're welcome! Good luck with the job hunt! 🚀";
        }

        return "That's a great question. Generally, tailoring your resume for every single application is the best strategy. Can I help with a specific section?";
    }

    function isConversationEnding(text) {
        const completionWords = ['thanks', 'thank you', 'bye', 'goodbye', 'done', 'great', 'awesome'];
        return completionWords.some(w => text.toLowerCase().includes(w));
    }

    function playNotificationSound() {
        // Optional: Implement subtle sound
    }

    return { init };
})();

// Initialize
document.addEventListener('DOMContentLoaded', ReefaChat.init);
