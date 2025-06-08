from app.extensions import db
from datetime import datetime
import json

class InterviewResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_session_id = db.Column(db.Integer, db.ForeignKey('interview_session.id'), nullable=False)
    score = db.Column(db.Integer)  # 0-100
    feedback_summary = db.Column(db.Text)
    full_transcript = db.Column(db.Text)
    detailed_feedback_json = db.Column(db.Text)  # Stored as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def detailed_feedback(self):
        if self.detailed_feedback_json:
            try:
                return json.loads(self.detailed_feedback_json)
            except json.JSONDecodeError:
                return {}
        return {}
    
    @detailed_feedback.setter
    def detailed_feedback(self, feedback_dict):
        if isinstance(feedback_dict, dict):
            self.detailed_feedback_json = json.dumps(feedback_dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interview_session_id': self.interview_session_id,
            'score': self.score,
            'feedback_summary': self.feedback_summary,
            'detailed_feedback': self.detailed_feedback,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 