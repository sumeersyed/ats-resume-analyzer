/**
 * Zume Security & Privacy Module
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


    // ==========================================
    // INITIALIZATION
    // ==========================================
    async function initSecurity() {
        await SecureStorage.init();

        // Initialize independent modules
        CookieConsent.init();
        // DateTimeWidget.init(); // Removed
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

