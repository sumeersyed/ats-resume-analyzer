// Utility Functions for Resume Analysis and Building

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce function for performance optimization
 */
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

/**
 * Extract text from different file types
 */
async function extractTextFromFile(file) {
    const fileType = file.name.split('.').pop().toLowerCase();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;

            if (fileType === 'txt') {
                resolve(content);
            } else if (fileType === 'pdf') {
                // For PDF, we'll use a simulated extraction
                // In production, you'd use pdf.js or similar
                resolve(simulatePDFExtraction(content));
            } else if (fileType === 'docx' || fileType === 'doc') {
                // For DOCX, we'll simulate extraction
                resolve(simulateDocxExtraction(content));
            } else {
                reject(new Error('Unsupported file format'));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));

        if (fileType === 'txt') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
}

/**
 * Simulate PDF text extraction (in production, use pdf.js)
 */
function simulatePDFExtraction(arrayBuffer) {
    // This is a simulation - in production you'd use pdf.js
    // For demo purposes, we generate sample resume text
    return generateSampleResumeText();
}

/**
 * Simulate DOCX text extraction
 */
function simulateDocxExtraction(arrayBuffer) {
    // This is a simulation - in production you'd use mammoth.js or similar
    return generateSampleResumeText();
}

/**
 * Generate sample resume text for demonstration
 */
function generateSampleResumeText() {
    return `John Doe
Software Engineer
johndoe@email.com | (555) 123-4567 | New York, NY
linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Results-driven software engineer with 5+ years of experience developing scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions using modern technologies including React, Node.js, and cloud platforms.

WORK EXPERIENCE

Senior Software Engineer | Tech Company Inc. | 2021 - Present
- Led development of microservices architecture serving 1M+ daily users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews
- Collaborated with product team to define technical requirements

Software Engineer | StartupXYZ | 2019 - 2021
- Built responsive web applications using React and TypeScript
- Developed RESTful APIs with Node.js and Express
- Optimized database queries improving performance by 40%
- Participated in agile development processes

EDUCATION

Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
GPA: 3.8/4.0

SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frameworks: React, Node.js, Express, Django
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS, Google Cloud Platform, Docker, Kubernetes
Tools: Git, JIRA, Figma

CERTIFICATIONS
AWS Certified Solutions Architect
Google Cloud Professional Developer

PROJECTS
E-commerce Platform - Built full-stack e-commerce solution with payment integration
Open Source Contributor - Active contributor to React ecosystem libraries`;
}

/**
 * ATS Keywords dictionary for analysis
 */
const ATS_KEYWORDS = {
    technical: [
        'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
        'kubernetes', 'git', 'agile', 'scrum', 'typescript', 'html', 'css', 'api',
        'rest', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis', 'linux',
        'ci/cd', 'devops', 'cloud', 'microservices', 'testing', 'debugging'
    ],
    action: [
        'led', 'developed', 'implemented', 'designed', 'managed', 'created',
        'improved', 'increased', 'reduced', 'achieved', 'delivered', 'built',
        'launched', 'optimized', 'streamlined', 'collaborated', 'mentored',
        'analyzed', 'resolved', 'established', 'initiated', 'spearheaded'
    ],
    soft: [
        'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
        'creative', 'adaptable', 'organized', 'detail-oriented', 'motivated',
        'proactive', 'innovative', 'strategic', 'collaborative'
    ]
};

/**
 * Required resume sections
 */
const REQUIRED_SECTIONS = [
    { name: 'contact', keywords: ['email', 'phone', 'linkedin', 'address', 'location'] },
    { name: 'summary', keywords: ['summary', 'objective', 'professional summary', 'profile', 'about'] },
    { name: 'experience', keywords: ['experience', 'work history', 'employment', 'work experience'] },
    { name: 'education', keywords: ['education', 'academic', 'degree', 'university', 'college'] },
    { name: 'skills', keywords: ['skills', 'technical skills', 'competencies', 'expertise'] }
];

/**
 * Analyze resume text and return scores
 */
