import re
import io
import os
from typing import Dict, List, Set, Any
import pypdf
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pdf2docx import Converter

# Common English stop words to filter out when extracting custom keywords from JD
STOP_WORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
    'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
    'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
    "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
    'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
    'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
    'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't", 'using', 'using', 'experience',
    'work', 'years', 'role', 'team', 'job', 'position', 'requirements', 'skills', 'ability', 'required', 'strong',
    'preferred', 'knowledge', 'working', 'candidate', 'highly', 'plus', 'description', 'environment'
}

# Standard resume section headers for formatting checker
SECTION_PATTERNS = {
    "education": [r"\beducation\b", r"\bacademic\b", r"\bqualification[s]?\b", r"\bstudy\b", r"\bdegree[s]?\b"],
    "experience": [r"\bexperience[s]?\b", r"\bemployment\b", r"\bwork history\b", r"\bcareer history\b", r"\bprofessional background\b", r"\bwork experience\b"],
    "skills": [r"\bskill[s]?\b", r"\btechnical skill[s]?\b", r"\bcore competencies\b", r"\bareas of expertise\b", r"\bproficiencies\b", r"\btechnologies\b"],
    "projects": [r"\bproject[s]?\b", r"\bkey projects\b", r"\bpersonal projects\b", r"\bportfolio\b"],
    "contact": [r"\bcontact\b", r"\bpersonal info\b", r"\babout me\b", r"\bsummary\b", r"\bprofile\b", r"\bcontact details\b"]
}

# Pre-defined industry keywords to help group matched/missing keywords
SKILL_TAXONOMY = {
    "Hard Skills": [
        "python", "javascript", "typescript", "rust", "go", "golang", "java", "c++", "c#", "ruby", "php", "swift", "kotlin",
        "sql", "nosql", "postgresql", "mysql", "mongodb", "redis", "cassandra", "elasticsearch",
        "machine learning", "deep learning", "nlp", "computer vision", "artificial intelligence", "data science",
        "data analysis", "statistics", "analytics", "tableau", "power bi", "excel",
        "cloud computing", "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "ansible",
        "api development", "graphql", "rest api", "grpc", "microservices", "system design", "architecture",
        "ci/cd", "jenkins", "github actions", "git", "linux", "agile", "scrum", "project management", "product management",
        "software engineering", "web development", "mobile development", "ui design", "ux design", "cybersecurity", "security"
    ],
    "Soft Skills": [
        "communication", "leadership", "teamwork", "collaboration", "problem solving", "critical thinking",
        "adaptability", "flexibility", "time management", "organization", "creativity", "innovation",
        "mentoring", "coaching", "active listening", "empathy", "negotiation", "conflict resolution",
        "decision making", "presentation", "public speaking", "work ethic", "attention to detail"
    ],
    "Tools & Frameworks": [
        "react", "angular", "vue", "next.js", "nuxt", "svelte", "node.js", "express", "fastapi", "django", "flask",
        "spring boot", "laravel", "rails", "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", "numpy",
        "jira", "confluence", "trello", "figma", "gitlab", "github", "bitbucket", "vscode", "postman", "unity"
    ]
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file using pypdf."""
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from a DOCX file using python-docx."""
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = docx.Document(docx_file)
        text_elements = []
        
        # Read paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                text_elements.append(para.text)
                
        # Read tables
        for table in doc.tables:
            for row in table.rows:
                row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_text:
                    text_elements.append(" | ".join(row_text))
                    
        return "\n".join(text_elements)
    except Exception as e:
        raise ValueError(f"Failed to parse Word Document: {str(e)}")

def clean_text(text: str) -> str:
    """Cleans text for keyword processing."""
    # Convert to lowercase
    text = text.lower()
    # Replace newlines/tabs with spaces
    text = re.sub(r'\s+', ' ', text)
    # Return cleaned text
    return text.strip()

def extract_keywords_from_job_description(jd_text: str) -> Dict[str, Set[str]]:
    """
    Extracts relevant keywords from the job description text.
    Groups them into Hard Skills, Soft Skills, Tools & Frameworks, and Custom Keywords.
    """
    cleaned_jd = clean_text(jd_text)
    
    extracted = {
        "Hard Skills": set(),
        "Soft Skills": set(),
        "Tools & Frameworks": set(),
        "Custom Keywords": set()
    }
    
    # 1. Look for pre-defined taxonomy keywords in JD
    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            # Match word boundary or exact phrase
            # Escaping skill names in case they have regex characters (like C++)
            escaped_skill = re.escape(skill)
            # Support plus signs (like C++) and hashes (like C#) properly in regex
            pattern = rf'\b{escaped_skill}\b'
            if skill.endswith('+') or skill.endswith('#'):
                pattern = rf'\b{escaped_skill}'
                
            if re.search(pattern, cleaned_jd):
                extracted[category].add(skill)
                
    # 2. Extract significant n-grams (1, 2, 3 words) from the JD that are not stop words
    # Split text into tokens
    words = re.findall(r'\b[a-zA-Z]{3,15}\b', cleaned_jd)
    
    # 1-grams (filtered)
    single_words = [w for w in words if w not in STOP_WORDS]
    
    # Let's count frequencies of single words and bi-grams to find unique JD keywords
    freq_map = {}
    for w in single_words:
        freq_map[w] = freq_map.get(w, 0) + 1
        
    # Sort and take top 15 words not already in taxonomies
    all_taxonomy_skills = set()
    for cat_skills in SKILL_TAXONOMY.values():
        all_taxonomy_skills.update(cat_skills)
        
    sorted_words = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)
    custom_count = 0
    for word, freq in sorted_words:
        if word not in all_taxonomy_skills and freq >= 2:
            extracted["Custom Keywords"].add(word)
            custom_count += 1
            if custom_count >= 15:
                break
                
    return extracted

