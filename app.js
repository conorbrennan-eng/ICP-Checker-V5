// Application State
const appState = {
    originalData: [],
    processedData: [],
    filteredData: [],
    targetSeniorityLevels: [],
    currentPage: 1,
    rowsPerPage: 50,
    charts: {
        seniority: null,
        jobFunction: null
    }
};

// Seniority Keywords - EXACT word matches only
const SENIORITY_KEYWORDS = {
    'C-Level': ['Chief', 'Officer', 'CTO', 'CIO', 'CISO', 'CSO', 'CAIO', 'CDO', 'CMO', 'CEO', 'CPO', 'CLO', 'CRO', 'CAO', 'CHRO', 'CFO', 'COO', 'BISO'],
    'Vice President': ['VP', 'SVP', 'AVP', 'EVP', 'Executive Vice President', 'Senior Vice President', 'Area Vice President', 'Senior VP', 'Assistant Vice President', 'Regional Vice President', 'Group Vice President', 'Vice President', 'President'],
    'Director': ['Director', 'Senior Director', 'Executive Director', 'Associate Director', 'Assistant Director', 'Managing Director', 'Regional Director'],
    'Head of': ['Head of', 'head', 'Senior Principal', 'principal'],
    'Manager': ['Manager', 'Senior Manager']
};

