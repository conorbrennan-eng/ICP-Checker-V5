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

// Job Function Keywords
const JOB_FUNCTIONS = {
    'IT Infrastructure & Cloud': ['IT Infrastructure & Cloud', 'Chief Technology Officer', 'Chief Information Officer', 'Infrastructure Services', 'Service Management', 'Technical Operations', 'Network Infrastructure', 'Systems Engineering', 'Network & Infrastructure', 'Enterprise Infrastructure', 'Network Operations', 'Infrastructure Engineering', 'Technology Infrastructure', 'Data Center Operations', 'Technical Infrastructure', 'Cloud Platform', 'Infrastructure Technology', 'Systems & Infrastructure', 'Systems Integration', 'Infrastructure Strategy', 'Infrastructure Management', 'Systems Operations', 'Cloud & Platform', 'Network & Systems', 'Cloud Services', 'Infrastructure & Cloud', 'Network Systems', 'Cloud Site Reliability Engineer', 'Information Systems', 'Business Information Systems', 'Information Services', 'Cloud Architect', 'Network Architect', 'Platform and Systems', 'Senior Network Architect', 'Infrastructure Architect', 'Systems Administrator', 'Network Engineer', 'Cloud Infrastructure', 'IT Operations', 'Technology Operations', 'Cloud Engineer'],
    'Cybersecurity': ['Cybersecurity', 'Information Security', 'Cyber Security', 'Application Security', 'Security Officer', 'Technology Risk', 'Infrastructure Security', 'CISO', 'Threat Intelligence', 'IT Security & Compliance', 'Infrastructure Security Engineering', 'CSO', 'Cyber Security Risk Oversight', 'Information Security Architect', 'IT Risk Management', 'Information Technology & Security', 'Data Governance', 'AI Security', 'Security Architecture', 'Cloud Security', 'Cyber Defense', 'Security Operations', 'Cyber Risk', 'Risk & Security', 'Compliance & Security', 'Security Engineering', 'Cyber Operations', 'Security & Compliance', 'Information Assurance', 'Security Strategy', 'Cyber Risk Management', 'Cyber Intelligence', 'Digital Security', 'Cyber Threat Management', 'Enterprise Security', 'Security Governance', 'Cyber Resilience', 'Security Innovation', 'Cyber Analytics', 'Security Technology', 'Information Protection', 'Threat Management', 'Cyber Innovation', 'Cyber Defense Strategy', 'Security Operations Center', 'Cyber Security Policy', 'Cyber Strategy', 'Security Compliance', 'Cyber Operations & Defense', 'Security & Risk Management', 'CyberSecurity Engineer', 'Business Information Security', 'BISO', 'Network Security', 'Cyber Warfare', 'Security', 'Security Risk and Governance'],
    'DevOps & Engineering': ['DevOps & Engineering', 'Platform Engineering', 'SRE', 'Site Reliability Engineering', 'DevOps', 'Software Engineering', 'Solution Architect', 'Infrastructure Engineering', 'Software Architect', 'Engineering Operations', 'Infrastructure & DevOps', 'Infrastructure Automation', 'DevOps Strategy', 'Developer Experience', 'Engineering Infrastructure', 'Release Engineering', 'DevOps Engineering', 'Platform Technology', 'System Reliability', 'SRE & Platform', 'Engineering Productivity', 'Continuous Integration', 'Platform Operations', 'Platform Innovation', 'Platform Strategy', 'Engineering Excellence', 'DevOps Operations', 'Engineering Efficiency', 'Platform & Infrastructure', 'DevOps & Platform', 'Engineering Platform', 'Platform & Operations', 'Infrastructure Operations', 'Engineering & Operations', 'Principal Engineer', 'Application Engineer', 'Application Development', 'Enterprise Systems Devops Engineer', 'Systems Devops Engineer', 'Software/Cloud Engineer', 'Software Test', 'Software Engineer', 'Cloud Engineer', 'Software Engineer Cloud', 'Solutions Architect', 'Application Officer', 'Application', 'Engineer'],
    'Data & Analytics': ['Data & Analytics', 'Data Engineering', 'Business Intelligence', 'Data Management', 'Analytics Officer', 'Data Monetization', 'Data Architecture', 'Data Quality', 'Data & Analytics Officer', 'Data Integration', 'Data Products', 'Cloud Engineering', 'Data Risk & Privacy', 'CAO', 'Data Science', 'Data Analytics & Strategy', 'Insights & Analytics', 'CDO', 'Data Strategy', 'Analytics', 'Analytics & Data Science', 'Business Analytics', 'Data Analyst', 'Data Scientist', 'Data Operations', 'Analytics & Insights', 'Advanced Analytics', 'Analytics Engineering', 'Data Platform', 'Data Innovation', 'Predictive Analytics', 'Data Insights', 'Data Intelligence', 'Analytics Strategy', 'Data Technology', 'Data Governance', 'Analytics Operations', 'Data Science & Engineering', 'Business Intelligence & Analytics', 'Data & Insights', 'Analytics Innovation', 'Data & Business Intelligence', 'Data Excellence', 'Analytical Sciences', 'Data'],
    'AI / ML': ['AI / ML', 'Data & AI', 'AI', 'Cloud and AI Officer', 'Data and AI', 'AI Officer CAIO', 'AI Engineering', 'CAIO', 'AI Technologies', 'Gen AI', 'AI Solutions', 'Artificial Intelligence Officer', 'AI Strategy', 'AI Development', 'AI & Machine Learning', 'AI Infrastructure', 'Artificial Intelligence', 'Machine Learning', 'Data Science & AI', 'ML Operations', 'AI Innovation', 'AI Research', 'AI Products', 'AI Platform', 'Machine Learning Engineering', 'AI Technology', 'AI Operations', 'AI & Analytics', 'Artificial Intelligence Research', 'ML Platform', 'AI Applications', 'AI Excellence', 'AI Systems'],
    'IT Strategy & ENT Architecture': ['IT Strategy & ENT Architecture', 'Enterprise Architect', 'IT Strategy and Operations', 'Strategy Officer', 'Enterprise Architecture', 'CSO', 'IT Strategy', 'Technology Strategy', 'Technical Strategy', 'IT Planning & Strategy', 'Enterprise Solutions', 'Technology Innovation', 'Strategic Initiatives', 'Strategic Technology', 'Technology Excellence', 'Enterprise Systems', 'IT Innovation', 'Enterprise Integration', 'Technology Planning', 'IT Strategy & Architecture', 'IT Strategy & Planning', 'Enterprise Technology', 'Technology Operations Strategy', 'IT Business Strategy', 'Enterprise Platform Strategy', 'Technology Roadmap', 'IT Strategic Planning', 'Enterprise Technology Strategy', 'Information Technology', 'Infrastructure Security Engineering'],
    'IT Governance': ['IT Governance', 'IT Compliance', 'Technology Governance', 'Enterprise Data Governance', 'Information Governance', 'AI Governance', 'Technology Risk & Compliance', 'IT Risk & Compliance', 'CCO', 'IT Innovation'],
    'Digital Transformation and Innovation': ['Digital Transformation and Innovation', 'Digital', 'Innovation', 'Emerging Technology', 'Emerging Technologies', 'Innovation Officer', 'Digital Strategy', 'Transformation Officer', 'Transformation', 'Digital Transformation', 'Strategic Initiatives', 'Digital Innovation', 'Digital Modernization', 'Digital Future', 'Innovation Management', 'Digital Acceleration', 'Innovation & Strategy', 'Cyber Innovation'],
    'Automation': ['Automation', 'Automation Engineer', 'Engineer Automation', 'Automation and Controls', 'Digital and Automation', 'Automation Anywhere', 'build automation', 'cognitive automation', 'industrial automation', 'intelligent automation', 'process automation', 'smart automation', 'workflow automation', 'IDigital Process Automation', 'Digital Process Automation', 'Intelligent Automation', 'Process & Improvement', 'Process Quality', 'process improvement', 'process optimization', 'process optimisation', 'workflow'],
    'Product Management & Development': ['Product Management & Development', 'Product', 'Product Development', 'Product & Customer Officer', 'Product Management', 'Product Management and Strategy', 'Direcror of Product Management and Strategy', 'Product Design', 'Direcror of Product Design', 'Product Innovation', 'Product & Innovation', 'Product & Strategy', 'Product Analytics', 'Product Delivery', 'Product Ecosystem', 'Product Engineering', 'Product Excellence', 'Product Solutions', 'Product Strategy', 'Product Strategy & Operations', 'Product Success', 'Product Technology', 'Product Transformation', 'Product Vision', 'Product Platform', 'Product Portfolio', 'Platform & Operations'],
    'R&D': ['R&D', 'Research & Development', 'Research', 'Scientific Officer', 'Scientific Research', 'Research Programs', 'R&D Strategy', 'Research & Development Officer', 'Laboratory', 'Innovation & Research', 'Research Operations', 'Development Operations', 'R&D Innovation', 'Research Technology', 'Development Technology', 'R&D Excellence', 'Research Strategy', 'R&D Operations', 'R&D Technology', 'Research & Innovation', 'Development Innovation', 'R&D Leadership', 'Research Excellence', 'Development Excellence', 'R&D Transformation', 'Data Innovation'],
    'Digital Product': ['Digital Product', 'Digital Product Officer', 'Digital Product Management', 'Digital Experience', 'Digital Platforms', 'Digital Product Strategy', 'Digital Product Development', 'Digital Product Operations', 'Digital Product Growth', 'Digital Product Technology', 'Digital Product Excellence', 'Digital Product Vision', 'Digital Product Platform', 'Digital Product Solutions', 'Digital Product Design', 'Digital Product Analytics', 'Digital Product Marketing', 'Digital Product Success', 'Digital Product Engineering', 'Digital Product Planning', 'Digital Product Delivery', 'Digital Product Portfolio', 'Digital Product Leadership', 'Digital Product Transformation', 'Digital Product & Strategy'],
    'UX': ['UX', 'Design Officer', 'User Experience', 'Design', 'UX Design', 'User Interface Design', 'Experience Design', 'UX Strategy', 'Design Strategy', 'UX Operations', 'UX Innovation', 'Experience Strategy', 'Design Excellence', 'UX Excellence', 'User Experience Strategy', 'Design & UX', 'UX & Design', 'UX Leadership'],
    'Marketing': ['Marketing', 'CMO', 'Marketing Officer', 'Growth Officer', 'Growth Marketing', 'Brand Officer', 'Marketing Strategy', 'Marketing Operations', 'Content Marketing', 'Performance Marketing', 'Marketing Analytics', 'Marketing Technology', 'Creative Marketing', 'Marketing Innovation', 'Marketing Excellence', 'Marketing Growth', 'Marketing Experience', 'Marketing & Communications', 'Marketing & Sales', 'Global Marketing', 'Regional Marketing', 'Marketing Transformation', 'Field Marketing', 'Demand Generation', 'Customer Marketing', 'Customer Acquisition', 'Customer Voice'],
    'Digital Marketing': ['Digital Marketing', 'Digital Marketing Strategy', 'Digital Marketing Operations', 'Digital Customer Acquisition', 'Digital Brand Marketing', 'Digital Performance Marketing', 'Digital Marketing Analytics', 'Digital Marketing Technology', 'Digital Marketing Innovation', 'Digital Content Marketing', 'Digital Marketing Excellence', 'Digital Marketing Experience', 'Digital Marketing Transformation', 'Digital Marketing & Growth', 'Digital Marketing & Brand', 'Digital Marketing & Customer', 'Digital Marketing & Strategy', 'Digital Marketing & Innovation', 'Digital Marketing & Analytics', 'Digital Marketing & Technology', 'Digital Marketing & Operations'],
    'Ecommerce': ['Ecommerce', 'Digital Commerce', 'Online Commerce', 'Ecommerce Strategy', 'Ecommerce Operations', 'Ecommerce Technology', 'Ecommerce Growth', 'Ecommerce Innovation', 'Ecommerce Excellence', 'Digital Retail', 'Online Retail', 'Ecommerce & Digital', 'Ecommerce Platform', 'Ecommerce & Digital Marketing', 'Ecommerce Leadership', 'Ecommerce Business', 'Commercial Digital Platforms', 'Digital Merchandising', 'E - Commerce', 'Ecommerce Experience', 'Ecommerce & Operations', 'Ecommerce & Innovation'],
    'Customer Experience & Support': ['Customer Experience & Support', 'Customer', 'Customer Success', 'Customer Success Officer', 'Customer Operations', 'Customer Support', 'Customer Service', 'Customer Engagement', 'Customer Strategy', 'Customer Innovation', 'Customer Excellence', 'Customer Technology', 'Customer Satisfaction', 'Customer Journey', 'Customer Platform', 'Customer Solutions', 'Customer Care', 'Customer Advocacy', 'Customer Relationship Management', 'Customer Value', 'Customer Transformation', 'Customer & Experience', 'Customer Operations & Success', 'Customer Experience', 'Customer Engagement Platform', 'Customer & Employee Experience', 'Experience', 'Customer Officer', 'Customer Voice', 'Chief Customer Officer', 'Customer & Experience Strategy', 'Customer Insights', 'Customer and Market Research', 'Consumer Insights', 'Consumer & Market Insights', 'Consumer Markets', 'Consumer Platforms', 'Personalization', 'Direct-to-Consumer', 'Consumer Engagement'],
    'Communications': ['Communications', 'Corporate Communications', 'Internal Communications', 'External Communications', 'Public Relations', 'Digital Communications', 'Strategic Communications', 'Communications Strategy', 'Communications Operations', 'Communications Innovation', 'Global Communications', 'Communications Analytics', 'Communications Transformation', 'Crisis Communications', 'Employee Communications', 'Communications & Marketing', 'Communications & Brand', 'Communications & Public Relations'],
    'Brand': ['Brand', 'Brand Officer', 'Brand Strategy Officer', 'Brand Strategy', 'Brand Innovation', 'Brand Excellence', 'Brand Experience', 'Brand Operations', 'Brand Technology', 'Brand Management', 'Brand Leadership', 'Global Brand', 'Brand Portfolio', 'Brand Performance', 'Brand Insights', 'Brand Engagement', 'Brand & Marketing', 'Brand & Communications', 'Brand & Strategy', 'Brand & Innovation', 'Brands'],
    'Creative': ['Creative', 'Experiential', 'Creative Producer', 'Branded Partnerships', 'Associate Creative', 'Experiential Creative', 'Content', 'Content & Programming', 'Content Strategy', 'Content Producer', 'Creative Services', 'Design Leadership'],
    'Event': ['Event', 'Events', 'Event Marketing', 'Event Strategy', 'Event Operations', 'Event Innovation', 'Event Excellence', 'Event Technology', 'Corporate Events', 'Global Events', 'Regional Events', 'Event Development', 'Event Experience', 'Event Communications', 'Event Production', 'Event Services', 'Event Logistics', 'Event & Marketing', 'Event & Experience', 'Event & Strategy', 'Event Leadership', 'Event Transformation', 'Event & Communications', 'Event & Brand'],
    'Operations': ['Operations', 'Operating', 'Business Officer', 'Business Operations', 'Operations Strategy', 'Operations Excellence', 'Operations Innovation', 'Operations Technology', 'Operations Analytics', 'Operations Transformation', 'Operations Performance', 'Operations Management', 'Operations Director', 'Operations Leadership', 'Global Operations', 'Manufacturing Operations', 'Service Operations', 'Operations & Strategy', 'Operations & Technology', 'Operations & Innovation', 'Operations & Excellence', 'Operations & Analytics', 'Operations & Transformation', 'Operations & Performance', 'Process & Operations', 'Process & Strategy', 'Process & Technology', 'Process & Innovation', 'Process & Excellence', 'Process & Analytics', 'Process & Improvement'],
    'Process': ['Process', 'Business Process Management', 'Process Improvement', 'Process Excellence', 'Operational Excellence', 'Continuous Improvement', 'Business Process Improvement', 'Process Engineering', 'Process Transformation', 'Process Strategy', 'Process Optimization', 'Process Innovation', 'Process Operations', 'Process Management', 'Process Development', 'Process Leadership', 'Process & Operations', 'Process & Strategy', 'Process & Technology', 'Process & Transformation', 'Process & Excellence', 'Process & Analytics', 'Process & Improvement'],
    'Manufacturing': ['Manufacturing Systems', 'Manufacturing', 'Global Manufacturing', 'Robotics', 'Manufacturing Process', 'Production Line', 'Assembly Line', 'Quality Control', 'Lean Manufacturing', 'Human Machine Interface', 'production', 'robotic systems', 'smart factory', 'quality assurance', 'Industry 4.0', 'Advanced Analytics', 'Data Center Operations'],
    'Legal & Compliance': ['Legal & Compliance', 'Legal', 'Legal & Compliance Officer', 'Compliance', 'Governance Officer', 'Governance', 'Ethics', 'Privacy', 'Regulatory Affairs', 'Legal Operations', 'Legal Strategy', 'Legal Technology', 'Compliance Operations', 'Compliance Strategy', 'Compliance Innovation', 'Compliance Excellence', 'Legal & Risk', 'Legal Leadership', 'Legal & Ethics', 'CLO', 'Corporate Governance', 'Legal & Regulatory'],
    'Sales': ['Sales', 'Revenue Officer', 'Revenue', 'Commercial Officer', 'Business Development', 'Sales Operations', 'Sales Strategy', 'Sales Excellence', 'Sales Innovation', 'Sales Technology', 'Sales Analytics', 'Sales Development', 'Sales Performance', 'Sales Growth', 'Sales Leadership', 'Sales & Marketing', 'Sales & Revenue', 'Sales & Business Development', 'Sales & Customer Success', 'Sales & Operations', 'Sales Strategy & Operations', 'Sales Excellence & Performance', 'Global Sales', 'Regional Sales', 'Enterprise Sales', 'CRO', 'Sales Technology'],
    'Finance': ['Finance', 'Financial', 'Finance Officer', 'Financial Planning & Analysis', 'Accounting Officer', 'Financial Operations', 'Financial Strategy', 'Financial Technology', 'Financial Analytics', 'Financial Innovation', 'Financial Excellence', 'Financial Transformation', 'Financial Controls', 'Financial Performance', 'Treasury', 'Accounting', 'Financial Reporting', 'Budget & Planning', 'Corporate Finance', 'Financial Compliance', 'Financial Business Partnering', 'Financial & Strategy', 'Financial & Operations', 'Financial Leadership', 'CAO', 'CFO'],
    'Human Resources': ['Human Resources', 'People Officer', 'People & Culture', 'Talent Management', 'HR Operations', 'HR Strategy', 'HR Technology', 'HR Analytics', 'HR Innovation', 'HR Excellence', 'People Operations', 'People Strategy', 'People Technology', 'People Analytics', 'People Innovation', 'People Excellence', 'People Transformation', 'HR Business Partnering', 'CHRO', 'People and Culture', 'Talent', 'Global Talent', 'Human Resource', 'People', 'Enterprise Learning', 'Learning', 'HR', 'L&D', 'Professional Enablement', 'Culture & Talent', 'People & Organization', 'Employee Resource', 'Leadership Development', 'Coaching', 'Organisational Development'],
    'Procurement & Supply Chain': ['Procurement & Supply Chain', 'Procurement', 'Supply Chain', 'Sourcing Officer', 'Sourcing', 'Logistics Officer', 'Logistics', 'Supply Chain Strategy', 'Procurement Strategy', 'Procurement Excellence', 'Supply Chain Operations', 'Supply Chain Technology', 'Procurement Technology', 'Supply Chain Planning', 'Vendor Management', 'Supply Chain Leadership', 'Procurement Analytics', 'Procurement Innovation', 'Supply Chain Excellence', 'Supply Chain Innovation', 'Supply Chain Transformation', 'Procurement Transformation', 'Global Procurement', 'Strategic Sourcing'],
    'Risk & Business Continuity': ['Risk & Business Continuity', 'Business Continuity', 'Risk Management', 'Enterprise Risk Officer', 'Enterprise Risk', 'Risk Strategy', 'Risk Innovation', 'Risk Excellence', 'Risk Operations', 'Risk Technology', 'Business Continuity Strategy', 'Business Continuity Innovation', 'Business Continuity Excellence', 'Business Continuity Operations', 'Business Continuity Technology', 'Risk', 'Enterprise Resilience', 'Risk Assessment', 'Operational Risk', 'Strategic Risk'],
    'Sustainability & ESG': ['Sustainability & ESG', 'Sustainability', 'ESG Officer', 'ESG', 'Environmental', 'Environmental Affairs', 'Sustainability Strategy', 'Sustainability Innovation', 'Sustainability Excellence', 'Sustainability Operations', 'ESG Strategy', 'ESG Innovation', 'ESG Excellence', 'ESG Operations', 'ESG Technology', 'ESG Analytics', 'ESG Transformation', 'Environmental Strategy', 'Climate Strategy', 'Corporate Sustainability', 'Social Impact', 'ESG Reporting', 'Sustainability Leadership', 'ESG Leadership', 'Sustainability Technology', 'ESG Transformation'],
    'Facilities': ['Facilities', 'Capital Projects', 'Destination Development', 'Facility Coordinator', 'Building and Facilities Operations', 'Facility']
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
        const detectedJobFunctions = detectJobFunctions(jobTitle);
        const score = calculateScore(detectedSeniority, detectedJobFunctions);

        // Combine job functions into a single comma-separated string
        const jobFunctionCategories = detectedJobFunctions.map(jf => jf.category).join(', ');
        const maxJobFunctionScore = Math.max(...detectedJobFunctions.map(jf => jf.score));

        return {
            ...lead, // Preserve all original data
            Detected_Seniority: detectedSeniority,
            Detected_Job_Function: jobFunctionCategories,
            Job_Function_Score: maxJobFunctionScore,
            Total_Score: score,
            _originalIndex: index,
            _jobFunctions: detectedJobFunctions // Store for internal use
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

function detectJobFunctions(jobTitle) {
    if (!jobTitle) return [{ category: 'Other/Unmatched', score: 0 }];

    const title = jobTitle.toLowerCase().trim();
    let allMatches = [];

    // Keywords are already sorted by length (longest first) in the data structure
    for (const [category, keywords] of Object.entries(JOB_FUNCTIONS)) {
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase().trim();

            // Check for exact phrase match first
            if (title === lowerKeyword) {
                allMatches.push({
                    category,
                    score: 75,
                    keywordLength: lowerKeyword.length,
                    matchType: 'exact'
                });
                continue;
            }

            // Check for word boundary matches ONLY - no substring matching
            if (hasWordBoundary(title, lowerKeyword)) {
                const score = 75; // Full word boundary match
                allMatches.push({
                    category,
                    score,
                    keywordLength: lowerKeyword.length,
                    matchType: 'word-boundary'
                });
            }
        }
    }

    // If no matches found, return single "Other/Unmatched" entry
    if (allMatches.length === 0) {
        return [{ category: 'Other/Unmatched', score: 0 }];
    }

    // Sort by score (descending) and then by keyword length (descending)
    allMatches.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.keywordLength - a.keywordLength;
    });

    // Remove duplicate categories - keep only the best match for each category
    const uniqueMatches = [];
    const seenCategories = new Set();

    for (const match of allMatches) {
        if (!seenCategories.has(match.category)) {
            uniqueMatches.push(match);
            seenCategories.add(match.category);
        }
        if (uniqueMatches.length >= 2) break;
    }

    // Return 1 or 2 matches based on what was found
    return uniqueMatches;
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

