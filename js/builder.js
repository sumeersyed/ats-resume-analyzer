// Resume Builder Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initBuilder();
});

function initBuilder() {
    // State
    let resumeData = loadFromStorage() || {
        template: 'modern',
        personal: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: []
    };

    let zoomLevel = 100;

    // DOM Elements
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomLevelEl = document.getElementById('zoomLevel');

    // Initialize
    initTemplateSelector();
    initPersonalInfo();
    initSummary();
    initExperience();
    initEducation();
    initSkills();
    initCertifications();
    initProjects();
    initZoomControls();

    // Update preview with initial data
    updatePreview();

    // Save button
    saveBtn.addEventListener('click', () => {
        saveToStorage();
        showToast('Resume saved successfully!');
    });

    // Download button
    downloadBtn.addEventListener('click', () => {
        downloadPDF();
    });

    // Template Selector
    function initTemplateSelector() {
        const templateOptions = document.querySelectorAll('.template-option');

        templateOptions.forEach(option => {
            if (option.dataset.template === resumeData.template) {
                option.classList.add('active');
            }

            option.addEventListener('click', () => {
                templateOptions.forEach(o => o.classList.remove('active'));
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
        resumeTemplate.className = `resume-template template-${resumeData.template}`;
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
                }, 300));
            }
        });
    }

    // Summary
    function initSummary() {
        const summaryInput = document.getElementById('summary');
        const summaryCount = document.getElementById('summaryCount');

        summaryInput.value = resumeData.summary || '';
        summaryCount.textContent = summaryInput.value.length;

        summaryInput.addEventListener('input', debounce(() => {
            resumeData.summary = summaryInput.value;
            summaryCount.textContent = summaryInput.value.length;
            updatePreview();
            saveToStorage();
        }, 300));
    }

    // Experience
    function initExperience() {
        const container = document.getElementById('experienceEntries');
        const addBtn = document.getElementById('addExperience');

        // Render existing entries
        renderExperienceEntries();

        addBtn.addEventListener('click', () => {
            resumeData.experience.push({
                id: Date.now(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            });
            renderExperienceEntries();
            saveToStorage();
        });
    }

    function renderExperienceEntries() {
        const container = document.getElementById('experienceEntries');

        container.innerHTML = resumeData.experience.map((exp, index) => `
            <div class="entry-card" data-id="${exp.id}">
                <div class="entry-header">
                    <h4>Experience ${index + 1}</h4>
                    <button class="remove-entry" onclick="removeExperience(${exp.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" value="${exp.title || ''}" onchange="updateExperience(${exp.id}, 'title', this.value)" placeholder="Software Engineer">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" value="${exp.company || ''}" onchange="updateExperience(${exp.id}, 'company', this.value)" placeholder="Company Name">
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" value="${exp.startDate || ''}" onchange="updateExperience(${exp.id}, 'startDate', this.value)" placeholder="Jan 2020">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" value="${exp.endDate || ''}" onchange="updateExperience(${exp.id}, 'endDate', this.value)" placeholder="Present">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="3" onchange="updateExperience(${exp.id}, 'description', this.value)" placeholder="• Led development of key features&#10;• Improved performance by 40%">${exp.description || ''}</textarea>
                </div>
            </div>
        `).join('');
    }

    // Global functions for experience (needed for inline event handlers)
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
        updatePreview();
        saveToStorage();
    };

    // Education
    function initEducation() {
        const addBtn = document.getElementById('addEducation');

        renderEducationEntries();

        addBtn.addEventListener('click', () => {
            resumeData.education.push({
                id: Date.now(),
                degree: '',
                school: '',
                location: '',
                graduationDate: '',
                gpa: ''
            });
            renderEducationEntries();
            saveToStorage();
        });
    }

    function renderEducationEntries() {
        const container = document.getElementById('educationEntries');

        container.innerHTML = resumeData.education.map((edu, index) => `
            <div class="entry-card" data-id="${edu.id}">
                <div class="entry-header">
                    <h4>Education ${index + 1}</h4>
                    <button class="remove-entry" onclick="removeEducation(${edu.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree</label>
                        <input type="text" value="${edu.degree || ''}" onchange="updateEducation(${edu.id}, 'degree', this.value)" placeholder="Bachelor of Science in Computer Science">
                    </div>
                    <div class="form-group">
                        <label>School</label>
                        <input type="text" value="${edu.school || ''}" onchange="updateEducation(${edu.id}, 'school', this.value)" placeholder="University Name">
                    </div>
                    <div class="form-group">
                        <label>Graduation Date</label>
                        <input type="text" value="${edu.graduationDate || ''}" onchange="updateEducation(${edu.id}, 'graduationDate', this.value)" placeholder="May 2020">
                    </div>
                    <div class="form-group">
                        <label>GPA (optional)</label>
                        <input type="text" value="${edu.gpa || ''}" onchange="updateEducation(${edu.id}, 'gpa', this.value)" placeholder="3.8/4.0">
                    </div>
                </div>
            </div>
        `).join('');
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
        updatePreview();
        saveToStorage();
    };

    // Skills
    function initSkills() {
        const skillInput = document.getElementById('skillInput');
        const skillsTags = document.getElementById('skillsTags');

        renderSkillTags();

        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && skillInput.value.trim()) {
                e.preventDefault();
                const skill = skillInput.value.trim();
                if (!resumeData.skills.includes(skill)) {
                    resumeData.skills.push(skill);
                    renderSkillTags();
                    updatePreview();
                    saveToStorage();
                }
                skillInput.value = '';
            }
        });
    }

    function renderSkillTags() {
        const skillsTags = document.getElementById('skillsTags');

        skillsTags.innerHTML = resumeData.skills.map(skill => `
            <span class="skill-tag">
                ${skill}
                <button onclick="removeSkill('${skill}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </span>
        `).join('');
    }

    window.removeSkill = (skill) => {
        resumeData.skills = resumeData.skills.filter(s => s !== skill);
        renderSkillTags();
        updatePreview();
        saveToStorage();
    };

    // Certifications
    function initCertifications() {
        const addBtn = document.getElementById('addCertification');

        renderCertificationEntries();

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

    function renderCertificationEntries() {
        const container = document.getElementById('certificationEntries');

        container.innerHTML = resumeData.certifications.map((cert, index) => `
            <div class="entry-card" data-id="${cert.id}">
                <div class="entry-header">
                    <h4>Certification ${index + 1}</h4>
                    <button class="remove-entry" onclick="removeCertification(${cert.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Certification Name</label>
                        <input type="text" value="${cert.name || ''}" onchange="updateCertification(${cert.id}, 'name', this.value)" placeholder="AWS Certified Solutions Architect">
                    </div>
                    <div class="form-group">
                        <label>Issuer</label>
                        <input type="text" value="${cert.issuer || ''}" onchange="updateCertification(${cert.id}, 'issuer', this.value)" placeholder="Amazon Web Services">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="text" value="${cert.date || ''}" onchange="updateCertification(${cert.id}, 'date', this.value)" placeholder="2023">
                    </div>
                </div>
            </div>
        `).join('');
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
        updatePreview();
        saveToStorage();
    };

    // Projects
    function initProjects() {
        const addBtn = document.getElementById('addProject');

        renderProjectEntries();

        addBtn.addEventListener('click', () => {
            resumeData.projects.push({
                id: Date.now(),
                name: '',
                description: '',
                technologies: '',
                link: ''
            });
            renderProjectEntries();
            saveToStorage();
        });
    }

    function renderProjectEntries() {
        const container = document.getElementById('projectEntries');

        container.innerHTML = resumeData.projects.map((proj, index) => `
            <div class="entry-card" data-id="${proj.id}">
                <div class="entry-header">
                    <h4>Project ${index + 1}</h4>
                    <button class="remove-entry" onclick="removeProject(${proj.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" value="${proj.name || ''}" onchange="updateProject(${proj.id}, 'name', this.value)" placeholder="E-commerce Platform">
                    </div>
                    <div class="form-group">
                        <label>Technologies</label>
                        <input type="text" value="${proj.technologies || ''}" onchange="updateProject(${proj.id}, 'technologies', this.value)" placeholder="React, Node.js, MongoDB">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea rows="2" onchange="updateProject(${proj.id}, 'description', this.value)" placeholder="Built a full-stack e-commerce solution with payment integration...">${proj.description || ''}</textarea>
                </div>
            </div>
        `).join('');
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
        updatePreview();
        saveToStorage();
    };

    // Zoom Controls
    function initZoomControls() {
        zoomInBtn.addEventListener('click', () => {
            if (zoomLevel < 150) {
                zoomLevel += 10;
                updateZoom();
            }
        });

        zoomOutBtn.addEventListener('click', () => {
            if (zoomLevel > 50) {
                zoomLevel -= 10;
                updateZoom();
            }
        });
    }

    function updateZoom() {
        zoomLevelEl.textContent = `${zoomLevel}%`;
        const preview = document.getElementById('resumePreview');
        preview.style.transform = `scale(${zoomLevel / 100})`;
    }

    // Preview Update
    function updatePreview() {
        // Personal Info
        document.getElementById('previewName').textContent =
            resumeData.personal.fullName || 'Your Name';
        document.getElementById('previewTitle').textContent =
            resumeData.personal.jobTitle || 'Job Title';

        // Contact
        const contacts = [];
        if (resumeData.personal.email) contacts.push(resumeData.personal.email);
        if (resumeData.personal.phone) contacts.push(resumeData.personal.phone);
        if (resumeData.personal.location) contacts.push(resumeData.personal.location);
        if (resumeData.personal.linkedin) contacts.push(resumeData.personal.linkedin);
        if (resumeData.personal.website) contacts.push(resumeData.personal.website);

        document.getElementById('previewContact').innerHTML =
            contacts.map(c => `<span>${c}</span>`).join('') || '<span>email@example.com</span>';

        // Summary
        const summarySection = document.getElementById('previewSummarySection');
        if (resumeData.summary) {
            summarySection.style.display = 'block';
            document.getElementById('previewSummary').textContent = resumeData.summary;
        } else {
            summarySection.style.display = 'none';
        }

        // Experience
        const expSection = document.getElementById('previewExperienceSection');
        if (resumeData.experience.length > 0) {
            expSection.style.display = 'block';
            document.getElementById('previewExperience').innerHTML = resumeData.experience.map(exp => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div>
                            <h3>${exp.title || 'Job Title'}</h3>
                            <span class="company">${exp.company || 'Company'}</span>
                        </div>
                        <span class="date">${exp.startDate || 'Start'} - ${exp.endDate || 'End'}</span>
                    </div>
                    ${exp.description ? `<p>${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `).join('');
        } else {
            expSection.style.display = 'none';
        }

        // Education
        const eduSection = document.getElementById('previewEducationSection');
        if (resumeData.education.length > 0) {
            eduSection.style.display = 'block';
            document.getElementById('previewEducation').innerHTML = resumeData.education.map(edu => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div>
                            <h3>${edu.degree || 'Degree'}</h3>
                            <span class="school">${edu.school || 'School'}</span>
                        </div>
                        <span class="date">${edu.graduationDate || 'Date'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</span>
                    </div>
                </div>
            `).join('');
        } else {
            eduSection.style.display = 'none';
        }

        // Skills
        const skillsSection = document.getElementById('previewSkillsSection');
        if (resumeData.skills.length > 0) {
            skillsSection.style.display = 'block';
            document.getElementById('previewSkills').innerHTML =
                resumeData.skills.map(skill => `<span>${skill}</span>`).join('');
        } else {
            skillsSection.style.display = 'none';
        }

        // Certifications
        const certSection = document.getElementById('previewCertificationsSection');
        if (resumeData.certifications.length > 0) {
            certSection.style.display = 'block';
            document.getElementById('previewCertifications').innerHTML = resumeData.certifications.map(cert => `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <div>
                            <h3>${cert.name || 'Certification'}</h3>
                            <span class="company">${cert.issuer || 'Issuer'}</span>
                        </div>
                        <span class="date">${cert.date || ''}</span>
                    </div>
                </div>
            `).join('');
        } else {
            certSection.style.display = 'none';
        }

        // Projects
        const projSection = document.getElementById('previewProjectsSection');
        if (resumeData.projects.length > 0) {
            projSection.style.display = 'block';
            document.getElementById('previewProjects').innerHTML = resumeData.projects.map(proj => `
                <div class="resume-entry">
                    <h3>${proj.name || 'Project Name'}${proj.technologies ? ` <small style="font-weight:normal;color:#666">| ${proj.technologies}</small>` : ''}</h3>
                    ${proj.description ? `<p>${proj.description}</p>` : ''}
                </div>
            `).join('');
        } else {
            projSection.style.display = 'none';
        }
    }

    // Storage
    function saveToStorage() {
        try {
            localStorage.setItem('resumeAI_data', JSON.stringify(resumeData));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem('resumeAI_data');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }

    // Toast
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // PDF Download
    function downloadPDF() {
        // Create a printable version
        const resumeContent = document.getElementById('resumeTemplate').cloneNode(true);

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${resumeData.personal.fullName || 'Resume'} - Resume</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        line-height: 1.5;
                        color: #333;
                    }
                    .resume-template {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px;
                    }
                    .resume-header {
                        margin-bottom: 24px;
                        padding-bottom: 16px;
                        border-bottom: 2px solid rgb(139, 92, 246);
                    }
                    .template-modern .resume-header {
                        background: linear-gradient(135deg, rgb(139, 92, 246), rgb(59, 130, 246));
                        color: white;
                        margin: -40px -40px 24px;
                        padding: 40px;
                        border-bottom: none;
                    }
                    .template-classic .resume-header {
                        text-align: center;
                        border-bottom: 1px solid #333;
                    }
                    .template-minimal .resume-header {
                        border-bottom: none;
                    }
                    .resume-name {
                        font-size: 28pt;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    .template-modern .resume-name { color: white; }
                    .resume-title {
                        font-size: 14pt;
                        color: #666;
                        margin-bottom: 12px;
                    }
                    .template-modern .resume-title { color: rgba(255,255,255,0.9); }
                    .resume-contact {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 16px;
                        font-size: 10pt;
                        color: #666;
                    }
                    .template-modern .resume-contact { color: rgba(255,255,255,0.8); }
                    .resume-section { margin-bottom: 20px; }
                    .resume-section h2 {
                        font-size: 12pt;
                        font-weight: 700;
                        color: rgb(139, 92, 246);
                        margin-bottom: 12px;
                        padding-bottom: 4px;
                        border-bottom: 1px solid #e5e5e5;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .template-classic .resume-section h2 { color: #333; border-bottom-color: #333; }
                    .template-minimal .resume-section h2 { border-bottom: none; color: #333; }
                    .resume-entry { margin-bottom: 16px; }
                    .resume-entry-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                    }
                    .resume-entry h3 { font-size: 11pt; font-weight: 600; }
                    .resume-entry .company, .resume-entry .school { font-size: 10pt; color: #666; }
                    .resume-entry .date { font-size: 10pt; color: #888; }
                    .resume-entry p { font-size: 10pt; color: #444; }
                    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
                    .skills-list span {
                        background: rgba(139, 92, 246, 0.1);
                        color: rgb(139, 92, 246);
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10pt;
                    }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                ${resumeContent.outerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