def compute_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """Computes semantic similarity using TF-IDF and Cosine Similarity."""
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([resume_text, jd_text])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(similarity * 100)
    except Exception:
        # Fallback if TF-IDF fails (e.g. empty inputs or vocabulary issues)
        return 0.0

def check_resume_formatting(resume_text: str, raw_text: str) -> Dict[str, Any]:
    """
    Checks the formatting of the resume:
    - Section head detection
    - Contact info check (email, phone, LinkedIn/GitHub)
    - Word count check
    """
    cleaned_resume = clean_text(resume_text)
    
    # 1. Section checks
    sections_found = {}
    for sec_name, patterns in SECTION_PATTERNS.items():
        found = False
        for pattern in patterns:
            if re.search(pattern, cleaned_resume):
                found = True
                break
        sections_found[sec_name] = found
        
    # 2. Contact details check
    # Email regex
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
    email = email_match.group(0) if email_match else None
    
    # Phone regex (matches typical formats: +1-234-567-8900, (123) 456-7890, etc.)
    phone_match = re.search(r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', raw_text)
    phone = phone_match.group(0) if phone_match else None
    
    # Links (LinkedIn / GitHub / Portfolio)
    linkedin_match = re.search(r'linkedin\.com/in/[a-zA-Z0-9_-]+', cleaned_resume)
    linkedin = linkedin_match.group(0) if linkedin_match else None
    
    github_match = re.search(r'github\.com/[a-zA-Z0-9_-]+', cleaned_resume)
    github = github_match.group(0) if github_match else None
    
    # 3. Word count check
    word_count = len(re.findall(r'\w+', raw_text))
    
    # Calculate formatting score
    # Score based on: sections found (5 sections * 10 pts = 50 pts)
    # Contact info: Email (15 pts), Phone (15 pts), Link (10 pts)
    # Length: Word count within 400-1200 range (10 pts)
    section_score = sum([10 for found in sections_found.values() if found])
    contact_score = (15 if email else 0) + (15 if phone else 0) + (10 if (linkedin or github) else 0)
    
    length_score = 0
    if 400 <= word_count <= 1200:
        length_score = 10
    elif 250 <= word_count <= 1800:
        length_score = 5
        
    formatting_score = section_score + contact_score + length_score
    
    return {
        "sections": sections_found,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "word_count": word_count,
        "score": formatting_score
    }

def analyze_resume(resume_bytes: bytes, filename: str, job_description: str) -> Dict[str, Any]:
    """
    Main entry point for analyzing a resume against a job description.
    Parses, cleans, extracts keywords, scores similarity, evaluates formatting, and returns feedback.
    """
    # 1. Parse Resume Text
    ext = filename.split('.')[-1].lower()
    if ext == 'pdf':
        raw_text = extract_text_from_pdf(resume_bytes)
    elif ext in ['docx', 'doc']:
        raw_text = extract_text_from_docx(resume_bytes)
    else:
        # Fallback to plain text
        raw_text = resume_bytes.decode('utf-8', errors='ignore')
        
    if not raw_text.strip():
        raise ValueError("Could not extract any text from the uploaded file. Please verify it is not scanned or empty.")
        
    cleaned_resume = clean_text(raw_text)
    
    # 2. Extract Keywords from JD
    jd_keywords = extract_keywords_from_job_description(job_description)
    
    # 3. Evaluate keyword matches in Resume
    keyword_analysis = {}
    total_jd_keywords = 0
    total_matched_keywords = 0
    
    for category, keywords in jd_keywords.items():
        matched = []
        missing = []
        for kw in keywords:
            # Check presence
            escaped_kw = re.escape(kw)
            pattern = rf'\b{escaped_kw}\b'
            if kw.endswith('+') or kw.endswith('#'):
                pattern = rf'\b{escaped_kw}'
                
            if re.search(pattern, cleaned_resume):
                matched.append(kw)
            else:
                missing.append(kw)
                
        keyword_analysis[category] = {
            "matched": matched,
            "missing": missing,
            "match_rate": (len(matched) / len(keywords) * 100) if keywords else 100.0
        }
        total_jd_keywords += len(keywords)
        total_matched_keywords += len(matched)
        
    keyword_match_score = (total_matched_keywords / total_jd_keywords * 100) if total_jd_keywords > 0 else 100.0
    
    # 4. Compute Semantic Similarity
    semantic_score = compute_semantic_similarity(raw_text, job_description)
    
    # 5. Format & Section checks
    format_analysis = check_resume_formatting(cleaned_resume, raw_text)
    
    # 6. Overall Weighted Score
    # Weighted average:
    # 40% Keyword Match Rate
    # 40% Semantic Similarity
    # 20% Formatting Score
    overall_score = (keyword_match_score * 0.40) + (semantic_score * 0.40) + (format_analysis["score"] * 0.20)
    overall_score = round(max(0.0, min(100.0, overall_score)), 1)
    
    # 7. Generate Actionable Recommendations
    recommendations = []
    
    # Keyword recommendations
    all_missing_keywords = []
    for cat, analysis in keyword_analysis.items():
        all_missing_keywords.extend(analysis["missing"])
        
    if all_missing_keywords:
        top_missing = all_missing_keywords[:6]
        recommendations.append({
            "type": "critical",
            "title": "Add Missing Keywords",
            "desc": f"Your resume is missing important keywords from the job description: {', '.join(top_missing)}. Incorporate these naturally in your skills or experience sections."
        })
        
    # Formatting & Section recommendations
    missing_sections = [sec for sec, found in format_analysis["sections"].items() if not found]
    if missing_sections:
        recommendations.append({
            "type": "warning",
            "title": "Missing Section Headings",
            "desc": f"The parser did not find the following typical section headings: {', '.join(missing_sections).title()}. Use standard headings like 'Experience', 'Education', and 'Skills' so ATS systems can categorize your profile correctly."
        })
        
    # Contact info recommendations
    if not format_analysis["email"] or not format_analysis["phone"]:
        missing_contact = []
        if not format_analysis["email"]: missing_contact.append("email address")
        if not format_analysis["phone"]: missing_contact.append("phone number")
        recommendations.append({
            "type": "critical",
            "title": "Missing Contact Information",
            "desc": f"We could not locate your {', '.join(missing_contact)}. Ensure your contact details are clear, complete, and placed at the top of your resume."
        })
        
    if not format_analysis["linkedin"]:
        recommendations.append({
            "type": "info",
            "title": "Add Professional Links",
            "desc": "Adding your LinkedIn profile link helps recruiters easily view your professional network and full background."
        })
        
    # Word count recommendations
    wc = format_analysis["word_count"]
    if wc < 300:
        recommendations.append({
            "type": "warning",
            "title": "Short Resume",
            "desc": f"Your resume has only {wc} words. Resumes that are too short may lack the necessary depth and detail about your achievements. Aim for 400 - 1000 words."
        })
    elif wc > 1500:
        recommendations.append({
            "type": "warning",
            "title": "Lengthy Resume",
            "desc": f"Your resume has {wc} words, which is quite long. Try to keep it concise, focused, and ideally within 1-2 pages (approx. 475-1000 words)."
        })
        
    # High similarity recommendation if semantic score is very high or low
    if semantic_score > 75:
        recommendations.append({
            "type": "success",
            "title": "Great Relevance",
            "desc": "Your resume has a strong semantic alignment with the job description. The context and vocabulary closely match the target role!"
        })
    elif semantic_score < 40:
        recommendations.append({
            "type": "critical",
            "title": "Low Relevance",
            "desc": "The context of your resume is quite distant from the job description. Try reframing your bullet points to align more closely with the goals and responsibilities mentioned in the posting."
        })
        
    # 8. Check if professional summary follows formula
    has_formula_summary = False
    summary_para = ""
    lines = raw_text.split('\n')
    summary_idx = -1
    for i, line in enumerate(lines):
        line_clean = line.strip().lower()
        if ("summary" in line_clean or "profile" in line_clean or "about me" in line_clean) and len(line_clean) < 30:
            summary_idx = i
            break
            
    if summary_idx != -1:
        for j in range(summary_idx + 1, min(len(lines), summary_idx + 5)):
            if lines[j].strip():
                summary_para = lines[j].strip()
                break
                
    if summary_para:
        has_exp = re.search(r'\b\d+\+?\s*years?\b', summary_para, re.IGNORECASE) is not None
        has_result = re.search(r'\b\d+%\b|\$\d+|\b(reduced|increased|closed|improved|grew|saved)\b', summary_para, re.IGNORECASE) is not None
        if has_exp and has_result:
            has_formula_summary = True
            
    if not has_formula_summary:
        recommendations.append({
            "type": "warning",
            "title": "Optimize Professional Summary",
            "desc": "Structure your professional summary using this formula: **Role + Experience + Key Skills + Measurable Result**. Example: *Talent Acquisition Lead | 6+ years of experience | Tech hiring & stakeholder management | Reduced cost-per-hire by 40% and closed 50+ niche roles.*"
        })
        
    # Readability Metric
    # Simple word complexity metric
    avg_word_len = sum(len(word) for word in raw_text.split()) / max(1, len(raw_text.split()))
    readability_rating = "Easy" if avg_word_len < 5.0 else ("Intermediate" if avg_word_len < 6.0 else "Advanced")
    
    return {
        "filename": filename,
        "overall_score": overall_score,
        "metrics": {
            "keyword_match": round(keyword_match_score, 1),
            "semantic_similarity": round(semantic_score, 1),
            "formatting": round(format_analysis["score"], 1)
        },
        "keyword_analysis": keyword_analysis,
        "format_analysis": format_analysis,
        "readability": {
            "rating": readability_rating,
            "avg_word_length": round(avg_word_len, 1),
            "est_read_time_min": round(wc / 200, 1) # ~200 words per minute average reading speed
        },
        "recommendations": recommendations
    }

def optimize_resume(resume_bytes: bytes, filename: str, job_description: str) -> Dict[str, Any]:
    """
    Optimizes the resume by injecting missing keywords, filling section headings,
    and creating placeholders for missing contact details. Runs a simulated
    post-optimization scan to return a projected score.
    """
    analysis = analyze_resume(resume_bytes, filename, job_description)
    
    # Extract raw text
    ext = filename.split('.')[-1].lower()
    if ext == 'pdf':
        raw_text = extract_text_from_pdf(resume_bytes)
    elif ext in ['docx', 'doc']:
        raw_text = extract_text_from_docx(resume_bytes)
    else:
        raw_text = resume_bytes.decode('utf-8', errors='ignore')
        
    original_lines = raw_text.split('\n')
    optimized_lines = []
    changes = []
    
    # Build formula-based Professional Summary: Role + Experience + Key Skills + Measurable Result
    jd_lines = [l.strip() for l in job_description.split('\n') if l.strip()]
    role = "Professional"
    if jd_lines:
        first_line = jd_lines[0]
        if len(first_line) < 50:
            role = first_line.rstrip(':').strip()
        else:
            words = first_line.split()[:4]
            role = " ".join(words)
            
    exp_years = "5+"
    match_exp = re.search(r'(\d+)\s*\+?\s*years?\b', raw_text, re.IGNORECASE)
    if match_exp:
        exp_years = f"{match_exp.group(1)}+"
        
    matched_hard = analysis["keyword_analysis"].get("Hard Skills", {}).get("matched", [])
    key_skills = list(matched_hard[:3]) if matched_hard else []
    if len(key_skills) < 3:
        matched_tools = analysis["keyword_analysis"].get("Tools & Frameworks", {}).get("matched", [])
        key_skills.extend(matched_tools[:(3 - len(key_skills))])
    if not key_skills:
        key_skills = ["Core Technologies"]
    key_skills_str = " & ".join(key_skills)
    
    measurable_result = "Reduced project delivery time by 20% and improved efficiency"
    for line in original_lines:
        if '%' in line or '$' in line or re.search(r'\b(50\+|40%)\b', line):
            if re.search(r'\b(reduced|increased|delivered|saved|managed|optimized|completed|closed|hired|grew)\b', line, re.IGNORECASE):
                line_clean = line.strip().lstrip("-•* ").strip()
                if len(line_clean) < 120:
                    measurable_result = line_clean
                    break
                    
    summary_text = f"{role} | {exp_years} years of experience | {key_skills_str} | {measurable_result}"
    
    # Locate summary index in original text
    summary_header_idx = -1
    for idx, line in enumerate(original_lines):
        line_clean = line.strip().lower()
        if ("summary" in line_clean or "profile" in line_clean or "about me" in line_clean or "about" in line_clean) and len(line_clean) < 30:
            summary_header_idx = idx
            break
            
    rebuilt_lines = []
    if summary_header_idx != -1:
        replaced_text = False
        for idx, line in enumerate(original_lines):
            rebuilt_lines.append(line)
            if idx == summary_header_idx:
                rebuilt_lines.append(summary_text)
                changes.append("Optimized Professional Summary using formula: Role + Experience + Key Skills + Measurable Result")
                replaced_text = True
            elif replaced_text:
                if line.strip():
                    rebuilt_lines.pop() # remove original text paragraph
                    replaced_text = False
    else:
        # Insert new header and summary
        contact_line_idx = -1
        for idx, line in enumerate(original_lines):
            if '@' in line or 'linkedin.com' in line or 'phone' in line.lower():
                contact_line_idx = idx
                
        if contact_line_idx != -1:
            for idx, line in enumerate(original_lines):
                rebuilt_lines.append(line)
                if idx == contact_line_idx:
                    rebuilt_lines.append("")
                    rebuilt_lines.append("PROFESSIONAL SUMMARY")
                    rebuilt_lines.append(summary_text)
                    rebuilt_lines.append("")
                    changes.append("Created Professional Summary section using formula: Role + Experience + Key Skills + Measurable Result")
        else:
            for idx, line in enumerate(original_lines):
                rebuilt_lines.append(line)
                if idx == 0:
                    rebuilt_lines.append("")
                    rebuilt_lines.append("PROFESSIONAL SUMMARY")
                    rebuilt_lines.append(summary_text)
                    rebuilt_lines.append("")
                    changes.append("Created Professional Summary section using formula: Role + Experience + Key Skills + Measurable Result")
                    
    original_lines = rebuilt_lines
    
    # 1. Contact info check & injection
    email_found = analysis["format_analysis"]["email"]
    phone_found = analysis["format_analysis"]["phone"]
    linkedin_found = analysis["format_analysis"]["linkedin"]
    
    contact_updates = []
    if not email_found:
        contact_updates.append("[EMAIL] your.email@example.com")
        changes.append("Added email placeholder: your.email@example.com")
    if not phone_found:
        contact_updates.append("[PHONE] +1-555-0100")
        changes.append("Added phone placeholder: +1-555-0100")
    if not linkedin_found:
        contact_updates.append("[LINKEDIN] linkedin.com/in/yourprofile")
        changes.append("Added LinkedIn placeholder: linkedin.com/in/yourprofile")
        
    inserted_contact = False
    
    # Find Skills & Experience sections
    skills_header_idx = -1
    experience_header_idx = -1
    
    for idx, line in enumerate(original_lines):
        line_clean = line.strip().lower()
        for p in SECTION_PATTERNS["skills"]:
            if re.search(p, line_clean) and len(line_clean) < 30:
                skills_header_idx = idx
                break
        for p in SECTION_PATTERNS["experience"]:
            if re.search(p, line_clean) and len(line_clean) < 30:
                experience_header_idx = idx
                break
                
    # Missing keywords
    missing_hard = analysis["keyword_analysis"].get("Hard Skills", {}).get("missing", [])
    missing_soft = analysis["keyword_analysis"].get("Soft Skills", {}).get("missing", [])
    missing_tools = analysis["keyword_analysis"].get("Tools & Frameworks", {}).get("missing", [])
    
    # Rebuild line-by-line
    for idx, line in enumerate(original_lines):
        line_strip = line.strip()
        
        # Insert contact details placeholder early
        if not inserted_contact and len(optimized_lines) > 0 and contact_updates:
            optimized_lines.append(" | ".join(contact_updates))
            optimized_lines.append("")
            inserted_contact = True
            
        optimized_lines.append(line)
        
        # Inject missing hard skills/tools under Skills heading
        if idx == skills_header_idx and (missing_hard or missing_tools):
            injected_skills = []
            if missing_hard:
                injected_skills.append(f"Technical Skills: {', '.join(missing_hard)}")
            if missing_tools:
                injected_skills.append(f"Tools & Tech: {', '.join(missing_tools)}")
            optimized_lines.append(" - " + " \n - ".join(injected_skills))
            changes.append(f"Injected missing hard skills/tools: {', '.join(missing_hard[:5])}{'...' if len(missing_hard) > 5 else ''}")
            
        # Inject missing soft skills under Experience heading
        if idx == experience_header_idx and missing_soft:
            optimized_lines.append(f" - Core Competencies: {', '.join(missing_soft)}")
            changes.append(f"Integrated soft skills competencies: {', '.join(missing_soft[:5])}{'...' if len(missing_soft) > 5 else ''}")
            
    # If Skills section header was missing entirely
    if skills_header_idx == -1 and (missing_hard or missing_tools):
        optimized_lines.append("")
        optimized_lines.append("SKILLS & TECHNOLOGIES")
        injected_skills = []
        if missing_hard:
            injected_skills.append(f"Technical Skills: {', '.join(missing_hard)}")
        if missing_tools:
            injected_skills.append(f"Tools & Tech: {', '.join(missing_tools)}")
        optimized_lines.append(" - " + " \n - ".join(injected_skills))
        changes.append("Created new 'SKILLS & TECHNOLOGIES' section with missing keywords.")
        
    # Check if education or experience sections were missing and create templates
    for sec_name, found in analysis["format_analysis"]["sections"].items():
        if not found and sec_name != "contact":
            optimized_lines.append("")
            optimized_lines.append(sec_name.upper())
            if sec_name == "education":
                optimized_lines.append(" - Bachelor of Science in Computer Science | University Name | Grad Year")
                changes.append("Created missing 'EDUCATION' placeholder section.")
            elif sec_name == "experience":
                optimized_lines.append(" - Software Engineer | Company Name | Year - Present\n   - Developed core products and enhanced feature sets.")
                changes.append("Created missing 'EXPERIENCE' placeholder section.")
            elif sec_name == "projects":
                optimized_lines.append(" - Portfolio Project | Tech Stack\n   - Built application interface and backend integrations.")
                changes.append("Created missing 'PROJECTS' placeholder section.")
                
    optimized_text = "\n".join(optimized_lines)
    
    # Run analysis on optimized text to get new projected score
    opt_bytes = optimized_text.encode('utf-8')
    projected_analysis = analyze_resume(opt_bytes, "optimized_resume.txt", job_description)
    
    return {
        "original_text": raw_text,
        "optimized_text": optimized_text,
        "summary_text": summary_text,
        "changes": changes,
        "original_score": analysis["overall_score"],
        "projected_score": projected_analysis["overall_score"],
        "projected_metrics": projected_analysis["metrics"]
    }

def convert_pdf_to_docx_bytes(pdf_bytes: bytes) -> bytes:
    """
    Converts PDF bytes to DOCX bytes using pdf2docx, maintaining exact layout.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    temp_dir = os.path.join(current_dir, "temp_scratch")
    os.makedirs(temp_dir, exist_ok=True)
    
    pdf_path = os.path.join(temp_dir, "temp_resume.pdf")
    docx_path = os.path.join(temp_dir, "temp_resume.docx")
    
    try:
        with open(pdf_path, "wb") as f:
            f.write(pdf_bytes)
            
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()
        
        with open(docx_path, "rb") as f:
            docx_bytes = f.read()
            
        return docx_bytes
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        if os.path.exists(docx_path):
            os.remove(docx_path)

def modify_docx_formatting(file_bytes: bytes, analysis: Dict[str, Any], summary_text: str) -> bytes:
    """
    Modifies an existing DOCX document to inject missing skills and formatting fixes
    while preserving the original styles, font families, colors, and layout.
    """
    doc = docx.Document(io.BytesIO(file_bytes))
    
    # 1. Update Professional Summary if it exists, or insert one
    summary_para_idx = -1
    for idx, para in enumerate(doc.paragraphs):
        text_lower = para.text.lower().strip()
        if ("summary" in text_lower or "profile" in text_lower or "about me" in text_lower or "about" in text_lower) and len(text_lower) < 30:
            summary_para_idx = idx
            break
            
    if summary_para_idx != -1:
        for i in range(summary_para_idx + 1, len(doc.paragraphs)):
            p = doc.paragraphs[i]
            if p.text.strip():
                p.text = "" # Clears original text
                run = p.add_run(summary_text)
                run.bold = False
                break
    else:
        # Insert right after contact details block
        contact_idx = -1
        for idx, para in enumerate(doc.paragraphs):
            txt = para.text.strip()
            if '@' in txt or 'phone' in txt.lower() or 'email' in txt.lower():
                contact_idx = idx
                break
        if contact_idx != -1 and contact_idx + 1 < len(doc.paragraphs):
            next_para = doc.paragraphs[contact_idx + 1]
            h = next_para.insert_paragraph_before("PROFESSIONAL SUMMARY")
            h.text = ""
            hrun = h.add_run("PROFESSIONAL SUMMARY")
            hrun.bold = True
            
            body = next_para.insert_paragraph_before(summary_text)
            body.text = ""
            brun = body.add_run(summary_text)
            brun.bold = False
            
    # 2. Ingest missing skills into skills section
    missing_hard = analysis["keyword_analysis"].get("Hard Skills", {}).get("missing", [])
    missing_tools = analysis["keyword_analysis"].get("Tools & Frameworks", {}).get("missing", [])
    missing_soft = analysis["keyword_analysis"].get("Soft Skills", {}).get("missing", [])
    
    skills_to_add = missing_hard + missing_tools + missing_soft
    if not skills_to_add:
        out_io = io.BytesIO()
        doc.save(out_io)
        return out_io.getvalue()
        
    skills_para_idx = -1
    for idx, para in enumerate(doc.paragraphs):
        text_lower = para.text.lower().strip()
        found = False
        for p in SECTION_PATTERNS["skills"]:
            if re.search(p, text_lower) and len(text_lower) < 30:
                skills_para_idx = idx
                found = True
                break
        if found:
            break
            
    if skills_para_idx != -1:
        target_para = None
        for i in range(skills_para_idx + 1, len(doc.paragraphs)):
            p = doc.paragraphs[i]
            is_another_section = False
            for sec_name, patterns in SECTION_PATTERNS.items():
                if sec_name == "skills": continue
                for pat in patterns:
                    if re.search(pat, p.text.lower().strip()) and len(p.text.strip()) < 30:
                        is_another_section = True
                        break
                if is_another_section:
                    break
            if is_another_section:
                target_para = doc.paragraphs[i - 1]
                break
            if p.text.strip():
                target_para = p
                if "bullet" in p.style.name.lower() or p.text.strip().startswith("•") or p.text.strip().startswith("-"):
                    continue
                else:
                    break
                    
        if target_para:
            sep = ", " if target_para.text.strip() and not target_para.text.strip().endswith(",") and not target_para.text.strip().endswith(".") else " "
            run = target_para.add_run(f"{sep}{', '.join(skills_to_add)}")
            run.bold = False
    else:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(f"Keywords: {', '.join(skills_to_add)}")
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(120, 120, 120)
        
    out_io = io.BytesIO()
    doc.save(out_io)
    return out_io.getvalue()


def generate_standard_optimized_docx(optimized_text: str) -> bytes:
    """
    Generates a brand new, beautifully formatted DOCX resume from optimized text.
    """
    doc = docx.Document()
    
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
    lines = optimized_text.split('\n')
    is_header = True
    
    for line in lines:
        line_strip = line.strip()
        if not line_strip:
            continue
            
        if is_header and (line_strip.startswith("-") or line_strip.startswith("•") or line_strip.isupper() or len(line_strip) > 100):
            is_header = False
            
        if is_header:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run(line_strip)
            if line == lines[0]:
                run.font.size = Pt(18)
                run.bold = True
            else:
                run.font.size = Pt(10.5)
                run.font.color.rgb = RGBColor(100, 100, 100)
        else:
            is_heading = False
            line_clean = line_strip.lower()
            for sec_patterns in SECTION_PATTERNS.values():
                for pattern in sec_patterns:
                    if re.match(pattern, line_clean) and len(line_clean) < 30:
                        is_heading = True
                        break
                if is_heading:
                    break
                    
            if is_heading or (line_strip.isupper() and len(line_strip) < 30):
                h = doc.add_paragraph()
                h.paragraph_format.space_before = Pt(12)
                h.paragraph_format.space_after = Pt(4)
                run = h.add_run(line_strip.upper())
                run.bold = True
                run.font.size = Pt(13)
                run.font.color.rgb = RGBColor(99, 102, 241)
            else:
                p = doc.add_paragraph()
                p.paragraph_format.space_after = Pt(3)
                
                if line_strip.startswith("-") or line_strip.startswith("•"):
                    p.style = 'List Bullet'
                    cleaned_line = line_strip.lstrip("-•").strip()
                    run = p.add_run(cleaned_line)
                else:
                    run = p.add_run(line_strip)
                run.font.size = Pt(10.5)
                
    out_io = io.BytesIO()
    doc.save(out_io)
    return out_io.getvalue()

def generate_optimized_docx_file(original_bytes: bytes, filename: str, job_description: str) -> bytes:
    """
    Main entry point for returning optimized docx file.
    Attempts to modify original if original was a Word document or PDF,
    retaining 100% of the visual layout design.
    """
    ext = filename.split('.')[-1].lower()
    
    try:
        analysis = analyze_resume(original_bytes, filename, job_description)
        opt_result = optimize_resume(original_bytes, filename, job_description)
        summary_text = opt_result["summary_text"]
        optimized_text = opt_result["optimized_text"]
        
        if ext in ['docx', 'doc']:
            docx_bytes = original_bytes
        elif ext == 'pdf':
            print("Converting PDF to DOCX to preserve layout...")
            docx_bytes = convert_pdf_to_docx_bytes(original_bytes)
        else:
            return generate_standard_optimized_docx(optimized_text)
            
        return modify_docx_formatting(docx_bytes, analysis, summary_text)
        
    except Exception as e:
        print(f"Error preserving visual layout: {str(e)}. Falling back to clean template.")
        opt_result = optimize_resume(original_bytes, filename, job_description)
        return generate_standard_optimized_docx(opt_result["optimized_text"])