function calculateScore(seniority, jobFunctionsArray) {
    let totalScore = 0;

    // Seniority score: 25 points if matches target seniority levels
    if (appState.targetSeniorityLevels.includes(seniority)) {
        totalScore += 25;
    }

    // Job function score: use the maximum score from all detected job functions
    const maxJobFunctionScore = Math.max(...jobFunctionsArray.map(jf => jf.score));
    totalScore += maxJobFunctionScore;

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

    // Count leads by job function - split comma-separated values and count each
    const jobFunctionCount = {};

    appState.filteredData.forEach(lead => {
        if (lead.Detected_Job_Function) {
            // Split by comma and trim whitespace
            const functions = lead.Detected_Job_Function.split(',').map(f => f.trim());
            functions.forEach(func => {
                jobFunctionCount[func] = (jobFunctionCount[func] || 0) + 1;
            });
        }
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
    // Collect all unique job functions from comma-separated values
    const allJobFunctions = new Set();
    appState.processedData.forEach(lead => {
        if (lead.Detected_Job_Function) {
            // Split by comma and trim whitespace
            const functions = lead.Detected_Job_Function.split(',').map(f => f.trim());
            functions.forEach(func => allJobFunctions.add(func));
        }
    });
    const jobFunctions = [...allJobFunctions].sort();
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
    
    // Job function filter - match if ANY of the lead's comma-separated job functions match the selected filters
    const selectedJobFunctions = Array.from(document.querySelectorAll('#jobFunctionList input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    if (selectedJobFunctions.length > 0) {
        filtered = filtered.filter(lead => {
            if (!lead.Detected_Job_Function) return false;
            // Split comma-separated job functions
            const leadJobFunctions = lead.Detected_Job_Function.split(',').map(f => f.trim());
            // Check if any of the lead's job functions match the selected filters
            return leadJobFunctions.some(func => selectedJobFunctions.includes(func));
        });
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