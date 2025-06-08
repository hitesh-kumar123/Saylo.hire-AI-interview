from app.extensions import db
from datetime import datetime

class InterviewSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey('resume.id'), nullable=False)
    job_description_id = db.Column(db.Integer, db.ForeignKey('job_description.id'), nullable=False)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')  # pending, active, completed, failed
    tavus_call_id = db.Column(db.String(128))
    livekit_room_name = db.Column(db.String(128))
    
    # Relationships
    result = db.relationship('InterviewResult', backref='interview_session', lazy=True, uselist=False)
    cheatsheet = db.relationship('Cheatsheet', backref='interview_session', lazy=True, uselist=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resume_id': self.resume_id,
            'job_description_id': self.job_description_id,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'status': self.status,
            'tavus_call_id': self.tavus_call_id,
            'livekit_room_name': self.livekit_room_name,
            'has_result': self.result is not None,
            'has_cheatsheet': self.cheatsheet is not None
        } 