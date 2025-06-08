from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.resume import Resume
from app.models.job_description import JobDescription
from app.models.interview_session import InterviewSession
from app.models.interview_result import InterviewResult
from app.models.cheatsheet import Cheatsheet
from app.services.gemini_service import GeminiService
from app.services.tavus_service import TavusService
from app.services.pdf_service import PDFService
from datetime import datetime
import os
import json
import uuid

interview_bp = Blueprint('interview', __name__)
gemini_service = GeminiService()
tavus_service = TavusService()
pdf_service = PDFService()

@interview_bp.route('/setup', methods=['POST'])
@jwt_required()
def setup_interview():
    """Set up a new interview with resume and job description."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('resume_id') or not data.get('job_description_id'):
        return jsonify({'message': 'Resume ID and Job Description ID are required'}), 400
    
    resume_id = data.get('resume_id')
    job_description_id = data.get('job_description_id')
    
    # Verify resume and job description belong to the user
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    job_description = JobDescription.query.filter_by(id=job_description_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    if not job_description:
        return jsonify({'message': 'Job description not found'}), 404
    
    try:
        # Create interview session
        interview_session = InterviewSession(
            user_id=user_id,
            resume_id=resume_id,
            job_description_id=job_description_id,
            status='pending'
        )
        db.session.add(interview_session)
        db.session.flush()  # Get the interview_session.id without committing
        
        # Generate interview questions using Gemini
        questions = gemini_service.generate_interview_questions(
            job_description.description_text,
            resume.raw_text_content
        )
        
        # Generate cheatsheet content
        cheatsheet_content = gemini_service.generate_cheatsheet_content(
            job_description.description_text,
            resume.raw_text_content
        )
        
        # Generate PDF
        pdf_filename = f"cheatsheet_{interview_session.id}_{uuid.uuid4().hex}.pdf"
        pdf_path = pdf_service.generate_cheatsheet_pdf(cheatsheet_content, user_id, pdf_filename)
        
        # Save cheatsheet
        cheatsheet = Cheatsheet(
            interview_session_id=interview_session.id,
            gemini_prompt="Interview preparation cheatsheet",
            generated_text=cheatsheet_content,
            pdf_file_path=pdf_path
        )
        db.session.add(cheatsheet)
        
        # Store questions in the session or database as needed
        # For simplicity, we'll store them in the session object as JSON
        interview_session.questions_json = json.dumps(questions)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Interview setup successful',
            'interview_session_id': interview_session.id,
            'questions': questions,
            'cheatsheet_id': cheatsheet.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error setting up interview: {str(e)}")
        return jsonify({'message': f'Error setting up interview: {str(e)}'}), 500

@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_interview():
    """Start an interview session with Tavus agent."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('interview_session_id'):
        return jsonify({'message': 'Interview session ID is required'}), 400
    
    interview_session_id = data.get('interview_session_id')
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_session_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    if interview_session.status not in ['pending', 'failed']:
        return jsonify({'message': f'Interview is already {interview_session.status}'}), 400
    
    try:
        # Get resume and job description
        resume = Resume.query.get(interview_session.resume_id)
        job_description = JobDescription.query.get(interview_session.job_description_id)
        
        # Create LiveKit session with Tavus
        tavus_response = tavus_service.create_livekit_agent_session(
            job_title=job_description.title,
            job_description=job_description.description_text,
            resume_summary_text=resume.raw_text_content,
            user_id=user_id
        )
        
        if tavus_response.get('status') == 'error':
            return jsonify({'message': tavus_response.get('message', 'Error creating LiveKit session')}), 500
        
        # Update interview session
        interview_session.status = 'active'
        interview_session.tavus_call_id = tavus_response.get('call_id')
        interview_session.livekit_room_name = tavus_response.get('room_name')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Interview started successfully',
            'livekit_url': tavus_response.get('livekit_url'),
            'livekit_token': tavus_response.get('livekit_token')
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error starting interview: {str(e)}")
        return jsonify({'message': f'Error starting interview: {str(e)}'}), 500

@interview_bp.route('/<int:interview_id>/finish', methods=['POST'])
@jwt_required()
def finish_interview(interview_id):
    """Finish an interview and process results."""
    user_id = get_jwt_identity()
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    if interview_session.status != 'active':
        return jsonify({'message': f'Interview is not active (current status: {interview_session.status})'}), 400
    
    try:
        # Get the transcript from Tavus
        transcript_response = tavus_service.get_interview_transcript(interview_session.tavus_call_id)
        
        if transcript_response.get('status') == 'error':
            return jsonify({'message': transcript_response.get('message', 'Error retrieving transcript')}), 500
        
        transcript_text = transcript_response.get('transcript', '')
        
        # Get resume and job description
        resume = Resume.query.get(interview_session.resume_id)
        job_description = JobDescription.query.get(interview_session.job_description_id)
        
        # Analyze transcript with Gemini
        analysis = gemini_service.analyze_interview_transcript(
            transcript_text,
            job_description.description_text,
            resume.raw_text_content
        )
        
        # Create interview result
        result = InterviewResult(
            interview_session_id=interview_id,
            score=analysis.get('score', 0),
            feedback_summary=analysis.get('feedback_summary', 'No feedback available'),
            full_transcript=transcript_text,
            detailed_feedback=analysis
        )
        db.session.add(result)
        
        # Update interview session
        interview_session.status = 'completed'
        interview_session.end_time = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Interview completed successfully',
            'result_id': result.id,
            'score': result.score,
            'feedback_summary': result.feedback_summary
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error finishing interview: {str(e)}")
        return jsonify({'message': f'Error finishing interview: {str(e)}'}), 500