// Job Function Keywords - Updated with comprehensive data and sorted by length for longest-match-first
const JOB_FUNCTION_KEYWORDS = {
    'IT Infrastructure & Cloud': ["Cloud Center of Excellence (CCoE)", "Cloud Site Reliability Engineer", "Director IT Systems Architect", "Business Information Systems", "Director Technical Architect", "Engineering & Infrastructure", "Infrastructure & Operations", "Infrastructure Engineering", "Cloud Data Infrastructure", "Enterprise Infrastructure", "Infrastructure Services", "Network Infrastructure", "Technology Infrastructure", "Technical Infrastructure", "Chief Technology Officer", "Systems & Infrastructure", "Infrastructure Technology", "Data Center Operations", "Infrastructure Strategy", "Infrastructure Management", "Network & Infrastructure", "Senior Network Architect", "Platform and Systems", "Chief Information", "Information Technology", "Information Systems", "Information Services", "Technical Operations", "Systems Engineering", "Network Operations", "Cloud Infrastructure", "Cloud Transformation", "Infrastructure & Cloud", "Systems Integration", "Cloud Architecture", "Technical Architect", "Cloud Engineering", "Cloud Operations", "Network Engineering", "Cloud Computing", "Systems Operations", "Network Architect", "Systems Architect", "Cloud Migration", "Cloud Platforms", "Information Officer", "Network Systems", "Cloud Services", "Cloud & Platform", "Network & Systems", "Cloud Technology", "Cloud Strategy", "Service Management", "Infrastructure", "Cloud Platform", "Architecture", "Operations", "Information", "Cloud Architect", "Technical", "Technology", "Cloud", "CTO", "CIO", "IT", "I.T."],
    'Cybersecurity': ["Infrastructure Security Engineering", "Information Technology & Security", "IT Security & Compliance", "Cyber Security Risk Oversight", "Information Security Architect", "Security Operations Center", "Cyber Operations & Defense", "Business Information Security", "Security Risk and Governance", "IT Risk Management", "Cyber Defense Strategy", "Security & Risk Management", "Cyber Risk Management", "Security & Compliance", "Cyber Threat Management", "Compliance & Security", "Information Protection", "Cyber Security Policy", "Enterprise Security", "Security Operations", "Information Assurance", "Digital Security", "Cyber Intelligence", "Security Governance", "Application Security", "Cyber Resilience", "Infrastructure Security", "Security Innovation", "Security Technology", "Information Security", "Security Engineering", "Threat Intelligence", "Security Architecture", "Cyber Analytics", "Technology Risk", "Security Strategy", "Cyber Innovation", "Security Officer", "Threat Management", "Cyber Operations", "Cyber Defense", "Network Security", "Cloud Security", "Security Excellence", "Cyber Warfare", "Cyber Strategy", "Cyber Security", "AI Security", "Security Compliance", "Cyber Risk", "Data Governance", "Cybersecurity", "CISO", "BISO", "Security"],
    'DevOps & Engineering': ["Enterprise Systems Devops Engineer", "Infrastructure & DevOps", "Site Reliability Engineering", "Systems Devops Engineer", "Software/Cloud Engineer", "DevOps Strategy", "Platform Engineering", "Infrastructure Engineering", "Software Engineering", "Engineering Infrastructure", "Solution Architect", "Software Architect", "Engineering Excellence", "DevOps Engineering", "Engineering Efficiency", "Platform Technology", "DevOps & Platform", "Engineering Platform", "System Reliability", "SRE & Platform", "Platform Operations", "Platform Innovation", "Platform Strategy", "Engineering Operations", "Software Engineer Cloud", "DevOps Operations", "Platform & Infrastructure", "Infrastructure Operations", "Engineering & Operations", "DevOps & Engineering", "Engineering Productivity", "Release Engineering", "Continuous Integration", "Developer Experience", "Principal Engineer", "Application Engineer", "DevOps & SRE", "Software Engineer", "Application Development", "Platform & Operations", "Solutions Architect", "Cloud Engineer", "Software Test", "Application Officer", "Engineering", "Application", "Software", "DevOps", "Engineer", "SRE"],
    'Data & Analytics': ["Global Data & Analytics", "Data & Analytics Officer", "Data Privacy & Protection", "Business Intelligence & Analytics", "Data Science & Engineering", "Data Analytics & Strategy", "Analytics & Data Science", "Data & Business Intelligence", "Insights & Analytics", "Business Intelligence", "Data Architecture", "Advanced Analytics", "Data Integration", "Data Management", "Data Monetization", "Analytics Engineering", "Data Operations", "Data Innovation", "Data Intelligence", "Data Risk & Privacy", "Analytics Strategy", "Data & Analytics", "Predictive Analytics", "Analytics Operations", "Data Technology", "Data Engineering", "Analytics Innovation", "Data Governance", "Analytical Sciences", "Analytics Officer", "Data & Insights", "Data Insights", "Data Excellence", "Data Platform", "Data Strategy", "Data Products", "Business Analytics", "Data Scientist", "Data Quality", "Analytics & Insights", "Data Science", "Data Analyst", "Analytics", "Data", "CDO", "CAO"],
    'AI / ML': ["Artificial Intelligence Research", "Artificial Intelligence Officer", "AI & Machine Learning", "Data Science & AI", "Machine Learning Engineering", "AI Officer CAIO", "Cloud and AI Officer", "AI Applications", "AI & Data Science", "AI Transformation", "Machine Intelligence", "Artificial Intelligence", "Data and AI", "AI Infrastructure", "AI Technologies", "Machine Learning", "AI Engineering", "AI Development", "AI Innovation", "AI Excellence", "AI Operations", "AI & Analytics", "ML Operations", "AI Technology", "AI Solutions", "Data & AI", "AI Strategy", "AI Systems", "AI Research", "AI Products", "AI Platform", "Gen AI", "ML Platform", "CAIO", "AI"],
    'IT Strategy & ENT Architecture': ["Technology Operations Strategy", "Enterprise Platform Strategy", "IT Strategy and Operations", "Enterprise Technology Strategy", "IT Strategic Planning", "IT Planning & Strategy", "Enterprise Architecture", "IT Strategy & Architecture", "IT Strategy & Planning", "Enterprise Integration", "IT Business Strategy", "Technology Strategy", "Enterprise Technology", "Enterprise Systems", "Technical Strategy", "Technology Planning", "Technology Vision", "Strategy Officer", "Technology Excellence", "IT Transformation", "Enterprise Architect", "IT Innovation", "Technology Roadmap", "IT Planning", "CSO"],
    'IT Governance': ["Technology Risk & Compliance", "Enterprise Data Governance", "IT Risk & Compliance", "Information Governance", "Technology Governance", "AI Governance", "IT Governance", "IT Compliance", "CCO"],
    'Digital Transformation and Innovation': ["Digital Transformation and Innovation", "Transformation & Innovation", "Digital Transformation", "Strategic Technology", "Innovation & Technology", "Emerging Technologies", "Technology Innovation", "Strategic Initiatives", "Innovation & Strategy", "Digital Modernization", "Innovation Management", "Digital Evolution", "Innovation & Growth", "Digital Future", "Innovation Initiatives", "Digital Initiatives", "Innovation Strategy", "Digital Acceleration", "Digital Innovation", "Digital Excellence", "Emerging Technology", "Digital Operations", "Innovation Technology", "Digital Solutions", "Innovation Operations", "Innovation Excellence", "Digital Platform", "Innovation Officer", "Transformation Officer", "Business Transformation", "Innovation & Research", "Strategy & Innovation", "Transformation Initiatives", "Digital Strategy", "Innovation", "Digital", "CDO"],
    'Automation': ["Digital Process Automation", "IDigital Process Automation", "Industrial Automation", "Intelligent Automation", "Automation and Controls", "Digital and Automation", "Process Optimization", "Automation Anywhere", "Engineer Automation", "Automation Engineer", "process optimization", "process improvement", "intelligent automation", "cognitive automation", "process automation", "workflow automation", "smart automation", "build automation", "industrial automation", "process optimisation", "Automation", "workflow"],
    'Product Management & Development': ["Direcror of Product Management and Strategy", "Product Management and Strategy", "Direcror of Product Design", "Product & Customer Officer", "Product & Engineering", "Product Strategy & Operations", "Product & Innovation", "Product & Strategy", "Product Management", "Product Development", "Product Innovation", "Product Excellence", "Product Experience", "Product Leadership", "Product Operations", "Product Technology", "Product Transformation", "Product Engineering", "Product Analytics", "Product Ecosystem", "Product Planning", "Product Platform", "Product Portfolio", "Product Solutions", "Product Strategy", "Product Delivery", "Product Growth", "Product Success", "Product Design", "Product Vision", "product operations", "Product"],
    'R&D': ["Research & Development Officer", "Research & Development", "Innovation & Research", "Research Programs", "Research Technology", "Development Operations", "R&D Innovation", "R&D Transformation", "Development Technology", "R&D Excellence", "Development Innovation", "R&D Leadership", "Research Excellence", "Development Excellence", "R&D Operations", "Research Innovation", "Technology Development", "Research Strategy", "Development Strategy", "Scientific Research", "Scientific Officer", "R&D Strategy", "R&D Technology", "Laboratory", "Research", "R&D"],
    'Digital Product': ["Digital Product Officer", "Digital Product Management", "Digital Product Development", "Digital Product Operations", "Digital Product Strategy", "Digital Product Experience", "Digital Product Growth", "Digital Product Technology", "Digital Product Excellence", "Digital Product Vision", "Digital Product Platform", "Digital Product Solutions", "Digital Product Design", "Digital Product Analytics", "Digital Product Success", "Digital Product Marketing", "Digital Product Engineering", "Digital Product Planning", "Digital Product Portfolio", "Digital Product Leadership", "Digital Product Transformation", "Digital Product & Strategy", "Digital Experience", "Digital Transformation", "Digital Platforms", "Digital Innovation", "Digital Strategy", "Digital Delivery", "Digital Product"],
    'UX': ["User Interface Design", "User Experience", "Experience Design", "Experience Strategy", "Design Operations", "UX Operations", "Design Strategy", "Experience Innovation", "Design Excellence", "Design Innovation", "Design Leadership", "UX Excellence", "UX Innovation", "UX Leadership", "UX Strategy", "Design & UX", "UX & Design", "Design Officer", "UX Research", "User Research", "UX Design", "Design", "UX"],
    'Marketing': ["Digital Marketing & Growth", "Digital Marketing & Brand", "Digital Marketing & Customer", "Digital Marketing & Strategy", "Digital Marketing & Innovation", "Digital Marketing & Analytics", "Digital Marketing & Technology", "Digital Marketing & Operations", "Marketing & Communications", "Marketing Transformation", "Marketing Operations", "Marketing Excellence", "Marketing Innovation", "Marketing Technology", "Marketing Analytics", "Marketing Strategy", "Marketing Experience", "Marketing Growth", "Marketing & Sales", "Performance Marketing", "Content Marketing", "Creative Marketing", "Global Marketing", "Regional Marketing", "Growth Marketing", "Customer Marketing", "Field Marketing", "Demand Generation", "Marketing Officer", "Brand Officer", "Growth Officer", "Loyalty and Personalization", "Customer Acquisition", "Omni-Channel", "Omnichannel", "Commercial Officer", "Commercial", "Marketing", "CMO", "GTM"],
    'Digital Marketing': ["Ecommerce & Digital Marketing", "Digital Marketing Communications", "Digital Marketing Excellence", "Digital Marketing Experience", "Digital Marketing Transformation", "Digital Customer Acquisition", "Digital Marketing Analytics", "Digital Marketing Technology", "Digital Marketing Innovation", "Digital Brand Marketing", "Digital Performance Marketing", "Digital Content Marketing", "Digital Marketing Operations", "Digital Marketing Strategy", "Digital Customer Marketing", "Digital Demand Generation", "Digital Marketing", "SEO"],
    'Ecommerce': ["Commercial Digital Platforms", "Ecommerce & Marketing", "Ecommerce & Technology", "Ecommerce & Operations", "Ecommerce & Strategy", "Ecommerce & Innovation", "Ecommerce & Growth", "Digital Merchandising", "Ecommerce Leadership", "Ecommerce Transformation", "Ecommerce Analytics", "Ecommerce Excellence", "Ecommerce Innovation", "Ecommerce Technology", "Ecommerce Operations", "Ecommerce Strategy", "Ecommerce Growth", "Ecommerce Experience", "Ecommerce Platform", "Ecommerce Marketing", "Ecommerce Business", "Digital Commerce", "Online Commerce", "Ecommerce & Digital", "Digital Retail", "Online Retail", "E - Commerce", "Experience", "Ecommerce"],
    'Customer Experience & Support': ["Customer & Employee Experience", "Customer Operations & Success", "Customer Relationship Management", "Customer & Experience Strategy", "Consumer & Market Insights", "Customer and Market Research", "Direct-to-Consumer", "Customer Engagement Platform", "Chief Customer Officer", "Customer & Experience", "Customer Experience", "Customer Operations", "Customer Engagement", "Customer Innovation", "Customer Excellence", "Customer Technology", "Customer Satisfaction", "Customer Transformation", "Customer Solutions", "Customer Strategy", "Customer Success", "Customer Journey", "Customer Insights", "Customer Platform", "Customer Retention", "Consumer Insights", "Consumer Markets", "Consumer Platforms", "Consumer Engagement", "Customer Care", "Customer Advocacy", "Customer Value", "Customer Growth", "Customer Support", "Customer Service", "Customer Voice", "Customer Officer", "Personalization", "Experience", "Customer", "Support", "CXO"],
    'Communications': ["Communications & Marketing", "Communications & Brand", "Communications & Public Relations", "Communications & Media", "Communications & Content", "Communications Innovation", "Communications Analytics", "Communications Transformation", "Communications Operations", "Communications Strategy", "Communications Excellence", "Communications Technology", "Corporate Communications", "Internal Communications", "External Communications", "Strategic Communications", "Digital Communications", "Global Communications", "Regional Communications", "Crisis Communications", "Employee Communications", "Public Relations", "Communications"],
    'Brand': ["Brand & Marketing", "Brand & Communications", "Brand & Strategy", "Brand & Innovation", "Brand & Experience", "Brand Strategy Officer", "Brand Development", "Brand Management", "Brand Transformation", "Brand Leadership", "Brand Excellence", "Brand Experience", "Brand Operations", "Brand Technology", "Brand Analytics", "Brand Innovation", "Brand Strategy", "Brand Performance", "Brand Insights", "Brand Engagement", "Global Brand", "Regional Brand", "Brand Portfolio", "Brand Officer", "Brands", "Brand"],
    'Creative': ["Experiential Creative", "Associate Creative", "Creative Producer", "Content Producer", "Creative Director", "Creative Services", "Social and Content", "Content & Programming", "Content Strategy", "Experiential", "Creative", "Content"],
    'Event': ["Event & Marketing", "Event & Experience", "Event & Communications", "Event & Brand", "Event & Strategy", "Event Leadership", "Event Transformation", "Event Development", "Event Experience", "Event Management", "Event Planning", "Event Operations", "Event Innovation", "Event Excellence", "Event Technology", "Event Strategy", "Event Production", "Event Services", "Event Logistics", "Corporate Events", "Event Marketing", "Global Events", "Regional Events", "Events", "Event"],
    'Operations': ["Operations & Strategy", "Operations & Technology", "Operations & Innovation", "Operations & Excellence", "Operations & Analytics", "Operations & Transformation", "Operations & Performance", "Operations Innovation", "Operations Excellence", "Operations Leadership", "Operations Management", "Operations Development", "Operations Planning", "Operations Analytics", "Operations Performance", "Operations Technology", "Operations Strategy", "Business Operations", "Global Operations", "Regional Operations", "Manufacturing Operations", "Service Operations", "Field Operations", "Operations Transformation", "Operational Excellence", "Executive Officer", "Business Officer", "Founder & CEO", "Founder/CEO", "Operations", "Operating", "Strategy", "CEO", "COO"],
    'Process': ["Business Process Management", "Process Engineering Director", "Business Process Improvement", "Process & Operations", "Process & Strategy", "Process & Technology", "Process & Innovation", "Process & Excellence", "Process & Analytics", "Process & Transformation", "Process Improvement", "Process Excellence", "Process Engineering", "Process Innovation", "Process Technology", "Process Analytics", "Process Management", "Process Leadership", "Process Operations", "Process Strategy", "Process Development", "Process Optimization", "Process Quality", "Continuous Improvement", "Business Process", "Operations Director", "Process Transformation", "Process Strategy", "Process Operations", "process improvement", "process optimization", "process optimisation", "IDigital Process Automation", "Process", "workflow", "CPO"],
    'Manufacturing': ["Manufacturing Systems", "Manufacturing Process", "Global Manufacturing", "Production Line", "Assembly Line", "Quality Control", "Lean Manufacturing", "Human Machine Interface", "lean manufacturing", "smart factory", "quality assurance", "Industry 4.0", "control systems", "robotic systems", "production", "factory", "Manufacturing", "Robotics"],
    'Legal & Compliance': ["Legal & Compliance Officer", "Legal & Regulatory", "Legal & Compliance", "Legal & Privacy", "Legal & Ethics", "Legal Leadership", "Legal Excellence", "Legal Transformation", "Legal Innovation", "Legal Technology", "Legal Strategy", "Legal Operations", "Corporate Governance", "Compliance Operations", "Compliance Strategy", "Compliance Innovation", "Compliance Excellence", "Compliance Transformation", "Governance Officer", "Regulatory Affairs", "Compliance", "Privacy", "Ethics", "Legal", "CLO"],
    'Sales': ["Sales Strategy & Operations", "Sales Innovation & Strategy", "Sales Excellence & Performance", "Sales & Marketing", "Sales & Revenue", "Sales & Business Development", "Sales & Customer Success", "Sales & Operations", "Business Development", "Sales Leadership", "Sales Excellence", "Sales Innovation", "Sales Technology", "Sales Analytics", "Sales Transformation", "Sales Operations", "Sales Strategy", "Revenue Officer", "Commercial Officer", "Growth Officer", "Global Sales", "Regional Sales", "Enterprise Sales", "Sales Performance", "Sales Development", "Sales Growth", "Revenue", "Sales", "CRO"],
    'Finance': ["Financial Planning & Analysis", "Financial & Strategy", "Financial & Operations", "Financial & Technology", "Financial & Analytics", "Financial Business Partnering", "Financial Excellence", "Financial Transformation", "Financial Leadership", "Financial Innovation", "Financial Analytics", "Financial Technology", "Financial Strategy", "Financial Operations", "Financial Performance", "Financial Systems", "Financial Controls", "Financial Reporting", "Finance Officer", "Accounting Officer", "Budget & Planning", "Corporate Finance", "Financial Compliance", "Financial", "Accounting", "Treasury", "Finance", "CFO", "CAO"],
    'Human Resources': ["People & Organization", "Employee Resource", "HR Business Partnering", "Learning and Deveopment", "Compensation & Benefits", "Organizational Development", "Learning & Development", "Employee Experience", "Talent Acquisition", "People and Culture", "Corporate Training", "People Excellence", "People Transformation", "People Innovation", "People Analytics", "People Technology", "People Operations", "People Strategy", "People & Culture", "Human Resources", "Talent Management", "HR Excellence", "HR Transformation", "HR Innovation", "HR Analytics", "HR Technology", "HR Strategy", "HR Operations", "People Officer", "Enterprise Learning", "Professional Enablement", "Culture & Talent", "Leadership Development", "Human Resource", "Global Talent", "HR & People", "People & Strategy", "Organisational Development", "Global Talent", "Training", "Learning", "Talent", "People", "Coaching", "CHRO", "CPO", "HR", "L&D"],
    'Procurement & Supply Chain': ["Procurement & Supply Chain", "Supply Chain Strategy", "Supply Chain Innovation", "Supply Chain Excellence", "Procurement Strategy", "Procurement Excellence", "Supply Chain Operations", "Procurement Operations", "Supply Chain Technology", "Procurement Technology", "Supply Chain Analytics", "Procurement Analytics", "Supply Chain Transformation", "Procurement Transformation", "Global Procurement", "Global Supply Chain", "Strategic Sourcing", "Supply Chain Planning", "Supply Chain Leadership", "Vendor Management", "Procurement Innovation", "Sourcing Officer", "Logistics Officer", "Supply Chain", "Procurement", "Sourcing", "Logistics"],
    'Risk & Business Continuity': ["Risk & Business Continuity", "Business Continuity Strategy", "Business Continuity Innovation", "Business Continuity Excellence", "Business Continuity Operations", "Business Continuity Technology", "Enterprise Risk Officer", "Business Resilience", "Crisis Management", "Operational Risk", "Risk Leadership", "Risk Assessment", "Enterprise Resilience", "Corporate Governance", "Enterprise Risk", "Risk Management", "Risk Excellence", "Risk Innovation", "Risk Operations", "Risk Analytics", "Risk Technology", "Risk Transformation", "Strategic Risk", "Risk Strategy", "Business Continuity", "Risk"],
    'Sustainability & ESG': ["Sustainability & ESG", "Environmental Affairs", "Sustainability Leadership", "ESG Leadership", "Environmental Strategy", "Climate Strategy", "Corporate Sustainability", "Social Impact", "ESG Reporting", "ESG Strategy", "ESG Innovation", "ESG Excellence", "ESG Operations", "ESG Technology", "ESG Analytics", "ESG Transformation", "Sustainability Strategy", "Sustainability Innovation", "Sustainability Excellence", "Sustainability Operations", "Sustainability Technology", "Sustainability Analytics", "Sustainability Transformation", "ESG Officer", "Environmental", "Sustainability", "ESG"]
};

