// App State
let selectedFile = null;
let apiData = null;
let currentKeywordFilter = 'all'; // 'all', 'matched', 'missing'
let loadingInterval = null;

// DOM Elements
const inputSection = document.getElementById('input-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const analysisForm = document.getElementById('analysis-form');
const jobDescriptionInput = document.getElementById('job-description');
const jdWordCountText = document.getElementById('jd-word-count');
const fileInput = document.getElementById('resume-file');
const dropZone = document.getElementById('drop-zone');
const fileInfoBox = document.getElementById('file-info');
const dropZoneContent = document.querySelector('.drop-zone-content');
const fileNameText = document.getElementById('file-name');
const fileSizeText = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file-btn');
const loadingStatusText = document.getElementById('loading-status');

// Loading state messages
const loadingMessages = [
    "Reading uploaded file...",
    "Extracting raw document text...",
    "Cleaning word tokens and text structure...",
    "Mapping resume section headings...",
    "Extracting key concepts from Job Description...",
    "Calculating keyword match densities...",
    "Computing TF-IDF vector models...",
    "Running Cosine Similarity comparison...",
    "Reviewing formatting rules and contact tags...",
    "Synthesizing optimization recommendations..."
];

/* -------------------------------------------------------------
 * Event Listeners Initialization
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Textarea word count
    jobDescriptionInput.addEventListener('input', updateJDWordCount);
    
    // 2. Drag & Drop interactions
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFileSelected(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
        }
    });
    
    // 3. Remove selected file
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering file browse dialog
        clearSelectedFile();
    });
    
    // 4. Form Submit
    analysisForm.addEventListener('submit', handleFormSubmit);
});

/* -------------------------------------------------------------
 * File & Input Helpers
 * ------------------------------------------------------------- */
function updateJDWordCount() {
    const text = jobDescriptionInput.value.trim();
    if (!text) {
        jdWordCountText.innerText = "0 words";
        return;
    }
    const wordCount = text.split(/\s+/).length;
    jdWordCountText.innerText = `${wordCount} words`;
}

function handleFileSelected(file) {
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        alert(`Unsupported file format. Please upload a PDF, DOCX, or TXT file.`);
        clearSelectedFile();
        return;
    }
    
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the 5MB limit. Please upload a smaller file.");
        clearSelectedFile();
        return;
    }
    
    selectedFile = file;
    
    // Update file card
    fileNameText.innerText = file.name;
    fileSizeText.innerText = formatBytes(file.size);
    
    // Set file icon based on type
    const fileIcon = fileInfoBox.querySelector('.file-type-icon');
    fileIcon.className = 'file-type-icon fa-regular';
    if (fileExtension === 'pdf') {
        fileIcon.classList.add('fa-file-pdf');
        fileIcon.style.color = '#ef4444';
    } else if (['docx', 'doc'].includes(fileExtension)) {
        fileIcon.classList.add('fa-file-word');
        fileIcon.style.color = '#3b82f6';
    } else {
        fileIcon.classList.add('fa-file-lines');
        fileIcon.style.color = '#94a3b8';
    }
    
    // Display file info card
    dropZoneContent.classList.add('hidden');
    fileInfoBox.classList.remove('hidden');
    
    // Mark input file value
    fileInput.required = false;
}

function clearSelectedFile() {
    selectedFile = null;
    fileInput.value = '';
    fileInput.required = true;
    dropZoneContent.classList.remove('hidden');
    fileInfoBox.classList.add('hidden');
}

function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* -------------------------------------------------------------
 * API submission & Loading Screen
 * ------------------------------------------------------------- */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!selectedFile) {
        alert("Please upload your resume file first.");
        return;
    }
    
    const jdText = jobDescriptionInput.value.trim();
    if (!jdText) {
        alert("Please paste the job description.");
        return;
    }
    
    // Show Loading
    inputSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    
    // Start status messages rotation
    let msgIndex = 0;
    loadingStatusText.innerText = loadingMessages[0];
    loadingInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        loadingStatusText.innerText = loadingMessages[msgIndex];
    }, 1800);
    
    // Create form payload
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job_description', jdText);
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'Failed to analyze resume.');
        }
        
        apiData = await response.json();
        
        // Render and Transition
        renderResults(apiData);
        
        // Hide Loading, Show Dashboard
        clearInterval(loadingInterval);
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error("API error:", error);
        clearInterval(loadingInterval);
        loadingSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        alert(`Analysis Error: ${error.message}`);
    }
}

/* -------------------------------------------------------------
 * Render Dashboard Results
 * ------------------------------------------------------------- */
