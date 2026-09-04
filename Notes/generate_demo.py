import os
import json
import glob

folder = "/Users/sid/Documents/Nimbus-spm/Notes/Ref notes/Storage"
files = glob.glob(os.path.join(folder, "*.md"))

data = {}
for f in files:
    with open(f, "r", encoding="utf-8") as file:
        data[os.path.basename(f)] = file.read()

html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Storage Live Demo</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body { 
            background-color: #0f172a; 
            color: #f8fafc; 
            font-family: 'Inter', sans-serif;
            background-image: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%);
            min-height: 100vh;
        }
        .markdown-body {
            background: rgba(30, 41, 59, 0.7);
            padding: 2.5rem;
            border-radius: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .markdown-body h1 { font-size: 2.5rem; color: #38bdf8; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
        .markdown-body h2 { font-size: 1.75rem; color: #38bdf8; margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 600; }
        .markdown-body h3 { font-size: 1.25rem; color: #7dd3fc; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.6; color: #cbd5e1; }
        .markdown-body ul { list-style-type: disc; margin-left: 2rem; margin-bottom: 1rem; color: #cbd5e1; }
        .markdown-body ol { list-style-type: decimal; margin-left: 2rem; margin-bottom: 1rem; color: #cbd5e1; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body pre {
            background: #000;
            padding: 1rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin-bottom: 1.5rem;
            border: 1px solid #334155;
        }
        .markdown-body code {
            color: #10b981;
            font-family: monospace;
            background: rgba(0,0,0,0.3);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
        }
        .markdown-body pre code { background: none; padding: 0; color: inherit; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        .markdown-body th, .markdown-body td { border: 1px solid #334155; padding: 0.75rem; text-align: left; }
        .markdown-body th { background: #1e293b; color: #38bdf8; }
        .markdown-body blockquote { border-left: 4px solid #38bdf8; padding-left: 1rem; color: #94a3b8; font-style: italic; margin-bottom: 1rem; }
        .markdown-body hr { border-color: #334155; margin: 2rem 0; }
        
        .tab-btn {
            position: relative;
            overflow: hidden;
        }
        .tab-btn.active {
            background: linear-gradient(to right, #38bdf8, #818cf8);
            color: #0f172a;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
        }
    </style>
</head>
<body class="p-6 md:p-12">
    <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4">AWS Storage Live Demo</h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">An interactive demonstration dashboard for students containing all EBS reference guides and scripts.</p>
    </header>
    
    <div class="flex flex-col md:flex-row max-w-7xl mx-auto gap-8">
        <!-- Sidebar for Tabs -->
        <div class="w-full md:w-1/4 flex flex-col gap-3" id="tabs">
            <!-- Tabs injected here -->
        </div>
        
        <!-- Content Area -->
        <div class="w-full md:w-3/4 markdown-body" id="content">
            <div class="text-center py-20">
                <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <h2 class="text-2xl font-semibold text-gray-400 mt-0">Select a module from the menu</h2>
                <p class="text-gray-500 mt-2">Click on any reference file on the left to view its contents.</p>
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
        
        // Sort filenames so they appear in a consistent order
        const filenames = Object.keys(markdownData).sort();
        
        filenames.forEach(filename => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn text-left px-5 py-4 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:-translate-y-1 transform transition-all duration-200 border border-slate-700';
            
            // Beautify the label a bit
            let label = filename.replace('.md', '').replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            btn.innerHTML = `<div class="font-medium">${label}</div><div class="text-xs text-gray-500 mt-1">${filename}</div>`;
            
            btn.onclick = () => {
                if (activeTab) activeTab.classList.remove('active');
                btn.classList.add('active');
                activeTab = btn;
                
                // Parse markdown and remove custom steppers for clean display
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

output_file = os.path.join(folder, "demo.html")
with open(output_file, "w", encoding="utf-8") as out:
    out.write(html_content)
    
print(f"Created {output_file} successfully.")