// Chart colors
const CHART_COLORS = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const uploadStatus = document.getElementById('uploadStatus');
const senioritySection = document.getElementById('senioritySection');
const analyzeBtn = document.getElementById('analyzeBtn');
const dashboard = document.getElementById('dashboard');
const filtersSection = document.getElementById('filtersSection');
const resultsSection = document.getElementById('resultsSection');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // File upload events
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    selectFileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Seniority selection events
    document.querySelectorAll('.seniority-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleSenioritySelection);
    });

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeLeads);

    // Filter events
    document.getElementById('clearFiltersBtn').addEventListener('click', clearAllFilters);
    document.getElementById('minScore').addEventListener('input', applyFilters);
    document.getElementById('maxScore').addEventListener('input', applyFilters);
    
    // Multi-select dropdown events
    setupJobFunctionDropdown();

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportResults);

    // Pagination events
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

// File handling functions
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drop-zone--dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showUploadStatus('Please upload a CSV file.', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showUploadStatus('File size must be less than 10MB.', 'error');
        return;
    }

    showUploadStatus('Processing file...', 'processing');

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const data = parseCSV(csv);
            
            if (data.length === 0) {
                showUploadStatus('CSV file is empty or invalid.', 'error');
                return;
            }

            appState.originalData = data;
            showUploadStatus(`Successfully loaded ${data.length} leads from ${file.name}`, 'success');
            senioritySection.style.display = 'block';
            
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showUploadStatus('Error parsing CSV file. Please check the format.', 'error');
        }
    };
    
    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }

    return data;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

function showUploadStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = `upload-status upload-status--${type}`;
    uploadStatus.style.display = 'block';
}

// Seniority selection functions
function handleSenioritySelection() {
    const checkedBoxes = document.querySelectorAll('.seniority-checkbox:checked');
    appState.targetSeniorityLevels = Array.from(checkedBoxes).map(cb => cb.value);
    analyzeBtn.disabled = checkedBoxes.length === 0;
}

// Analysis functions
function analyzeLeads() {
    if (appState.originalData.length === 0) return;

    showUploadStatus('Analyzing leads...', 'processing');
    
    // Find job title column
    const headers = Object.keys(appState.originalData[0]);
    const jobTitleColumn = findJobTitleColumn(headers);
    
    if (!jobTitleColumn) {
        showUploadStatus('Could not find job title column. Please ensure your CSV has a column named "Job Title", "Title", "Position", or similar.', 'error');
        return;
    }

    // Process each lead
    appState.processedData = appState.originalData.map((lead, index) => {
        const jobTitle = lead[jobTitleColumn] || '';
        const detectedSeniority = detectSeniority(jobTitle);
        const detectedJobFunction = detectJobFunction(jobTitle);
        const score = calculateScore(detectedSeniority, detectedJobFunction);

        return {
            ...lead, // Preserve all original data
            Detected_Seniority: detectedSeniority,
            Detected_Job_Function: detectedJobFunction.category,
            Job_Function_Score: detectedJobFunction.score,
            Total_Score: score,
            _originalIndex: index
        };
    });

    appState.filteredData = [...appState.processedData];
    
    showUploadStatus(`Analysis complete! Processed ${appState.processedData.length} leads.`, 'success');
    
    // Show dashboard and results
    dashboard.style.display = 'block';
    filtersSection.style.display = 'block';
    resultsSection.style.display = 'block';
    
    // Update dashboard
    updateDashboard();
    setupFilters();
    displayResults();
}