function renderResults(data) {
    // 1. Overall Score Ring Animation
    const scoreVal = Math.round(data.overall_score);
    const fillRing = document.getElementById('score-ring-fill');
    
    // SVG stroke dasharray is 440 (2 * pi * r = 2 * 3.14159 * 70 = 439.8)
    const offset = 440 - (440 * scoreVal) / 100;
    
    // Trigger score circular animation after short delay
    setTimeout(() => {
        fillRing.style.strokeDashoffset = offset;
    }, 100);
    
    // Score ring color based on tier
    if (scoreVal >= 85) {
        fillRing.style.stroke = 'var(--color-success)';
    } else if (scoreVal >= 60) {
        fillRing.style.stroke = 'var(--primary)';
    } else if (scoreVal >= 40) {
        fillRing.style.stroke = 'var(--color-warning)';
    } else {
        fillRing.style.stroke = 'var(--color-danger)';
    }
    
    // Count up score numbers
    animateValue('overall-score-num', 0, scoreVal, 1500);
    
    // Score Title and Description
    const scoreStatusTitle = document.getElementById('score-status-title');
    const scoreStatusDesc = document.getElementById('score-status-desc');
    
    if (scoreVal >= 85) {
        scoreStatusTitle.innerText = "Excellent Match";
        scoreStatusDesc.innerText = "Your resume is highly optimized for this role and has a high probability of passing ATS filters.";
        scoreStatusTitle.style.color = 'var(--color-success)';
    } else if (scoreVal >= 70) {
        scoreStatusTitle.innerText = "Good Match";
        scoreStatusDesc.innerText = "Solid resume match. Incorporating a few more keywords will make your profile stand out further.";
        scoreStatusTitle.style.color = 'var(--primary)';
    } else if (scoreVal >= 50) {
        scoreStatusTitle.innerText = "Fair Match";
        scoreStatusDesc.innerText = "Moderate alignment. Core components are parsed, but you are missing several critical job-specific keywords.";
        scoreStatusTitle.style.color = 'var(--color-warning)';
    } else {
        scoreStatusTitle.innerText = "Weak Match";
        scoreStatusDesc.innerText = "Significant gaps found. We highly recommend aligning your skills and format with the job description requirements.";
        scoreStatusTitle.style.color = 'var(--color-danger)';
    }
    
    // 2. Metrics breakdown progress bars
    const kwScore = Math.round(data.metrics.keyword_match);
    const semanticScore = Math.round(data.metrics.semantic_similarity);
    const formatScore = Math.round(data.metrics.formatting);
    
    animateValue('metric-keyword-val', 0, kwScore, 1200, '%');
    animateValue('metric-semantic-val', 0, semanticScore, 1200, '%');
    animateValue('metric-format-val', 0, formatScore, 1200, '%');
    
    document.getElementById('metric-keyword-bar').style.width = `${kwScore}%`;
    document.getElementById('metric-semantic-bar').style.width = `${semanticScore}%`;
    document.getElementById('metric-format-bar').style.width = `${formatScore}%`;
    
    // 3. Document health stats
    document.getElementById('stat-word-count').innerText = data.format_analysis.word_count;
    document.getElementById('stat-readability').innerText = data.readability.rating;
    document.getElementById('stat-read-time').innerText = `${data.readability.est_read_time_min}m`;
    
    // Word count color badge
    const wordStatusBadge = document.getElementById('stat-word-status');
    const wc = data.format_analysis.word_count;
    wordStatusBadge.className = 'stat-sub';
    if (wc >= 400 && wc <= 1200) {
        wordStatusBadge.innerText = "Optimal";
        wordStatusBadge.classList.add('optimal');
    } else if ((wc >= 250 && wc < 400) || (wc > 1200 && wc <= 1800)) {
        wordStatusBadge.innerText = "Sub-optimal";
        wordStatusBadge.classList.add('warning');
    } else {
        wordStatusBadge.innerText = "Attention";
        wordStatusBadge.classList.add('short');
    }
    
    // 4. Populate Keywords List
    currentKeywordFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.keyword-filters button').classList.add('active');
    renderKeywordsTab();
    
    // 5. Populate Formatting checklist
    renderFormattingTab(data.format_analysis);
    
    // 6. Populate Actionable Recommendations
    renderRecommendations(data.recommendations);
}

/* -------------------------------------------------------------
 * Render Sub-Tabs
 * ------------------------------------------------------------- */
