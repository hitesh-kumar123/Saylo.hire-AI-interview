from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.resume import Resume
from app.models.job_description import JobDescription
from app.services.tavus_service import TavusService
from app.utils import allowed_file, save_uploaded_file, extract_text_from_pdf
import os

resume_bp = Blueprint('resume', __name__)
tavus_service = TavusService()

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload a new resume file."""
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename, {'pdf'}):
        return jsonify({'message': 'Only PDF files are allowed'}), 400
    
    user_id = get_jwt_identity()
    
    try:
        # Create user-specific directory
        user_upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], str(user_id))
        os.makedirs(user_upload_dir, exist_ok=True)
        
        # Save file
        file_path, unique_filename = save_uploaded_file(file, user_upload_dir, prefix='resume_')
        
        # Extract text from PDF
        raw_text = extract_text_from_pdf(file_path)
        
        # Process with Tavus (if applicable)
        # Note: This is a placeholder - actual implementation depends on Tavus API
        # tavus_response = tavus_service.process_resume_for_interview_context(file.read(), file.filename)
        
        # Create Resume entry
        resume = Resume(
            user_id=user_id,
            file_path=file_path,
            original_filename=file.filename,
            raw_text_content=raw_text
            # If Tavus provides job title or skills, add them here
            # extracted_job_title=tavus_response.get('job_title'),
            # extracted_skills=tavus_response.get('skills', [])
        )
        
        db.session.add(resume)
        db.session.commit()
        
        return jsonify({
            'message': 'Resume uploaded successfully',
            'resume_id': resume.id,
            'filename': file.filename
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Error uploading resume: {str(e)}")
        return jsonify({'message': f'Error uploading resume: {str(e)}'}), 500

@resume_bp.route('/', methods=['GET'])
@jwt_required()
def get_resumes():
    """Get all resumes for the current user."""
    user_id = get_jwt_identity()
    
    resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.upload_date.desc()).all()
    
    return jsonify({
        'resumes': [resume.to_dict() for resume in resumes]
    }), 200

@resume_bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    """Get a specific resume."""
    user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    return jsonify(resume.to_dict()), 200

@resume_bp.route('/<int:resume_id>/download', methods=['GET'])
@jwt_required()
def download_resume(resume_id):
    """Download a resume file."""
    user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    try:
        return send_file(resume.file_path, as_attachment=True, 
                        download_name=resume.original_filename)
    except Exception as e:
        current_app.logger.error(f"Error downloading resume: {str(e)}")
        return jsonify({'message': f'Error downloading resume: {str(e)}'}), 500

@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    """Delete a resume."""
    user_id = get_jwt_identity()
    
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404
    
    try:
        # Delete file from disk
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
        
        # Delete from database
        db.session.delete(resume)
        db.session.commit()
        
        return jsonify({'message': 'Resume deleted successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting resume: {str(e)}")
        return jsonify({'message': f'Error deleting resume: {str(e)}'}), 500

# Job Description Routes
@resume_bp.route('/job-description', methods=['POST'])
@jwt_required()
def create_job_description():
    """Create a new job description."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description_text'):
        return jsonify({'message': 'Title and description are required'}), 400
    
    try:
        job_description = JobDescription(
            user_id=user_id,
            title=data['title'],
            description_text=data['description_text'],
            source_url=data.get('source_url', '')
        )
        
        # If skills keywords are provided
        if 'skills_keywords' in data and isinstance(data['skills_keywords'], list):
            job_description.skills_keywords = data['skills_keywords']
        
        db.session.add(job_description)
        db.session.commit()
        
        return jsonify({
            'message': 'Job description created successfully',
            'job_description_id': job_description.id
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error creating job description: {str(e)}")
        return jsonify({'message': f'Error creating job description: {str(e)}'}), 500

@resume_bp.route('/job-description', methods=['GET'])
@jwt_required()
def get_job_descriptions():
    """Get all job descriptions for the current user."""
    user_id = get_jwt_identity()
    
    job_descriptions = JobDescription.query.filter_by(user_id=user_id).order_by(JobDescription.created_at.desc()).all()
    
    return jsonify({
        'job_descriptions': [jd.to_dict() for jd in job_descriptions]
    }), 200

@resume_bp.route('/job-description/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job_description(job_id):
    """Get a specific job description."""
    user_id = get_jwt_identity()
    
    job_description = JobDescription.query.filter_by(id=job_id, user_id=user_id).first()
    
    if not job_description:
        return jsonify({'message': 'Job description not found'}), 404
    
    return jsonify(job_description.to_dict()), 200

@resume_bp.route('/job-description/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job_description(job_id):
    """Update a job description."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    job_description = JobDescription.query.filter_by(id=job_id, user_id=user_id).first()
    
    if not job_description:
        return jsonify({'message': 'Job description not found'}), 404
    
    try:
        if 'title' in data:
            job_description.title = data['title']
        if 'description_text' in data:
            job_description.description_text = data['description_text']
        if 'source_url' in data:
            job_description.source_url = data['source_url']
        if 'skills_keywords' in data and isinstance(data['skills_keywords'], list):
            job_description.skills_keywords = data['skills_keywords']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Job description updated successfully',
            'job_description': job_description.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error updating job description: {str(e)}")
        return jsonify({'message': f'Error updating job description: {str(e)}'}), 500

@resume_bp.route('/job-description/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job_description(job_id):
    """Delete a job description."""
    user_id = get_jwt_identity()
    
    job_description = JobDescription.query.filter_by(id=job_id, user_id=user_id).first()
    
    if not job_description:
        return jsonify({'message': 'Job description not found'}), 404
    
    try:
        db.session.delete(job_description)
        db.session.commit()
        
        return jsonify({'message': 'Job description deleted successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting job description: {str(e)}")
        return jsonify({'message': f'Error deleting job description: {str(e)}'}), 500 