function findJobTitleColumn(headers) {
    const titleVariations = [
        'job title', 'title', 'job_title', 'jobtitle',
        'position', 'role', 'job', 'job role', 'job_role',
        'designation', 'function'
    ];
    
    return headers.find(header => 
        titleVariations.some(variation => 
            header.toLowerCase().includes(variation)
        )
    );
}

function detectSeniority(jobTitle) {
    if (!jobTitle) return 'Unmatched';
    
    const title = jobTitle.toLowerCase().trim();
    
    // Tokenize the job title by splitting on various delimiters
    const tokens = tokenizeJobTitle(title);
    
    // Check in order of seniority hierarchy (highest to lowest)
    const seniorityLevels = ['C-Level', 'Vice President', 'Director', 'Head of', 'Manager'];
    
    for (const level of seniorityLevels) {
        const keywords = SENIORITY_KEYWORDS[level];
        
        // Check multi-word phrases first (longer matches take priority)
        const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
        
        for (const keyword of sortedKeywords) {
            if (matchesExactly(title, tokens, keyword)) {
                return level;
            }
        }
    }
    
    return 'Unmatched';
}

// Tokenize job title into individual words
function tokenizeJobTitle(title) {
    // Split on various delimiters: spaces, commas, hyphens, parentheses, slashes, etc.
    return title.split(/[\s,\-()\[\]/&]+/)
        .map(token => token.trim())
        .filter(token => token.length > 0);
}