function renderKeywordsTab() {
    const container = document.getElementById('keyword-categories');
    container.innerHTML = '';
    
    const kwAnalysis = apiData.keyword_analysis;
    let hasKeywords = false;
    
    for (const [category, details] of Object.entries(kwAnalysis)) {
        const matched = details.matched;
        const missing = details.missing;
        
        // Filter chips according to state
        let displayChips = [];
        if (currentKeywordFilter === 'all') {
            displayChips = [
                ...matched.map(kw => ({ text: kw, matched: true })),
                ...missing.map(kw => ({ text: kw, matched: false }))
            ];
        } else if (currentKeywordFilter === 'matched') {
            displayChips = matched.map(kw => ({ text: kw, matched: true }));
        } else if (currentKeywordFilter === 'missing') {
            displayChips = missing.map(kw => ({ text: kw, matched: false }));
        }
        
        if (displayChips.length === 0) continue;
        
        hasKeywords = true;
        
        const block = document.createElement('div');
        block.className = 'keyword-category-block';
        
        const countMatched = matched.length;
        const countTotal = matched.length + missing.length;
        
        block.innerHTML = `
            <h4>
                <span>${category}</span>
                <span>${countMatched}/${countTotal} matched</span>
            </h4>
            <div class="chips-list">
                ${displayChips.map(chip => `
                    <span class="chip ${chip.matched ? 'matched' : 'missing'}">
                        <i class="fa-solid ${chip.matched ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                        ${escapeHtml(chip.text)}
                    </span>
                `).join('')}
            </div>
        `;
        container.appendChild(block);
    }
    
    if (!hasKeywords) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.8rem;"></i>
                <p>No keywords found matching this filter.</p>
            </div>
        `;
    }
}

function renderFormattingTab(formatData) {
    // 1. Section headers checklist
    const sectionsList = document.getElementById('format-sections-list');
    sectionsList.innerHTML = '';
    
    const friendlySectionNames = {
        education: "Education Details",
        experience: "Work Experience",
        skills: "Skills Section",
        projects: "Projects Section",
        contact: "Contact/Summary Header"
    };
    
    for (const [sec, found] of Object.entries(formatData.sections)) {
        const item = document.createElement('div');
        item.className = `check-item ${found ? 'passed' : 'failed'}`;
        item.innerHTML = `
            <div class="check-icon">
                <i class="fa-solid ${found ? 'fa-check' : 'fa-xmark'}"></i>
            </div>
            <div class="check-details">
                <span class="check-name">${friendlySectionNames[sec] || sec}</span>
                <span class="check-desc">${found ? 'Found heading in document' : 'Heading not detected by parser'}</span>
            </div>
        `;
        sectionsList.appendChild(item);
    }
    
    // 2. Contact details checklist
    const contactList = document.getElementById('contact-info-list');
    contactList.innerHTML = '';
    
    const contactItems = [
        { name: "Email Address", val: formatData.email, desc: "Used by employers to contact you" },
        { name: "Phone Number", val: formatData.phone, desc: "Used for interview schedules" },
        { name: "LinkedIn URL", val: formatData.linkedin, desc: "Online professional presence" },
        { name: "GitHub Link", val: formatData.github, desc: "Coding projects repository" }
    ];
    
    contactItems.forEach(c => {
        const found = !!c.val;
        const item = document.createElement('div');
        item.className = `check-item ${found ? 'passed' : 'failed'}`;
        item.innerHTML = `
            <div class="check-icon">
                <i class="fa-solid ${found ? 'fa-check' : 'fa-xmark'}"></i>
            </div>
            <div class="check-details">
                <span class="check-name">${c.name}</span>
                <span class="check-desc">${found ? escapeHtml(c.val) : 'Not found in resume'}</span>
            </div>
        `;
        contactList.appendChild(item);
    });
}

function renderRecommendations(recs) {
    const list = document.getElementById('recommendations-list');
    list.innerHTML = '';
    
    if (recs.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--color-success); margin-bottom: 1rem;"></i>
                <h4>Your resume is fully optimized!</h4>
                <p style="font-size: 0.85rem; margin-top: 0.4rem;">We found no immediate improvements required.</p>
            </div>
        `;
        return;
    }
    
    const recIcons = {
        critical: "fa-solid fa-triangle-exclamation",
        warning: "fa-solid fa-circle-exclamation",
        info: "fa-solid fa-circle-info",
        success: "fa-solid fa-circle-check"
    };
    
    recs.forEach(r => {
        const item = document.createElement('div');
        item.className = `recommendation-item ${r.type}`;
        item.innerHTML = `
            <i class="${recIcons[r.type] || 'fa-solid fa-circle-info'}"></i>
            <div class="rec-content">
                <h4>${escapeHtml(r.title)}</h4>
                <p>${escapeHtml(r.desc)}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

/* -------------------------------------------------------------
 * UI Helpers & Utilities
 * ------------------------------------------------------------- */
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    document.getElementById(`tab-content-${tabId}`).classList.add('active');
}

function filterKeywords(filter) {
    currentKeywordFilter = filter;
    
    // Toggle active filter button class
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    if (filter === 'all') {
        document.querySelector('.filter-btn:nth-child(1)').classList.add('active');
    } else if (filter === 'matched') {
        document.querySelector('.filter-btn:nth-child(2)').classList.add('active');
    } else if (filter === 'missing') {
        document.querySelector('.filter-btn:nth-child(3)').classList.add('active');
    }
    
    renderKeywordsTab();
}

function resetApp() {
    // Clear API data
    apiData = null;
    clearSelectedFile();
    jobDescriptionInput.value = '';
    jdWordCountText.innerText = "0 words";
    
    // Reset Score circle offset
    const fillRing = document.getElementById('score-ring-fill');
    fillRing.style.strokeDashoffset = '440';
    
    // Reset tabs
    switchTab('keywords');
    
    // Show input, hide results
    resultsSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
}

// Animate numbers counting up
function animateValue(id, start, end, duration, suffix = '') {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    if (start === end) {
        obj.innerHTML = start + suffix;
        return;
    }
    
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current + suffix;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime || 1); // Fallback to 1ms if division is 0
}

// Helper to escape HTML tags in text
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/* -------------------------------------------------------------
 * Resume Optimization Functions
 * ------------------------------------------------------------- */
async function startOptimization() {
    if (!selectedFile) {
        alert("No resume file uploaded.");
        return;
    }
    
    const jdText = jobDescriptionInput.value.trim();
    if (!jdText) {
        alert("Job description is missing.");
        return;
    }
    
    // Select optimization button to show loading
    const optBtn = document.getElementById('optimize-btn');
    const originalBtnHTML = optBtn.innerHTML;
    optBtn.disabled = true;
    optBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Optimizing...`;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job_description', jdText);
    
    try {
        const response = await fetch('/api/optimize', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'Failed to optimize resume.');
        }
        
        const result = await response.json();
        
        // Populate modal data
        document.getElementById('opt-current-score').innerText = Math.round(result.original_score);
        document.getElementById('opt-projected-score').innerText = '0';
        
        // Populating list of revisions
        const changesList = document.getElementById('optimization-changes-list');
        changesList.innerHTML = '';
        if (result.changes.length === 0) {
            changesList.innerHTML = `<li>No revisions needed (already fully optimized).</li>`;
        } else {
            result.changes.forEach(change => {
                const li = document.createElement('li');
                li.innerText = change;
                changesList.appendChild(li);
            });
        }
        
        // Populating diff code body
        document.getElementById('optimized-text-pre').innerText = result.optimized_text;
        
        // Reveal Modal
        const modal = document.getElementById('optimization-modal');
        modal.classList.remove('hidden');
        
        // Animate projected score counting up
        const targetProjScore = Math.round(result.projected_score);
        animateValue('opt-projected-score', 0, targetProjScore, 1200);
        
    } catch (err) {
        console.error("Optimization failed:", err);
        alert(`Optimization Failed: ${err.message}`);
    } finally {
        optBtn.disabled = false;
        optBtn.innerHTML = originalBtnHTML;
    }
}