@interview_bp.route('/results/<int:interview_id>', methods=['GET'])
@jwt_required()
def get_interview_results(interview_id):
    """Get results for a specific interview."""
    user_id = get_jwt_identity()
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    result = InterviewResult.query.filter_by(interview_session_id=interview_id).first()
    
    if not result:
        return jsonify({'message': 'Interview results not found'}), 404
    
    # Get related data for context
    resume = Resume.query.get(interview_session.resume_id)
    job_description = JobDescription.query.get(interview_session.job_description_id)
    
    return jsonify({
        'interview_id': interview_id,
        'score': result.score,
        'feedback_summary': result.feedback_summary,
        'detailed_feedback': result.detailed_feedback,
        'job_title': job_description.title,
        'resume_filename': resume.original_filename,
        'interview_date': interview_session.start_time.isoformat() if interview_session.start_time else None,
        'has_transcript': bool(result.full_transcript)
    }), 200

@interview_bp.route('/results/<int:interview_id>/transcript', methods=['GET'])
@jwt_required()
def get_interview_transcript(interview_id):
    """Get the full transcript for a specific interview."""
    user_id = get_jwt_identity()
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    result = InterviewResult.query.filter_by(interview_session_id=interview_id).first()
    
    if not result or not result.full_transcript:
        return jsonify({'message': 'Interview transcript not found'}), 404
    
    return jsonify({
        'interview_id': interview_id,
        'transcript': result.full_transcript
    }), 200

@interview_bp.route('/history', methods=['GET'])
@jwt_required()
def get_interview_history():
    """Get interview history for the current user."""
    user_id = get_jwt_identity()
    
    # Get all completed interviews with their results
    interviews = (
        db.session.query(InterviewSession, InterviewResult, JobDescription)
        .join(InterviewResult, InterviewSession.id == InterviewResult.interview_session_id, isouter=True)
        .join(JobDescription, InterviewSession.job_description_id == JobDescription.id)
        .filter(InterviewSession.user_id == user_id)
        .order_by(InterviewSession.start_time.desc())
        .all()
    )
    
    history = []
    for interview, result, job in interviews:
        history.append({
            'interview_id': interview.id,
            'job_title': job.title,
            'date': interview.start_time.isoformat() if interview.start_time else None,
            'status': interview.status,
            'score': result.score if result else None,
            'has_result': result is not None
        })
    
    return jsonify({
        'history': history
    }), 200

@interview_bp.route('/<int:interview_id>/cheatsheet', methods=['GET'])
@jwt_required()
def get_interview_cheatsheet(interview_id):
    """Get the cheatsheet for a specific interview."""
    user_id = get_jwt_identity()
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    cheatsheet = Cheatsheet.query.filter_by(interview_session_id=interview_id).first()
    
    if not cheatsheet:
        return jsonify({'message': 'Cheatsheet not found'}), 404
    
    return jsonify({
        'interview_id': interview_id,
        'cheatsheet_text': cheatsheet.generated_text,
        'generated_date': cheatsheet.generated_date.isoformat() if cheatsheet.generated_date else None
    }), 200

@interview_bp.route('/<int:interview_id>/cheatsheet/pdf', methods=['GET'])
@jwt_required()
def download_cheatsheet_pdf(interview_id):
    """Download the PDF cheatsheet for a specific interview."""
    user_id = get_jwt_identity()
    
    # Verify interview session belongs to the user
    interview_session = InterviewSession.query.filter_by(id=interview_id, user_id=user_id).first()
    
    if not interview_session:
        return jsonify({'message': 'Interview session not found'}), 404
    
    cheatsheet = Cheatsheet.query.filter_by(interview_session_id=interview_id).first()
    
    if not cheatsheet or not cheatsheet.pdf_file_path:
        return jsonify({'message': 'Cheatsheet PDF not found'}), 404
    
    try:
        return send_file(
            cheatsheet.pdf_file_path,
            as_attachment=True,
            download_name=f"interview_cheatsheet_{interview_id}.pdf"
        )
    except Exception as e:
        current_app.logger.error(f"Error downloading cheatsheet PDF: {str(e)}")
        return jsonify({'message': f'Error downloading cheatsheet PDF: {str(e)}'}), 500 