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

            // Simulate processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Analyze the resume
            const results = window.resumeUtils.analyzeResume(text);

            // Display results
            displayResults(results);

        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to analyze resume. Please try again.');
            resetAnalyzer();
        }
    }

    function displayResults(results) {
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

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
