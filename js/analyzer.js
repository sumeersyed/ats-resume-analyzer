// Resume Analyzer Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initAnalyzer();
});

function initAnalyzer() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const uploadContainer = document.getElementById('uploadContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');

    let selectedFile = null;

    // Drag and drop handlers
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Remove file
    removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUpload();
    });

    // Analyze button
    analyzeBtn.addEventListener('click', () => {
        if (selectedFile) {
            startAnalysis();
        }
    });

    // New analysis button
    newAnalysisBtn.addEventListener('click', () => {
        resetAnalyzer();
    });

    function handleFileSelect(file) {
        const validTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'];
        const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
        const extension = file.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(extension)) {
            alert('Please upload a PDF, DOCX, DOC, or TXT file.');
            return;
        }

        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = window.resumeUtils.formatFileSize(file.size);

        uploadZone.style.display = 'none';
        fileInfo.style.display = 'flex';
        analyzeBtn.disabled = false;
    }

    function resetUpload() {
        selectedFile = null;
        fileInput.value = '';
        uploadZone.style.display = 'block';
        fileInfo.style.display = 'none';
        analyzeBtn.disabled = true;
    }

    function resetAnalyzer() {
        resetUpload();
        resultsContainer.style.display = 'none';
        uploadContainer.style.display = 'block';
    }

    async function startAnalysis() {
        uploadContainer.style.display = 'none';
        loadingContainer.style.display = 'block';

        try {
            // Extract text from file
            const text = await window.resumeUtils.extractTextFromFile(selectedFile);

            // Processing text...

            // Analyze the resume
            const results = window.resumeUtils.analyzeResume(text);

            // Fetch Live Market Data
            const loadingText = document.querySelector('.loading-text h3');
            if (loadingText) loadingText.textContent = `Fetching live market data for ${results.detectedRole}...`;

            const marketData = await window.resumeUtils.fetchMarketData(results.detectedRole);

            // Display results with market data
            displayResults(results, marketData);

        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to analyze resume. Please try again.');
            resetAnalyzer();
        }
    }

    function displayResults(results, marketData) {
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Show transparency: Proof that text was read
        const resultsHeader = document.querySelector('.results-header p');
        if (resultsHeader) {
            resultsHeader.innerHTML = `Analysis complete based on <strong>${results.stats.wordCount}</strong> words extracted from your file. <br> <span style="font-size: 0.85em; opacity: 0.8">Processing time: Instant (Real-time)</span>`;
        }

        // Add SVG gradient definition for score circle
        const svgDefs = `
            <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgb(139, 92, 246)"/>
                    <stop offset="100%" style="stop-color:rgb(59, 130, 246)"/>
                </linearGradient>
            </defs>
        `;

        const scoreCircleSvg = document.querySelector('.score-circle svg');
        if (scoreCircleSvg && !scoreCircleSvg.querySelector('defs')) {
            scoreCircleSvg.insertAdjacentHTML('afterbegin', svgDefs);
        }

        // Animate score
        animateScore(results.overallScore);

        // Update score summary
        document.getElementById('scoreTitle').textContent = `Your Resume Score: ${results.overallScore}/100`;
        document.getElementById('scoreSummary').textContent = window.resumeUtils.getScoreMessage(results.overallScore);

        // Update rating badge
        const ratingBadge = document.querySelector('.rating-badge');
        ratingBadge.className = `rating-badge ${window.resumeUtils.getRatingClass(results.overallScore)}`;
        ratingBadge.textContent = window.resumeUtils.getRatingLabel(results.overallScore);

        // Update metrics
        animateMetric('keywords', results.keywordScore);
        animateMetric('formatting', results.formattingScore);
        animateMetric('sections', results.sectionScore);
        animateMetric('readability', results.readabilityScore);

        // Update strengths
        const strengthsList = document.getElementById('strengthsList');
        strengthsList.innerHTML = results.strengths.map(s => `<li>${s}</li>`).join('');

        // Update improvements
        const improvementsList = document.getElementById('improvementsList');
        improvementsList.innerHTML = results.improvements.map(i => `<li>${i}</li>`).join('');

        // Update suggestions
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = results.suggestions.map(s => `
            <div class="suggestion-item">
                <h4>${s.title}</h4>
                <p>${s.description}</p>
            </div>
        `).join('');

        // Display Live Market Insights
        const marketContainer = document.getElementById('marketInsights');
        if (!marketContainer && marketData) {
            // Create container if it doesn't exist (injecting into DOM)
            const analysisGrid = document.querySelector('.analysis-grid');
            const marketSection = document.createElement('div');
            marketSection.className = 'analysis-card market-insights full-width';
            marketSection.id = 'marketInsights';
            marketSection.style.marginTop = '2rem';

            marketSection.innerHTML = `
                <div class="card-header">
                    <h3>📊 Live Market Intelligence</h3>
                    <span class="live-badge">
                        <span class="pulse-dot"></span> LIVE
                    </span>
                </div>
                <div class="market-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                    <div class="market-stat">
                        <span class="label">Role Detected</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--text-primary); text-transform: capitalize;">${marketData.role}</strong>
                    </div>
                     <div class="market-stat">
                        <span class="label">Active Job Openings</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--text-primary);">${marketData.activeListings}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">Source: ${marketData.source || 'Market DB'}</span>
                    </div>
                    <div class="market-stat">
                        <span class="label">Average Salary Range</span>
                        <strong style="display: block; font-size: 1.1rem; color: var(--text-primary);">${marketData.avgSalary}</strong>
                    </div>
                </div>
                <div class="trending-skills" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                    <span class="label" style="display: block; margin-bottom: 0.5rem;">🔥 Trending Skills for this Role:</span>
                    <div class="skill-tags">
                        ${marketData.trendingSkills.map(skill => `<span class="skill-tag" style="background: rgba(139, 92, 246, 0.1); color: var(--primary-purple); border: 1px solid rgba(139, 92, 246, 0.2);">${skill}</span>`).join('')}
                    </div>
                </div>
            `;

            if (analysisGrid) {
                analysisGrid.parentNode.insertBefore(marketSection, analysisGrid.nextSibling);
            }
        }
    }

    function animateScore(targetScore) {
        const scoreNumber = document.getElementById('scoreNumber');
        const scoreProgress = document.getElementById('scoreProgress');

        let currentScore = 0;
        const duration = 1500;
        const steps = 60;
        const increment = targetScore / steps;
        const stepDuration = duration / steps;

        const circumference = 2 * Math.PI * 90; // radius = 90
        scoreProgress.style.strokeDasharray = circumference;
        scoreProgress.style.strokeDashoffset = circumference;

        const animate = () => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                scoreNumber.textContent = Math.round(currentScore);
                const offset = circumference - (currentScore / 100) * circumference;
                scoreProgress.style.strokeDashoffset = offset;
                return;
            }

            scoreNumber.textContent = Math.round(currentScore);
            const offset = circumference - (currentScore / 100) * circumference;
            scoreProgress.style.strokeDashoffset = offset;

            setTimeout(animate, stepDuration);
        };

        // Start animation after a short delay
        setTimeout(animate, 300);
    }

    function animateMetric(name, score) {
        const scoreEl = document.getElementById(`${name}Score`);
        const progressEl = document.getElementById(`${name}Progress`);

        let current = 0;
        const duration = 1000;
        const steps = 40;
        const increment = score / steps;
        const stepDuration = duration / steps;

        const animate = () => {
            current += increment;
            if (current >= score) {
                current = score;
                scoreEl.textContent = `${Math.round(current)}%`;
                progressEl.style.width = `${current}%`;
                return;
            }

            scoreEl.textContent = `${Math.round(current)}%`;
            progressEl.style.width = `${current}%`;

            setTimeout(animate, stepDuration);
        };

        // Start with slight delay for staggered effect
        const delay = { keywords: 400, formatting: 500, sections: 600, readability: 700 };
        setTimeout(animate, delay[name] || 400);
    }
}

