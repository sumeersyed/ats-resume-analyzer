// Template Definitions - 20 Pre-built Resume Templates
// Each template defines layout, colors, fonts, and structure

const RESUME_TEMPLATES = {
    // 1. Double Column - Professional two-column layout
    'double-column': {
        id: 'double-column',
        name: 'Double Column',
        category: 'professional',
        description: 'Clean two-column layout with sidebar for contact and skills',
        atsScore: 92,
        layout: 'two-column',
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#3b82f6',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f8fafc'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'sidebar-left',
            sectionDivider: 'none',
            bulletStyle: 'circle'
        }
    },

    // 2. Ivy League - Academic/prestigious university style
    'ivy-league': {
        id: 'ivy-league',
        name: 'Ivy League',
        category: 'academic',
        description: 'Prestigious academic style with navy and gold accents',
        atsScore: 95,
        layout: 'single-column',
        colors: {
            primary: '#1e3a5f',
            secondary: '#c9a227',
            accent: '#2d5a87',
            text: '#1a1a2e',
            muted: '#4a5568',
            background: '#ffffff',
            sidebar: '#f7f8fa'
        },
        fonts: {
            heading: "'Times New Roman', Georgia, serif",
            body: "'Times New Roman', Georgia, serif"
        },
        styles: {
            headerStyle: 'centered',
            sectionDivider: 'line',
            bulletStyle: 'square'
        }
    },

    // 3. Elegant - Refined with serif fonts
    'elegant': {
        id: 'elegant',
        name: 'Elegant',
        category: 'classic',
        description: 'Refined and sophisticated with beautiful typography',
        atsScore: 90,
        layout: 'single-column',
        colors: {
            primary: '#4a3728',
            secondary: '#8b7355',
            accent: '#d4a574',
            text: '#2d2d2d',
            muted: '#666666',
            background: '#fffefb',
            sidebar: '#faf7f2'
        },
        fonts: {
            heading: "'Playfair Display', Georgia, serif",
            body: "'Lora', Georgia, serif"
        },
        styles: {
            headerStyle: 'elegant-border',
            sectionDivider: 'ornament',
            bulletStyle: 'diamond'
        }
    },

    // 4. Contemporary - Modern sans-serif clean look
    'contemporary': {
        id: 'contemporary',
        name: 'Contemporary',
        category: 'modern',
        description: 'Fresh modern design with clean lines and bold headers',
        atsScore: 94,
        layout: 'single-column',
        colors: {
            primary: '#0f172a',
            secondary: '#475569',
            accent: '#06b6d4',
            text: '#1e293b',
            muted: '#64748b',
            background: '#ffffff',
            sidebar: '#f1f5f9'
        },
        fonts: {
            heading: "'Outfit', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'bold-top',
            sectionDivider: 'thick-line',
            bulletStyle: 'dash'
        }
    },

    // 5. Polished - Executive professional
    'polished': {
        id: 'polished',
        name: 'Polished',
        category: 'executive',
        description: 'Executive-level professional resume for senior roles',
        atsScore: 96,
        layout: 'single-column',
        colors: {
            primary: '#111827',
            secondary: '#374151',
            accent: '#4f46e5',
            text: '#111827',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f9fafb'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'executive',
            sectionDivider: 'subtle-line',
            bulletStyle: 'arrow'
        }
    },

    // 6. Modern - Current design with accent colors
    'modern': {
        id: 'modern',
        name: 'Modern',
        category: 'modern',
        description: 'Trendy design with gradient header and vibrant accents',
        atsScore: 91,
        layout: 'single-column',
        colors: {
            primary: '#8b5cf6',
            secondary: '#6366f1',
            accent: '#a78bfa',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#faf5ff'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'gradient',
            sectionDivider: 'colored-line',
            bulletStyle: 'circle'
        }
    },

    // 7. Creative - Bold with unique layouts
    'creative': {
        id: 'creative',
        name: 'Creative',
        category: 'creative',
        description: 'Bold and unique for creative professionals',
        atsScore: 85,
        layout: 'two-column-creative',
        colors: {
            primary: '#ec4899',
            secondary: '#f97316',
            accent: '#fbbf24',
            text: '#18181b',
            muted: '#52525b',
            background: '#ffffff',
            sidebar: '#fdf2f8'
        },
        fonts: {
            heading: "'Poppins', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'creative-block',
            sectionDivider: 'colored-block',
            bulletStyle: 'star'
        }
    },

    // 8. Timeline - Experience as visual timeline
    'timeline': {
        id: 'timeline',
        name: 'Timeline',
        category: 'modern',
        description: 'Visual timeline format for experience and education',
        atsScore: 88,
        layout: 'timeline',
        colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#34d399',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#ecfdf5'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'clean-top',
            sectionDivider: 'timeline-dots',
            bulletStyle: 'timeline-dot'
        }
    },

    // 9. Stylish - Fashion/design industry focused
    'stylish': {
        id: 'stylish',
        name: 'Stylish',
        category: 'creative',
        description: 'Fashion-forward design for creative industries',
        atsScore: 83,
        layout: 'stylish',
        colors: {
            primary: '#000000',
            secondary: '#404040',
            accent: '#e11d48',
            text: '#171717',
            muted: '#525252',
            background: '#ffffff',
            sidebar: '#fafafa'
        },
        fonts: {
            heading: "'Montserrat', sans-serif",
            body: "'Lato', sans-serif"
        },
        styles: {
            headerStyle: 'fashion',
            sectionDivider: 'thin-accent',
            bulletStyle: 'line'
        }
    },

    // 10. Single Column - Traditional single column
    'single-column': {
        id: 'single-column',
        name: 'Single Column',
        category: 'classic',
        description: 'Traditional single-column format, highly ATS-friendly',
        atsScore: 98,
        layout: 'single-column',
        colors: {
            primary: '#1f2937',
            secondary: '#374151',
            accent: '#2563eb',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f9fafb'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'simple',
            sectionDivider: 'line',
            bulletStyle: 'circle'
        }
    },

    // 11. Elegant with Logos - Elegant with company logos area
    'elegant-logos': {
        id: 'elegant-logos',
        name: 'Elegant with Logos',
        category: 'classic',
        description: 'Elegant design with space for company and school logos',
        atsScore: 87,
        layout: 'single-column-logos',
        colors: {
            primary: '#4a3728',
            secondary: '#8b7355',
            accent: '#d4a574',
            text: '#2d2d2d',
            muted: '#666666',
            background: '#fffefb',
            sidebar: '#faf7f2'
        },
        fonts: {
            heading: "'Playfair Display', Georgia, serif",
            body: "'Lora', Georgia, serif"
        },
        styles: {
            headerStyle: 'elegant-border',
            sectionDivider: 'ornament',
            bulletStyle: 'diamond',
            showLogos: true
        }
    },

    // 12. Double Column with Logos
    'double-column-logos': {
        id: 'double-column-logos',
        name: 'Double Column with Logos',
        category: 'professional',
        description: 'Two-column layout with company logo placeholders',
        atsScore: 86,
        layout: 'two-column-logos',
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#3b82f6',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f0f9ff'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'sidebar-left',
            sectionDivider: 'none',
            bulletStyle: 'circle',
            showLogos: true
        }
    },

    // 13. Compact - Condensed one-page design
    'compact': {
        id: 'compact',
        name: 'Compact',
        category: 'professional',
        description: 'Space-efficient design to fit more content on one page',
        atsScore: 93,
        layout: 'compact',
        colors: {
            primary: '#0f766e',
            secondary: '#14b8a6',
            accent: '#2dd4bf',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f0fdfa'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'compact',
            sectionDivider: 'minimal',
            bulletStyle: 'dash',
            fontSize: 'small'
        }
    },

    // 14. Modern with Logos
    'modern-logos': {
        id: 'modern-logos',
        name: 'Modern with Logos',
        category: 'modern',
        description: 'Modern design with integrated logo sections',
        atsScore: 84,
        layout: 'single-column-logos',
        colors: {
            primary: '#8b5cf6',
            secondary: '#6366f1',
            accent: '#a78bfa',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#faf5ff'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'gradient',
            sectionDivider: 'colored-line',
            bulletStyle: 'circle',
            showLogos: true
        }
    },

    // 15. Multicolumn - Three-column layout
    'multicolumn': {
        id: 'multicolumn',
        name: 'Multicolumn',
        category: 'creative',
        description: 'Three-column layout for maximum information density',
        atsScore: 80,
        layout: 'three-column',
        colors: {
            primary: '#7c3aed',
            secondary: '#8b5cf6',
            accent: '#a78bfa',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#f5f3ff'
        },
        fonts: {
            heading: "'Poppins', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'full-width',
            sectionDivider: 'vertical',
            bulletStyle: 'circle'
        }
    },

    // 16. Timeline with Logos
    'timeline-logos': {
        id: 'timeline-logos',
        name: 'Timeline with Logos',
        category: 'modern',
        description: 'Timeline format with company logo integration',
        atsScore: 82,
        layout: 'timeline-logos',
        colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#34d399',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#ecfdf5'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'clean-top',
            sectionDivider: 'timeline-dots',
            bulletStyle: 'timeline-dot',
            showLogos: true
        }
    },

    // 17. Classic - Traditional conservative style
    'classic': {
        id: 'classic',
        name: 'Classic',
        category: 'classic',
        description: 'Timeless traditional format for conservative industries',
        atsScore: 97,
        layout: 'single-column',
        colors: {
            primary: '#1f2937',
            secondary: '#374151',
            accent: '#1f2937',
            text: '#1f2937',
            muted: '#4b5563',
            background: '#ffffff',
            sidebar: '#f9fafb'
        },
        fonts: {
            heading: "'Times New Roman', Georgia, serif",
            body: "'Times New Roman', Georgia, serif"
        },
        styles: {
            headerStyle: 'traditional',
            sectionDivider: 'double-line',
            bulletStyle: 'circle'
        }
    },

    // 18. Ivy League with Logos
    'ivy-league-logos': {
        id: 'ivy-league-logos',
        name: 'Ivy League with Logos',
        category: 'academic',
        description: 'Academic style with institution logo support',
        atsScore: 89,
        layout: 'single-column-logos',
        colors: {
            primary: '#1e3a5f',
            secondary: '#c9a227',
            accent: '#2d5a87',
            text: '#1a1a2e',
            muted: '#4a5568',
            background: '#ffffff',
            sidebar: '#f7f8fa'
        },
        fonts: {
            heading: "'Times New Roman', Georgia, serif",
            body: "'Times New Roman', Georgia, serif"
        },
        styles: {
            headerStyle: 'centered',
            sectionDivider: 'line',
            bulletStyle: 'square',
            showLogos: true
        }
    },

    // 19. High Performer - Achievement-focused layout
    'high-performer': {
        id: 'high-performer',
        name: 'High Performer',
        category: 'executive',
        description: 'Achievement and metrics-focused for top performers',
        atsScore: 94,
        layout: 'achievement-focused',
        colors: {
            primary: '#dc2626',
            secondary: '#b91c1c',
            accent: '#f87171',
            text: '#1f2937',
            muted: '#6b7280',
            background: '#ffffff',
            sidebar: '#fef2f2'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'impact',
            sectionDivider: 'accent-line',
            bulletStyle: 'checkmark'
        }
    },

    // 20. Minimal - Ultra-clean minimalist design
    'minimal': {
        id: 'minimal',
        name: 'Minimal',
        category: 'modern',
        description: 'Ultra-clean design with maximum whitespace',
        atsScore: 96,
        layout: 'minimal',
        colors: {
            primary: '#18181b',
            secondary: '#3f3f46',
            accent: '#71717a',
            text: '#27272a',
            muted: '#71717a',
            background: '#ffffff',
            sidebar: '#fafafa'
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif"
        },
        styles: {
            headerStyle: 'minimal',
            sectionDivider: 'space',
            bulletStyle: 'none'
        }
    }
};

