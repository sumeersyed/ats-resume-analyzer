// Templates Gallery Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initTemplatesPage();
});

function initTemplatesPage() {
    renderTemplates('all');
    initFilters();
    initMobileMenu();
}

// Render template cards
function renderTemplates(category) {
    const grid = document.getElementById('templatesGrid');
    const countEl = document.getElementById('templatesCount');

    if (!grid) return;

    const templates = category === 'all'
        ? getAllTemplates()
        : getTemplatesByCategory(category);

    if (countEl) {
        countEl.textContent = templates.length;
    }

    if (templates.length === 0) {
        grid.innerHTML = `
            <div class="templates-empty">
                <div class="templates-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                </div>
                <h3>No templates found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = templates.map(template => createTemplateCard(template)).join('');

    // Add click handlers
    grid.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.template;
            window.location.href = `builder.html?template=${templateId}`;
        });
    });
}

// Create template card HTML
function createTemplateCard(template) {
    const atsClass = template.atsScore >= 90 ? 'high' : template.atsScore >= 80 ? 'medium' : 'low';

    return `
        <div class="template-card" data-template="${template.id}" data-category="${template.category}">
            <div class="template-card-preview">
                <div class="ats-badge ${atsClass}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    ATS ${template.atsScore}%
                </div>
                ${generateTemplatePreview(template)}
                <button class="template-use-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Use Template
                </button>
            </div>
            <div class="template-card-info">
                <div class="template-card-header">
                    <h3 class="template-card-name">${template.name}</h3>
                    <span class="template-card-category">${template.category}</span>
                </div>
                <p class="template-card-description">${template.description}</p>
            </div>
        </div>
    `;
}

// Generate template preview based on layout
function generateTemplatePreview(template) {
    const colors = template.colors;
    const layout = template.layout;

    let headerStyle = '';
    if (template.styles.headerStyle === 'gradient') {
        headerStyle = `background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.accent});`;
    } else if (template.styles.headerStyle === 'centered') {
        headerStyle = `background: ${colors.background}; color: ${colors.primary}; border-bottom: 2px solid ${colors.secondary};`;
    } else {
        headerStyle = `background: ${colors.primary};`;
    }

    let bodyClass = '';
    if (layout.includes('two-column')) {
        bodyClass = 'two-column';
    } else if (layout.includes('timeline')) {
        bodyClass = 'timeline';
    }

    return `
        <div class="template-preview-mini" style="--primary: ${colors.primary}; --accent: ${colors.accent};">
            <div class="preview-header-mini" style="${headerStyle}">
                <div class="preview-name-mini" style="${template.styles.headerStyle === 'centered' ? `color: ${colors.primary}` : ''}">Your Name</div>
                <div class="preview-title-mini" style="${template.styles.headerStyle === 'centered' ? `color: ${colors.muted}` : ''}">Job Title</div>
            </div>
            <div class="preview-body-mini ${bodyClass}" style="--primary: ${colors.primary};">
                <div class="preview-section-mini">
                    <div class="preview-section-title-mini" style="color: ${colors.primary};">Experience</div>
                    <div class="preview-lines-mini">
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                        <div class="preview-line"></div>
                    </div>
                </div>
                <div class="preview-section-mini">
                    <div class="preview-section-title-mini" style="color: ${colors.primary};">Education</div>
                    <div class="preview-lines-mini">
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                    </div>
                </div>
                ${layout.includes('two-column') ? '' : `
                <div class="preview-section-mini">
                    <div class="preview-section-title-mini" style="color: ${colors.primary};">Skills</div>
                    <div class="preview-lines-mini">
                        <div class="preview-line short"></div>
                    </div>
                </div>
                `}
            </div>
        </div>
    `;
}

// Initialize filter tabs
function initFilters() {
    const tabs = document.querySelectorAll('.filter-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Render filtered templates
            const category = tab.dataset.category;
            renderTemplates(category);
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
