/**
 * ResumeRadar Security & Privacy Module
 * - Data encryption using Web Crypto API (AES-GCM)
 * - Secure localStorage wrapper
 * - Cookie consent management
 * - Date/Time/Location widget (Draggable, Resizable, Geolocation, Live User Counter)
 * - Persistent Stats Manager
 */

(function () {
    'use strict';

    // ==========================================
    // ENCRYPTION MODULE (Web Crypto API - AES-GCM)
    // ==========================================
    const CryptoModule = {
        algorithm: 'AES-GCM',
        keyLength: 256,

        async generateKey() {
            return await crypto.subtle.generateKey(
                { name: this.algorithm, length: this.keyLength },
                true,
                ['encrypt', 'decrypt']
            );
        },

        async exportKey(key) {
            const exported = await crypto.subtle.exportKey('raw', key);
            return this.arrayBufferToBase64(exported);
        },

        async importKey(keyData) {
            const keyBuffer = this.base64ToArrayBuffer(keyData);
            return await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: this.algorithm, length: this.keyLength },
                true,
                ['encrypt', 'decrypt']
            );
        },

        async encrypt(data, key) {
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const encrypted = await crypto.subtle.encrypt(
                { name: this.algorithm, iv: iv },
                key,
                encodedData
            );

            return {
                iv: this.arrayBufferToBase64(iv),
                data: this.arrayBufferToBase64(encrypted)
            };
        },

        async decrypt(encryptedObj, key) {
            try {
                const iv = this.base64ToArrayBuffer(encryptedObj.iv);
                const data = this.base64ToArrayBuffer(encryptedObj.data);

                const decrypted = await crypto.subtle.decrypt(
                    { name: this.algorithm, iv: iv },
                    key,
                    data
                );

                return JSON.parse(new TextDecoder().decode(decrypted));
            } catch (e) {
                console.warn('Decryption failed:', e);
                return null;
            }
        },

        arrayBufferToBase64(buffer) {
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        },

        base64ToArrayBuffer(base64) {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        }
    };

    // ==========================================
    // SECURE STORAGE MODULE
    // ==========================================
    const SecureStorage = {
        keyStorageKey: '_rr_encryption_key',
        cryptoKey: null,

        async init() {
            try {
                const storedKey = localStorage.getItem(this.keyStorageKey);
                if (storedKey) {
                    this.cryptoKey = await CryptoModule.importKey(storedKey);
                } else {
                    this.cryptoKey = await CryptoModule.generateKey();
                    const exportedKey = await CryptoModule.exportKey(this.cryptoKey);
                    localStorage.setItem(this.keyStorageKey, exportedKey);
                }
                return true;
            } catch (e) {
                console.error('SecureStorage init failed:', e);
                return false;
            }
        },

        async setItem(key, value) {
            if (!this.cryptoKey) await this.init();
            try {
                const encrypted = await CryptoModule.encrypt(value, this.cryptoKey);
                localStorage.setItem(key, JSON.stringify(encrypted));
                return true;
            } catch (e) {
                console.error('SecureStorage setItem failed:', e);
                return false;
            }
        },

        async getItem(key) {
            if (!this.cryptoKey) await this.init();
            try {
                const stored = localStorage.getItem(key);
                if (!stored) return null;
                const encryptedObj = JSON.parse(stored);
                if (
                    !encryptedObj ||
                    (typeof encryptedObj === 'object' && (!encryptedObj.iv || !encryptedObj.data))
                ) {
                    // Not encrypted or malformed, return as-is
                    return stored;
                }
                return await CryptoModule.decrypt(encryptedObj, this.cryptoKey);
            } catch (e) {
                // If parse fails, it might be raw string data
                const raw = localStorage.getItem(key);
                return raw;
            }
        },

        async removeItem(key) {
            localStorage.removeItem(key);
        }
    };

    // ==========================================
    // STATS MANAGER (Persistent Growth)
    // ==========================================
    const StatsManager = {
        STORAGE_KEY: 'rr_stats_data',

        // Base values to start from if no storage
        defaults: {
            resumesAnalyzed: 52847,
            analysesToday: 38429,
            activeUsers: 142,
            lastUpdated: Date.now()
        },

        data: null,

        async init() {
            // Load from secure storage
            const stored = await SecureStorage.getItem(this.STORAGE_KEY);

            if (stored) {
                this.data = typeof stored === 'string' ? JSON.parse(stored) : stored;
            } else {
                this.data = { ...this.defaults };
                await this.save();
            }

            // Calculate growth based on time elapsed
            this.calculateGrowth();

            // Start live updates
            this.startLiveUpdates();
        },

        calculateGrowth() {
            const now = Date.now();
            const elapsed = now - this.data.lastUpdated;
            const daysElapsed = elapsed / (1000 * 60 * 60 * 24);

            // Growth rates
            const resumesRate = 1200; // per day
            const analysesRate = 800; // per day

            // Add growth
            if (daysElapsed > 0) {
                this.data.resumesAnalyzed += Math.floor(resumesRate * daysElapsed);
                this.data.analysesToday += Math.floor(analysesRate * daysElapsed); // Resets daily in real app, but we simulate continuous growth for user request
                this.data.lastUpdated = now;
                this.save();
            }
        },

        async save() {
            await SecureStorage.setItem(this.STORAGE_KEY, this.data);
        },

        startLiveUpdates() {
            // Initial render
            this.updateDOM();

            // Periodic increments
            setInterval(() => {
                // Randomly increment Active Users
                if (Math.random() > 0.4) {
                    this.data.activeUsers += Math.random() > 0.5 ? 1 : -1;
                    if (this.data.activeUsers < 100) this.data.activeUsers = 100;
                }

                // Incremental growth for others
                if (Math.random() > 0.8) {
                    this.data.resumesAnalyzed++;
                }
                if (Math.random() > 0.7) {
                    this.data.analysesToday++;
                }

                this.updateDOM();
                this.save();
            }, 2500);
        },

        updateDOM() {
            // Stats Section
            const resumesEl = document.getElementById('liveVisitorCount');
            const analysesEl = document.getElementById('analysisCount');
            const activeEl = document.getElementById('activeUsers');
            const widgetCounterEl = document.getElementById('activeUserCount');

            if (resumesEl) {
                // Format: 50K+ or exact number if above
                const val = this.data.resumesAnalyzed;
                const formatted = val > 99999 ? (val / 1000).toFixed(0) + 'K+' : val.toLocaleString();
                resumesEl.textContent = formatted;
                // Add exact number to title for hover
                resumesEl.title = val.toLocaleString();
            }

            if (analysesEl) analysesEl.textContent = this.data.analysesToday.toLocaleString();

            if (activeEl) activeEl.textContent = this.data.activeUsers.toLocaleString();
            if (widgetCounterEl) widgetCounterEl.textContent = this.data.activeUsers.toLocaleString();
        }
    };

    // ==========================================
    // COOKIE CONSENT MODULE
    // ==========================================
    const CookieConsent = {
        consentKey: '_rr_cookie_consent',

        hasConsent() {
            return localStorage.getItem(this.consentKey) === 'accepted';
        },

        isDeclined() {
            return localStorage.getItem(this.consentKey) === 'declined';
        },

        needsConsent() {
            return !localStorage.getItem(this.consentKey);
        },

        accept() {
            localStorage.setItem(this.consentKey, 'accepted');
            this.hideBanner();
            this.enableTracking();
        },

        decline() {
            localStorage.setItem(this.consentKey, 'declined');
            this.hideBanner();
            this.disableTracking();
        },

        hideBanner() {
            const banner = document.getElementById('cookieConsentBanner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => banner.style.display = 'none', 300);
            }
        },

        showBanner() {
            const banner = document.getElementById('cookieConsentBanner');
            if (banner) {
                banner.style.display = 'flex';
                setTimeout(() => banner.classList.add('show'), 10);
            }
        },

        enableTracking() {
            console.log('Tracking enabled with user consent');
        },

        disableTracking() {
            console.log('Tracking disabled per user preference');
        },

        init() {
            if (this.needsConsent()) {
                this.showBanner();
            } else if (this.hasConsent()) {
                this.enableTracking();
            }
        }
    };

    // ==========================================
    // DATE/TIME/LOCATION WIDGET
    // ==========================================
    const DateTimeWidget = {
        element: null,
        locationData: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },

        init() {
            this.element = document.getElementById('datetimeWidget');
            if (!this.element) return;

            this.updateDateTime();
            setInterval(() => this.updateDateTime(), 1000);

            this.initLocation();
            this.initDragAndDrop();

            // Ensure container exists for user counter (managed by StatsManager now, but structure needed)
            if (!document.getElementById('widgetUserCounter')) {
                const counterEl = document.createElement('div');
                counterEl.className = 'widget-user-counter';
                counterEl.id = 'widgetUserCounter';
                counterEl.innerHTML = `<span class="pulse-dot"></span> <span id="activeUserCount">0</span> Live Users`;

                // Insert before location or append
                const loc = document.getElementById('widgetLocation');
                if (loc) {
                    this.element.insertBefore(counterEl, loc.nextSibling);
                } else {
                    this.element.appendChild(counterEl);
                }
            }

            // Wrap contents for better resize handling
            if (!this.element.querySelector('.widget-content-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'widget-content-wrapper';
                while (this.element.firstChild) {
                    wrapper.appendChild(this.element.firstChild);
                }
                this.element.appendChild(wrapper);
            }
        },

        updateDateTime() {
            const now = new Date();
            const dateEl = document.getElementById('widgetDate');
            const timeEl = document.getElementById('widgetTime');

            if (dateEl) {
                const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
                dateEl.textContent = now.toLocaleDateString('en-US', options);
            }

            if (timeEl) {
                const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                timeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);
            }
        },

        initLocation() {
            const locationEl = document.getElementById('widgetLocation');
            if (!locationEl) return;

            if (navigator.geolocation) {
                locationEl.innerHTML = 'Asking permission...';
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const resp = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
                            const data = await resp.json();
                            this.displayLocation(data.city, data.countryCode);
                        } catch (e) {
                            this.displayLocation(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`, 'GPS');
                        }
                    },
                    (error) => {
                        console.log('Geolocation permission denied or error, falling back to IP');
                        this.detectIPLocation();
                    }
                );
            } else {
                this.detectIPLocation();
            }
        },

        async detectIPLocation() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (response.ok) {
                    const data = await response.json();
                    this.displayLocation(data.city, data.country_code);
                } else {
                    document.getElementById('widgetLocation').textContent = 'Location unavailable';
                }
            } catch (e) {
                document.getElementById('widgetLocation').textContent = 'Location unavailable';
            }
        },

        displayLocation(city, country) {
            const locationEl = document.getElementById('widgetLocation');
            if (locationEl) {
                locationEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${city}, ${country}`;
            }
        },

        initDragAndDrop() {
            const el = this.element;
            if (!el) return;

            // Auto-scale text on resize
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const width = entry.contentRect.width;
                    // Base size 160px -> 1rem. Scale accordingly.
                    const scale = width / 160;
                    const newSize = Math.max(0.7, Math.min(scale, 2.5)); // Min 0.7rem, Max 2.5rem

                    el.style.fontSize = `${newSize}rem`;

                    // Adjust sub-elements if needed
                    const timeEl = document.getElementById('widgetTime');
                    if (timeEl) timeEl.style.fontSize = `${newSize * 1.25}rem`;
                }
            });
            resizeObserver.observe(el);

            el.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

                const rect = el.getBoundingClientRect();
                const isResizeZone = (e.clientX > rect.right - 20) && (e.clientY > rect.bottom - 20);
                if (isResizeZone) return;

                this.isDragging = true;

                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;

                el.style.cursor = 'grabbing';
                el.style.transition = 'none';
            });

            // Auto-hide after 10 seconds
            setTimeout(() => {
                el.style.transition = 'opacity 1s ease, transform 1s ease';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none'; // Prevent interaction when hidden
            }, 10000); // 10 seconds

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;

                e.preventDefault();

                let x = e.clientX - this.dragOffset.x;
                let y = e.clientY - this.dragOffset.y;

                const rect = el.getBoundingClientRect();
                const winWidth = window.innerWidth;
                const winHeight = window.innerHeight;

                if (x < 0) x = 0;
                if (y < 0) y = 0;
                if (x + rect.width > winWidth) x = winWidth - rect.width;
                if (y + rect.height > winHeight) y = winHeight - rect.height;

                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    el.style.cursor = 'move';
                    el.style.transition = 'transform 0.1s';
                }
            });
        }
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    async function initSecurity() {
        await SecureStorage.init();

        // Initialize independent modules
        CookieConsent.init();
        DateTimeWidget.init();
        StatsManager.init(); // New Stats Init

        window.SecureStorage = SecureStorage;
        window.CookieConsent = CookieConsent;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

})();
