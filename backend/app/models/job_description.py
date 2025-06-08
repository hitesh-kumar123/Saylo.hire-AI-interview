from app.extensions import db
from datetime import datetime
import json

class JobDescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    description_text = db.Column(db.Text, nullable=False)
    skills_keywords_json = db.Column(db.Text)  # Stored as JSON string
    source_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    interview_sessions = db.relationship('InterviewSession', backref='job_description', lazy=True)
    
    @property
    def skills_keywords(self):
        if self.skills_keywords_json:
            try:
                return json.loads(self.skills_keywords_json)
            except json.JSONDecodeError:
                return []
        return []
    
    @skills_keywords.setter
    def skills_keywords(self, keywords_list):
        if isinstance(keywords_list, list):
            self.skills_keywords_json = json.dumps(keywords_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description_text': self.description_text,
            'skills_keywords': self.skills_keywords,
            'source_url': self.source_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 