function analyzeResume(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    const wordCount = words.length;

    // Keyword Analysis
    let techKeywordCount = 0;
    let actionKeywordCount = 0;
    let softKeywordCount = 0;

    ATS_KEYWORDS.technical.forEach(keyword => {
        if (lowerText.includes(keyword)) techKeywordCount++;
    });

    ATS_KEYWORDS.action.forEach(keyword => {
        if (lowerText.includes(keyword)) actionKeywordCount++;
    });

    ATS_KEYWORDS.soft.forEach(keyword => {
        if (lowerText.includes(keyword)) softKeywordCount++;
    });

    const totalKeywords = techKeywordCount + actionKeywordCount + softKeywordCount;
    const maxKeywords = ATS_KEYWORDS.technical.length + ATS_KEYWORDS.action.length + ATS_KEYWORDS.soft.length;
    const keywordScore = Math.min(100, Math.round((totalKeywords / (maxKeywords * 0.3)) * 100));

    // Section Analysis
    let sectionsFound = 0;
    const foundSections = [];
    const missingSections = [];

    REQUIRED_SECTIONS.forEach(section => {
        const found = section.keywords.some(keyword => lowerText.includes(keyword));
        if (found) {
            sectionsFound++;
            foundSections.push(section.name);
        } else {
            missingSections.push(section.name);
        }
    });

    const sectionScore = Math.round((sectionsFound / REQUIRED_SECTIONS.length) * 100);

    // Formatting Analysis
    let formattingScore = 100;
    const formattingIssues = [];

    // Check word count (optimal: 400-800 words)
    if (wordCount < 300) {
        formattingScore -= 20;
        formattingIssues.push('Resume is too short. Add more details about your experience.');
    } else if (wordCount > 1000) {
        formattingScore -= 10;
        formattingIssues.push('Resume may be too long. Consider condensing to 1-2 pages.');
    }

    // Check for bullet points
    const bulletCount = (text.match(/[•\-\*]/g) || []).length;
    if (bulletCount < 5) {
        formattingScore -= 15;
        formattingIssues.push('Use more bullet points to highlight achievements.');
    }

    // Check for quantifiable achievements
    const numberPattern = /\d+%|\d+\+|\$\d+|\d+ years?/gi;
    const quantifiables = (text.match(numberPattern) || []).length;
    if (quantifiables < 3) {
        formattingScore -= 15;
        formattingIssues.push('Add more quantifiable achievements (percentages, numbers).');
    }

    formattingScore = Math.max(0, formattingScore);

    // Readability Analysis
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = words.length / Math.max(1, sentences.length);

    let readabilityScore = 100;
    if (avgSentenceLength > 25) {
        readabilityScore -= 20;
    }
    if (avgWordLength > 7) {
        readabilityScore -= 10;
    }
    readabilityScore = Math.max(0, readabilityScore);

    // Calculate overall score
    const overallScore = Math.round(
        (keywordScore * 0.3) +
        (sectionScore * 0.25) +
        (formattingScore * 0.25) +
        (readabilityScore * 0.2)
    );

    // Generate strengths
    const strengths = [];
    if (techKeywordCount >= 8) strengths.push('Strong technical keyword presence');
    if (actionKeywordCount >= 6) strengths.push('Good use of action verbs');
    if (sectionsFound >= 4) strengths.push('Well-structured with key sections');
    if (quantifiables >= 3) strengths.push('Includes quantifiable achievements');
    if (bulletCount >= 8) strengths.push('Good use of bullet points for readability');
    if (wordCount >= 400 && wordCount <= 800) strengths.push('Optimal resume length');

    if (strengths.length === 0) {
        strengths.push('Resume uploaded successfully for analysis');
    }

    // Generate improvements
    const improvements = [];
    if (techKeywordCount < 5) improvements.push('Add more technical keywords relevant to your target role');
    if (actionKeywordCount < 4) improvements.push('Use stronger action verbs to describe achievements');
    missingSections.forEach(section => {
        improvements.push(`Add a ${section.charAt(0).toUpperCase() + section.slice(1)} section`);
    });
    formattingIssues.forEach(issue => improvements.push(issue));

    if (improvements.length === 0) {
        improvements.push('Your resume is well-optimized! Consider tailoring it for specific job postings.');
    }

    // Generate suggestions
    const suggestions = [
        {
            title: 'Tailor for Each Application',
            description: 'Customize your resume keywords to match the specific job description you\'re applying for.'
        },
        {
            title: 'Use Standard Formatting',
            description: 'Avoid tables, graphics, and unusual fonts that ATS systems may not parse correctly.'
        },
        {
            title: 'Include Contact Information',
            description: 'Ensure your email, phone, and LinkedIn URL are clearly visible at the top.'
        }
    ];

    if (quantifiables < 5) {
        suggestions.push({
            title: 'Quantify Your Impact',
            description: 'Add specific numbers, percentages, and metrics to demonstrate your achievements.'
        });
    }

    return {
        overallScore,
        keywordScore,
        sectionScore,
        formattingScore,
        readabilityScore,
        strengths,
        improvements,
        suggestions,
        stats: {
            wordCount,
            techKeywords: techKeywordCount,
            actionVerbs: actionKeywordCount,
            sectionsFound,
            bulletPoints: bulletCount,
            quantifiables
        }
    };
}

/**
 * Get rating badge class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'rating-excellent';
    if (score >= 60) return 'rating-good';
    if (score >= 40) return 'rating-fair';
    return 'rating-poor';
}

/**
 * Get rating label based on score
 */
function getRatingLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
}

/**
 * Get score message based on score
 */
function getScoreMessage(score) {
    if (score >= 80) {
        return 'Your resume is well-optimized for ATS systems. Great job!';
    }
    if (score >= 60) {
        return 'Your resume is generally good but has room for improvement.';
    }
    if (score >= 40) {
        return 'Your resume needs some optimization to pass ATS filters effectively.';
    }
    return 'Your resume requires significant improvements to be ATS-friendly.';
}

// Export utilities
window.resumeUtils = {
    formatFileSize,
    debounce,
    extractTextFromFile,
    analyzeResume,
    getRatingClass,
    getRatingLabel,
    getScoreMessage
};
