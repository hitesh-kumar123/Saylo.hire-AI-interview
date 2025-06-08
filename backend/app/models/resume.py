from app.extensions import db
from datetime import datetime
import json

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    extracted_job_title = db.Column(db.String(128))
    extracted_skills_json = db.Column(db.Text)  # Stored as JSON string
    raw_text_content = db.Column(db.Text)  # Extracted text from PDF
    
    # Relationships
    interview_sessions = db.relationship('InterviewSession', backref='resume', lazy=True)
    
    @property
    def extracted_skills(self):
        if self.extracted_skills_json:
            try:
                return json.loads(self.extracted_skills_json)
            except json.JSONDecodeError:
                return []
        return []
    
    @extracted_skills.setter
    def extracted_skills(self, skills_list):
        if isinstance(skills_list, list):
            self.extracted_skills_json = json.dumps(skills_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'original_filename': self.original_filename,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'extracted_job_title': self.extracted_job_title,
            'extracted_skills': self.extracted_skills
        } 