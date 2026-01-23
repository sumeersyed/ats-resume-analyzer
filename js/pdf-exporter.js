// PDF Exporter for Resume Builder
// Uses html2pdf.js library for high-quality PDF generation

class PDFExporter {
    constructor() {
        this.isGenerating = false;
    }

    /**
     * Export resume to PDF
     * @param {Object} resumeData - Resume data object
     * @param {HTMLElement} templateElement - Resume template DOM element
     */
    async exportToPDF(resumeData, templateElement) {
        if (this.isGenerating) {
            console.warn('PDF generation already in progress');
            return;
        }

        this.isGenerating = true;

        try {
            // Show loading state
            this.showLoadingState();

            // Clone the template to avoid modifying the original
            const clonedTemplate = templateElement.cloneNode(true);

            // Create a temporary container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '210mm'; // A4 width
            container.style.background = 'white';
            container.appendChild(clonedTemplate);
            document.body.appendChild(container);

            // Configure PDF options
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `${resumeData.personal.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    scrollY: 0,
                    scrollX: 0
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Generate PDF
            await html2pdf().set(opt).from(clonedTemplate).save();

            // Clean up
            document.body.removeChild(container);
            this.hideLoadingState();
            this.showSuccessMessage();

        } catch (error) {
            console.error('PDF generation failed:', error);
            this.hideLoadingState();
            this.showErrorMessage(error.message);
        } finally {
            this.isGenerating = false;
        }
    }

    /**
     * Quick print method (browser print dialog)
     * @param {HTMLElement} templateElement - Resume template DOM element
     */
    printResume(templateElement) {
        const printWindow = window.open('', '_blank');
        const styles = this.getResumeStyles();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume</title>
                <style>${styles}</style>
            </head>
            <body>${templateElement.outerHTML}</body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    /**
     * Get compiled resume styles for PDF/Print
     */
    getResumeStyles() {
        return `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background: white;
            }
            .resume-template { 
                max-width: 210mm; 
                margin: 0 auto; 
                padding: 15mm; 
                background: white;
            }
            
            /* Header Styles */
            .resume-header { 
                margin-bottom: 20px; 
                padding-bottom: 15px; 
                border-bottom: 2px solid rgb(139,92,246); 
            }
            .template-modern .resume-header { 
                background: linear-gradient(135deg, rgb(139,92,246), rgb(59,130,246)); 
                color: white; 
                margin: -15mm -15mm 20px; 
                padding: 25px 15mm; 
                border: none; 
            }
            .resume-name { 
                font-size: 32pt; 
                font-weight: 700; 
                margin-bottom: 5px; 
                color: #1a1a1a;
            }
            .template-modern .resume-name { color: white; }
            
            .resume-title { 
                font-size: 16pt; 
                color: #666; 
                margin-bottom: 12px; 
                font-weight: 500;
            }
            .template-modern .resume-title { color: rgba(255,255,255,0.95); }
            
            .resume-contact { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 15px; 
                font-size: 10pt; 
                color: #666; 
            }
            .template-modern .resume-contact { color: rgba(255,255,255,0.9); }
            .resume-contact span { display: inline-block; }
            
            /* Section Styles */
            .resume-section { 
                margin-bottom: 18px; 
                page-break-inside: avoid;
            }
            .resume-section h2 { 
                font-size: 13pt; 
                font-weight: 700; 
                color: rgb(139,92,246); 
                margin-bottom: 10px; 
                padding-bottom: 5px; 
                border-bottom: 1.5px solid #e5e5e5; 
                text-transform: uppercase; 
                letter-spacing: 0.5px; 
            }
            
            /* Entry Styles */
            .resume-entry { 
                margin-bottom: 14px; 
                page-break-inside: avoid;
            }
            .resume-entry-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: baseline;
                margin-bottom: 5px; 
            }
            .resume-entry h3 { 
                font-size: 11pt; 
                font-weight: 600; 
                color: #1a1a1a;
            }
            .resume-entry .company, 
            .resume-entry .school { 
                font-size: 10pt; 
                color: #666; 
                font-style: italic;
            }
            .resume-entry .date { 
                font-size: 9pt; 
                color: #888; 
                white-space: nowrap;
            }
            .resume-entry p, 
            .resume-entry ul { 
                font-size: 10pt; 
                color: #444; 
                margin-top: 5px;
            }
            .resume-entry ul { 
                margin-left: 18px; 
            }
            .resume-entry li { 
                margin-bottom: 3px; 
            }
            
            /* Skills */
            .skills-list { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 8px; 
            }
            .skills-list span { 
                background: rgba(139,92,246,0.12); 
                color: rgb(100,60,200); 
                padding: 5px 14px; 
                border-radius: 20px; 
                font-size: 9pt; 
                font-weight: 500;
                border: 1px solid rgba(139,92,246,0.2);
            }
            
            /* Print Optimizations */
            @media print { 
                body { 
                    print-color-adjust: exact; 
                    -webkit-print-color-adjust: exact; 
                }
                .resume-template {
                    padding: 10mm;
                }
            }
            
            /* Classic Template */
            .template-classic .resume-header {
                border-bottom: 3px double #333;
            }
            .template-classic .resume-section h2 {
                color: #333;
                border-bottom: 2px solid #333;
            }
            
            /* Minimal Template */
            .template-minimal .resume-header {
                border-bottom: 1px solid #ddd;
            }
            .template-minimal .resume-section h2 {
                color: #555;
                border-bottom: none;
                font-weight: 600;
            }
        `;
    }

    showLoadingState() {
        const btn = document.getElementById('downloadBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                </svg>
                Generating PDF...
            `;
        }
    }

    hideLoadingState() {
        const btn = document.getElementById('downloadBtn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
            `;
        }
    }

    showSuccessMessage() {
        if (typeof showToast === 'function') {
            showToast('✅ PDF downloaded successfully!');
        }
    }

    showErrorMessage(message) {
        if (typeof showToast === 'function') {
            showToast(`❌ PDF generation failed: ${message}`);
        } else {
            alert(`PDF generation failed: ${message}`);
        }
    }
}

// Create and export singleton instance
if (typeof window !== 'undefined') {
    window.PDFExporter = PDFExporter;
    window.pdfExporter = new PDFExporter();
    console.log('PDF Exporter initialized successfully');
}