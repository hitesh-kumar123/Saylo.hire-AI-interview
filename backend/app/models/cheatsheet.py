from app.extensions import db
from datetime import datetime

class Cheatsheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interview_session_id = db.Column(db.Integer, db.ForeignKey('interview_session.id'), nullable=False)
    gemini_prompt = db.Column(db.Text)
    generated_text = db.Column(db.Text, nullable=False)
    pdf_file_path = db.Column(db.String(255))
    generated_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interview_session_id': self.interview_session_id,
            'generated_text': self.generated_text,
            'pdf_file_path': self.pdf_file_path,
            'generated_date': self.generated_date.isoformat() if self.generated_date else None
        } 