// Check if keyword matches exactly in the job title
function matchesExactly(fullTitle, tokens, keyword) {
    const lowerKeyword = keyword.toLowerCase().trim();
    
    // Handle multi-word phrases
    if (lowerKeyword.includes(' ')) {
        // Check if the full phrase exists as consecutive words
        const keywordTokens = tokenizeJobTitle(lowerKeyword);
        
        // Check if consecutive tokens match the keyword phrase
        for (let i = 0; i <= tokens.length - keywordTokens.length; i++) {
            let matches = true;
            for (let j = 0; j < keywordTokens.length; j++) {
                if (tokens[i + j] !== keywordTokens[j]) {
                    matches = false;
                    break;
                }
            }
            if (matches) return true;
        }
        
        // Also check as a complete phrase in the original title
        return fullTitle.includes(lowerKeyword);
    } else {
        // Single word - check exact match in tokens
        return tokens.includes(lowerKeyword);
    }
}

function detectJobFunction(jobTitle) {
    if (!jobTitle) return { category: 'Other/Unmatched', score: 0 };
    
    const title = jobTitle.toLowerCase().trim();
    let bestMatch = { category: 'Other/Unmatched', score: 0, keywordLength: 0, matchType: 'none' };
    
    // Keywords are already sorted by length (longest first) in the data structure
    for (const [category, keywords] of Object.entries(JOB_FUNCTION_KEYWORDS)) {
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase().trim();
            
            // Check for exact phrase match first
            if (title === lowerKeyword) {
                return { category, score: 75, keywordLength: lowerKeyword.length, matchType: 'exact' };
            }
            
            // Check for word boundary matches ONLY - no substring matching
            if (hasWordBoundary(title, lowerKeyword)) {
                const score = 75; // Full word boundary match
                if (score > bestMatch.score || (score === bestMatch.score && lowerKeyword.length > bestMatch.keywordLength)) {
                    bestMatch = {
                        category,
                        score,
                        keywordLength: lowerKeyword.length,
                        matchType: 'word-boundary'
                    };
                    // Continue to find longest match at same score level
                }
            }
        }
        
        // If we found a perfect match, no need to check other categories
        if (bestMatch.score === 75 && bestMatch.matchType === 'exact') break;
    }
    
    return bestMatch;
}

// Helper function to escape regex special characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Enhanced word boundary checking function
function hasWordBoundary(text, keyword) {
    // Handle multi-word phrases by checking each word has boundaries
    if (keyword.includes(' ')) {
        return matchesPhrase(text, keyword);
    }
    
    // For single words, use regex word boundaries
    const regex = new RegExp('\\b' + escapeRegex(keyword) + '\\b', 'i');
    return regex.test(text);
}

// Check multi-word phrase with proper word boundaries
function matchesPhrase(text, phrase) {
    const words = phrase.split(/\s+/);
    
    // Create pattern that matches the phrase with word boundaries around each word
    const pattern = words.map(word => '\\b' + escapeRegex(word) + '\\b').join('\\s+');
    const regex = new RegExp(pattern, 'i');
    
    return regex.test(text);
}

function calculateScore(seniority, jobFunctionResult) {
    let totalScore = 0;
    
    // Seniority score: 25 points if matches target seniority levels
    if (appState.targetSeniorityLevels.includes(seniority)) {
        totalScore += 25;
    }
    
    // Job function score: from detection result
    totalScore += jobFunctionResult.score;
    
    return totalScore;
}

// Dashboard functions
function updateDashboard() {
    // Update stats
    const totalLeads = appState.filteredData.length;
    const matchedLeads = appState.filteredData.filter(lead => lead.Total_Score > 0).length;
    const avgScore = totalLeads > 0 ? (appState.filteredData.reduce((sum, lead) => sum + lead.Total_Score, 0) / totalLeads).toFixed(1) : 0;
    
    document.getElementById('totalLeads').textContent = totalLeads;
    document.getElementById('matchedLeads').textContent = matchedLeads;
    document.getElementById('avgScore').textContent = avgScore;
    
    // Update charts
    updateCharts();
}

function updateCharts() {
    updateSeniorityChart();
    updateJobFunctionChart();
}

