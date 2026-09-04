import os
import json
import glob
import re

folder = "/Users/sid/Documents/Nimbus-spm/Notes/Ref notes/Storage"
files = glob.glob(os.path.join(folder, "*.md"))

data = {}
for f in files:
    filename = os.path.basename(f)
    
    # Exclude instructor-only files
    if "live-demo-scripts" in filename:
        continue
            
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
        
    # Strip teacher specific sections
    content = re.sub(r'## Teaching Tips.*?(?=## |$)', '', content, flags=re.DOTALL)
    
    data[filename] = content

html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Storage Student Lab Guide</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body { 
            background-color: #f8fafc; 
            color: #1e293b; 
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
        }
        .markdown-body {
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 1.5rem;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .markdown-body h1 { font-size: 2.5rem; color: #2563eb; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
        .markdown-body h2 { font-size: 1.75rem; color: #2563eb; margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 600; }
        .markdown-body h3 { font-size: 1.25rem; color: #3b82f6; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.6; color: #475569; }
        .markdown-body ul { list-style-type: disc; margin-left: 2rem; margin-bottom: 1rem; color: #475569; }
        .markdown-body ol { list-style-type: decimal; margin-left: 2rem; margin-bottom: 1rem; color: #475569; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body pre {
            background: #1e293b;
            padding: 1rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin-bottom: 1.5rem;
            border: 1px solid #cbd5e1;
            color: #f8fafc;
        }
        .markdown-body code {
            color: #059669;
            font-family: monospace;
            background: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
        }
        .markdown-body pre code { background: none; padding: 0; color: inherit; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .markdown-body th, .markdown-body td { border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; }
        .markdown-body th { background: #f8fafc; color: #2563eb; }
        .markdown-body blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; color: #64748b; font-style: italic; margin-bottom: 1rem; }
        .markdown-body hr { border-color: #cbd5e1; margin: 2rem 0; }
        
        .tab-btn {
            position: relative;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #475569;
        }
        .tab-btn:hover {
            background: #f8fafc;
            transform: translateY(-2px);
        }
        .tab-btn.active {
            background: linear-gradient(to right, #2563eb, #6366f1);
            color: #ffffff;
            font-weight: 600;
            border: none;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }
        .tab-btn.active .text-gray-500 {
            color: #e0e7ff;
        }
    </style>
</head>
<body class="p-6 md:p-12">
    <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">AWS Storage Student Lab</h1>
        <p class="text-xl text-slate-500 max-w-2xl mx-auto">Your interactive reference guide and lab instructions.</p>
    </header>
    
    <div class="flex flex-col md:flex-row max-w-7xl mx-auto gap-8">
        <!-- Sidebar for Tabs -->
        <div class="w-full md:w-1/4 flex flex-col gap-3" id="tabs">
            <!-- Tabs injected here -->
        </div>
        
        <!-- Content Area -->
        <div class="w-full md:w-3/4 markdown-body" id="content">
            <div class="text-center py-20">
                <svg class="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                <h2 class="text-2xl font-semibold text-slate-600 mt-0">Select a lab module</h2>
                <p class="text-slate-500 mt-2">Click on a topic on the left to start learning.</p>
            </div>
        </div>
    </div>

    <script>
        const markdownData = __DATA__;
        
        const tabsContainer = document.getElementById('tabs');
        const contentContainer = document.getElementById('content');
        
        let activeTab = null;
        
        // Configure marked to use syntax highlighting
        marked.setOptions({
            highlight: function(code, lang) {
                if (Prism.languages[lang]) {
                    return Prism.highlight(code, Prism.languages[lang], lang);
                } else {
                    return code;
                }
            }
        });
        
        const filenames = Object.keys(markdownData).sort();
        
        filenames.forEach(filename => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn text-left px-5 py-4 rounded-xl transition-all duration-200';
            
            let label = filename.replace('.md', '').replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            btn.innerHTML = `<div class="font-medium">${label}</div><div class="text-xs text-gray-500 mt-1">${filename}</div>`;
            
            btn.onclick = () => {
                if (activeTab) activeTab.classList.remove('active');
                btn.classList.add('active');
                activeTab = btn;
                
                let mdContent = markdownData[filename];
                mdContent = mdContent.replace(/{% stepper %}/g, '<div class="pl-4 border-l-2 border-indigo-500 my-4">');
                mdContent = mdContent.replace(/{% endstepper %}/g, '</div>');
                mdContent = mdContent.replace(/{% step %}/g, '<div class="mb-8">');
                mdContent = mdContent.replace(/{% endstep %}/g, '</div>');
                
                contentContainer.innerHTML = marked.parse(mdContent);
            };
            
            tabsContainer.appendChild(btn);
        });
    </script>
</body>
</html>
"""

html_content = html_template.replace("__DATA__", json.dumps(data))

output_file = os.path.join(folder, "student_demo.html")
with open(output_file, "w", encoding="utf-8") as out:
    out.write(html_content)
    
print(f"Created {output_file} successfully.")
