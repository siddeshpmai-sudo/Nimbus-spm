import os
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from analyzer import analyze_resume, optimize_resume, generate_optimized_docx_file

app = FastAPI(
    title="Resume ATS Score Tester API",
    description="Backend API for parsing resumes and scoring them against a job description.",
    version="1.0.0"
)

# Allow CORS for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Analyzes an uploaded resume file (.pdf, .docx, .txt) against a job description.
    """
    # Validation
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
        
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")
        
    ext = filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx', 'doc', 'txt']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format: .{ext}. Please upload a PDF, DOCX, or TXT file."
        )
        
    try:
        # Read file bytes
        file_bytes = await file.read()
        
        # Analyze
        analysis_result = analyze_resume(file_bytes, filename, job_description)
        return analysis_result
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Log error in console
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/api/optimize")
async def optimize(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Optimizes the resume by injecting missing keywords and returning a side-by-side comparison
    along with projected scoring metrics.
    """
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
        
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")
        
    ext = filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx', 'doc', 'txt']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format: .{ext}. Please upload a PDF, DOCX, or TXT file."
        )
        
    try:
        file_bytes = await file.read()
        optimization_result = optimize_resume(file_bytes, filename, job_description)
        return optimization_result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error during optimization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/api/download_optimized_docx")
async def download_optimized_docx(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Generates and downloads the optimized resume as a Word document (.docx) file.
    If original is DOCX, modifies it directly to preserve formatting.
    If original is PDF/TXT, outputs a professionally formatted DOCX resume.
    """
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
        
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")
        
    ext = filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx', 'doc', 'txt']:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format: .{ext}. Please upload a PDF, DOCX, or TXT file."
        )
        
    try:
        file_bytes = await file.read()
        docx_bytes = generate_optimized_docx_file(file_bytes, filename, job_description)
        
        # Build friendly name
        base_name = filename.split('.')[0]
        download_name = f"{base_name}_optimized.docx"
        
        return StreamingResponse(
            io.BytesIO(docx_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={download_name}"}
        )
    except Exception as e:
        print(f"Error downloading docx: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate DOCX file: {str(e)}")

# Mount static frontend files
# Ensure the frontend directory path is correct relative to the backend folder
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.abspath(os.path.join(current_dir, "../frontend"))

# Create directory if it doesn't exist (to avoid start crashes)
os.makedirs(frontend_dir, exist_ok=True)

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