function updateSeniorityChart() {
    const ctx = document.getElementById('seniorityChart').getContext('2d');
    
    // Count leads by seniority
    const seniorityCount = {};
    const allSeniorityLevels = ['C-Level', 'Vice President', 'Director', 'Head of', 'Manager', 'Unmatched'];
    
    allSeniorityLevels.forEach(level => seniorityCount[level] = 0);
    
    appState.filteredData.forEach(lead => {
        const seniority = lead.Detected_Seniority || 'Unmatched';
        seniorityCount[seniority] = (seniorityCount[seniority] || 0) + 1;
    });
    
    const labels = Object.keys(seniorityCount).filter(key => seniorityCount[key] > 0);
    const data = labels.map(label => seniorityCount[label]);
    const colors = labels.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    
    if (appState.charts.seniority) {
        appState.charts.seniority.destroy();
    }
    
    appState.charts.seniority = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function updateJobFunctionChart() {
    const ctx = document.getElementById('jobFunctionChart').getContext('2d');
    
    // Count leads by job function
    const jobFunctionCount = {};
    
    appState.filteredData.forEach(lead => {
        const jobFunction = lead.Detected_Job_Function || 'Other/Unmatched';
        jobFunctionCount[jobFunction] = (jobFunctionCount[jobFunction] || 0) + 1;
    });
    
    // Sort by count and take top 10
    const sortedJobFunctions = Object.entries(jobFunctionCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const labels = sortedJobFunctions.map(([label]) => label);
    const data = sortedJobFunctions.map(([,count]) => count);
    const colors = labels.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
    
    if (appState.charts.jobFunction) {
        appState.charts.jobFunction.destroy();
    }
    
    appState.charts.jobFunction = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Leads',
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

// Filter functions
function setupFilters() {
    setupSeniorityFilters();
    setupJobFunctionFilters();
}

function setupSeniorityFilters() {
    const container = document.getElementById('seniorityFilters');
    const seniorityLevels = [...new Set(appState.processedData.map(lead => lead.Detected_Seniority))];
    
    container.innerHTML = '';
    
    seniorityLevels.forEach(level => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = level;
        checkbox.checked = true;
        checkbox.addEventListener('change', applyFilters);
        
        const customCheckbox = document.createElement('span');
        customCheckbox.className = 'checkbox-custom';
        
        label.appendChild(checkbox);
        label.appendChild(customCheckbox);
        label.appendChild(document.createTextNode(level));
        
        container.appendChild(label);
    });
}

function setupJobFunctionFilters() {
    const jobFunctions = [...new Set(appState.processedData.map(lead => lead.Detected_Job_Function))].sort();
    populateJobFunctionDropdown(jobFunctions);
}

function setupJobFunctionDropdown() {
    const dropdown = document.getElementById('jobFunctionDropdown');
    const input = document.getElementById('jobFunctionInput');
    const search = document.getElementById('jobFunctionSearch');
    const options = document.getElementById('jobFunctionOptions');
    const selectAllBtn = document.getElementById('selectAllJobFunctions');
    const clearAllBtn = document.getElementById('clearAllJobFunctions');
    
    // Toggle dropdown
    input.addEventListener('click', () => {
        const isOpen = options.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            options.classList.add('open');
            input.classList.add('active');
            search.focus();
        }
    });
    
    // Search functionality
    search.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterJobFunctionOptions(searchTerm);
    });
    
    // Select/Clear all buttons
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = options.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.closest('.multi-select-option').style.display !== 'none') {
                cb.checked = true;
            }
        });
        updateJobFunctionSelection();
        applyFilters();
    });
    
    clearAllBtn.addEventListener('click', () => {
        const checkboxes = options.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.closest('.multi-select-option').style.display !== 'none') {
                cb.checked = false;
            }
        });
        updateJobFunctionSelection();
        applyFilters();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            closeAllDropdowns();
        }
    });
    
    // Prevent search input from closing dropdown
    search.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function populateJobFunctionDropdown(jobFunctions) {
    const list = document.getElementById('jobFunctionList');
    const count = document.getElementById('jobFunctionCount');
    
    list.innerHTML = '';
    
    jobFunctions.forEach(jobFunction => {
        const option = document.createElement('div');
        option.className = 'multi-select-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = jobFunction;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            updateJobFunctionSelection();
            applyFilters();
        });
        
        const label = document.createElement('label');
        label.textContent = jobFunction;
        label.style.cursor = 'pointer';
        label.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            updateJobFunctionSelection();
            applyFilters();
        });
        
        option.appendChild(checkbox);
        option.appendChild(label);
        list.appendChild(option);
    });
    
    count.textContent = `${jobFunctions.length} of ${jobFunctions.length} selected`;
}