function closeOptimizationModal() {
    document.getElementById('optimization-modal').classList.add('hidden');
}

function copyOptimizedText() {
    const textToCopy = document.getElementById('optimized-text-pre').innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.querySelector('.copy-opt-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        copyBtn.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text automatically. Please select it manually.');
    });
}

function downloadOptimizedText() {
    const textToDownload = document.getElementById('optimized-text-pre').innerText;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Default name
    let baseName = "optimized_resume.txt";
    if (selectedFile) {
        const nameParts = selectedFile.name.split('.');
        nameParts.pop(); // Remove extension
        baseName = nameParts.join('.') + "_optimized.txt";
    }
    
    link.href = url;
    link.download = baseName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function downloadOptimizedDocx() {
    if (!selectedFile) {
        alert("No resume file uploaded.");
        return;
    }
    
    const jdText = jobDescriptionInput.value.trim();
    if (!jdText) {
        alert("Job description is missing.");
        return;
    }
    
    const docxBtn = document.getElementById('download-docx-btn');
    const originalHTML = docxBtn.innerHTML;
    docxBtn.disabled = true;
    docxBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('job_description', jdText);
    
    try {
        const response = await fetch('/api/download_optimized_docx', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'Failed to generate DOCX file.');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const nameParts = selectedFile.name.split('.');
        nameParts.pop();
        const downloadName = nameParts.join('.') + "_optimized.docx";
        
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
    } catch (err) {
        console.error("DOCX download error:", err);
        alert(`Failed to download DOCX: ${err.message}`);
    } finally {
        docxBtn.disabled = false;
        docxBtn.innerHTML = originalHTML;
    }
}
