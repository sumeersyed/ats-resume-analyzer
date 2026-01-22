/**
 * Jinni - The Friendly Resume Assistant (Formerly Reefa)
 * Handles chatbot logic, suggestions, and donation prompt
 */

const JinniChat = (function () {
    const config = {
        name: 'Jinni',
        avatar: 'assets/chatbot_logo.png', // New Owl Image
        storageKey: 'jinni_chat_history',
        suggestions: [
            "How do I improve my ATS score?",
            "What keywords should I include?",
            "Can you review my summary?",
            "How does the donation help?"
        ],
        donationMessage: "I hope I've been helpful! ❤️ Zume is a free tool maintained by a small team. If you secured an interview or just love the app, a small donation of $5 would mean the world to us. It keeps the servers running and updates coming! Check the Support section below.",
    };

    let isOpen = false;
    let hasWelcomed = false;
    let chatHistory = [];

    async function init() {
        injectHTML();
        attachEvents();

        // Load History ("Learning")
        if (window.SecureStorage) {
            const stored = await window.SecureStorage.getItem(config.storageKey);
            if (stored && Array.isArray(stored)) {
                chatHistory = stored;
                // Don't replay all history immediately to UI to keep it clean, 
                // OR replay last few messages. Let's replay last 5 for context.
                // For now, we just load it into memory so the "bot" knows context (simulated).

                // If history exists, we don't need the auto-welcome sound/badge maybe?
                // Let's still show badge if it's been a while.
            }
        }

        // Auto-welcome after delay
        setTimeout(() => {
            if (!hasWelcomed && !isOpen) {
                document.getElementById('jinniBadge').style.display = 'flex';
                // playNotificationSound(); // removed per user preference implicitly
            }
        }, 3000);
    }

    function injectHTML() {
        const div = document.createElement('div');
        div.className = 'jinni-chat-widget';
        div.innerHTML = `
            <div class="jinni-chat-window" id="jinniWindow">
                <div class="jinni-header">
                    <div class="jinni-bot-info">
                        <div class="jinni-avatar">
                            <img src="${config.avatar}" alt="${config.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        </div>
                        <div>
                            <div class="jinni-name">${config.name}</div>
                            <div class="jinni-status">Online • Learning AI</div>
                        </div>
                    </div>
                    <button class="jinni-close" id="jinniClose">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="jinni-messages" id="jinniMessages"></div>
                <div class="jinni-input-area">
                    <input type="text" class="jinni-input" id="jinniInput" placeholder="Ask Jinni anything...">
                    <button class="jinni-send" id="jinniSend">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="jinni-toggle-btn" id="jinniToggle">
                <span class="jinni-notification-badge" id="jinniBadge" style="display: none">1</span>
                <img src="${config.avatar}" alt="Chat" class="jinni-toggle-img">
            </button>
        `;
        document.body.appendChild(div);
    }

    function attachEvents() {
        const toggleBtn = document.getElementById('jinniToggle');
        const closeBtn = document.getElementById('jinniClose');
        const sendBtn = document.getElementById('jinniSend');
        const input = document.getElementById('jinniInput');

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    function toggleChat() {
        const window = document.getElementById('jinniWindow');
        const badge = document.getElementById('jinniBadge');

        isOpen = !isOpen;
        window.classList.toggle('active', isOpen);

        if (isOpen) {
            badge.style.display = 'none';
            if (!hasWelcomed) {
                // If history exists, recreate it
                if (chatHistory.length > 0) {
                    // Replay last 3 messages just for UI context
                    const recent = chatHistory.slice(-3);
                    recent.forEach(msg => addMessageToUI(msg.role, msg.text));
                    addMessageToUI("bot", "Welcome back! I remember our last chat. How can I help you now?");
                } else {
                    addMessageToUI("bot", "Hi! I'm Jinni, your learning AI assistant. I'll remember our conversations to help you better. What's on your mind?");
                    showSuggestions();
                }
                hasWelcomed = true;
            }
            document.getElementById('jinniInput').focus();
        }
    }

    function handleSend() {
        const input = document.getElementById('jinniInput');
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
        }, 1500);
    }

    async function addMessage(type, text) {
        // Add to UI
        addMessageToUI(type, text);

        // Save to History (Learning)
        chatHistory.push({ role: type, text: text, timestamp: Date.now() });
        if (window.SecureStorage) {
            await window.SecureStorage.setItem(config.storageKey, chatHistory);
        }
    }

    function addMessageToUI(type, text) {
        const container = document.getElementById('jinniMessages');
        const div = document.createElement('div');
        div.className = `jinni-message ${type}`;
        div.innerHTML = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        const container = document.getElementById('jinniMessages');
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.id = 'jinniTyping';
        div.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping() {
        const el = document.getElementById('jinniTyping');
        if (el) el.remove();
    }

    function showSuggestions() {
        const container = document.getElementById('jinniMessages');
        const div = document.createElement('div');
        div.className = 'suggestion-chips'; // New class or inline
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
                document.getElementById('jinniInput').value = s;
                handleSend();
                div.remove();
            };
            div.appendChild(btn);
        });

        container.appendChild(div);
    }

    function generateResponse(input) {
        input = input.toLowerCase();

        // Simulate "Learning" from history context (very basic)
        const previousContext = chatHistory.length > 2 ? chatHistory[chatHistory.length - 2].text.toLowerCase() : "";

        if (input.includes('ats') || input.includes('score')) {
            return "To boost your ATS score, focus on: <br>1. Standard headings (Experience, Education) <br>2. No tables or columns <br>3. Keywords from the job description.";
        }
        if (input.includes('keyword')) {
            return "Look at the job posting's 'Responsibilities' section. Words used frequently there are your keywords! I've learned that 'Python' and 'Agile' are currently trending.";
        }
        if (input.includes('donation') || input.includes('free') || input.includes('pay')) {
            return config.donationMessage;
        }

        return "I'm learning more about that! Generally, specific results are better than generic tasks. Can I help you rephrase a bullet point?";
    }

    return { init };
})();

// Initialize
document.addEventListener('DOMContentLoaded', JinniChat.init);