// Template categories for filtering
const TEMPLATE_CATEGORIES = [
    { id: 'all', name: 'All Templates', icon: 'grid' },
    { id: 'professional', name: 'Professional', icon: 'briefcase' },
    { id: 'modern', name: 'Modern', icon: 'zap' },
    { id: 'classic', name: 'Classic', icon: 'book' },
    { id: 'creative', name: 'Creative', icon: 'palette' },
    { id: 'academic', name: 'Academic', icon: 'graduation-cap' },
    { id: 'executive', name: 'Executive', icon: 'award' }
];

// Get template by ID
function getTemplate(templateId) {
    return RESUME_TEMPLATES[templateId] || RESUME_TEMPLATES['modern'];
}

// Get all templates
function getAllTemplates() {
    return Object.values(RESUME_TEMPLATES);
}

// Get templates by category
function getTemplatesByCategory(category) {
    if (category === 'all') return getAllTemplates();
    return getAllTemplates().filter(t => t.category === category);
}

// Generate template preview HTML structure
function generateTemplatePreviewHTML(templateId) {
    const template = getTemplate(templateId);
    return `
        <div class="template-preview-mini" style="--primary: ${template.colors.primary}; --accent: ${template.colors.accent}; --sidebar: ${template.colors.sidebar};">
            <div class="preview-header-mini" style="background: ${template.styles.headerStyle === 'gradient' ? `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})` : template.colors.primary};">
                <div class="preview-name-mini">Your Name</div>
                <div class="preview-title-mini">Job Title</div>
            </div>
            <div class="preview-body-mini ${template.layout}">
                <div class="preview-section-mini">
                    <div class="preview-section-title-mini" style="color: ${template.colors.primary};">Experience</div>
                    <div class="preview-lines-mini">
                        <div class="preview-line"></div>
                        <div class="preview-line short"></div>
                    </div>
                </div>
                <div class="preview-section-mini">
                    <div class="preview-section-title-mini" style="color: ${template.colors.primary};">Education</div>
                    <div class="preview-lines-mini">
                        <div class="preview-line"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Calculate ATS score based on resume content
function calculateATSScore(resumeData) {
    let score = 0;
    let factors = [];

    // Personal information (20 points)
    if (resumeData.personal?.fullName) { score += 5; } else { factors.push('Add your full name'); }
    if (resumeData.personal?.email) { score += 5; } else { factors.push('Add your email address'); }
    if (resumeData.personal?.phone) { score += 5; } else { factors.push('Add your phone number'); }
    if (resumeData.personal?.location) { score += 3; }
    if (resumeData.personal?.linkedin) { score += 2; }

    // Summary (15 points)
    if (resumeData.summary) {
        const wordCount = resumeData.summary.split(/\s+/).length;
        if (wordCount >= 30) { score += 15; }
        else if (wordCount >= 15) { score += 10; }
        else { score += 5; factors.push('Expand your summary to 30+ words'); }
    } else {
        factors.push('Add a professional summary');
    }

    // Experience (30 points)
    if (resumeData.experience?.length > 0) {
        score += Math.min(resumeData.experience.length * 8, 24);
        resumeData.experience.forEach(exp => {
            if (exp.description && exp.description.length > 50) score += 2;
        });
        if (resumeData.experience.length < 2) {
            factors.push('Add more work experience entries');
        }
    } else {
        factors.push('Add your work experience');
    }

    // Education (15 points)
    if (resumeData.education?.length > 0) {
        score += Math.min(resumeData.education.length * 7, 15);
    } else {
        factors.push('Add your education');
    }

    // Skills (15 points)
    if (resumeData.skills?.length > 0) {
        score += Math.min(resumeData.skills.length * 2, 15);
        if (resumeData.skills.length < 5) {
            factors.push('Add more skills (aim for 8-15)');
        }
    } else {
        factors.push('Add your skills');
    }

    // Certifications (5 points bonus)
    if (resumeData.certifications?.length > 0) {
        score += Math.min(resumeData.certifications.length * 2, 5);
    }

    return {
        score: Math.min(score, 100),
        factors: factors,
        grade: score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work'
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RESUME_TEMPLATES, TEMPLATE_CATEGORIES, getTemplate, getAllTemplates, getTemplatesByCategory, calculateATSScore };
}
