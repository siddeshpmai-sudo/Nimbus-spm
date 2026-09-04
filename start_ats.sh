#!/bin/bash
cd "/Users/sid/Documents/Nimbus-spm/ATS_score_checker/backend"
"../venv/bin/python" -m uvicorn main:app --host 127.0.0.1 --port 8000