function filterJobFunctionOptions(searchTerm) {
    const options = document.querySelectorAll('#jobFunctionList .multi-select-option');
    
    options.forEach(option => {
        const label = option.querySelector('label').textContent.toLowerCase();
        if (label.includes(searchTerm)) {
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
}

function updateJobFunctionSelection() {
    const checkboxes = document.querySelectorAll('#jobFunctionList input[type="checkbox"]');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    const count = document.getElementById('jobFunctionCount');
    
    count.textContent = `${selected.length} of ${checkboxes.length} selected`;
    
    // Update search placeholder
    const search = document.getElementById('jobFunctionSearch');
    if (selected.length === 0) {
        search.placeholder = 'No job functions selected';
    } else if (selected.length === checkboxes.length) {
        search.placeholder = 'All job functions selected';
    } else {
        search.placeholder = `${selected.length} job functions selected`;
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.multi-select-options.open').forEach(dropdown => {
        dropdown.classList.remove('open');
    });
    document.querySelectorAll('.multi-select-input.active').forEach(input => {
        input.classList.remove('active');
    });
}

function applyFilters() {
    let filtered = [...appState.processedData];
    
    // Seniority filter
    const checkedSeniorities = Array.from(document.querySelectorAll('#seniorityFilters input:checked'))
        .map(cb => cb.value);
    
    if (checkedSeniorities.length > 0) {
        filtered = filtered.filter(lead => checkedSeniorities.includes(lead.Detected_Seniority));
    }
    
    // Job function filter
    const selectedJobFunctions = Array.from(document.querySelectorAll('#jobFunctionList input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selectedJobFunctions.length > 0) {
        filtered = filtered.filter(lead => selectedJobFunctions.includes(lead.Detected_Job_Function));
    }
    
    // Score range filter
    const minScore = parseInt(document.getElementById('minScore').value) || 0;
    const maxScore = parseInt(document.getElementById('maxScore').value) || 100;
    
    filtered = filtered.filter(lead => lead.Total_Score >= minScore && lead.Total_Score <= maxScore);
    
    appState.filteredData = filtered;
    appState.currentPage = 1;
    
    updateFilterSummary();
    updateDashboard();
    displayResults();
}

function updateFilterSummary() {
    const summaryText = document.querySelector('.filter-summary-text');
    const badgesContainer = document.getElementById('filterBadges');
    
    // Count active filters
    const totalSeniorities = document.querySelectorAll('#seniorityFilters input').length;
    const selectedSeniorities = document.querySelectorAll('#seniorityFilters input:checked').length;
    const totalJobFunctions = document.querySelectorAll('#jobFunctionList input[type="checkbox"]').length;
    const selectedJobFunctions = document.querySelectorAll('#jobFunctionList input[type="checkbox"]:checked').length;
    const hasScoreFilter = document.getElementById('minScore').value || document.getElementById('maxScore').value;
    
    const seniorityFiltered = selectedSeniorities < totalSeniorities;
    const jobFunctionFiltered = selectedJobFunctions < totalJobFunctions;
    
    // Update summary text
    if (!seniorityFiltered && !jobFunctionFiltered && !hasScoreFilter) {
        summaryText.textContent = 'No filters applied';
    } else {
        summaryText.textContent = `${appState.filteredData.length} of ${appState.processedData.length} leads match current filters`;
    }
    
    // Create filter badges
    badgesContainer.innerHTML = '';
    
    if (seniorityFiltered) {
        const badge = createFilterBadge(`Seniority: ${selectedSeniorities}/${totalSeniorities}`, () => {
            document.querySelectorAll('#seniorityFilters input').forEach(cb => cb.checked = true);
            applyFilters();
        });
        badgesContainer.appendChild(badge);
    }
    
    if (jobFunctionFiltered) {
        const badge = createFilterBadge(`Job Functions: ${selectedJobFunctions}/${totalJobFunctions}`, () => {
            document.querySelectorAll('#jobFunctionList input[type="checkbox"]').forEach(cb => cb.checked = true);
            updateJobFunctionSelection();
            applyFilters();
        });
        badgesContainer.appendChild(badge);
    }
    
    if (hasScoreFilter) {
        const minScore = document.getElementById('minScore').value || 0;
        const maxScore = document.getElementById('maxScore').value || 100;
        const badge = createFilterBadge(`Score: ${minScore}-${maxScore}`, () => {
            document.getElementById('minScore').value = '';
            document.getElementById('maxScore').value = '';
            applyFilters();
        });
        badgesContainer.appendChild(badge);
    }
}

function createFilterBadge(text, removeCallback) {
    const badge = document.createElement('div');
    badge.className = 'filter-badge';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    
    const removeBtn = document.createElement('span');
    removeBtn.className = 'filter-badge-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', removeCallback);
    
    badge.appendChild(textSpan);
    badge.appendChild(removeBtn);
    
    return badge;
}

function clearAllFilters() {
    // Reset seniority filters
    document.querySelectorAll('#seniorityFilters input').forEach(cb => cb.checked = true);
    
    // Reset job function filters
    document.querySelectorAll('#jobFunctionList input[type="checkbox"]').forEach(cb => cb.checked = true);
    updateJobFunctionSelection();
    
    // Reset score filters
    document.getElementById('minScore').value = '';
    document.getElementById('maxScore').value = '';
    
    applyFilters();
}

// Results display functions
function displayResults() {
    const table = document.getElementById('resultsTable');
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    
    if (appState.filteredData.length === 0) {
        thead.innerHTML = '';
        tbody.innerHTML = '<tr><td colspan="100%" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No leads match the current filters</td></tr>';
        updateResultsCount(0);
        return;
    }
    
    // Create header
    if (thead.children.length === 0) {
        const headers = Object.keys(appState.filteredData[0]).filter(key => !key.startsWith('_'));
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.replace(/_/g, ' ');
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => sortTable(header));
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
    }
    
    // Paginate data
    const startIndex = (appState.currentPage - 1) * appState.rowsPerPage;
    const endIndex = startIndex + appState.rowsPerPage;
    const pageData = appState.filteredData.slice(startIndex, endIndex);
    
    // Create rows
    tbody.innerHTML = '';
    
    pageData.forEach(lead => {
        const row = document.createElement('tr');
        
        Object.keys(lead).forEach(key => {
            if (key.startsWith('_')) return; // Skip internal fields
            
            const cell = document.createElement('td');
            let value = lead[key];
            
            if (key === 'Total_Score' || key === 'Job_Function_Score') {
                cell.className = 'score-cell';
                if (value >= 70) cell.classList.add('score-high');
                else if (value >= 40) cell.classList.add('score-medium');
                else cell.classList.add('score-low');
            }
            
            cell.textContent = value;
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    updateResultsCount(appState.filteredData.length);
    updatePagination();
}

function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = `${count} lead${count !== 1 ? 's' : ''}`;
}

function updatePagination() {
    const totalPages = Math.ceil(appState.filteredData.length / appState.rowsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');
    
    prevBtn.disabled = appState.currentPage <= 1;
    nextBtn.disabled = appState.currentPage >= totalPages;
    
    if (totalPages > 1) {
        paginationInfo.textContent = `Page ${appState.currentPage} of ${totalPages}`;
        document.getElementById('pagination').style.display = 'flex';
    } else {
        document.getElementById('pagination').style.display = 'none';
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(appState.filteredData.length / appState.rowsPerPage);
    appState.currentPage = Math.max(1, Math.min(totalPages, appState.currentPage + direction));
    displayResults();
}

function sortTable(column) {
    const isNumeric = ['Total_Score', 'Job_Function_Score'].includes(column);
    
    appState.filteredData.sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';
        
        if (isNumeric) {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
            return bVal - aVal; // Descending for numeric
        } else {
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();
            return aVal.localeCompare(bVal); // Ascending for text
        }
    });
    
    appState.currentPage = 1;
    displayResults();
}

// Export function
function exportResults() {
    if (appState.filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Get headers (exclude internal fields)
    const headers = Object.keys(appState.filteredData[0]).filter(key => !key.startsWith('_'));
    
    // Create CSV content
    let csvContent = headers.map(header => `"${header}"`).join(',') + '\n';
    
    appState.filteredData.forEach(lead => {
        const row = headers.map(header => {
            const value = lead[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',');
        csvContent += row + '\n';
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        // Generate filename with timestamp and filter info
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `lead_analysis_${timestamp}_${appState.filteredData.length}_leads.csv`;
        link.setAttribute('download', filename);
        
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}