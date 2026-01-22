import http.server
import socketserver
import webbrowser
import os
import sys
import json
import re

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# ATS Analysis Logic
class ATSAnalyzer:
    def __init__(self):
        self.action_verbs = {
            'achieved', 'improved', 'trained', 'mentored', 'managed', 'created',
            'developed', 'designed', 'strategized', 'launched', 'budgeted',
            'minimized', 'maximized', 'increased', 'decreased', 'negotiated'
        }
        self.weak_words = {
            'responsible for', 'helped', 'worked on', 'tried', 'various'
        }

    def analyze(self, data):
        score = 0
        feedback = []
        
        # 1. Contact Info (Critical) - 15 pts
        personal = data.get('personal', {})
        if personal.get('fullName'): score += 5
        else: feedback.append("Missing Full Name")
        
        if personal.get('email'): 
            score += 5
            if not '@' in personal.get('email'): score -= 2; feedback.append("Invalid Email format")
        else: feedback.append("Missing Email")
        
        if personal.get('phone'): score += 5
        else: feedback.append("Missing Phone Number")

        # 2. Professional Summary - 15 pts
        summary = data.get('summary', '')
        word_count = len(summary.split())
        if word_count > 30: score += 15
        elif word_count > 10: score += 8; feedback.append("Summary is too short (aim for 30+ words)")
        else: feedback.append("Add a professional summary")

        # 3. Experience & Impact - 40 pts
        experience = data.get('experience', [])
        if experience:
            score += 10 # Base points for having experience
            
            # Check for action verbs
            full_text = " ".join([exp.get('description', '').lower() for exp in experience])
            found_verbs = [verb for verb in self.action_verbs if verb in full_text]
            unique_verbs = len(set(found_verbs))
            
            if unique_verbs >= 5: score += 15
            elif unique_verbs >= 2: score += 8
            else: feedback.append("Use more strong action verbs (e.g., 'Achieved', 'Developed')")
            
            # Check for metrics (numbers/%)
            if re.search(r'\d+%|\$\d+|\d+ [year|month]', full_text):
                score += 15
            else:
                feedback.append("Add quantifiable metrics (e.g., 'Increased sales by 20%')")
        else:
            feedback.append("Missing Work Experience section")

        # 4. Skills - 20 pts
        skills = data.get('skills', [])
        if len(skills) >= 5: score += 20
        elif len(skills) > 0: score += 10; feedback.append("Add more skills (aim for 5+)")
        else: feedback.append("Missing Skills section")

        # 5. Formatting/Completeness - 10 pts
        if data.get('education'): score += 5
        else: feedback.append("Missing Education section")
        
        if data.get('projects') or data.get('certifications'): score += 5

        return {
            "score": min(100, score),
            "grade": self.get_grade(score),
            "factors": feedback
        }

    def get_grade(self, score):
        if score >= 90: return "Excellent"
        if score >= 75: return "Good"
        if score >= 60: return "Fair"
        return "Needs Improvement"

analyzer = ATSAnalyzer()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                resume_data = json.loads(post_data.decode('utf-8'))
                result = analyzer.analyze(resume_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_error(404)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}/builder.html"
            print(f"Python ATS Server Running!")
            print(f"Analysis Engine: Active")
            print(f"Location: {url}")
            webbrowser.open(url)
            httpd.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
    except OSError:
        print(f"Port {PORT} is in use.")

if __name__ == "__main__":
    run_server()
