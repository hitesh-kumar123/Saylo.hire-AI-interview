import google.generativeai as genai
from app.config import Config
import json

class GeminiService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')  # Or the latest model version
    
    def generate_interview_questions(self, job_description_text, resume_summary_text, num_questions=5):
        """Generate interview questions based on job description and resume."""
        prompt = f"""
        You are an expert interviewer. Generate {num_questions} mock interview questions for a candidate.
        The candidate's resume summary:
        "{resume_summary_text}"

        The job description they are applying for:
        "{job_description_text}"

        Questions should cover various aspects like behavioral, technical (if applicable), and situational.
        Focus on questions that assess skills and experiences relevant to the job and unique to the resume.
        Provide only the list of questions, formatted as a JSON array of strings.
        Example: ["Question 1?", "Question 2?", ...]
        """
        response = self.model.generate_content(prompt)
        try:
            # Clean up response to ensure it's valid JSON
            text = response.text.strip()
            # Remove markdown code block markers if present
            text = text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except json.JSONDecodeError:
            return ["Error: Could not parse questions."]  # Handle gracefully
    
    def generate_cheatsheet_content(self, job_description_text, resume_summary_text):
        """Generate interview cheatsheet content."""
        prompt = f"""
        You are an interview preparation assistant. Generate a concise cheatsheet based on the following
        job description and candidate's resume.
        Focus on key skills, experiences, and talking points the candidate should emphasize or be prepared to discuss.
        Include 3-5 bullet points of "Key Strengths/Experiences to Highlight" and 3-5 "Potential Questions/Areas to Prepare."

        Job Description:
        "{job_description_text}"

        Resume Summary:
        "{resume_summary_text}"

        Format the output clearly with headings like "Key Strengths to Highlight" and "Potential Questions/Areas to Prepare."
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()
    
    def analyze_interview_transcript(self, interview_transcript, job_description_text, resume_summary_text):
        """Analyze interview transcript and provide feedback."""
        prompt = f"""
        Analyze the following mock interview transcript based on the provided job description and candidate resume.
        Provide a score out of 100 and detailed feedback.
        Focus on communication clarity, relevance of answers to questions and job description, demonstration of skills, and overall interview performance.

        Job Description:
        "{job_description_text}"

        Candidate Resume Summary:
        "{resume_summary_text}"

        Interview Transcript:
        "{interview_transcript}"

        Provide the output in a JSON format with keys: "score" (integer), "feedback_summary" (string), "areas_for_improvement" (array of strings), "strengths" (array of strings).
        Example:
        {{
          "score": 75,
          "feedback_summary": "The candidate performed well...",
          "areas_for_improvement": ["Elaborate more on XYZ.", "Structure answers with STAR method."],
          "strengths": ["Clear communication.", "Demonstrated strong knowledge of ABC."]
        }}
        """
        response = self.model.generate_content(prompt)
        try:
            # Clean up response to ensure it's valid JSON
            text = response.text.strip()
            # Remove markdown code block markers if present
            text = text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except json.JSONDecodeError:
            return {
                "score": 0, 
                "feedback_summary": "Analysis failed.", 
                "areas_for_improvement": [], 
                "strengths": []
            } 