// Resume Builder V2 - Complete JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initBuilderV2();
});

function initBuilderV2() {
    // Check for template in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlTemplate = urlParams.get('template');

    // State
    let resumeData = loadFromStorage() || {
        template: urlTemplate || 'modern',
        personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', website: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: []
    };

    // If URL has template, override stored template
    if (urlTemplate && typeof RESUME_TEMPLATES !== 'undefined' && RESUME_TEMPLATES[urlTemplate]) {
        resumeData.template = urlTemplate;
    }

    let zoomLevel = 70; // Start smaller to fit better
    let currentSection = 'personal';

    // Cache DOM elements
    const elements = {
        saveBtn: document.getElementById('saveBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        zoomIn: document.getElementById('zoomIn'),
        zoomOut: document.getElementById('zoomOut'),
        zoomLevel: document.getElementById('zoomLevel'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        undoBtn: document.getElementById('undoBtn'),
        redoBtn: document.getElementById('redoBtn'),
        aiSummaryBtn: document.getElementById('aiSummaryBtn'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        resumePreview: document.getElementById('resumePreview'),
        checkAtsBtn: document.getElementById('checkAtsBtn'),
        atsScoreValue: document.getElementById('atsScoreValue'),
        templateNameBadge: document.getElementById('templateNameBadge'),
        templatePills: document.getElementById('templatePills')
    };

    // Initialize all modules
    initSidebarNav();
    initTemplateSelector();
    initPersonalInfo();
    initSummary();
    initExperience();
    initEducation();
    initSkills();
    initCertifications();
    initProjects();
    initZoomControls();
    initActionButtons();
    initAIAssist();
    initATSChecker();
    renderTemplatePills();
    updatePreview();
    updateZoom();
    updateATSScore();

    // Sidebar Navigation
    function initSidebarNav() {
        const navItems = document.querySelectorAll('.sidebar-nav-item');
        const sections = document.querySelectorAll('.form-section-v2');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.dataset.section;

                // Update active nav
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                // Scroll to section
                const targetSection = document.getElementById(`section-${sectionId}`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                currentSection = sectionId;
            });
        });
    }

    // Template Selector
    function initTemplateSelector() {
        const pills = document.querySelectorAll('.template-pill');
        const options = document.querySelectorAll('.template-option');

        // Handle pill clicks
        pills.forEach(pill => {
            if (pill.dataset.template === resumeData.template) {
                pill.classList.add('active');
            }
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                resumeData.template = pill.dataset.template;
                updateTemplateStyle();
                saveToStorage();
            });
        });

        // Handle option clicks (if they exist from old UI)
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                resumeData.template = option.dataset.template;
                updateTemplateStyle();
                saveToStorage();
            });
        });

        updateTemplateStyle();
    }

    function updateTemplateStyle() {
        const resumeTemplate = document.getElementById('resumeTemplate');
        if (resumeTemplate) {
            resumeTemplate.className = `resume-template template-${resumeData.template}`;
        }

        // Update template name badge
        if (elements.templateNameBadge && typeof RESUME_TEMPLATES !== 'undefined') {
            const template = RESUME_TEMPLATES[resumeData.template];
            if (template) {
                elements.templateNameBadge.textContent = template.name;
            } else {
                elements.templateNameBadge.textContent = resumeData.template.charAt(0).toUpperCase() + resumeData.template.slice(1);
            }
        }

        // Update active pill
        const pills = document.querySelectorAll('.template-pill');
        pills.forEach(pill => {
            if (pill.dataset.template === resumeData.template) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    // Render template pills dynamically
    function renderTemplatePills() {
        if (!elements.templatePills || typeof RESUME_TEMPLATES === 'undefined') return;

        const templates = Object.values(RESUME_TEMPLATES);
        elements.templatePills.innerHTML = templates.map(template => `
            <button class="template-pill ${template.id === resumeData.template ? 'active' : ''}" 
                    data-template="${template.id}" 
                    title="${template.name} - ATS ${template.atsScore}%">
                <span class="pill-preview" style="--pill-color: ${template.colors.primary}"></span>
                ${template.name.length > 12 ? template.name.substring(0, 12) + '...' : template.name}
            </button>
        `).join('');

        // Add click handlers
        elements.templatePills.querySelectorAll('.template-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                resumeData.template = pill.dataset.template;
                updateTemplateStyle();
                updateATSScore();
                saveToStorage();
                showToast(`Switched to ${RESUME_TEMPLATES[pill.dataset.template]?.name || pill.dataset.template} template`);
            });
        });
    }

    // ATS Score Checker
    function initATSChecker() {
        if (elements.checkAtsBtn) {
            elements.checkAtsBtn.addEventListener('click', () => {
                updateATSScore();
                showATSFeedback();
            });
        }
    }

    function updateATSScore() {
        if (!elements.atsScoreValue || typeof calculateATSScore === 'undefined') return;

        const result = calculateATSScore(resumeData);
        elements.atsScoreValue.textContent = result.score;

        // Update widget color based on score
        const widget = document.getElementById('atsScoreWidget');
        if (widget) {
            widget.classList.remove('high', 'medium', 'low');
            if (result.score >= 80) widget.classList.add('high');
            else if (result.score >= 60) widget.classList.add('medium');
            else widget.classList.add('low');
        }
    }

    function showATSFeedback() {
        if (typeof calculateATSScore === 'undefined') {
            showToast('ATS scoring not available');
            return;
        }

        const result = calculateATSScore(resumeData);

        if (result.factors.length === 0) {
            showToast(`🎉 Excellent! Your resume scores ${result.score}% - ${result.grade}`);
        } else {
            const topTip = result.factors[0];
            showToast(`Score: ${result.score}% (${result.grade}) - Tip: ${topTip}`);
        }
    }

    // Personal Information
    function initPersonalInfo() {
        const fields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin', 'website'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = resumeData.personal[field] || '';
                input.addEventListener('input', debounce(() => {
                    resumeData.personal[field] = input.value;
                    updatePreview();
                    saveToStorage();
                    updateCompletionBadge();
                }, 200));
            }
        });
        updateCompletionBadge();
    }

    function updateCompletionBadge() {
        const badge = document.querySelector('.completion-badge');
        if (badge) {
            const filled = Object.values(resumeData.personal).filter(v => v.trim()).length;
            badge.textContent = `${filled} of 7 fields`;
        }
    }

    // Summary
    function initSummary() {
        const summaryInput = document.getElementById('summary');
        const summaryCount = document.getElementById('summaryCount');

        if (summaryInput) {
            summaryInput.value = resumeData.summary || '';
            if (summaryCount) summaryCount.textContent = summaryInput.value.length;

            summaryInput.addEventListener('input', debounce(() => {
                resumeData.summary = summaryInput.value;
                if (summaryCount) summaryCount.textContent = summaryInput.value.length;
                updatePreview();
                saveToStorage();
            }, 200));
        }
    }

    // Experience
    function initExperience() {
        const addBtn = document.getElementById('addExperience');
        renderExperienceEntries();

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                resumeData.experience.push({
                    id: Date.now(),
                    title: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                });
                renderExperienceEntries();
                saveToStorage();
            });
        }
    }

    function renderExperienceEntries() {
        const container = document.getElementById('experienceEntries');
        if (!container) return;

        if (resumeData.experience.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                    </div>
                    <p>No work experience added yet</p>
                    <span>Click "Add Position" to get started</span>
                </div>
            `;
            updatePreview();
            return;
        }

        container.innerHTML = resumeData.experience.map((exp, index) => `
            <div class="entry-card-v2" data-id="${exp.id}">
                <div class="entry-header-v2">
                    <div class="entry-number">
                        <span class="entry-badge">${index + 1}</span>
                        <h4>Experience</h4>
                    </div>
                    <button class="remove-entry-v2" onclick="window.removeExperience(${exp.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-fields">
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Job Title</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                                <input type="text" value="${exp.title || ''}" onchange="window.updateExperience(${exp.id}, 'title', this.value)" placeholder="Software Engineer">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">Company</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                </svg>
                                <input type="text" value="${exp.company || ''}" onchange="window.updateExperience(${exp.id}, 'company', this.value)" placeholder="Company Name">
                            </div>
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Start Date</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                </svg>
                                <input type="text" value="${exp.startDate || ''}" onchange="window.updateExperience(${exp.id}, 'startDate', this.value)" placeholder="Jan 2020">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">End Date</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                </svg>
                                <input type="text" value="${exp.endDate || ''}" onchange="window.updateExperience(${exp.id}, 'endDate', this.value)" placeholder="Present">
                            </div>
                        </div>
                    </div>
                    <div class="field-group textarea-group">
                        <label><span class="label-text">Description</span></label>
                        <div class="textarea-wrapper">
                            <textarea rows="3" onchange="window.updateExperience(${exp.id}, 'description', this.value)" placeholder="• Led development team&#10;• Improved performance by 40%">${exp.description || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        updatePreview();
    }

    window.updateExperience = (id, field, value) => {
        const exp = resumeData.experience.find(e => e.id === id);
        if (exp) {
            exp[field] = value;
            updatePreview();
            saveToStorage();
        }
    };

    window.removeExperience = (id) => {
        resumeData.experience = resumeData.experience.filter(e => e.id !== id);
        renderExperienceEntries();
        saveToStorage();
    };

    // Education
    function initEducation() {
        const addBtn = document.getElementById('addEducation');
        renderEducationEntries();

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                resumeData.education.push({
                    id: Date.now(),
                    degree: '',
                    school: '',
                    graduationDate: '',
                    gpa: ''
                });
                renderEducationEntries();
                saveToStorage();
            });
        }
    }

    function renderEducationEntries() {
        const container = document.getElementById('educationEntries');
        if (!container) return;

        if (resumeData.education.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <p>No education added yet</p>
                    <span>Click "Add Education" to get started</span>
                </div>
            `;
            updatePreview();
            return;
        }

        container.innerHTML = resumeData.education.map((edu, index) => `
            <div class="entry-card-v2" data-id="${edu.id}">
                <div class="entry-header-v2">
                    <div class="entry-number">
                        <span class="entry-badge">${index + 1}</span>
                        <h4>Education</h4>
                    </div>
                    <button class="remove-entry-v2" onclick="window.removeEducation(${edu.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-fields">
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Degree</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                </svg>
                                <input type="text" value="${edu.degree || ''}" onchange="window.updateEducation(${edu.id}, 'degree', this.value)" placeholder="Bachelor of Science">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">School</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                </svg>
                                <input type="text" value="${edu.school || ''}" onchange="window.updateEducation(${edu.id}, 'school', this.value)" placeholder="University Name">
                            </div>
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Graduation Date</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                                </svg>
                                <input type="text" value="${edu.graduationDate || ''}" onchange="window.updateEducation(${edu.id}, 'graduationDate', this.value)" placeholder="May 2020">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">GPA (optional)</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                                <input type="text" value="${edu.gpa || ''}" onchange="window.updateEducation(${edu.id}, 'gpa', this.value)" placeholder="3.8/4.0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        updatePreview();
    }

    window.updateEducation = (id, field, value) => {
        const edu = resumeData.education.find(e => e.id === id);
        if (edu) {
            edu[field] = value;
            updatePreview();
            saveToStorage();
        }
    };

    window.removeEducation = (id) => {
        resumeData.education = resumeData.education.filter(e => e.id !== id);
        renderEducationEntries();
        saveToStorage();
    };

    // Skills
    function initSkills() {
        const skillInput = document.getElementById('skillInput');
        const suggestions = document.querySelectorAll('.skill-suggestion');

        renderSkillTags();

        if (skillInput) {
            skillInput.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ',') && skillInput.value.trim()) {
                    e.preventDefault();
                    addSkill(skillInput.value.trim().replace(',', ''));
                    skillInput.value = '';
                }
            });
        }

        suggestions.forEach(btn => {
            btn.addEventListener('click', () => {
                addSkill(btn.dataset.skill);
            });
        });
    }

    function addSkill(skill) {
        if (skill && !resumeData.skills.includes(skill)) {
            resumeData.skills.push(skill);
            renderSkillTags();
            updatePreview();
            saveToStorage();
        }
    }

    function renderSkillTags() {
        const container = document.getElementById('skillsTags');
        if (!container) return;

        container.innerHTML = resumeData.skills.map(skill => `
            <span class="skill-tag-v2">
                ${skill}
                <button onclick="window.removeSkill('${skill.replace(/'/g, "\\'")}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </span>
        `).join('');

        updatePreview();
    }

    window.removeSkill = (skill) => {
        resumeData.skills = resumeData.skills.filter(s => s !== skill);
        renderSkillTags();
        saveToStorage();
    };

    // Certifications
    function initCertifications() {
        const addBtn = document.getElementById('addCertification');
        renderCertificationEntries();

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                resumeData.certifications.push({
                    id: Date.now(),
                    name: '',
                    issuer: '',
                    date: ''
                });
                renderCertificationEntries();
                saveToStorage();
            });
        }
    }

    function renderCertificationEntries() {
        const container = document.getElementById('certificationEntries');
        if (!container) return;

        if (resumeData.certifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                    </div>
                    <p>No certifications added yet</p>
                    <span>Click "Add Certification" to get started</span>
                </div>
            `;
            updatePreview();
            return;
        }

        container.innerHTML = resumeData.certifications.map((cert, index) => `
            <div class="entry-card-v2" data-id="${cert.id}">
                <div class="entry-header-v2">
                    <div class="entry-number">
                        <span class="entry-badge">${index + 1}</span>
                        <h4>Certification</h4>
                    </div>
                    <button class="remove-entry-v2" onclick="window.removeCertification(${cert.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-fields">
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Certification Name</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="8" r="7"/>
                                </svg>
                                <input type="text" value="${cert.name || ''}" onchange="window.updateCertification(${cert.id}, 'name', this.value)" placeholder="AWS Solutions Architect">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">Issuer</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                </svg>
                                <input type="text" value="${cert.issuer || ''}" onchange="window.updateCertification(${cert.id}, 'issuer', this.value)" placeholder="Amazon Web Services">
                            </div>
                        </div>
                    </div>
                    <div class="field-row single">
                        <div class="field-group">
                            <label><span class="label-text">Date</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                                </svg>
                                <input type="text" value="${cert.date || ''}" onchange="window.updateCertification(${cert.id}, 'date', this.value)" placeholder="2023">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        updatePreview();
    }

    window.updateCertification = (id, field, value) => {
        const cert = resumeData.certifications.find(c => c.id === id);
        if (cert) {
            cert[field] = value;
            updatePreview();
            saveToStorage();
        }
    };

    window.removeCertification = (id) => {
        resumeData.certifications = resumeData.certifications.filter(c => c.id !== id);
        renderCertificationEntries();
        saveToStorage();
    };

    // Projects
    function initProjects() {
        const addBtn = document.getElementById('addProject');
        renderProjectEntries();

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                resumeData.projects.push({
                    id: Date.now(),
                    name: '',
                    technologies: '',
                    description: ''
                });
                renderProjectEntries();
                saveToStorage();
            });
        }
    }

    function renderProjectEntries() {
        const container = document.getElementById('projectEntries');
        if (!container) return;

        if (resumeData.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <p>No projects added yet</p>
                    <span>Click "Add Project" to get started</span>
                </div>
            `;
            updatePreview();
            return;
        }

        container.innerHTML = resumeData.projects.map((proj, index) => `
            <div class="entry-card-v2" data-id="${proj.id}">
                <div class="entry-header-v2">
                    <div class="entry-number">
                        <span class="entry-badge">${index + 1}</span>
                        <h4>Project</h4>
                    </div>
                    <button class="remove-entry-v2" onclick="window.removeProject(${proj.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-fields">
                    <div class="field-row">
                        <div class="field-group">
                            <label><span class="label-text">Project Name</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                                </svg>
                                <input type="text" value="${proj.name || ''}" onchange="window.updateProject(${proj.id}, 'name', this.value)" placeholder="E-commerce Platform">
                            </div>
                        </div>
                        <div class="field-group">
                            <label><span class="label-text">Technologies</span></label>
                            <div class="input-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                                </svg>
                                <input type="text" value="${proj.technologies || ''}" onchange="window.updateProject(${proj.id}, 'technologies', this.value)" placeholder="React, Node.js">
                            </div>
                        </div>
                    </div>
                    <div class="field-group textarea-group">
                        <label><span class="label-text">Description</span></label>
                        <div class="textarea-wrapper">
                            <textarea rows="2" onchange="window.updateProject(${proj.id}, 'description', this.value)" placeholder="Built a full-stack e-commerce solution...">${proj.description || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        updatePreview();
    }

    window.updateProject = (id, field, value) => {
        const proj = resumeData.projects.find(p => p.id === id);
        if (proj) {
            proj[field] = value;
            updatePreview();
            saveToStorage();
        }
    };

    window.removeProject = (id) => {
        resumeData.projects = resumeData.projects.filter(p => p.id !== id);
        renderProjectEntries();
        saveToStorage();
    };

    // Zoom Controls
    function initZoomControls() {
        if (elements.zoomIn) {
            elements.zoomIn.addEventListener('click', () => {
                if (zoomLevel < 120) {
                    zoomLevel += 10;
                    updateZoom();
                }
            });
        }

        if (elements.zoomOut) {
            elements.zoomOut.addEventListener('click', () => {
                if (zoomLevel > 40) {
                    zoomLevel -= 10;
                    updateZoom();
                }
            });
        }

        if (elements.fullscreenBtn) {
            elements.fullscreenBtn.addEventListener('click', () => {
                const preview = document.querySelector('.builder-preview-v2');
                if (preview) {
                    if (!document.fullscreenElement) {
                        preview.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                }
            });
        }
    }

    function updateZoom() {
        if (elements.zoomLevel) {
            elements.zoomLevel.textContent = `${zoomLevel}%`;
        }
        if (elements.resumePreview) {
            elements.resumePreview.style.transform = `scale(${zoomLevel / 100})`;
        }
    }

    // Action Buttons
    function initActionButtons() {
        if (elements.saveBtn) {
            elements.saveBtn.addEventListener('click', () => {
                saveToStorage();
                showToast('Resume saved successfully!');
            });
        }

        if (elements.downloadBtn) {
            elements.downloadBtn.addEventListener('click', downloadPDF);
        }

        if (elements.undoBtn) {
            elements.undoBtn.addEventListener('click', () => {
                showToast('Undo - Coming soon!');
            });
        }

        if (elements.redoBtn) {
            elements.redoBtn.addEventListener('click', () => {
                showToast('Redo - Coming soon!');
            });
        }

        // Toast close button
        const toastClose = document.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => {
                elements.toast.classList.remove('show');
            });
        }
    }

    // AI Assist
    function initAIAssist() {
        if (elements.aiSummaryBtn) {
            elements.aiSummaryBtn.addEventListener('click', openAIModal);
        }

        // Create AI modal if it doesn't exist
        if (!document.getElementById('aiModal')) {
            const modal = document.createElement('div');
            modal.id = 'aiModal';
            modal.className = 'ai-modal-overlay';
            modal.innerHTML = `
                <div class="ai-modal">
                    <div class="ai-modal-header">
                        <div class="ai-modal-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            AI Summary Generator
                        </div>
                        <button class="ai-modal-close" onclick="window.closeAIModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ai-modal-content">
                        <textarea id="aiJobDescription" placeholder="Paste the job description here and we'll generate a tailored professional summary..."></textarea>
                        <div class="ai-modal-actions">
                            <button class="ai-btn-cancel" onclick="window.closeAIModal()">Cancel</button>
                            <button class="ai-btn-generate" onclick="window.generateAISummary()">
                                ✨ Generate Summary
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAIModal();
                }
            });
        }
    }

    function openAIModal() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    window.closeAIModal = () => {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    window.generateAISummary = () => {
        const jobDesc = document.getElementById('aiJobDescription')?.value || '';
        const name = resumeData.personal.fullName || 'Professional';
        const title = resumeData.personal.jobTitle || 'experienced professional';

        // Generate a basic summary (could be enhanced with actual AI API)
        const templates = [
            `Results-driven ${title} with a proven track record of delivering high-impact solutions. Skilled in leveraging technical expertise and collaborative approach to drive innovation and achieve organizational goals.`,
            `Dynamic ${title} with extensive experience in developing scalable solutions. Combines strong technical acumen with excellent communication skills to bridge business needs with technology.`,
            `Accomplished ${title} passionate about creating efficient, user-focused solutions. Demonstrates expertise in modern technologies and best practices to deliver exceptional results.`
        ];

        const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

        const summaryInput = document.getElementById('summary');
        if (summaryInput) {
            summaryInput.value = selectedTemplate;
            resumeData.summary = selectedTemplate;
            const countEl = document.getElementById('summaryCount');
            if (countEl) countEl.textContent = selectedTemplate.length;
            updatePreview();
            saveToStorage();
        }

        closeAIModal();
        showToast('Summary generated! Feel free to customize it.');
    };

    // Preview Update
    function updatePreview() {
        const previewName = document.getElementById('previewName');
        const previewTitle = document.getElementById('previewTitle');
        const previewContact = document.getElementById('previewContact');

        if (previewName) previewName.textContent = resumeData.personal.fullName || 'Your Name';
        if (previewTitle) previewTitle.textContent = resumeData.personal.jobTitle || 'Job Title';

        // Contact
        const contacts = [];
        if (resumeData.personal.email) contacts.push(resumeData.personal.email);
        if (resumeData.personal.phone) contacts.push(resumeData.personal.phone);
        if (resumeData.personal.location) contacts.push(resumeData.personal.location);

        if (previewContact) {
            previewContact.innerHTML = contacts.length > 0
                ? contacts.map(c => `<span>${c}</span>`).join('')
                : '<span>email@example.com</span>';
        }

        // Summary
        const summarySection = document.getElementById('previewSummarySection');
        const previewSummary = document.getElementById('previewSummary');
        if (summarySection && previewSummary) {
            summarySection.style.display = resumeData.summary ? 'block' : 'none';
            previewSummary.textContent = resumeData.summary;
        }

        // Experience
        const expSection = document.getElementById('previewExperienceSection');
        const previewExp = document.getElementById('previewExperience');
        if (expSection && previewExp) {
            expSection.style.display = resumeData.experience.length > 0 ? 'block' : 'none';
            previewExp.innerHTML = resumeData.experience.map(exp => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div><h3>${exp.title || 'Job Title'}</h3><span class="company">${exp.company || 'Company'}</span></div>
                        <span class="date">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</span>
                    </div>
                    ${exp.description ? `<p>${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `).join('');
        }

        // Education
        const eduSection = document.getElementById('previewEducationSection');
        const previewEdu = document.getElementById('previewEducation');
        if (eduSection && previewEdu) {
            eduSection.style.display = resumeData.education.length > 0 ? 'block' : 'none';
            previewEdu.innerHTML = resumeData.education.map(edu => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div><h3>${edu.degree || 'Degree'}</h3><span class="school">${edu.school || 'School'}</span></div>
                        <span class="date">${edu.graduationDate || ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</span>
                    </div>
                </div>
            `).join('');
        }

        // Skills
        const skillsSection = document.getElementById('previewSkillsSection');
        const previewSkills = document.getElementById('previewSkills');
        if (skillsSection && previewSkills) {
            skillsSection.style.display = resumeData.skills.length > 0 ? 'block' : 'none';
            previewSkills.innerHTML = resumeData.skills.map(s => `<span>${s}</span>`).join('');
        }

        // Certifications
        const certSection = document.getElementById('previewCertificationsSection');
        const previewCert = document.getElementById('previewCertifications');
        if (certSection && previewCert) {
            certSection.style.display = resumeData.certifications.length > 0 ? 'block' : 'none';
            previewCert.innerHTML = resumeData.certifications.map(c => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div><h3>${c.name || 'Certification'}</h3><span class="company">${c.issuer || 'Issuer'}</span></div>
                        <span class="date">${c.date || ''}</span>
                    </div>
                </div>
            `).join('');
        }

        // Projects
        const projSection = document.getElementById('previewProjectsSection');
        const previewProj = document.getElementById('previewProjects');
        if (projSection && previewProj) {
            projSection.style.display = resumeData.projects.length > 0 ? 'block' : 'none';
            previewProj.innerHTML = resumeData.projects.map(p => `
                <div class="resume-entry">
                    <h3>${p.name || 'Project'}${p.technologies ? ` <small style="font-weight:normal;color:#666">| ${p.technologies}</small>` : ''}</h3>
                    ${p.description ? `<p>${p.description}</p>` : ''}
                </div>
            `).join('');
        }
    }

    // Storage
    function saveToStorage() {
        try {
            localStorage.setItem('resumeAI_data', JSON.stringify(resumeData));
        } catch (e) {
            console.error('Save failed:', e);
        }
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem('resumeAI_data');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    // Toast
    function showToast(message) {
        if (elements.toast && elements.toastMessage) {
            elements.toastMessage.textContent = message;
            elements.toast.classList.add('show');
            setTimeout(() => elements.toast.classList.remove('show'), 3000);
        }
    }

    // PDF Download
    function downloadPDF() {
        const template = document.getElementById('resumeTemplate');
        if (!template) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resumeData.personal.fullName || 'Resume'}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Inter', -apple-system, sans-serif; line-height: 1.5; color: #333; }
                    .resume-template { max-width: 800px; margin: 0 auto; padding: 40px; }
                    .resume-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid rgb(139,92,246); }
                    .template-modern .resume-header { background: linear-gradient(135deg, rgb(139,92,246), rgb(59,130,246)); color: white; margin: -40px -40px 24px; padding: 40px; border: none; }
                    .resume-name { font-size: 28pt; font-weight: 700; margin-bottom: 4px; }
                    .template-modern .resume-name { color: white; }
                    .resume-title { font-size: 14pt; color: #666; margin-bottom: 12px; }
                    .template-modern .resume-title { color: rgba(255,255,255,0.9); }
                    .resume-contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 10pt; color: #666; }
                    .template-modern .resume-contact { color: rgba(255,255,255,0.8); }
                    .resume-section { margin-bottom: 20px; }
                    .resume-section h2 { font-size: 12pt; font-weight: 700; color: rgb(139,92,246); margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #e5e5e5; text-transform: uppercase; letter-spacing: 0.5px; }
                    .resume-entry { margin-bottom: 16px; }
                    .resume-entry-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
                    .resume-entry h3 { font-size: 11pt; font-weight: 600; }
                    .resume-entry .company, .resume-entry .school { font-size: 10pt; color: #666; }
                    .resume-entry .date { font-size: 10pt; color: #888; }
                    .resume-entry p { font-size: 10pt; color: #444; }
                    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
                    .skills-list span { background: rgba(139,92,246,0.1); color: rgb(139,92,246); padding: 4px 12px; border-radius: 20px; font-size: 10pt; }
                    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
                </style>
            </head>
            <body>${template.outerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }

    // Debounce
    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Resizable Panels
    function initResizablePanels() {
        const resizeHandle = document.getElementById('resizeHandle');
        const formPanel = document.querySelector('.builder-form-v2');
        const previewPanel = document.querySelector('.builder-preview-v2');

        if (!resizeHandle || !formPanel || !previewPanel) return;

        let isResizing = false;
        let startX = 0;
        let startFormWidth = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startFormWidth = formPanel.getBoundingClientRect().width;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            resizeHandle.classList.add('active');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const newFormWidth = startFormWidth + deltaX;
            const containerWidth = document.querySelector('.builder-layout').getBoundingClientRect().width;
            const sidebarWidth = document.querySelector('.builder-sidebar')?.getBoundingClientRect().width || 72;
            const minFormWidth = 300;
            const minPreviewWidth = 350;
            const availableWidth = containerWidth - sidebarWidth - 6; // 6px for handle

            if (newFormWidth >= minFormWidth && (availableWidth - newFormWidth) >= minPreviewWidth) {
                formPanel.style.flex = 'none';
                formPanel.style.width = `${newFormWidth}px`;
                previewPanel.style.width = `${availableWidth - newFormWidth}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                resizeHandle.classList.remove('active');

                // Save panel sizes to localStorage
                localStorage.setItem('builderPanelSizes', JSON.stringify({
                    formWidth: formPanel.style.width,
                    previewWidth: previewPanel.style.width
                }));
            }
        });

        // Restore saved panel sizes
        const savedSizes = localStorage.getItem('builderPanelSizes');
        if (savedSizes) {
            try {
                const sizes = JSON.parse(savedSizes);
                if (sizes.formWidth) {
                    formPanel.style.flex = 'none';
                    formPanel.style.width = sizes.formWidth;
                }
                if (sizes.previewWidth) {
                    previewPanel.style.width = sizes.previewWidth;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    // Initialize resizable panels
    initResizablePanels();

    // Expose close modal
    window.closeAIModal = closeAIModal;
}
