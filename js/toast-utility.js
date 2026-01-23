// Global Toast Utility
// Must be loaded before other scripts that use it

window.showToast = function (message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) {
        console.warn('Toast elements not found');
        console.log(message); // Fallback to console
        return;
    }

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
};

// Initialize on DOM load
console.log('Toast utility loaded');
